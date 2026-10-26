// Read-only: node --env-file=.env scripts/audit-orders-missing-responsibles.cjs
const { MongoClient } = require('mongodb')
const fs = require('node:fs')
const path = require('node:path')

async function main() {
  if (!process.env.DB_KEY) throw new Error('Missing DB_KEY')
  const client = new MongoClient(process.env.DB_KEY, { serverSelectionTimeoutMS: 30000 })
  try {
    await client.connect()
    const db = client.db('projetos')
    const projects = await db.collection('dados').find({}, { projection: {
      qtde: 1, nomeDoContrato: 1, tipoDeServico: 1, idOrdemServico: 1, 'obra.responsaveis': 1,
    } }).toArray()
    const orders = await db.collection('ordensDeServico').find({}, { projection: {
      categoria: 1, status: 1, projeto: 1, responsaveis: 1, responsavel: 1,
    } }).toArray()
    const projectsById = new Map(projects.map(project => [project._id.toString(), project]))
    const ordersById = new Map(orders.map(order => [order._id.toString(), order]))
    const mainLinks = new Map()
    for (const project of projects) {
      if (!project.idOrdemServico) continue
      const id = String(project.idOrdemServico).toLowerCase()
      mainLinks.set(id, [...(mainLinks.get(id) || []), project._id.toString()])
    }
    const summary = { projectsWithResponsibles: 0, mainOrderPairs: 0, uniqueMainOrders: 0,
      mainOrderPairsWithConsistentUniqueLink: 0, mainOrderPairsWithLinkIssues: 0,
      mainOrderPairsWithInvalidProjectResponsibles: 0, mainByCategory: {}, mainByStatus: {}, mainListState: {},
      additionalNonMainOrders: 0, additionalByCategory: {}, additionalByStatus: {},
      ordersWithInvalidResponsiblesShape: orders.filter(order => order.responsaveis != null && !Array.isArray(order.responsaveis)).length }
    const findings = []
    const missing = order => order.responsaveis == null || (Array.isArray(order.responsaveis) && !order.responsaveis.length)
    const populated = project => Array.isArray(project.obra?.responsaveis) && project.obra.responsaveis.length > 0
    const increment = (counts, key) => { key = key || '(missing)'; counts[key] = (counts[key] || 0) + 1 }
    const mainOrderIds = new Set()
    function describe(project, order, relation) {
      return { relation, projectId: project._id.toString(), projectNumber: project.qtde,
        projectName: project.nomeDoContrato, projectType: project.tipoDeServico,
        orderId: order._id.toString(), orderCategory: order.categoria, orderStatus: order.status,
        orderProjectId: order.projeto?.id ?? null,
        orderListState: !Object.hasOwn(order, 'responsaveis') ? 'missing' : order.responsaveis === null ? 'null' : 'empty-array',
        legacyOrderResponsible: order.responsavel?.nome ?? null, projectResponsibles: project.obra.responsaveis }
    }
    for (const project of projects) {
      if (!populated(project)) continue
      summary.projectsWithResponsibles++
      const order = ordersById.get(String(project.idOrdemServico || '').toLowerCase())
      if (!order || !missing(order)) continue
      summary.mainOrderPairs++
      mainOrderIds.add(order._id.toString())
      const finding = describe(project, order, 'main-via-idOrdemServico')
      finding.linkIssues = []
      if (String(order.projeto?.id) !== project._id.toString()) finding.linkIssues.push('reverse-link-mismatch-or-missing')
      if (mainLinks.get(order._id.toString())?.length > 1) finding.linkIssues.push('shared-main-order')
      if (project.tipoDeServico === 'SISTEMA FOTOVOLTAICO' && order.categoria !== 'MONTAGEM') finding.linkIssues.push('solar-main-order-not-assembly')
      if (finding.linkIssues.length) summary.mainOrderPairsWithLinkIssues++
      else summary.mainOrderPairsWithConsistentUniqueLink++
      if (project.obra.responsaveis.some(person => !person || typeof person.id !== 'string' || !person.id || typeof person.nome !== 'string' || !person.nome)) {
        summary.mainOrderPairsWithInvalidProjectResponsibles++
      }
      increment(summary.mainByCategory, order.categoria)
      increment(summary.mainByStatus, order.status)
      increment(summary.mainListState, finding.orderListState)
      findings.push(finding)
    }
    summary.uniqueMainOrders = mainOrderIds.size
    for (const order of orders) {
      if (!missing(order)) continue
      const project = projectsById.get(String(order.projeto?.id || ''))
      if (!project || !populated(project) || String(project.idOrdemServico || '').toLowerCase() === order._id.toString()) continue
      summary.additionalNonMainOrders++
      increment(summary.additionalByCategory, order.categoria)
      increment(summary.additionalByStatus, order.status)
      findings.push(describe(project, order, 'non-main-via-order.projeto.id'))
    }
    const directory = path.join(__dirname, '.project-service-order-audits')
    fs.mkdirSync(directory, { recursive: true })
    const output = path.join(directory, `orders-missing-responsibles-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
    fs.writeFileSync(output, JSON.stringify({ generatedAt: new Date().toISOString(), readOnly: true,
      scope: 'Empty/missing/null order.responsaveis with populated project.obra.responsaveis. Principal pairs via idOrdemServico, additional orders via order.projeto.id. No name matching.',
      summary, findings }, null, 2) + '\n', { flag: 'wx' })
    console.log(JSON.stringify({ ...summary, report: output }, null, 2))
  } finally {
    await client.close()
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1 })
