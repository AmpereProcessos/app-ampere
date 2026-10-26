// Read-only: node --env-file=.env scripts/audit-solar-main-service-orders.cjs
const { MongoClient } = require('mongodb')
const fs = require('node:fs')
const path = require('node:path')

async function main() {
  if (!process.env.DB_KEY) throw new Error('Missing DB_KEY')
  const client = new MongoClient(process.env.DB_KEY, { serverSelectionTimeoutMS: 30000 })
  try {
    await client.connect()
    const db = client.db('projetos')
    const projects = await db.collection('dados').find({ tipoDeServico: 'SISTEMA FOTOVOLTAICO' }, {
      projection: { qtde: 1, nomeDoContrato: 1, tipoDeServico: 1, idOrdemServico: 1 },
    }).toArray()
    const orders = await db.collection('ordensDeServico').find({}, {
      projection: { index: 1, categoria: 1, descricao: 1, projeto: 1, status: 1 },
    }).toArray()
    const byId = new Map(orders.map(order => [order._id.toString(), order]))
    const assemblyByProject = new Map()
    for (const order of orders) {
      if (order.categoria !== 'MONTAGEM' || !order.projeto?.id) continue
      const projectId = String(order.projeto.id)
      assemblyByProject.set(projectId, [...(assemblyByProject.get(projectId) || []), order])
    }
    const summary = { solarProjects: projects.length, withoutMainOrder: 0, linked: 0,
      missingMainOrder: 0, byCategory: {}, nonAssembly: 0, maintenance: 0,
      maintenanceWithAssemblyCandidate: 0, maintenanceWithOneAssemblyCandidate: 0,
      maintenanceReverseLinkMismatch: 0 }
    const findings = []
    const describeOrder = order => ({ id: order._id.toString(), number: order.index,
      category: order.categoria ?? null, description: order.descricao, status: order.status,
      projectId: order.projeto?.id ?? null })
    for (const project of projects) {
      if (!project.idOrdemServico) { summary.withoutMainOrder++; continue }
      summary.linked++
      const id = String(project.idOrdemServico)
      const order = byId.get(id.toLowerCase())
      const identity = { projectId: project._id.toString(), projectNumber: project.qtde,
        projectName: project.nomeDoContrato, mainOrderId: id }
      if (!order) {
        summary.missingMainOrder++
        findings.push({ ...identity, issue: 'missing-main-order' })
        continue
      }
      const category = order.categoria || '(missing)'
      summary.byCategory[category] = (summary.byCategory[category] || 0) + 1
      if (category === 'MONTAGEM') continue
      summary.nonAssembly++
      const assemblyCandidates = assemblyByProject.get(identity.projectId) || []
      const maintenance = category.startsWith('MANUTEN')
      if (maintenance) {
        summary.maintenance++
        if (assemblyCandidates.length) summary.maintenanceWithAssemblyCandidate++
        if (assemblyCandidates.length === 1) summary.maintenanceWithOneAssemblyCandidate++
        if (String(order.projeto?.id) !== identity.projectId) summary.maintenanceReverseLinkMismatch++
      }
      findings.push({ ...identity, issue: 'non-assembly-main-order', mainOrder: describeOrder(order),
        assemblyCandidates: assemblyCandidates.map(describeOrder) })
    }
    const report = { generatedAt: new Date().toISOString(), readOnly: true,
      scope: 'All SISTEMA FOTOVOLTAICO projects; main order resolved through idOrdemServico. Assembly candidates found through order.projeto.id; candidates are not automatically selected.',
      summary, findings }
    const directory = path.join(__dirname, '.project-service-order-audits')
    fs.mkdirSync(directory, { recursive: true })
    const output = path.join(directory, `solar-main-orders-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
    fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
    console.log(JSON.stringify({ ...summary, report: output, examples: findings.slice(0, 3) }, null, 2))
  } finally {
    await client.close()
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1 })
