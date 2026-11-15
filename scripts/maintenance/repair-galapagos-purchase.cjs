// Dry run: node scripts/maintenance/repair-galapagos-purchase.cjs
// Apply:   node scripts/maintenance/repair-galapagos-purchase.cjs --apply
const { MongoClient, ObjectId } = require('mongodb');
const { writeFileSync, mkdtempSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const assert = require('node:assert/strict');

process.loadEnvFile('.env');
const purchaseId = '6a70a7d96655bf24bf7a335d';
const mappings = [
  ['TIJOLINHO 18X0,9X0,4CM (1KG)', '6a70a6397f53c87b9e3d1403', 200, 'UN', 0.77],
  ['CAL SUPERCAL CHIII 15KG', '6a70a67c7f53c87b9e3d1406', 1, 'UN', 25.6],
  ['AREIA (LATA)', '64d24f96ab998e916e930a0b', 8, 'UN', 8],
  ['CIMENTO ', '64d2518055751645a4ccfc3b', 50, 'KG', 0.9],
];

async function main() {
  const client = new MongoClient(process.env.DB_KEY, { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  const session = client.startSession();
  try {
    const purchases = client.db('projetos').collection('controles-compras');
    const materials = client.db('almoxarifado').collection('material');
    const logs = client.db('almoxarifado').collection('alteracoes');
    const apply = process.argv.includes('--apply');
    const directory = mkdtempSync(join(tmpdir(), 'ampere-galapagos-'));
    let result;
    await session.withTransaction(async () => {
      const purchase = await purchases.findOne({ _id: new ObjectId(purchaseId) }, { session });
      assert(purchase && purchase.entrega.dataEfetivacao);
      assert(!purchase.projeto?.id, 'Expected a purchase destined for stock');
      assert.equal(purchase.composicao.length, mappings.length);
      const entries = await logs.find({ $or: [
        { idCompra: { $in: [purchaseId, new ObjectId(purchaseId)] } },
        { 'compra.id': { $in: [purchaseId, new ObjectId(purchaseId)] } },
      ] }, { session }).toArray();
      const beforeMaterials = [];
      const plan = [];
      const composition = [];
      for (const [index, [name, id, quantity, unit, price]] of mappings.entries()) {
        const item = purchase.composicao[index];
        assert.equal(item.descricao, name);
        assert.equal(item.qtde, quantity);
        assert.equal(item.unidade, unit);
        assert.equal(item.valor, price);
        assert(!item.materialId || item.materialId === id, 'Unexpected existing link');
        const material = await materials.findOne({ _id: new ObjectId(id) }, { session });
        assert(material && !material.dataExclusao);
        assert.equal(material.nome, name);
        assert.equal(material.grandeza, unit);
        assert(Number.isFinite(material.qtde) && Number.isFinite(material.preco));
        const related = entries.filter(entry => entry.material?.id === id);
        assert(related.every(entry => entry.tipo === 'ENTRADA'), 'Unexpected movement type');
        const entered = related.reduce((total, entry) => total + (
          typeof entry.qtdeAnterior === 'number' && typeof entry.qtdeNovo === 'number'
            ? entry.qtdeNovo - entry.qtdeAnterior : entry.alteracao
        ), 0);
        assert(Number.isFinite(entered) && entered >= 0 && entered <= quantity);
        const adjustment = quantity - entered;
        const newQty = material.qtde + adjustment;
        const newPrice = adjustment === 0 ? material.preco :
          (material.qtde * material.preco + adjustment * price) / newQty;
        beforeMaterials.push(material);
        plan.push({ materialId: id, material: name, unit, entered, adjustment,
          previousQuantity: material.qtde, newQuantity: newQty,
          previousPrice: material.preco, newPrice });
        composition.push({ ...item, materialId: id,
          dataAlocacao: purchase.entrega.dataEfetivacao, qtdeAlocada: quantity });
      }
      assert(entries.every(entry => mappings.some(mapping => mapping[1] === entry.material?.id)), 'Unmapped movement');
      writeFileSync(join(directory, 'before.json'), JSON.stringify({ purchase, materials: beforeMaterials, entries }, null, 2));
      result = { applied: apply, purchaseId, backupDirectory: directory, plan };
      if (!apply) return;
      for (const change of plan) {
        if (!change.adjustment) continue;
        const update = await materials.updateOne({ _id: new ObjectId(change.materialId) }, {
          $set: { qtde: change.newQuantity, preco: change.newPrice },
        }, { session });
        assert.equal(update.matchedCount, 1);
        await logs.insertOne({
          idCompra: purchaseId, tipo: 'ENTRADA', alteracao: change.adjustment,
          material: { id: change.materialId, nome: change.material },
          projeto: { id: null, nome: null },
          qtdeAnterior: change.previousQuantity, qtdeNovo: change.newQuantity,
          precoAnterior: change.previousPrice, precoNovo: change.newPrice,
          autor: { id: 'manutencao-script', nome: 'Manutenção via script autorizada pelo usuário' },
          dataInsercao: new Date().toISOString(),
          observacoes: 'Reconciliação da compra Galápagos: restauração de materialId e entrada ausente. Data de entrega preservada.',
        }, { session });
      }
      const update = await purchases.updateOne({ _id: purchase._id }, { $set: { composicao: composition } }, { session });
      assert.equal(update.matchedCount, 1);
    }, { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } });
    const afterPurchase = await purchases.findOne({ _id: new ObjectId(purchaseId) });
    const afterEntries = await logs.find({ idCompra: purchaseId, tipo: 'ENTRADA' }).toArray();
    if (apply) for (const item of afterPurchase.composicao) {
      assert.equal(afterEntries.filter(entry => entry.material.id === item.materialId)
        .reduce((sum, entry) => sum + entry.qtdeNovo - entry.qtdeAnterior, 0), item.qtde);
      assert.equal(item.qtdeAlocada, item.qtde);
    }
    const afterMaterials = await materials.find({ _id: { $in: mappings.map(mapping => new ObjectId(mapping[1])) } }).toArray();
    writeFileSync(join(directory, 'after.json'), JSON.stringify({ purchase: afterPurchase, entries: afterEntries, materials: afterMaterials }, null, 2));
    writeFileSync(join(directory, 'result.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await session.endSession();
    await client.close();
  }
}
main().catch(error => { console.error(error.name, error.code || '', error.message); process.exitCode = 1; });
