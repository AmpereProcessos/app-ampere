// Read-only: node --env-file=.env scripts/dry-run-project-responsibles-sync.cjs
// Plans only dados.obra.responsaveis <- ordensDeServico.responsaveis via idOrdemServico.
// This script contains no database writes or apply mode.
const { MongoClient } = require('mongodb')
const { isDeepStrictEqual } = require('node:util')
const fs = require('node:fs')
const path = require('node:path')
const { compareProject } = require('./audit-project-service-orders.cjs')

function skipReason(project, order, linkCount) {
  if (!order) return 'missing-service-order'
  if (linkCount > 1) return 'shared-main-service-order'
  if (String(order.projeto?.id) !== project._id.toString()) return 'reverse-link-mismatch-or-missing'
  if (project.tipoDeServico === 'SISTEMA FOTOVOLTAICO' && order.categoria !== 'MONTAGEM') return 'solar-main-order-not-assembly'
  if (!Array.isArray(order.responsaveis)) return 'source-responsibles-missing-or-invalid'
  if (!order.responsaveis.length) return 'source-responsibles-empty'
  if (order.responsaveis.some(person => !person || typeof person.id !== 'string' || !person.id || typeof person.nome !== 'string' || !person.nome)) return 'source-responsible-invalid'
  if (project.obra?.responsaveis != null && !Array.isArray(project.obra.responsaveis)) return 'target-responsibles-invalid'
  return null
}

function classifyChange(before, after) {
  if (!before?.length && after.length) return 'populate-empty-project-list'
  const identities = people => people.map(person => JSON.stringify([person.id, person.nome])).sort()
  return isDeepStrictEqual(identities(before || []), identities(after)) ? 'metadata-only' : 'change-responsible-ids-or-names'
}

function planSync(project, order, linkCount) {
  const reason = skipReason(project, order, linkCount)
  if (reason) return { outcome: 'skipped', reason }
  const different = compareProject(project, order).some(difference => difference.projectField === 'obra.responsaveis')
  if (!different) return { outcome: 'unchanged' }
  return { outcome: 'would-update', change: classifyChange(project.obra?.responsaveis, order.responsaveis),
    before: project.obra?.responsaveis ?? null, after: order.responsaveis,
    // Exact original list and link are retained as preconditions for a future apply implementation.
    updateOne: { filter: { _id: project._id, idOrdemServico: project.idOrdemServico,
      'obra.responsaveis': Object.hasOwn(project.obra || {}, 'responsaveis')
        ? { $eq: project.obra.responsaveis } : { $exists: false } },
      update: { $set: { 'obra.responsaveis': order.responsaveis } } } }
}

async function main() {
  if (process.argv.length > 2) throw new Error('No arguments supported; this script is dry-run only.')
  if (!process.env.DB_KEY) throw new Error('Missing DB_KEY')
  const client = new MongoClient(process.env.DB_KEY, { serverSelectionTimeoutMS: 30000 })
  try {
    await client.connect()
    const db = client.db('projetos')
    const projects = await db.collection('dados').find({}, { projection: {
      qtde: 1, nomeDoContrato: 1, tipoDeServico: 1, idOrdemServico: 1, 'obra.responsaveis': 1,
    } }).toArray()
    const orders = await db.collection('ordensDeServico').find({}, { projection: {
      projeto: 1, categoria: 1, responsaveis: 1,
    } }).toArray()
    const ordersById = new Map(orders.map(order => [order._id.toString(), order]))
    const links = new Map()
    for (const project of projects) {
      if (!project.idOrdemServico) continue
      const id = String(project.idOrdemServico).toLowerCase()
      links.set(id, (links.get(id) || 0) + 1)
    }
    const summary = { projects: projects.length, withoutMainOrder: 0, linked: 0, unchanged: 0,
      wouldUpdate: 0, changes: {}, skipped: 0, skippedByReason: {}, skippedWithResponsiblesDifference: 0 }
    const findings = []
    for (const project of projects) {
      if (!project.idOrdemServico) { summary.withoutMainOrder++; continue }
      summary.linked++
      const id = String(project.idOrdemServico).toLowerCase()
      const order = ordersById.get(id)
      const plan = planSync(project, order, links.get(id))
      if (plan.outcome === 'unchanged') { summary.unchanged++; continue }
      if (plan.outcome === 'skipped') {
        summary.skipped++
        summary.skippedByReason[plan.reason] = (summary.skippedByReason[plan.reason] || 0) + 1
        // Invalid shapes cannot be compared; valid skipped pairs are counted separately.
        if (order && (order.responsaveis == null || Array.isArray(order.responsaveis)) &&
          (project.obra?.responsaveis == null || Array.isArray(project.obra.responsaveis))) {
          plan.responsiblesDiffer = compareProject(project, order).some(difference => difference.projectField === 'obra.responsaveis')
          if (plan.responsiblesDiffer) summary.skippedWithResponsiblesDifference++
        }
      } else {
        summary.wouldUpdate++
        summary.changes[plan.change] = (summary.changes[plan.change] || 0) + 1
      }
      findings.push({ projectId: project._id.toString(), projectNumber: project.qtde,
        projectName: project.nomeDoContrato, projectType: project.tipoDeServico,
        mainOrderId: String(project.idOrdemServico), orderCategory: order?.categoria ?? null, ...plan })
    }
    const directory = path.join(__dirname, '.project-service-order-audits')
    fs.mkdirSync(directory, { recursive: true })
    const output = path.join(directory, `responsibles-sync-dry-run-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
    const report = { generatedAt: new Date().toISOString(), mode: 'dry-run', databaseWrites: 0,
      direction: 'ordensDeServico.responsaveis -> dados.obra.responsaveis via dados.idOrdemServico',
      policy: 'Copy the full responsible list including metadata only when the source list is populated. Empty, missing or invalid source lists never overwrite the project list. Ignore array order and null vs undefined values. Skip ambiguous links and solar projects whose principal order is not MONTAGEM. Collections read sequentially, not in a transaction.',
      summary, findings }
    fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
    console.log(JSON.stringify({ mode: 'dry-run', databaseWrites: 0, ...summary, report: output }, null, 2))
  } finally {
    await client.close()
  }
}

module.exports = { planSync, classifyChange }
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1 })
