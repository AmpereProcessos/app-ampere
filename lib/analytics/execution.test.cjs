const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
function load(file, stubs = {}) {
  const module = { exports: {} }
  const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText
  new Function('require', 'module', 'exports', code)((id) => (id in stubs ? stubs[id] : require(id)), module, module.exports)
  return module.exports
}
const analytics = load('execution.ts')
const filters = { start: '2025-01-01', end: '2025-01-31', granularity: 'week', categories: [], people: [], cities: [], states: [], projectTypes: [] }
const now = new Date('2025-03-01T12:00:00Z')
const person = (id) => ({ id, nome: id })
function order(id, start, end, extras = {}) {
  return {
    _id: id,
    categoria: 'MONTAGEM',
    periodo: { inicio: start, fim: end },
    responsaveis: [person('Ana')],
    projeto: { id: 'p1', nome: 'Projeto 1' },
    localizacao: { cidade: 'Uberlândia', uf: 'MG' },
    ...extras,
  }
}
const at = (d) => `${d}T12:00:00-03:00`
test('costs split equally across distinct project participants, including those outside the selected category', () => {
  const orders = [
    order('one', at('2025-01-01'), at('2025-01-02'), { responsaveis: [person('Ana'), person('Ana'), person('Bia')] }),
    order('two', at('2025-01-03'), at('2025-01-04'), { categoria: 'OUTROS', responsaveis: [person('Ana'), person('Caio')] }),
  ]
  const expenses = [expense('e1', at('2025-01-05'))]
  for (const current of [filters, { ...filters, people: ['Ana'] }, { ...filters, categories: ['MONTAGEM'] }]) {
    const data = analytics.buildExecutionAnalytics(orders, expenses, current, now)
    for (const scope of [data.costs.period, data.costs.completed]) {
      assert.deepEqual(
        scope.people.map((p) => p.value),
        [33.34, 33.33, 33.33]
      )
      assert.equal(Math.round(scope.people.reduce((sum, p) => sum + p.value, 0) * 100), 10000)
      assert.equal(scope.details[0].allocations.length, 3)
      assert.equal(scope.people.find((p) => p.key === 'Ana').projects, 1)
    }
  }
})
test('unassigned project costs remain visible, canceled participants excluded, cents reconcile for signed amounts', () => {
  const data = analytics.buildExecutionAnalytics(
    [
      order('unassigned', at('2025-01-01'), at('2025-01-02'), { responsaveis: [] }),
      order('canceled', at('2025-01-01'), null, { status: 'CANCELADA', responsaveis: [person('Ana')] }),
    ],
    [expense('e1', at('2025-01-05'), { pagamentos: [{ valor: 25, dataPagamento: at('2025-01-10') }] })],
    filters,
    now
  )
  assert.deepEqual(data.costs.period.people, [
    { key: analytics.UNASSIGNED, label: 'Sem responsável', value: 100, paid: 25, outstanding: 75, projects: 1 },
  ])
  for (const value of [0.01, 100, -100, -0.01])
    assert.equal(Math.round([0, 1, 2].reduce((s, i) => s + analytics.splitCost(value, 3, i), 0) * 100), Math.round(value * 100))
})
function expense(id, date, extras = {}) {
  return {
    _id: id,
    identificador: analytics.EXECUTION_COST_TAG,
    projeto: { id: 'p1', nome: 'Projeto 1' },
    total: 100,
    efetivacao: { data: date },
    itens: [{ descricao: 'Alimentação', qtde: 2, preco: 50 }],
    pagamentos: [],
    ...extras,
  }
}
test('São Paulo date boundaries, leap validation and maximum interval', () => {
  const { start, end } = analytics.executionRange(filters)
  assert.equal(new Date(start).toISOString(), '2025-01-01T03:00:00.000Z')
  assert.equal(new Date(end).toISOString(), '2025-02-01T03:00:00.000Z')
  for (const change of [{ start: '2025-02-30' }, { start: '2025-02-01' }, { end: '2026-02-01' }, { end: '2100-01-01' }])
    assert.equal(analytics.ExecutionFiltersSchema.safeParse({ ...filters, ...change }).success, false)
  assert.equal(analytics.ExecutionFiltersSchema.safeParse({ ...filters, start: '2024-02-29', end: '2024-02-29' }).success, true)
})
test('event cohorts are independent, canceled OS excluded, durations keep true zero and discard negatives', () => {
  const orders = [
    order('carry-concluded', at('2024-12-30'), at('2025-01-02')),
    order('same-day', at('2025-01-05'), at('2025-01-05')),
    order('ongoing', at('2025-01-10'), null),
    order('carry-open', at('2024-12-01'), at('2025-02-02')),
    order('missing-start', null, at('2025-01-20')),
    order('negative', at('2025-01-22'), at('2025-01-21')),
    order('canceled', at('2025-01-01'), null, { status: 'CANCELADA' }),
  ]
  const data = analytics.buildExecutionAnalytics(orders, [], filters, now)
  assert.deepEqual(data.summary, { initiated: 3, concluded: 4, ongoing: 1, open: 2, durationCount: 2, average: 1.5, median: 1.5 })
  assert.equal(data.quality.invalidDurations, 2)
  assert.equal(data.buckets.at(-1).open, data.summary.open)
  assert.equal(
    data.buckets.reduce((sum, b) => sum + b.initiated, 0),
    data.summary.initiated
  )
  assert.equal(
    data.buckets.reduce((sum, b) => sum + b.concluded, 0),
    data.summary.concluded
  )
})
test('events on the next UTC day still belong to the previous São Paulo day', () => {
  const data = analytics.buildExecutionAnalytics(
    [
      order('before', '2025-01-01T02:59:59.999Z', null),
      order('at-start', '2025-01-01T03:00:00.000Z', null),
      order('last', '2025-02-01T02:59:59.999Z', null),
      order('outside', '2025-02-01T03:00:00.000Z', null),
    ],
    [],
    filters,
    now
  )
  assert.equal(data.summary.initiated, 2)
  assert.equal(data.summary.open, 3)
})
test('individual rankings count shared OS once per person, never duplicate IDs; unassigned remains visible', () => {
  const data = analytics.buildExecutionAnalytics(
    [
      order('shared', at('2025-01-01'), at('2025-01-02'), { responsaveis: [person('Ana'), person('Ana'), person('Bia')] }),
      order('unassigned', at('2025-01-02'), at('2025-01-03'), { responsaveis: [] }),
    ],
    [],
    filters,
    now
  )
  assert.equal(data.summary.concluded, 2)
  assert.equal(
    data.groups.people.reduce((sum, p) => sum + p.concluded, 0),
    3
  )
  assert.equal(data.groups.people.find((p) => p.key === 'Ana').concluded, 1)
  assert.equal(data.quality.unassigned, 1)
  assert.equal(data.groups.people.find((p) => p.key === analytics.UNASSIGNED).concluded, 1)
})
test('filters match assigned people, categories and locations; primary responsible is not substituted', () => {
  const os = order('one', at('2025-01-01'), at('2025-01-02'), { responsavel: { nome: 'Carlos' }, responsaveis: [person('Ana'), person('Bia')] })
  assert.equal(analytics.buildExecutionAnalytics([os], [], { ...filters, people: ['Carlos'] }, now).summary.concluded, 0)
  const data = analytics.buildExecutionAnalytics([os], [], { ...filters, people: ['Ana'], categories: ['MONTAGEM'], states: ['MG'] }, now)
  assert.equal(data.summary.concluded, 1)
  assert.deepEqual(
    data.groups.people.map((p) => p.key),
    ['Ana']
  )
  assert.equal(analytics.buildExecutionAnalytics([os], [], { ...filters, cities: ['Outra'] }, now).summary.concluded, 0)
})
test('shared projects and duplicate expense records never multiply costs; only the approved tag counts', () => {
  const e = expense('e1', at('2025-01-05'))
  const data = analytics.buildExecutionAnalytics(
    [order('one', at('2025-01-01'), at('2025-01-02')), order('two', at('2025-01-03'), at('2025-01-04'))],
    [e, e, expense('other', at('2025-01-05'), { identificador: 'OUTRO' })],
    filters,
    now
  )
  assert.equal(data.costs.period.recorded, 100)
  assert.equal(data.costs.completed.recorded, 100)
  assert.equal(data.costs.completed.projects, 1)
  assert.equal(data.costs.completed.coverage, 100)
  assert.equal(data.costs.completed.averagePerProject, 100)
})
test('payments use payment date independently, pending uses cutoff, completed projects include lifetime tagged costs', () => {
  const data = analytics.buildExecutionAnalytics(
    [order('one', at('2025-01-01'), at('2025-01-02'))],
    [
      expense('prior', at('2024-12-20'), { pagamentos: [{ valor: 40, dataPagamento: at('2025-01-05') }] }),
      expense('current', at('2025-01-20'), {
        pagamentos: [
          { valor: 25, dataPagamento: at('2025-01-25') },
          { valor: 75, dataPagamento: at('2025-02-10') },
        ],
      }),
      expense('later', at('2025-02-20')),
    ],
    filters,
    now
  )
  assert.equal(data.costs.period.recorded, 100)
  assert.equal(data.costs.period.paid, 65)
  assert.equal(data.costs.period.outstanding, 75)
  assert.equal(data.costs.completed.recorded, 300)
  assert.equal(data.costs.completed.paid, 140)
  assert.equal(data.costs.completed.outstanding, 160)
  assert.equal(
    data.costs.trend.reduce((s, b) => s + b.paid, 0),
    65
  )
  assert.equal(
    data.costs.trend.reduce((s, b) => s + b.recorded, 0),
    100
  )
})
test('missing links/dates do not turn into free execution; item differences reconcile to the expense total', () => {
  const data = analytics.buildExecutionAnalytics(
    [
      order('one', at('2025-01-01'), at('2025-01-02')),
      order('two', at('2025-01-01'), at('2025-01-02'), { projeto: { id: 'p2' } }),
      order('no-project', at('2025-01-01'), null, { projeto: {} }),
    ],
    [expense('missing-date', null, { itens: [{ descricao: 'Item', qtde: 1, preco: 30 }] })],
    filters,
    now
  )
  assert.equal(data.costs.period.recorded, 0)
  assert.equal(data.costs.period.missingDates, 1)
  assert.equal(data.costs.period.coverage, 50)
  assert.equal(data.costs.completed.recorded, 100)
  assert.equal(
    data.costs.completed.items.reduce((s, i) => s + i.value, 0),
    100
  )
  assert.equal(data.quality.withoutProject, 1)
})
test('all aging buckets handle boundary days', () => {
  assert.deepEqual([0, 7.99, 8, 15.99, 16, 30.99, 31].map(analytics.agingKey), ['0-7', '0-7', '8-15', '8-15', '16-30', '16-30', '31+'])
})
test('API denies operational access before querying, and does not read expenses without financial permission', async () => {
  let finance = false,
    operational = true
  const reads = []
  const handler = load('../../pages/api/stats/execution.ts', {
    '@/lib/analytics/execution': analytics,
    '@/utils/api': {
      apiHandler: (x) => x.POST,
      validateAuthenticationWithSession: async () => ({
        user: { permissoes: { execucao: { visualizar: operational }, ordensDeServico: { visualizar: false }, financeiro: { visualizar: finance } } },
      }),
    },
    '@/utils/services/mongodb/projects': async () => ({
      collection: (name) => ({
        find: () => {
          reads.push(name)
          return { toArray: async () => (name === 'ordensDeServico' ? [order('one', at('2025-01-01'), at('2025-01-02'))] : []) }
        },
      }),
    }),
  }).default
  let response
  const res = {
    setHeader() {},
    status() {
      return this
    },
    json(data) {
      response = data
    },
  }
  await handler({ body: filters }, res)
  assert.deepEqual(reads, ['ordensDeServico'])
  assert.equal(response.data.costs, null)
  finance = true
  await handler({ body: filters }, res)
  assert.deepEqual(reads, ['ordensDeServico', 'ordensDeServico', 'despesas'])
  operational = false
  await assert.rejects(() => handler({ body: filters }, res), { statusCode: 403 })
  assert.equal(reads.length, 3)
})
