// Run once during deployment: node --env-file=.env scripts/prepare-obras-filters.cjs
// Uses the same DB_KEY and database as the application. No full collection is held in memory.
const { MongoClient } = require('mongodb')
const milestones = {
  compraDataPagamento: ['compra', 'dataPagamento'],
  compraEntregaDataEfetivacao: ['compra', 'dataEntrega'],
  homologacaoAcessoDataResposta: ['homologacao', 'acesso', 'dataResposta'],
  homologacaoVistoriaDataEfetivacao: ['homologacao', 'vistoria', 'dataEfetivacao'],
}

async function check(orders) {
  const [summary] = await orders.aggregate([
    { $match: { 'projeto.id': { $type: 'string', $ne: '' } } },
    { $project: { projeto: 1, projectId: { $convert: { input: '$projeto.id', to: 'objectId', onError: null, onNull: null } } } },
    { $lookup: { from: 'dados', localField: 'projectId', foreignField: '_id', as: 'source' } },
    { $set: { source: { $arrayElemAt: ['$source', 0] } } },
    { $facet: {
      linked: [{ $count: 'count' }],
      orphaned: [{ $match: { source: { $exists: false } } }, { $count: 'count' }],
      mismatched: [{ $match: { source: { $exists: true }, $expr: { $or: Object.entries(milestones).map(([key, fields]) => ({
        $ne: [{ $ifNull: [`$projeto.${key}`, null] }, { $ifNull: [`$source.${fields.join('.')}`, null] }],
      })) } } }, { $count: 'count' }],
    } },
  ]).toArray()
  return Object.fromEntries(Object.entries(summary).map(([key, value]) => [key, value[0]?.count ?? 0]))
}

async function main() {
  if (!process.env.DB_KEY) throw new Error('Missing DB_KEY')
  const client = new MongoClient(process.env.DB_KEY)
  try {
    await client.connect()
    const db = client.db('projetos')
    const orders = db.collection('ordensDeServico')
    console.log('Before:', JSON.stringify(await check(orders)))
    if (process.argv.includes('--check')) return
    await orders.createIndex({ 'projeto.id': 1 }, { name: 'service_orders_project' })
    await orders.createIndex({ dataEfetivacao: 1, dataInsercao: -1, _id: -1 }, { name: 'service_orders_pending_insertion' })
    await orders.createIndex({ dataInsercao: -1, _id: -1 }, { name: 'service_orders_insertion' })

    const cursor = db.collection('dados').find({}, { projection: {
      'compra.dataPagamento': 1, 'compra.dataEntrega': 1,
      'homologacao.acesso.dataResposta': 1, 'homologacao.vistoria.dataEfetivacao': 1,
    } }).batchSize(500)
    let batch = []
    let modified = 0
    let matched = 0
    async function flush() {
      if (!batch.length) return
      const projectsById = new Map(batch.map((project) => [project._id.toString(), project]))
      const currentOrders = await orders.find({ 'projeto.id': { $in: [...projectsById.keys()] } }, {
        projection: { projeto: 1 },
      }).toArray()
      const operations = currentOrders.map((order) => {
        const project = projectsById.get(order.projeto.id)
        const filter = { _id: order._id, 'projeto.id': order.projeto.id }
        const values = {}
        for (const [key, fields] of Object.entries(milestones)) {
          const field = `projeto.${key}`
          // Compare-and-set protects dates updated by live synchronization after our read.
          filter[field] = order.projeto[key] === undefined ? { $exists: false } : { $eq: order.projeto[key] }
          values[field] = fields.reduce((value, part) => value?.[part], project) ?? null
        }
        return { updateOne: { filter, update: { $set: values } } }
      })
      const result = operations.length ? await orders.bulkWrite(operations, { ordered: false }) : { modifiedCount: 0, matchedCount: 0 }
      modified += result.modifiedCount
      matched += result.matchedCount
      batch = []
    }
    for await (const project of cursor) {
      batch.push(project)
      if (batch.length === 500) await flush()
    }
    await flush()
    console.log(`Prepared Obras indexes; matched ${matched}, updated ${modified} service orders.`)
    const summary = await check(orders)
    console.log('After:', JSON.stringify(summary))
    if (summary.mismatched) process.exitCode = 2
  } finally {
    await client.close()
  }
}
main().catch((error) => { console.error(error.message); process.exitCode = 1 })
