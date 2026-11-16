const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { ObjectId } = require('mongodb');
const { z } = require('zod');

function load(file, stubs = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  new Function('require', 'module', 'exports', code)(id => id in stubs ? stubs[id] : require(id), module, module.exports);
  return module.exports;
}
const rules = load('purchase-materials.ts');
const stock = load('purchase-stock.ts', { './purchase-materials': rules });
const schemas = load('../../utils/schemas/purchases.ts', { './users': { AuthorSchema: z.object({ id: z.string(), nome: z.string() }) } });
const materialId = 'bbbbbbbbbbbbbbbbbbbbbbbb';
const otherId = 'cccccccccccccccccccccccc';
const purchaseId = 'aaaaaaaaaaaaaaaaaaaaaaaa';
const deliveryDate = '2026-11-13T03:00:00.000Z';
const item = (overrides = {}) => ({ materialId, descricao: 'Material', categoria: 'OUTROS', unidade: 'UN', qtde: 10, valor: 2, ...overrides });

function fixture({ composition = [item()], entries = [], delivered = true, revision, catalogMissing = false, allocations = [] } = {}) {
  const purchase = { _id: new ObjectId(purchaseId), titulo: 'Compra', projeto: {}, entrega: { dataEfetivacao: delivered ? deliveryDate : null }, composicao: structuredClone(composition), ...(revision === undefined ? {} : { revisao: revision }) };
  const materials = [materialId, otherId].map(id => ({ _id: new ObjectId(id), nome: id, qtde: 100, preco: 2 }));
  const calls = { stock: [], logs: [], writes: 0 };
  const project = { _id: new ObjectId(otherId), alocacoes: allocations };
  const projectsCollection = { findOne: async () => structuredClone(project), updateOne: async (_filter, update) => { Object.assign(project, update.$set); } };
  const logs = structuredClone(entries);
  const purchaseCollection = {
    insertOne: async document => { Object.assign(purchase, document); return { acknowledged: true, insertedId: purchase._id }; },
    findOne: async () => structuredClone(purchase),
    updateOne: async (_filter, update) => {
      if (Object.hasOwn(_filter, 'revisao')) {
        const matches = typeof _filter.revisao === 'number'
          ? purchase.revisao === _filter.revisao : !Object.hasOwn(purchase, 'revisao');
        if (!matches) return { acknowledged: true, matchedCount: 0 };
      }
      calls.writes++;
      Object.assign(purchase, update.$set);
      if (update.$inc?.revisao) purchase.revisao = (purchase.revisao || 0) + update.$inc.revisao;
      return { acknowledged: true, matchedCount: 1 };
    },
  };
  const materialsCollection = {
    find: query => ({ toArray: async () => catalogMissing ? [] : materials.filter(m => query._id.$in.some(id => id.equals(m._id))) }),
    findOne: async query => {
      const material = catalogMissing ? null : materials.find(m => m._id.equals(query._id));
      return material ? { ...material } : null;
    },
    updateOne: async (filter, update) => {
      const material = materials.find(m => m._id.equals(filter._id));
      Object.assign(material, update.$set);
      calls.stock.push(update);
      return { acknowledged: true, matchedCount: 1 };
    },
  };
  const logCollection = {
    find: query => ({ toArray: async () => logs.filter(entry => (!query.tipo || entry.tipo === query.tipo) && (!query['material.id'] || entry.material.id === query['material.id'])) }),
    insertOne: async entry => { logs.push(structuredClone(entry)); calls.logs.push(entry); },
  };
  const session = { withTransaction: async callback => callback(), endSession: async () => {} };
  const client = { startSession: () => session, db: () => ({ collection: name => ({ 'controles-compras': purchaseCollection, material: materialsCollection, alteracoes: logCollection, dados: projectsCollection })[name] }) };
  const userSession = { user: { id: 'operator', nome: 'Test' } };
  const api = load('../../pages/api/controles-compras/index.ts', {
    '@/utils/api': { apiHandler: handlers => handlers, validateAuthenticationWithSession: async () => userSession },
    '@/utils/schemas/purchases': schemas,
    '@/lib/projects/purchase-materials': rules,
    '@/lib/projects/purchase-stock': stock,
    '@/utils/services/mongodb/mongo-client': Promise.resolve(client),
    '@/utils/services/mongodb/projects': async () => client.db(),
    '@/lib/service-orders/delivery-release': { syncServiceOrdersDeliveryRelease: async () => {} },
    '@/lib/notifications/materials': { notifyMaterialBelowMinimumIfCrossed: async () => {} },
  });
  const res = { status: () => res, json: value => value };
  return {
    purchase, materials, calls, logs, project,
    post: body => api.default.POST({ body }, res),
    put: body => api.default.PUT({ query: { id: purchaseId }, body }, res),
    patch: () => api.default.PATCH({ query: { id: purchaseId }, body: { materialId } }, res),
    reconcile: (type = 'UPDATING', composition = purchase.composicao, projectId = null) => api.handlePurchaseControlAllocationsImproved({
      type, purchaseControlId: purchaseId, purchaseControlTitle: 'Compra', purchaseControlDeliveryDate: deliveryDate,
      purchaseControlComposition: composition, projectId, purchaseControlsCollection: purchaseCollection,
      projectsCollection, materialsCollection, materialsLogsCollection: logCollection, dbSession: session, userSession,
    }),
  };
}
const receipt = (quantity, id = materialId) => ({ tipo: 'ENTRADA', material: { id }, alteracao: quantity, qtdeAnterior: 0, qtdeNovo: quantity, precoAnterior: 0, precoNovo: 2 });

test('rejects missing/invalid/newly cleared links while allowing unchanged legacy rows', () => {
  for (const id of [null, undefined, '', 'invalid', '123456789012']) {
    assert.throws(() => rules.validatePurchaseComposition([item({ materialId: id })]), { statusCode: 400 });
    rules.validatePurchaseComposition([item({ materialId: id })], [item({ materialId: id })]);
    assert.throws(() => rules.validatePurchaseComposition([item({ materialId: id })], [item()]), { statusCode: 400 });
  }
  assert.throws(() => rules.validatePurchaseComposition([item({ materialId: null }), item({ materialId: null })], [item({ materialId: null })]), { statusCode: 400 });
  assert.throws(() => rules.validatePurchaseComposition([item({ qtde: 0 })]), { statusCode: 400 });
});

test('PUT rejects stale full forms and missing revision before any writes', async () => {
  const f = fixture({ revision: 2 });
  for (const revisao of [0, 1, undefined]) await assert.rejects(f.put({ composicao: [item()], revisao }), { statusCode: 409 });
  assert.equal(f.calls.writes, 0);
});

test('PUT blocks clearing a repaired link even at the current revision', async () => {
  const f = fixture({ revision: 2 });
  await assert.rejects(f.put({ composicao: [item({ materialId: null })], revisao: 2 }), { statusCode: 400 });
  assert.equal(f.calls.writes, 0);
});

test('PUT checks the catalog for newly selected materials', async () => {
  const f = fixture({ catalogMissing: true });
  await assert.rejects(f.put({ composicao: [item({ materialId: otherId })], revisao: 0 }), {
    statusCode: 400,
    message: `O material "Material" (ID: ${otherId}) não existe ou foi excluído. Selecione outro material.`,
  });
  assert.equal(f.calls.writes, 0);
});

test('catalog errors identify every missing/deleted material and omit active materials', async () => {
  const deletedId = 'dddddddddddddddddddddddd';
  const selected = [item({ descricao: 'Active' }), item({ materialId: otherId, descricao: 'Missing' }),
    item({ materialId: deletedId, descricao: 'Deleted' })];
  const collection = { find: query => {
    assert.equal(query.dataExclusao, null);
    return { toArray: async () => [{ _id: new ObjectId(materialId) }] };
  } };
  await assert.rejects(rules.validatePurchaseMaterialCatalog(selected, collection), error => {
    assert.equal(error.statusCode, 400);
    assert.ok(error.message.includes(`"Missing" (ID: ${otherId})`));
    assert.ok(error.message.includes(`"Deleted" (ID: ${deletedId})`));
    assert.ok(!error.message.includes('Active'));
    return true;
  });
});

test('editing notes on a legacy delivered purchase does not create stock', async () => {
  const composition = [item({ materialId: null, dataAlocacao: deliveryDate, qtdeAlocada: 10 })];
  const f = fixture({ composition });
  await f.put({ anotacoes: 'Updated', composicao: composition, revisao: 0 });
  assert.equal(f.purchase.anotacoes, 'Updated');
  assert.equal(f.purchase.revisao, 1);
  assert.equal(f.calls.stock.length, 0);
});

test('unrelated partial edits remain compatible with legacy revisions', async () => {
  const f = fixture();
  await f.put({ anotacoes: 'Updated' });
  assert.equal(f.purchase.revisao, 1);
  assert.equal(f.calls.stock.length, 0);
});

test('full-form note edits ignore property order and cannot manufacture allocation flags', async () => {
  const f = fixture();
  const row = { ...item(), dataAlocacao: deliveryDate, qtdeAlocada: 1000 };
  await f.put({ anotacoes: 'Updated', composicao: [row], revisao: 0 });
  assert.equal(f.calls.stock.length, 0);
  assert.equal(f.purchase.composicao[0].qtdeAlocada, 0);
  assert.equal(f.purchase.composicao[0].dataAlocacao, null);
});

test('allocation flags without logs do not suppress real stock receipts', async () => {
  const f = fixture({ composition: [item({ dataAlocacao: deliveryDate, qtdeAlocada: 10 })] });
  await f.reconcile();
  assert.equal(f.materials[0].qtde, 110);
  assert.equal(f.logs[0].alteracao, 10);
  await f.reconcile();
  assert.equal(f.materials[0].qtde, 110);
  assert.equal(f.logs.length, 1);
});

test('multiple lines for the same material reconcile once against all signed receipts', async () => {
  const f = fixture({ composition: [item({ qtde: 7 }), item({ qtde: 5 })], entries: [receipt(8), receipt(-2)] });
  await f.reconcile();
  assert.equal(f.materials[0].qtde, 106);
  assert.equal(f.calls.logs[0].alteracao, 6);
  assert.equal(f.calls.stock.length, 1);
});

test('replacing/removing materials reverses previous receipts and allocates the new material', async () => {
  const f = fixture({ composition: [item({ materialId: otherId })], entries: [receipt(10)] });
  await f.reconcile();
  assert.equal(f.materials[0].qtde, 90);
  assert.equal(f.materials[1].qtde, 110);
  await f.reconcile();
  assert.equal(f.calls.stock.length, 2);
});

test('price edits adjust stock value without adding quantity twice', async () => {
  const f = fixture({ composition: [item({ valor: 3 })], entries: [receipt(10)] });
  await f.reconcile();
  assert.equal(f.materials[0].qtde, 100);
  assert.equal(f.materials[0].preco, 2.1);
  assert.equal(f.calls.logs[0].alteracao, 0);
  await f.reconcile();
  assert.equal(f.calls.stock.length, 1);
});

test('undoing delivery reverses recorded quantity, retaining the audit history', async () => {
  const f = fixture({ entries: [receipt(4)] });
  await f.reconcile('DEALLOCATING');
  assert.equal(f.materials[0].qtde, 96);
  assert.equal(f.logs.length, 2);
  assert.equal(f.logs[1].alteracao, -4);
  await f.reconcile('DEALLOCATING');
  assert.equal(f.calls.stock.length, 1);
});

test('legacy unlinked rows never become new stock allocations', async () => {
  const f = fixture({ composition: [item({ materialId: null })] });
  await f.reconcile();
  assert.equal(f.calls.stock.length, 0);
  assert.equal(f.purchase.composicao[0].dataAlocacao, undefined);
});

test('explicit stock synchronization increments the purchase revision', async () => {
  const f = fixture({ revision: 4 });
  await f.patch();
  assert.equal(f.purchase.revisao, 5);
  await assert.rejects(f.put({ composicao: [item()], revisao: 4 }), { statusCode: 409 });
});

test('changing the destination of an already delivered purchase is rejected', async () => {
  const f = fixture();
  await assert.rejects(f.put({ projeto: { id: otherId } }), { statusCode: 400 });
  assert.equal(f.calls.writes, 0);
});

test('project reconciliation groups duplicates and removes replaced purchase movements only', async () => {
  const unrelated = { idMaterial: 'dddddddddddddddddddddddd', quantidade: 7, movimentacoes: [], precoUnitario: 4 };
  const f = fixture({ allocations: [unrelated, {
    idMaterial: materialId, quantidadePrevista: 20, quantidade: 13,
    movimentacoes: [{ idCompra: purchaseId, quantidade: 10, precoUnitario: 2 }, { idCompra: 'another', quantidade: 3, precoUnitario: 4 }],
  }] });
  await f.reconcile('UPDATING', [item({ materialId: otherId, qtde: 3 }), item({ materialId: otherId, qtde: 2 })], otherId);
  assert.deepEqual(f.project.alocacoes[0], unrelated);
  assert.equal(f.project.alocacoes[1].quantidade, 3);
  assert.equal(f.project.alocacoes[1].movimentacoes.length, 1);
  assert.equal(f.project.alocacoes[2].quantidade, 5);
  assert.equal(f.project.alocacoes[2].movimentacoes.length, 1);
  await f.reconcile('DEALLOCATING', [], otherId);
  assert.equal(f.project.alocacoes[2].quantidade, 0);
  assert.equal(f.project.alocacoes[1].quantidade, 3);
  assert.equal(f.calls.stock.length, 0);
});

test('creating a delivered purchase records stock in the same transaction', async () => {
  const f = fixture();
  const payload = {
    status: 'ALMOXARIFADO', titulo: 'Compra', anotacoes: '', projeto: {}, etiquetas: [], atualizacoes: [],
    liberacao: { autor: {} }, composicao: [item({ dataAlocacao: deliveryDate, qtdeAlocada: 10 })],
    fornecedor: {}, total: 20, transporte: { transportadora: {} }, faturamentos: [],
    entrega: { status: 'ENTREGUE', dataEfetivacao: deliveryDate, localizacao: { uf: 'MG', cidade: 'Ituiutaba' } },
    autor: { id: 'operator', nome: 'Test' }, dataInsercao: deliveryDate,
  };
  await f.post(payload);
  assert.equal(f.materials[0].qtde, 110);
  assert.equal(f.purchase.revisao, 0);
  assert.equal(f.logs.length, 1);
});

test('setting project and delivery together allocates to the updated project, not stock', async () => {
  const f = fixture({ delivered: false });
  await f.put({ projeto: { id: otherId }, entrega: {
    status: 'ENTREGUE', dataEfetivacao: deliveryDate, localizacao: { uf: 'MG', cidade: 'Ituiutaba' },
  } });
  assert.equal(f.calls.stock.length, 0);
  assert.equal(f.project.alocacoes[0].quantidade, 10);
});

test('two concurrent saves of the same revision cannot both overwrite the composition', async () => {
  const f = fixture({ delivered: false });
  const results = await Promise.allSettled([
    f.put({ composicao: [item({ qtde: 11 })], revisao: 0 }),
    f.put({ composicao: [item({ qtde: 12 })], revisao: 0 }),
  ]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(results.find(result => result.status === 'rejected').reason.statusCode, 409);
  assert.equal(f.purchase.revisao, 1);
});

test('kit API authenticates writes and validates selected materials against the catalog', async () => {
  let saves = 0;
  let authenticated = true;
  const handlers = load('../../pages/api/controles-compras/kits.ts', {
    '@/utils/api': { apiHandler: handlers => handlers, validateAuthenticationWithSession: async () => {
      if (!authenticated) throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });
    } },
    '@/utils/schemas/purchases': schemas,
    '@/utils/schemas/useful-server': {},
    '@/lib/projects/purchase-materials': rules,
    '@/utils/services/mongodb/warehouse': async () => ({ collection: () => ({ find: () => ({ toArray: async () => [] }) }) }),
    '@/utils/services/mongodb/projects': async () => ({ collection: () => ({ insertOne: async () => { saves++; } }) }),
  }).default;
  const payload = { titulo: 'Kit', itens: [item()], dataInsercao: deliveryDate };
  await assert.rejects(handlers.POST({ body: payload }, {}), { statusCode: 400 });
  authenticated = false;
  await assert.rejects(handlers.POST({ body: payload }, {}), { statusCode: 401 });
  assert.equal(saves, 0);
});

test('reconciliation rejects negative stock before changing a material', async () => {
  const f = fixture({ entries: [receipt(200)] });
  await assert.rejects(f.reconcile('DEALLOCATING'), { statusCode: 400 });
  assert.equal(f.calls.stock.length, 0);
});

test('legacy receipts without price snapshots can be undone using the purchase unit price', async () => {
  const f = fixture({ entries: [{ tipo: 'ENTRADA', material: { id: materialId }, alteracao: 4 }] });
  await f.reconcile('DEALLOCATING');
  assert.equal(f.materials[0].qtde, 96);
  assert.equal(f.materials[0].preco, 2);
});

test('removing a delivered purchase line through PUT reverses its receipts', async () => {
  const f = fixture({ entries: [receipt(10)] });
  await f.put({ composicao: [], revisao: 0 });
  assert.equal(f.materials[0].qtde, 90);
  assert.equal(f.purchase.composicao.length, 0);
  assert.equal(f.purchase.revisao, 1);
  assert.equal(f.calls.logs[0].alteracao, -10);
});
