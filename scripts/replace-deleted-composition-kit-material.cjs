// Dry run: node --env-file=.env scripts/replace-deleted-composition-kit-material.cjs
// Apply: append --apply. Only replaces the known deleted support material ID.
const assert = require('node:assert/strict');
const { MongoClient, ObjectId } = require('mongodb');

const deletedId = '67869b39a5ec80635757c6d6';
const activeId = '68de7dad7c8c5bf715069b94';

async function main() {
  const client = new MongoClient(process.env.DB_KEY);
  try {
    await client.connect();
    const materials = client.db('almoxarifado').collection('material');
    const deleted = await materials.findOne({ _id: new ObjectId(deletedId) });
    const active = await materials.findOne({ _id: new ObjectId(activeId) });
    assert.ok(deleted?.dataExclusao, 'Source must be soft-deleted');
    assert.ok(active && !active.dataExclusao, 'Destination must be active');
    assert.equal(deleted.nome, active.nome, 'Material names must match');
    const kits = client.db('projetos').collection('controles-compras-kits-composicao');
    const filter = { 'itens.materialId': deletedId };
    const affected = await kits.find(filter, { projection: { titulo: 1, itens: 1 } }).toArray();
    console.log(JSON.stringify({ deletedId, activeId, kits: affected.map(kit => ({
      id: kit._id.toString(), title: kit.titulo,
      references: kit.itens.filter(item => item.materialId === deletedId).length,
    })) }, null, 2));
    if (!process.argv.includes('--apply')) return;
    const result = await kits.updateMany(filter, {
      $set: { 'itens.$[item].materialId': activeId },
    }, { arrayFilters: [{ 'item.materialId': deletedId }] });
    const remaining = await kits.countDocuments(filter);
    assert.equal(remaining, 0, 'Deleted material references remain');
    console.log(JSON.stringify({ matched: result.matchedCount, modified: result.modifiedCount, remaining }));
  } finally {
    await client.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
