const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const { ObjectId } = require('mongodb')

function load(relative, stubs = {}, cache = new Map()) {
  const filename = path.resolve(__dirname, relative)
  if (cache.has(filename)) return cache.get(filename).exports
  const module = { exports: {} }
  cache.set(filename, module)
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText
  new Function('require', 'module', 'exports', code)((id) => {
    if (id in stubs) return stubs[id]
    if (id.startsWith('@/')) return load(`../../${id.slice(2)}.ts`, stubs, cache)
    if (id.startsWith('.')) return load(path.relative(__dirname, path.resolve(path.dirname(filename), `${id}.ts`)), stubs, cache)
    return require(id)
  }, module, module.exports)
  return module.exports
}

const { resolveServiceOrderReleaseDate } = load('delivery-release.ts')
test('project delivery overrides manual dates; standalone dates remain editable, including clearing', async () => {
  const projectsCollection = { findOne: async () => ({ compra: { dataEntrega: 'delivery' } }) }
  const projectId = new ObjectId().toString()
  assert.equal(await resolveServiceOrderReleaseDate({ projectId, manualDate: 'manual', projectsCollection }), 'delivery')
  projectsCollection.findOne = async () => ({ compra: {} })
  assert.equal(await resolveServiceOrderReleaseDate({ projectId, manualDate: 'manual', projectsCollection }), null)
  assert.equal(await resolveServiceOrderReleaseDate({ manualDate: 'manual', projectsCollection }), 'manual')
  assert.equal(await resolveServiceOrderReleaseDate({ manualDate: null, projectsCollection }), null)
})

function transportHarness(relative, oldDate) {
  const projectId = new ObjectId()
  const orderId = new ObjectId()
  const purchaseId = new ObjectId()
  const transportId = new ObjectId()
  const completedAt = '2026-09-10T03:00:00.000Z'
  const project = {
    _id: projectId, idOrdemServico: orderId.toString(), nomeDoContrato: 'Test',
    compra: { dataEntrega: oldDate },
  }
  const order = { _id: orderId, projeto: { id: projectId.toString() }, categoria: 'MONTAGEM', dataEfetivacao: completedAt }
  const purchase = { _id: purchaseId, projeto: { id: projectId.toString() }, autor: { id: 'test', nome: 'Test' }, entrega: {} }
  const transport = { _id: transportId, custos: [], itens: [{ id: purchaseId.toString(), projeto: { id: projectId.toString() }, dataEfetivacao: oldDate, anexos: [] }] }
  const calls = { orders: [], links: 0, inserts: 0 }
  function setFields(target, values) {
    for (const [key, value] of Object.entries(values)) {
      const fields = key.split('.')
      const last = fields.pop()
      let current = target
      for (const field of fields) current = current[field] ??= {}
      current[last] = value
    }
  }
  const collections = {
    'controles-transportes': {
      findOne: async () => structuredClone(transport),
      updateOne: async (_filter, update) => { setFields(transport, update.$set); return { acknowledged: true } },
      deleteOne: async () => ({ acknowledged: true, deletedCount: 1 }),
    },
    'controles-compras': {
      findOne: async () => purchase,
      updateOne: async (_filter, update) => { setFields(purchase, update.$set); return { acknowledged: true } },
    },
    dados: {
      findOne: async () => ({ ...project, _id: projectId, compra: { ...project.compra } }),
      updateOne: async (_filter, update) => { if ('idOrdemServico' in update.$set) calls.links++; setFields(project, update.$set); return { acknowledged: true } },
    },
    ordensDeServico: {
      findOne: async () => order,
      updateMany: async (filter, update) => { calls.orders.push({ filter, update }); setFields(order, update.$set); return { acknowledged: true } },
      insertOne: async () => { calls.inserts++; throw new Error('Must reuse existing order') },
      deleteOne: async () => { throw new Error('Must retain existing order') },
    },
    'file-references': { updateMany: async () => ({ acknowledged: true }) },
  }
  const { default: handlers } = load(relative, {
    '@/utils/api': {
      apiHandler: (handlers) => handlers,
      validateAuthentication: async () => ({ user: { id: 'test', nome: 'Test' } }),
      validateAuthenticationWithSession: async () => ({ user: { id: 'test', nome: 'Test' } }),
    },
    '@/utils/constants': {},
    '@/utils/services/mongodb/projects': async () => ({ collection: (name) => collections[name] }),
    '@/utils/services/mongodb/crm/main': async () => ({ collection: (name) => collections[name] }),
  })
  const response = { status: () => response, json: () => {} }
  return { handlers, response, calls, project, order, purchase, transportId, purchaseId, completedAt }
}

for (const route of ['../../pages/api/controles-transportes/index.ts', '../../pages/api/controles-transportes/itens/index.ts']) {
  test(`${route}: initial delivery, correction and clearing retain orders and completion`, async () => {
    for (const [before, after] of [[null, '2026-10-01T03:00:00.000Z'], ['2026-10-01T03:00:00.000Z', '2026-10-02T03:00:00.000Z'], ['2026-10-01T03:00:00.000Z', null]]) {
      const h = transportHarness(route, before)
      const body = route.includes('/itens/')
        ? { transportControlId: h.transportId.toString(), itemIndex: 0, changes: { dataEfetivacao: after } }
        : { transportControlId: h.transportId.toString(), changes: { itens: [{ id: h.purchaseId.toString(), ordem: 1, titulo: 'Test', projeto: { id: h.project._id.toString() }, dataEfetivacao: after, anexos: [] }] } }
      await h.handlers.PUT({ body }, h.response)
      assert.equal(h.project.compra.dataEntrega, after)
      assert.equal(h.purchase.entrega.dataEfetivacao, after)
      assert.equal(h.order.dataLiberacao, after)
      assert.equal(h.order.dataEfetivacao, h.completedAt)
      assert.equal(h.calls.inserts, 0)
      assert.equal(h.calls.links, 0)
      assert.equal(h.calls.orders.length, 1)
    }
  })
}

test('transport deletion clears release but retains the linked order and completion', async () => {
  const h = transportHarness('../../pages/api/controles-transportes/index.ts', '2026-10-01T03:00:00.000Z')
  await h.handlers.DELETE({ query: { id: h.transportId.toString() } }, h.response)
  assert.equal(h.order.dataLiberacao, null)
  assert.equal(h.order.dataEfetivacao, h.completedAt)
  assert.equal(h.project.idOrdemServico, h.order._id.toString())
})
