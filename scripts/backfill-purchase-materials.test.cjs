const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ObjectId } = require('mongodb');
const { EJSON } = require('bson');
const { match, planPurchase, prepareUpdate, afterComposition, prepareRollback } = require('./backfill-purchase-materials.cjs');

const first = { _id: new ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'), nome: 'Disjuntor TRIFÁSICO 100A ', grandeza: 'UN' };
const second = { _id: new ObjectId('bbbbbbbbbbbbbbbbbbbbbbbb'), nome: first.nome, grandeza: 'PT' };
const purchaseId = new ObjectId('cccccccccccccccccccccccc');
const item = { descricao: ' disjuntor   trifasico 100a', materialId: null, unidade: 'UN', qtde: 3, qtdeAlocada: 2, dataAlocacao: '2026-10-07', valor: 10 };

test('name matching ignores case, accents and whitespace while retaining electrical specifications', () => {
  assert.equal(match(item, [first]).material._id.toString(), first._id.toString());
  assert.equal(match({ ...item, descricao: 'Disjuntor TRIFÁSICO 125A' }, [first]).kind, 'unmatched');
  assert.equal(match({ ...item, descricao: '' }, [first]).kind, 'unmatched');
});

test('identical names are disambiguated only by explicit differing catalog units', () => {
  assert.equal(match(item, [first, second]).basis, 'name-and-unit');
  assert.equal(match({ ...item, unidade: 'PT' }, [first, second]).material._id.toString(), second._id.toString());
  assert.equal(match(item, [first, { ...second, grandeza: undefined }]).kind, 'ambiguous');
  assert.equal(match(item, [first, { ...second, grandeza: 'UN' }]).kind, 'ambiguous');
  assert.equal(match({ ...item, unidade: undefined }, [first, second]).kind, 'ambiguous');
  assert.equal(match({ ...item, unidade: 'M' }, [first]).kind, 'unit-conflict');
});

test('backfill updates only missing reference paths and guards against reordered or edited compositions', () => {
  const linked = { ...item, materialId: second._id.toString() };
  const before = [item, linked, { ...item, materialId: '' }, { descricao: item.descricao, unidade: 'UN' }];
  const plan = planPurchase({ _id: purchaseId, composicao: before }, [first]);
  assert.equal(plan.changes.length, 3);
  const prepared = prepareUpdate(plan);
  assert.deepEqual(prepared.filter, { _id: purchaseId, composicao: before });
  assert.deepEqual(Object.keys(prepared.update.$set), ['composicao.0.materialId', 'composicao.2.materialId', 'composicao.3.materialId']);
  assert.deepEqual(afterComposition(plan)[0], { ...item, materialId: first._id.toString() });
  assert.deepEqual(afterComposition(plan)[1], linked);
  assert.equal(before[0].materialId, null);
  assert.equal(before[0].qtdeAlocada, 2);
});

test('rollback distinguishes null, empty and absent fields and refuses to overwrite later composition edits', () => {
  const composition = [item, { ...item, materialId: '' }, { descricao: item.descricao, unidade: 'UN' }];
  const plan = planPurchase({ _id: purchaseId, composicao: composition }, [first]);
  const rollback = prepareRollback(EJSON.parse(EJSON.stringify(plan)));
  assert.deepEqual(rollback.filter.composicao, afterComposition(plan));
  assert.deepEqual(rollback.update, { $set: { 'composicao.0.materialId': null, 'composicao.1.materialId': '' }, $unset: { 'composicao.2.materialId': '' } });
});

test('a forged plan cannot overwrite an existing material reference', () => {
  assert.throws(() => prepareUpdate({ purchaseId: purchaseId.toString(), before: [{ ...item, materialId: second._id.toString() }], changes: [{ index: 0, description: item.descricao, materialId: first._id.toString() }] }), /Never overwrite/);
});
