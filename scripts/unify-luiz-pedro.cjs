// Read-only by default; pass --apply to migrate responsible identities.
const { MongoClient } = require('mongodb')
const { EJSON } = require('bson')
const fs = require('node:fs')
const path = require('node:path')
const { isDeepStrictEqual } = require('node:util')
const target = '6996218f4ce47a6fb59199a4'
const old = new Set(['65564f8e23d030258d68c5ee', '69b4574ce2a028c53581b0c8'])
async function main() {
 const client = new MongoClient(process.env.DB_KEY)
 const apply = process.argv.includes('--apply')
 const dir = path.join(__dirname, '.project-service-order-audits')
 fs.mkdirSync(dir, { recursive: true })
 const stamp = new Date().toISOString().replace(/[:.]/g, '-')
 const backup = path.join(dir, `luiz-pedro-backup-${stamp}.jsonl`)
 const report = { apply, target, backup, collections: {}, issues: [] }
 try {
  await client.connect()
  const db = client.db('projetos')
  const canonical = await db.collection('ordensDeServico').findOne({'responsaveis.id': target})
  const person = canonical?.responsaveis.find(p => p.id === target)
  if (!person) throw new Error('Canonical identity missing')
  const identity = Object.fromEntries(['id','nome','email','telefone','avatar_url'].filter(k => k in person).map(k => [k, person[k]]))
  identity.nome = 'Equipe - Luiz Pedro'
  for (const [collection, field] of [['ordensDeServico','responsaveis'], ['dados','obra.responsaveis']]) {
   const col = db.collection(collection)
   const docs = await col.find({[`${field}.id`]: {$in: [...old, target]}}).toArray()
   const stats = report.collections[collection] = { planned: 0, modified: 0, verified: 0, deduplicated: 0 }
   for (const doc of docs) {
    const before = collection === 'dados' ? doc.obra.responsaveis : doc.responsaveis
    let after = before.map(p => old.has(p.id) || p.id === target ? {...p, ...identity} : p)
    const matches = after.filter(p => p.id === target)
    if (matches.length > 1) {
     // Never silently discard conflicting historical metadata.
     const merged = {...matches[0]}
     for (const p of matches.slice(1)) for (const [k,v] of Object.entries(p)) {
      if (k in merged && !isDeepStrictEqual(merged[k], v)) throw new Error(`Conflicting duplicate metadata: ${collection}/${doc._id}/${k}`)
      merged[k] = v
     }
     let seen = false
     after = after.flatMap(p => p.id !== target ? [p] : seen ? [] : (seen = true, [merged]))
     stats.deduplicated++
    }
    if (isDeepStrictEqual(before, after)) continue
    stats.planned++
    if (!apply) continue
    fs.appendFileSync(backup, EJSON.stringify({collection, before: doc, field, after}) + '\n')
    const result = await col.updateOne({_id: doc._id, [field]: {$eq: before}}, {$set: {[field]: after}}, {writeConcern: {w:'majority'}})
    if (result.modifiedCount !== 1) throw new Error(`Concurrent change: ${doc._id}`)
    stats.modified++
    const current = await col.findOne({_id:doc._id})
    const expected = {...doc}
    if (collection === 'dados') expected.obra = {...doc.obra, responsaveis: after}
    else expected.responsaveis = after
    if (!isDeepStrictEqual(current, expected)) throw new Error(`Verification failed: ${doc._id}`)
    stats.verified++
   }
   stats.remainingOldReferences = await col.countDocuments({[`${field}.id`]: {$in:[...old]}})
  }
 } catch(e) { report.issues.push(e.message); process.exitCode = 1 }
 finally { await client.close(); fs.writeFileSync(path.join(dir, `luiz-pedro-${apply?'applied':'dry-run'}-${stamp}.json`), JSON.stringify(report,null,2)); console.log(JSON.stringify(report,null,2)) }
}
main()
