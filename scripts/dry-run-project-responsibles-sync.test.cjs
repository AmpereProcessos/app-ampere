const { test } = require('node:test')
const assert = require('node:assert/strict')
const { planSync } = require('./dry-run-project-responsibles-sync.cjs')
const { prepareUpdate } = require('./apply-project-responsibles-sync.cjs')

const person = { id: 'person-1', nome: 'Ana', dataValidacao: '2026-10-26T12:00:00Z' }
const project = { _id: 'project-1', tipoDeServico: 'SISTEMA FOTOVOLTAICO',
  idOrdemServico: 'order-1', obra: { responsaveis: [], statusDaObra: 'PROJECT STATUS', observacoes: 'Keep this' } }
const order = { categoria: 'MONTAGEM', projeto: { id: 'project-1' }, responsaveis: [person], status: 'ORDER STATUS' }

test('plans only the responsible list, preserving source metadata and guarding the old target/link', () => {
  const plan = planSync(project, order, 1)
  assert.equal(plan.outcome, 'would-update')
  assert.equal(plan.change, 'populate-empty-project-list')
  assert.deepEqual(plan.updateOne.update, { $set: { 'obra.responsaveis': [person] } })
  assert.deepEqual(plan.updateOne.filter, { _id: 'project-1', idOrdemServico: 'order-1', 'obra.responsaveis': { $eq: [] } })
  assert.equal(project.obra.statusDaObra, 'PROJECT STATUS')
  assert.deepEqual(project.obra.responsaveis, [])
})

test('classifies metadata-only and identity changes', () => {
  const populated = { ...project, obra: { responsaveis: [person] } }
  assert.equal(planSync(populated, { ...order, responsaveis: [{ ...person, dataValidacao: null }] }, 1).change, 'metadata-only')
  assert.equal(planSync(populated, { ...order, responsaveis: [{ ...person, id: 'person-2' }] }, 1).change, 'change-responsible-ids-or-names')
})

test('ignores list/property order and guards absent target lists', () => {
  const other = { id: 'person-2', nome: 'Bruno' }
  const populated = { ...project, obra: { responsaveis: [person, other] } }
  assert.equal(planSync(populated, { ...order, responsaveis: [{ nome: 'Bruno', id: 'person-2' }, person] }, 1).outcome, 'unchanged')
  assert.deepEqual(planSync({ ...project, obra: {} }, order, 1).updateOne.filter['obra.responsaveis'], { $exists: false })
})

test('skips missing, ambiguous, and category-incompatible links', () => {
  assert.equal(planSync(project, null, 1).reason, 'missing-service-order')
  assert.equal(planSync(project, order, 2).reason, 'shared-main-service-order')
  assert.equal(planSync(project, { ...order, projeto: { id: 'different' } }, 1).reason, 'reverse-link-mismatch-or-missing')
  assert.equal(planSync(project, { ...order, categoria: 'MANUTENÇÃO CORRETIVA' }, 1).reason, 'solar-main-order-not-assembly')
})

test('does not interpret absent or invalid source lists as instructions to clear', () => {
  for (const responsaveis of [undefined, null, 'invalid']) {
    assert.equal(planSync(project, { ...order, responsaveis }, 1).reason, 'source-responsibles-missing-or-invalid')
  }
  assert.equal(planSync(project, { ...order, responsaveis: [null] }, 1).reason, 'source-responsible-invalid')
  assert.equal(planSync({ ...project, obra: { responsaveis: 'invalid' } }, order, 1).reason, 'target-responsibles-invalid')
})

test('empty source lists never overwrite populated, empty or missing project lists', () => {
  for (const obra of [{ responsaveis: [person] }, { responsaveis: [] }, {}]) {
    const target = { ...project, obra }
    const original = structuredClone(target)
    const plan = planSync(target, { ...order, responsaveis: [] }, 1)
    assert.equal(plan.outcome, 'skipped')
    assert.equal(plan.reason, 'source-responsibles-empty')
    assert.equal(plan.updateOne, undefined)
    assert.deepEqual(target, original)
  }
})

test('apply accepts reviewed lists only and generates an update of responsibles alone', () => {
  const reviewed = { mainOrderId: 'order-1', before: [], after: [person] }
  const prepared = prepareUpdate(reviewed, project, order, 1)
  assert.deepEqual(prepared.operation.update, { $set: { 'obra.responsaveis': [person] } })
  assert.equal(prepareUpdate(reviewed, project, { ...order, responsaveis: [] }, 1).skipped, 'source-responsibles-empty')
  assert.equal(prepareUpdate(reviewed, project, { ...order, responsaveis: [{ ...person, nome: 'Changed' }] }, 1).skipped, 'responsibles-changed-since-review')
  assert.equal(prepareUpdate(reviewed, { ...project, obra: { responsaveis: [{ id: 'new', nome: 'New' }] } }, order, 1).skipped, 'responsibles-changed-since-review')
  assert.equal(prepareUpdate(reviewed, { ...project, idOrdemServico: 'other' }, order, 1).skipped, 'main-order-changed')
  assert.equal(prepareUpdate(reviewed, project, order, 2).skipped, 'shared-main-service-order')
})
