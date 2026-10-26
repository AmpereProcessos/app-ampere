// node --env-file=.env scripts/apply-project-responsibles-sync.cjs --apply --report=<reviewed-dry-run.json>
const { MongoClient, ObjectId } = require('mongodb')
const { EJSON } = require('bson')
const { isDeepStrictEqual } = require('node:util')
const fs = require('node:fs')
const path = require('node:path')
const { planSync } = require('./dry-run-project-responsibles-sync.cjs')

function prepareUpdate(reviewed, project, order, linkCount) {
  if (!project) return { skipped: 'project-missing' }
  if (String(project.idOrdemServico) !== reviewed.mainOrderId) return { skipped: 'main-order-changed' }
  const plan = planSync(project, order, linkCount)
  if (plan.outcome !== 'would-update') return { skipped: plan.reason || plan.outcome }
  if (!isDeepStrictEqual(plan.after, reviewed.after) || !isDeepStrictEqual(plan.before, reviewed.before)) {
    return { skipped: 'responsibles-changed-since-review' }
  }
  // Only use the freshly generated, guarded operation, never arbitrary operations from a JSON file.
  plan.updateOne.filter.tipoDeServico = { $eq: project.tipoDeServico }
  return { operation: plan.updateOne }
}

function withoutResponsibles(document) {
  const copy = structuredClone(document)
  if (copy.obra) delete copy.obra.responsaveis
  return copy
}

async function main() {
  const args = process.argv.slice(2)
  if (!args.includes('--apply') || args.some(arg => arg !== '--apply' && !arg.startsWith('--report='))) {
    throw new Error('Usage: --apply --report=<reviewed-dry-run.json>')
  }
  const reportPath = args.find(arg => arg.startsWith('--report='))?.slice(9)
  if (!reportPath || !process.env.DB_KEY) throw new Error('Reviewed report and DB_KEY are required')
  const reviewed = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
  if (reviewed.mode !== 'dry-run' || reviewed.databaseWrites !== 0) throw new Error('Expected a dry-run report')
  const updates = reviewed.findings.filter(finding => finding.outcome === 'would-update')
  if (updates.length !== reviewed.summary.wouldUpdate || new Set(updates.map(item => item.projectId)).size !== updates.length) {
    throw new Error('Invalid reviewed update count or duplicate project IDs')
  }
  const directory = path.join(__dirname, '.project-service-order-audits')
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  fs.mkdirSync(directory, { recursive: true })
  const backupPath = path.join(directory, `responsibles-sync-backup-${timestamp}.jsonl`)
  const resultPath = path.join(directory, `responsibles-sync-applied-${timestamp}.json`)
  const result = { mode: 'apply', reviewedReport: path.resolve(reportPath), reviewedUpdates: updates.length,
    matched: 0, modified: 0, verifiedResponsibles: 0, verifiedOtherFieldsUnchanged: 0,
    skipped: [], verificationIssues: [], backupPath, resultPath }
  const client = new MongoClient(process.env.DB_KEY, { serverSelectionTimeoutMS: 30000 })
  let backupFd
  try {
    await client.connect()
    const db = client.db('projetos')
    const projectsCollection = db.collection('dados')
    const ordersCollection = db.collection('ordensDeServico')
    backupFd = fs.openSync(backupPath, 'wx')
    for (let offset = 0; offset < updates.length; offset += 100) {
      const batch = updates.slice(offset, offset + 100)
      const projectIds = batch.map(item => new ObjectId(item.projectId))
      const orderIds = batch.map(item => new ObjectId(item.mainOrderId))
      const projects = await projectsCollection.find({ _id: { $in: projectIds } }).toArray()
      const orders = await ordersCollection.find({ _id: { $in: orderIds } }).toArray()
      const linkedProjects = await projectsCollection.find({ idOrdemServico: { $in: batch.map(item => item.mainOrderId) } },
        { projection: { idOrdemServico: 1 } }).toArray()
      const counts = new Map()
      for (const project of linkedProjects) counts.set(project.idOrdemServico, (counts.get(project.idOrdemServico) || 0) + 1)
      const projectsById = new Map(projects.map(project => [project._id.toString(), project]))
      const ordersById = new Map(orders.map(order => [order._id.toString(), order]))
      const operations = []
      const applied = []
      for (const item of batch) {
        const project = projectsById.get(item.projectId)
        const order = ordersById.get(item.mainOrderId)
        const prepared = prepareUpdate(item, project, order, counts.get(item.mainOrderId))
        if (prepared.skipped) { result.skipped.push({ projectId: item.projectId, reason: prepared.skipped }); continue }
        fs.writeSync(backupFd, EJSON.stringify({ projectId: project._id, before: project,
          sourceOrderId: order._id, appliedResponsibles: order.responsaveis }) + '\n')
        operations.push({ updateOne: prepared.operation })
        applied.push({ item, project })
      }
      if (!operations.length) continue
      fs.fsyncSync(backupFd)
      const response = await projectsCollection.bulkWrite(operations, { ordered: true, writeConcern: { w: 'majority' } })
      result.matched += response.matchedCount
      result.modified += response.modifiedCount
      const after = await projectsCollection.find({ _id: { $in: applied.map(entry => entry.project._id) } }).toArray()
      const afterById = new Map(after.map(project => [project._id.toString(), project]))
      for (const { item, project } of applied) {
        const current = afterById.get(item.projectId)
        if (current && isDeepStrictEqual(current.obra?.responsaveis, item.after)) result.verifiedResponsibles++
        else result.verificationIssues.push({ projectId: item.projectId, issue: 'responsibles-not-as-planned' })
        if (current && isDeepStrictEqual(withoutResponsibles(project), withoutResponsibles(current))) result.verifiedOtherFieldsUnchanged++
        else result.verificationIssues.push({ projectId: item.projectId, issue: 'other-fields-changed-during-apply' })
      }
      if (response.matchedCount !== operations.length || result.verificationIssues.length) {
        throw new Error('Concurrent changes or verification differences detected; stopped before the next batch')
      }
    }
  } catch (error) {
    result.error = error.message
    throw error
  } finally {
    if (backupFd !== undefined) fs.closeSync(backupFd)
    result.finishedAt = new Date().toISOString()
    fs.writeFileSync(resultPath, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
    console.log(JSON.stringify(result, null, 2))
    await client.close()
  }
}

module.exports = { prepareUpdate }
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1 })
