// Read-only: node --env-file=.env scripts/audit-project-service-orders.cjs
// Optional: --output=path/to/report.json (reports include record values; keep them local).
const { MongoClient, ObjectId } = require('mongodb')
const fs = require('node:fs')
const path = require('node:path')
const { isDeepStrictEqual } = require('node:util')

function canonical(value) {
  if (value == null) return null
  if (Array.isArray(value)) return value.map(canonical)
  if (typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]))
  return value
}

function responsibles(value) {
  // List order is not meaningful; compare every stored property, including validation metadata.
  return (value || []).map(canonical).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
}

function date(value) {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString()
}

function compareProject(project, order) {
  const pairs = [
    ['obra.entrada', 'periodo.inicio', project.obra?.entrada, order.periodo?.inicio, date],
    ['obra.saida', 'periodo.fim', project.obra?.saida, order.periodo?.fim, date],
    ['obra.statusDaObra', 'status', project.obra?.statusDaObra, order.status],
    ['obra.equipeResp', 'responsavel.nome', project.obra?.equipeResp, order.responsavel?.nome],
    ['obra.responsaveis', 'responsaveis', project.obra?.responsaveis, order.responsaveis, responsibles],
    ['obra.observacoes', 'observacoes', project.obra?.observacoes,
      (order.observacoes || []).map(p => `(${p.topico}):${p.descricao}`).join('/')],
  ]
  return pairs.flatMap(([projectField, orderField, projectValue, orderValue, normalize = value => value ?? null]) =>
    isDeepStrictEqual(normalize(projectValue), normalize(orderValue)) ? [] : [{
      projectField, orderField, projectValue: projectValue ?? null, orderValue: orderValue ?? null,
    }])
}

async function main() {
  const args = process.argv.slice(2)
  if (args.some(arg => !arg.startsWith('--output='))) throw new Error('Only --output=path is supported. This script is read-only.')
  if (!process.env.DB_KEY) throw new Error('Missing DB_KEY')
  const output = path.resolve(args.find(arg => arg.startsWith('--output='))?.slice(9) ||
    path.join(__dirname, '.project-service-order-audits', `${new Date().toISOString().replace(/[:.]/g, '-')}.json`))
  const client = new MongoClient(process.env.DB_KEY, { serverSelectionTimeoutMS: 30000 })
  try {
    await client.connect()
    const db = client.db('projetos')
    // Read each collection once; only fields required by the audit are fetched.
    const orders = await db.collection('ordensDeServico').find({}, { projection: {
      projeto: 1, periodo: 1, status: 1, responsavel: 1, responsaveis: 1, observacoes: 1,
    } }).toArray()
    const ordersById = new Map(orders.map(order => [order._id.toString(), order]))
    const summary = { projects: 0, withoutServiceOrder: 0, linked: 0, invalidServiceOrderId: 0,
      missingServiceOrder: 0, compared: 0, matching: 0, different: 0, reverseLinkMismatch: 0,
      reverseLinkMissing: 0, sharedServiceOrders: 0, differencesByField: {} }
    const findings = []
    const links = new Map()
    for await (const project of db.collection('dados').find({}, { projection: {
      qtde: 1, nomeDoContrato: 1, idOrdemServico: 1, 'obra.entrada': 1, 'obra.saida': 1,
      'obra.statusDaObra': 1, 'obra.equipeResp': 1, 'obra.responsaveis': 1, 'obra.observacoes': 1,
    } })) {
      summary.projects++
      const id = project.idOrdemServico
      if (id == null || id === '') { summary.withoutServiceOrder++; continue }
      summary.linked++
      const identity = { projectId: project._id.toString(), projectNumber: project.qtde,
        projectName: project.nomeDoContrato, serviceOrderId: String(id) }
      if (typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id)) {
        summary.invalidServiceOrderId++
        findings.push({ ...identity, issue: 'invalid-service-order-id' })
        continue
      }
      const normalizedId = new ObjectId(id).toHexString()
      links.set(normalizedId, [...(links.get(normalizedId) || []), identity.projectId])
      const order = ordersById.get(normalizedId)
      if (!order) {
        summary.missingServiceOrder++
        findings.push({ ...identity, issue: 'missing-service-order' })
        continue
      }
      if (!order.projeto?.id) {
        summary.reverseLinkMissing++
        findings.push({ ...identity, issue: 'missing-reverse-link' })
      } else if (String(order.projeto.id) !== identity.projectId) {
        summary.reverseLinkMismatch++
        findings.push({ ...identity, issue: 'reverse-link-mismatch', orderProjectId: String(order.projeto.id) })
      }
      summary.compared++
      const differences = compareProject(project, order)
      if (!differences.length) { summary.matching++; continue }
      summary.different++
      for (const difference of differences) {
        summary.differencesByField[difference.projectField] = (summary.differencesByField[difference.projectField] || 0) + 1
      }
      findings.push({ ...identity, issue: 'field-differences', differences })
    }
    for (const [serviceOrderId, projectIds] of links) {
      if (projectIds.length < 2) continue
      summary.sharedServiceOrders++
      findings.push({ issue: 'shared-service-order', serviceOrderId, projectIds })
    }
    const report = { generatedAt: new Date().toISOString(), database: 'projetos', readOnly: true,
      scope: 'All projects; principal order resolved exclusively through idOrdemServico. Mirrored execution fields only.',
      normalization: 'Missing/null scalars equivalent; dates compared as instants; missing/null responsibles equivalent to []; responsible list order ignored, all metadata compared. Collections read sequentially, not a transactional snapshot.',
      summary, findings }
    fs.mkdirSync(path.dirname(output), { recursive: true })
    fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
    console.log(JSON.stringify({ ...summary, report: output }, null, 2))
  } finally {
    await client.close()
  }
}

module.exports = { compareProject }
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1 })
