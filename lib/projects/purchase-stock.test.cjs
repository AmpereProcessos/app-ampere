const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { ObjectId } = require('mongodb');

const purchaseId = '6ac694bf180b412c176ea328';
const materialId = 'bbbbbbbbbbbbbbbbbbbbbbbb';
const deliveryDate = '2026-10-07T03:00:00.000Z';
const item = (id) => ({ materialId: id, descricao: 'Disjuntor', qtde: 3, valor: 7, unidade: 'UN', dataAlocacao: deliveryDate, qtdeAlocada: 1 });

function fixture(composition, { materialFound = true } = {}) {
  const calls = { stock: [], logs: [], notifications: [], ended: false };
  const material = { _id: new ObjectId(materialId), nome: 'Disjuntor', qtde: 10, preco: 5 };
  const purchase = { _id: new ObjectId(purchaseId), titulo: 'Compra', projeto: {}, entrega: { dataEfetivacao: deliveryDate }, composicao: structuredClone(composition) };
  const session = { withTransaction: async (callback) => callback(), endSession: async () => { calls.ended = true; } };
  const purchaseControlsCollection = {
    findOne: async () => structuredClone(purchase),
    updateOne: async (_filter, update) => { Object.assign(purchase, update.$set); return { acknowledged: true }; },
  };
  const materialsCollection = {
    find: (query) => {
      // Null/unset links must not enter the catalog query either.
      assert.ok(query._id.$in.every((id) => id instanceof ObjectId));
      return { toArray: async () => materialFound ? [material] : [] };
    },
    findOne: async () => materialFound ? material : null,
    updateOne: async (filter, update) => { calls.stock.push({ filter, update }); return { acknowledged: true }; },
  };
  const materialsLogsCollection = {
    find: () => ({ toArray: async () => [{ material: { id: materialId } }] }),
    insertOne: async (log) => { calls.logs.push({ insert: log }); },
    updateOne: async (filter, update) => { calls.logs.push({ filter, update }); },
    deleteMany: async (filter) => { calls.logs.push({ delete: filter }); },
  };
  const client = {
    startSession: () => session,
    db: (name) => ({ collection: (collection) => {
      if (name === 'projetos' && collection === 'controles-compras') return purchaseControlsCollection;
      if (name === 'projetos' && collection === 'dados') return {};
      if (name === 'almoxarifado' && collection === 'material') return materialsCollection;
      if (name === 'almoxarifado' && collection === 'alteracoes') return materialsLogsCollection;
      throw new Error(`Unexpected collection ${name}.${collection}`);
    } }),
  };
  const userSession = { user: { id: 'operator', nome: 'Test' } };
  const stubs = {
    '@/utils/api': { apiHandler: (handlers) => handlers, validateAuthenticationWithSession: async () => userSession },
    '@/utils/schemas/purchases': { GeneralPurchaseControlSchema: { partial: () => ({ parse: (body) => body }) } },
    '@/utils/services/mongodb/mongo-client': Promise.resolve(client),
    '@/utils/services/mongodb/projects': {},
    '@/lib/service-orders/delivery-release': {},
    '@/lib/notifications/materials': { notifyMaterialBelowMinimumIfCrossed: async (input) => { calls.notifications.push(input); } },
  };
  const compiledModule = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '../../pages/api/controles-compras/index.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  new Function('require', 'module', 'exports', code)(
    (id) => Object.hasOwn(stubs, id) ? stubs[id] : require(id), compiledModule, compiledModule.exports,
  );
  return {
    calls, purchase, handlers: compiledModule.exports.default,
    reconcile: (type) => compiledModule.exports.handlePurchaseControlAllocationsImproved({
      type, purchaseControlId: purchaseId, purchaseControlTitle: purchase.titulo,
      purchaseControlDeliveryDate: deliveryDate, purchaseControlComposition: composition,
      projectId: null, purchaseControlsCollection, projectsCollection: {},
      materialsCollection, materialsLogsCollection, dbSession: session, userSession,
    }),
  };
}

test('editing an already delivered purchase with an unlinked item succeeds without stock writes', async () => {
  const unlinked = { ...item(null), qtde: 1 };
  const { handlers, calls, purchase } = fixture([unlinked]);
  let status;
  await handlers.PUT({ query: { id: purchaseId }, body: { anotacoes: 'Updated note' } }, {
    status: (code) => { status = code; return { json() {} }; },
  });
  assert.equal(status, 201);
  assert.equal(purchase.anotacoes, 'Updated note');
  assert.equal(purchase.composicao[0].materialId, null);
  assert.deepEqual(calls.stock, []);
  assert.deepEqual(calls.logs, []);
  assert.deepEqual(calls.notifications, []);
  assert.equal(calls.ended, true);
});

for (const type of ['ALLOCATING', 'UPDATING', 'DEALLOCATING']) {
  test(`${type} skips null, undefined and empty links and still reconciles linked stock`, async () => {
    const f = fixture([item(null), item(undefined), item(''), item(materialId)]);
    await f.reconcile(type);
    const writes = f.calls.stock;
    assert.equal(writes.length, 1);
    assert.equal(writes[0].filter._id.toString(), materialId);
    const delta = type === 'ALLOCATING' ? 3 : type === 'UPDATING' ? 2 : -3;
    if (type === 'DEALLOCATING') {
      assert.equal(writes[0].update.$set.qtde, 10 + delta);
      assert.equal(writes[0].update.$set.preco, (50 + delta * 7) / (10 + delta));
    } else {
      assert.equal(writes[0].update.$inc.qtde, delta);
      assert.equal(writes[0].update.$set.preco, (50 + delta * 7) / (10 + delta));
    }
    assert.equal(f.calls.logs.length, 1);
    assert.equal(f.calls.notifications.length, 1);
  });

  test(`${type} still rejects a genuine missing catalog reference`, async () => {
    const { reconcile } = fixture([item(materialId)], { materialFound: false });
    await assert.rejects(reconcile(type), { statusCode: 404, message: 'Material não encontrado.' });
  });
}
