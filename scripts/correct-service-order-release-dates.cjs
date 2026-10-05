// Dry run: node --env-file=.env scripts/correct-service-order-release-dates.cjs
// Apply: add --apply. Only unfinished, project-linked orders from the Obras base filters.
const { MongoClient } = require('mongodb')
const fs = require('node:fs')
const path = require('node:path')

function buildCorrection(order) {
  const deliveryDate = order.source.compra?.dataEntrega || null
  if ((order.dataLiberacao ?? null) === deliveryDate) return null
  return {
    updateOne: {
      filter: {
        _id: order._id,
        'projeto.id': order.projeto.id,
        dataEfetivacao: null,
        dataLiberacao: Object.hasOwn(order, 'dataLiberacao') ? { $eq: order.dataLiberacao } : { $exists: false },
      },
      update: { $set: { dataLiberacao: deliveryDate } },
    },
  }
}

async function main() {
  if (!process.env.DB_KEY) throw new Error('Missing DB_KEY')
  const apply = process.argv.includes('--apply')
  const client = new MongoClient(process.env.DB_KEY)
  let backupFd
  try {
    await client.connect()
    const db = client.db('projetos')
    const orders = db.collection('ordensDeServico')
    const cursor = orders.aggregate([
      { $match: { dataEfetivacao: null, 'projeto.id': { $type: 'string', $ne: '' } } },
      { $set: { projectId: { $convert: { input: '$projeto.id', to: 'objectId', onError: null, onNull: null } } } },
      { $lookup: { from: 'dados', localField: 'projectId', foreignField: '_id', as: 'source' } },
      { $unwind: '$source' },
      { $project: { projeto: 1, dataLiberacao: 1, 'source.compra.dataEntrega': 1 } },
    ]).batchSize(200)
    let eligible = 0, corrections = 0, matched = 0, modified = 0
    let batch = []
    let backupPath
    async function flush() {
      if (!batch.length) return
      fs.fsyncSync(backupFd)
      const result = await orders.bulkWrite(batch, { ordered: false })
      matched += result.matchedCount
      modified += result.modifiedCount
      batch = []
    }
    for await (const order of cursor) {
      eligible++
      const correction = buildCorrection(order)
      if (!correction) continue
      corrections++
      if (!apply) continue
      if (backupFd === undefined) {
        const backupDirectory = path.join(__dirname, '.service-order-release-backups')
        fs.mkdirSync(backupDirectory, { recursive: true })
        backupPath = path.join(backupDirectory, `${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`)
        backupFd = fs.openSync(backupPath, 'wx')
      }
      fs.writeSync(backupFd, JSON.stringify({
        id: order._id.toString(), projectId: order.projeto.id,
        hadReleaseDate: Object.hasOwn(order, 'dataLiberacao'), previousReleaseDate: order.dataLiberacao,
        appliedReleaseDate: correction.updateOne.update.$set.dataLiberacao,
      }) + '\n')
      batch.push(correction)
      if (batch.length === 200) await flush()
    }
    if (apply) await flush()
    console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', eligible, corrections, matched, modified, backupPath }))
    if (apply && matched !== corrections) console.log('Concurrent order changes were skipped; rerun the dry run to inspect remaining differences.')
  } finally {
    if (backupFd !== undefined) fs.closeSync(backupFd)
    await client.close()
  }
}

module.exports = { buildCorrection }
if (require.main === module) main().catch((error) => { console.error(error.message); process.exitCode = 1 })
