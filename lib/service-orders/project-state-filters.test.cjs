const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

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
const { buildProjectStateQuery, PROJECT_STATE_PAIRS } = load('project-state-filters.ts')
const empty = { projectStates: [], projectEquipmentDelivered: false, projectEquipmentNotDelivered: false, projectHomologationApproved: false }

test('milestones combine with AND, require a project, and handle null/missing/empty dates', () => {
  assert.deepEqual(buildProjectStateQuery(empty), {})
  for (const [positive, negative] of PROJECT_STATE_PAIRS) {
    const completed = buildProjectStateQuery({ ...empty, projectStates: [positive] })
    assert.deepEqual(completed.$and[0], { 'projeto.id': { $type: 'string', $ne: '' } })
    assert.deepEqual(Object.values(completed.$and[1])[0], { $type: 'string', $nin: ['', null] })
    const pending = buildProjectStateQuery({ ...empty, projectStates: [negative] })
    assert.deepEqual(Object.values(pending.$and[1])[0], { $in: [null, ''] })
  }
  assert.equal(buildProjectStateQuery({ ...empty, projectStates: ['paid', 'approved', 'not-delivered'] }).$and.length, 4)
  assert.deepEqual(
    buildProjectStateQuery({ ...empty, projectHomologationApproved: true, projectEquipmentNotDelivered: true }),
    buildProjectStateQuery({ ...empty, projectStates: ['approved', 'not-delivered'] }),
  )
})

test('saved criteria survive hydration independently per tab, page resets, invalid storage recovers', async () => {
  const memory = new Map()
  global.localStorage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: (key) => memory.delete(key),
  }
  const fresh = () => load('../../utils/stores/obras-filters-store.ts').useObrasFiltersStore
  const store = fresh()
  assert.equal(store.getState().hasHydrated, false)
  await store.persist.rehydrate()
  store.getState().updateFilters('execution', { projectStates: ['paid'], name: 'Ana', page: 3 })
  store.getState().updateFilters('planning', { city: ['Uberlândia'] })
  const reopened = fresh()
  await reopened.persist.rehydrate()
  assert.equal(reopened.getState().hasHydrated, true)
  assert.deepEqual(reopened.getState().filters.execution.projectStates, ['paid'])
  assert.equal(reopened.getState().filters.execution.name, 'Ana')
  assert.equal(reopened.getState().filters.execution.page, 1)
  assert.deepEqual(reopened.getState().filters.planning.projectStates, ['approved', 'not-delivered'])
  reopened.getState().resetFilters('execution')
  assert.deepEqual(reopened.getState().filters.planning.city, ['Uberlândia'])
  memory.set('obras-filters', '{broken')
  const broken = fresh()
  await broken.persist.rehydrate()
  assert.equal(broken.getState().hasHydrated, true)
  assert.deepEqual(broken.getState().filters.execution.projectStates, [])
  global.localStorage = {
    getItem: () => { throw new Error('blocked') },
    setItem: () => { throw new Error('full') },
  }
  const unavailable = fresh()
  await unavailable.persist.rehydrate()
  assert.equal(unavailable.getState().hasHydrated, true)
  assert.doesNotThrow(() => unavailable.getState().updateFilters('execution', { name: 'Bia' }))
  assert.equal(unavailable.getState().filters.execution.name, 'Bia')
  delete global.localStorage
})

test('search shares predicates between count and page, preserves date AND, sorts before pagination', async () => {
  const calls = {}
  const { createObrasFilters } = load('../../utils/stores/obras-filters-store.ts')
  const schema = load('../../utils/schemas/service-order.ts')
  const cursor = {
    sort: (sort) => { calls.sort = sort; return cursor },
    skip: (skip) => { calls.skip = skip; return cursor },
    limit: (limit) => { calls.limit = limit; return cursor },
    project: () => cursor,
    toArray: async () => [{ _id: 'order' }],
  }
  const collection = {
    countDocuments: async (query) => { calls.count = query; return 201 },
    find: (query) => { calls.find = query; return cursor },
  }
  const { default: handler } = load('../../pages/api/ordensDeServico/search.ts', {
    '@/utils/api': { apiHandler: (handlers) => handlers.POST, validateAuthenticationWithSession: async () => ({}) },
    '@/utils/methods/dates': { formatDateQuery: (date) => date },
    '@/utils/schemas/service-order': schema,
    '@/utils/services/mongodb/projects': async () => ({ collection: () => collection }),
  })
  const response = { status: () => response, json: (data) => { calls.response = data } }
  await handler({ query: { page: '2' }, body: {
    ...createObrasFilters('planning'),
    period: { field: 'dataInsercao', after: '2026-01-01', before: '2026-02-01' },
  } }, response)
  assert.deepEqual(calls.count, calls.find)
  assert.equal(calls.find.$and.length, 5)
  assert.deepEqual(calls.sort, { dataInsercao: -1, _id: -1 })
  assert.equal(calls.skip, 200)
  assert.equal(calls.limit, 200)
  assert.equal(calls.response.data.totalPages, 2)
  await assert.rejects(handler({ query: { page: '1.5' }, body: createObrasFilters('execution') }, response))
})
