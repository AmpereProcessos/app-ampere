// Dry run: node --env-file=.env scripts/fill-service-order-responsibles.cjs
// Apply a reviewed plan: node --env-file=.env scripts/fill-service-order-responsibles.cjs --apply --report=<dry-run.json>
// Scope: principal orders only, resolved from project.idOrdemServico with a matching order.projeto.id.
const { MongoClient, ObjectId } = require('mongodb')
const { EJSON } = require('bson')
const { isDeepStrictEqual } = require('node:util')
const fs = require('node:fs')
const path = require('node:path')

const DIRECTION = 'dados.obra.responsaveis -> ordensDeServico.responsaveis (main orders only)'
const validId = value => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value)
const orderIsEmpty = order => order.responsaveis == null || (Array.isArray(order.responsaveis) && order.responsaveis.length === 0)

function planFill(project, order, linkCount) {
  if (!project || !order) return { outcome: 'skipped', reason: 'missing-project-or-order' }
  if (String(project.idOrdemServico || '').toLowerCase() !== order._id.toString()) return { outcome: 'skipped', reason: 'not-main-order' }
  if (linkCount !== 1 || String(order.projeto?.id) !== project._id.toString()) return { outcome: 'skipped', reason: 'ambiguous-or-inconsistent-link' }
  if (project.tipoDeServico === 'SISTEMA FOTOVOLTAICO' && order.categoria !== 'MONTAGEM') return { outcome: 'skipped', reason: 'solar-main-order-not-assembly' }
  if (!orderIsEmpty(order)) return { outcome: 'skipped', reason: 'order-list-populated-or-invalid' }
  const people = project.obra?.responsaveis
  if (!Array.isArray(people) || people.length === 0) return { outcome: 'skipped', reason: 'project-list-empty-or-invalid' }
  if (people.some(person => !person || typeof person.id !== 'string' || !person.id.trim() ||
    typeof person.nome !== 'string' || !person.nome.trim() ||
    ['avatar_url', 'telefone', 'email', 'dataValidacao'].some(key => person[key] != null && typeof person[key] !== 'string'))) {
    return { outcome: 'skipped', reason: 'project-responsible-invalid' }
  }
  const state = !Object.hasOwn(order, 'responsaveis') ? 'missing' : order.responsaveis === null ? 'null' : 'empty-array'
  const guard = state === 'missing' ? { $exists: false } : state === 'null' ? { $type: 10 } : { $size: 0 }
  return { outcome: 'would-update', beforeState: state, before: order.responsaveis ?? null, after: people,
    operation: { updateOne: { filter: { _id: order._id, 'projeto.id': order.projeto.id,
      categoria: { $eq: order.categoria }, responsaveis: guard }, update: { $set: { responsaveis: people } } } } }
}

function prepareReviewedFill(reviewed, project, order, linkCount) {
  const plan = planFill(project, order, linkCount)
  if (plan.outcome !== 'would-update') return plan
  if (project._id.toString() !== reviewed.projectId || order._id.toString() !== reviewed.orderId ||
    project.tipoDeServico !== reviewed.projectType || order.categoria !== reviewed.orderCategory ||
    plan.beforeState !== reviewed.beforeState || !isDeepStrictEqual(plan.after, reviewed.after)) {
    return { outcome: 'skipped', reason: 'changed-since-review' }
  }
  return plan
}

async function loadContext(db, orderIds) {
  // Always read all project links so shared principal orders cannot be mistaken for unique links.
  const projects = await db.collection('dados').find({}, { projection: {
    qtde: 1, nomeDoContrato: 1, tipoDeServico: 1, idOrdemServico: 1, 'obra.responsaveis': 1,
  } }).toArray()
  const orders = await db.collection('ordensDeServico').find(orderIds ? { _id: { $in: orderIds } } : {}).toArray()
  const counts = new Map()
  for (const project of projects) {
    if (!project.idOrdemServico) continue
    const id = String(project.idOrdemServico).toLowerCase()
    counts.set(id, (counts.get(id) || 0) + 1)
  }
  return { projects, counts, projectsById: new Map(projects.map(project => [project._id.toString(), project])),
    ordersById: new Map(orders.map(order => [order._id.toString(), order])) }
}

async function dryRun(db, output) {
  const context = await loadContext(db)
  const report = { generatedAt: new Date().toISOString(), mode: 'dry-run', databaseWrites: 0, direction: DIRECTION,
    policy: 'Copy the full project responsible list, including metadata, to empty/null/missing principal order lists only. Skip inconsistent/shared links and solar projects with non-MONTAGEM main orders. Secondary orders excluded. Collections read sequentially, not in a transaction.',
    summary: { projects: context.projects.length, wouldUpdate: 0, byCategory: {}, skippedByReason: {} }, findings: [] }
  for (const project of context.projects) {
    const id = String(project.idOrdemServico || '').toLowerCase()
    const order = context.ordersById.get(id)
    const plan = planFill(project, order, context.counts.get(id))
    if (plan.outcome !== 'would-update') {
      report.summary.skippedByReason[plan.reason] = (report.summary.skippedByReason[plan.reason] || 0) + 1
      continue
    }
    report.summary.wouldUpdate++
    const category = order.categoria || '(missing)'
    report.summary.byCategory[category] = (report.summary.byCategory[category] || 0) + 1
    report.findings.push({ projectId: project._id.toString(), projectNumber: project.qtde,
      projectName: project.nomeDoContrato, projectType: project.tipoDeServico,
      orderId: id, orderCategory: order.categoria, ...plan })
  }
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
  console.log(JSON.stringify({ mode: report.mode, databaseWrites: 0, ...report.summary, report: output }, null, 2))
}

function withoutResponsibles(document) {
  const copy = structuredClone(document)
  delete copy.responsaveis
  return copy
}

async function apply(db, reportPath, output, backupPath) {
  const reviewed = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
  if (reviewed.mode !== 'dry-run' || reviewed.databaseWrites !== 0 || reviewed.direction !== DIRECTION ||
    !Array.isArray(reviewed.findings) || reviewed.findings.length !== reviewed.summary?.wouldUpdate ||
    new Set(reviewed.findings.map(item => item.orderId)).size !== reviewed.findings.length ||
    reviewed.findings.some(item => !validId(item.projectId) || !validId(item.orderId) || item.outcome !== 'would-update')) {
    throw new Error('Invalid principal-order fill dry-run report')
  }
  const result = { mode: 'apply', direction: DIRECTION, reviewedReport: path.resolve(reportPath),
    planned: reviewed.findings.length, matched: 0, modified: 0, verified: 0, skipped: [], backupPath, report: output }
  const backupFd = fs.openSync(backupPath, 'wx')
  try {
    for (let offset = 0; offset < reviewed.findings.length; offset += 100) {
      const batch = reviewed.findings.slice(offset, offset + 100)
      const context = await loadContext(db, batch.map(item => new ObjectId(item.orderId)))
      const operations = [], entries = []
      for (const item of batch) {
        const project = context.projectsById.get(item.projectId)
        const order = context.ordersById.get(item.orderId)
        const plan = prepareReviewedFill(item, project, order, context.counts.get(item.orderId))
        if (plan.outcome !== 'would-update') { result.skipped.push({ orderId: item.orderId, reason: plan.reason }); continue }
        fs.writeSync(backupFd, EJSON.stringify({ orderId: order._id, before: order,
          sourceProjectId: project._id, appliedResponsibles: plan.after }) + '\n')
        operations.push(plan.operation)
        entries.push({ item, order, plan })
      }
      if (!operations.length) continue
      fs.fsyncSync(backupFd)
      const response = await db.collection('ordensDeServico').bulkWrite(operations, { ordered: true, writeConcern: { w: 'majority' } })
      result.matched += response.matchedCount
      result.modified += response.modifiedCount
      const current = await db.collection('ordensDeServico').find({ _id: { $in: entries.map(entry => entry.order._id) } }).toArray()
      const currentById = new Map(current.map(order => [order._id.toString(), order]))
      for (const { item, order, plan } of entries) {
        const after = currentById.get(item.orderId)
        if (!after || !isDeepStrictEqual(after.responsaveis, plan.after) ||
          !isDeepStrictEqual(withoutResponsibles(order), withoutResponsibles(after))) {
          throw new Error(`Verification failed for order ${item.orderId}; stopped before the next batch`)
        }
        result.verified++
      }
      if (response.matchedCount !== operations.length) throw new Error('Concurrent order changes detected; stopped before the next batch')
    }
  } catch (error) {
    result.error = error.message
    throw error
  } finally {
    fs.closeSync(backupFd)
    result.finishedAt = new Date().toISOString()
    fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
    console.log(JSON.stringify(result, null, 2))
  }
}

async function main() {
  const args = process.argv.slice(2)
  const applying = args.includes('--apply')
  const reportPath = args.find(arg => arg.startsWith('--report='))?.slice(9)
  if (args.some(arg => arg !== '--apply' && !arg.startsWith('--report=')) || applying !== Boolean(reportPath)) {
    throw new Error('Usage: no arguments for dry run; --apply --report=<dry-run.json> to apply')
  }
  if (!process.env.DB_KEY) throw new Error('Missing DB_KEY')
  const directory = path.join(__dirname, '.project-service-order-audits')
  fs.mkdirSync(directory, { recursive: true })
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const output = path.join(directory, `fill-order-responsibles-${applying ? 'applied' : 'dry-run'}-${timestamp}.json`)
  const client = new MongoClient(process.env.DB_KEY, { serverSelectionTimeoutMS: 30000 })
  try {
    await client.connect()
    if (applying) await apply(client.db('projetos'), reportPath, output, path.join(directory, `fill-order-responsibles-backup-${timestamp}.jsonl`))
    else await dryRun(client.db('projetos'), output)
  } finally {
    await client.close()
  }
}

module.exports = { planFill, prepareReviewedFill }
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1 })
