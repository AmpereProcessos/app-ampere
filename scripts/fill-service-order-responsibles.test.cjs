const { test } = require('node:test')
const assert = require('node:assert/strict')
const { planFill, prepareReviewedFill } = require('./fill-service-order-responsibles.cjs')

const person = { id: 'person-1', nome: 'Ana', dataValidacao: '2026-10-26T12:00:00Z', email: 'ana@example.com' }
const project = { _id: 'project-1', idOrdemServico: 'order-1', tipoDeServico: 'SISTEMA FOTOVOLTAICO', obra: { responsaveis: [person] } }
const order = { _id: 'order-1', projeto: { id: 'project-1' }, categoria: 'MONTAGEM', responsaveis: [], status: 'KEEP', observacoes: ['KEEP'] }

test('copies the full project list into the principal order and sets only responsaveis', () => {
  const beforeProject = structuredClone(project), beforeOrder = structuredClone(order)
  const plan = planFill(project, order, 1)
  assert.equal(plan.outcome, 'would-update')
  assert.deepEqual(plan.operation.updateOne.update, { $set: { responsaveis: [person] } })
  assert.deepEqual(plan.operation.updateOne.filter.responsaveis, { $size: 0 })
  assert.equal(plan.operation.updateOne.filter['projeto.id'], 'project-1')
  assert.deepEqual(project, beforeProject)
  assert.deepEqual(order, beforeOrder)
})

test('distinguishes empty, null, and missing destination lists with matching guards', () => {
  const missing = { ...order }
  delete missing.responsaveis
  assert.deepEqual(planFill(project, missing, 1).operation.updateOne.filter.responsaveis, { $exists: false })
  assert.deepEqual(planFill(project, { ...order, responsaveis: null }, 1).operation.updateOne.filter.responsaveis, { $type: 10 })
})

test('never overwrites a populated or invalid order list', () => {
  for (const responsaveis of [[person], 'invalid']) {
    const plan = planFill(project, { ...order, responsaveis }, 1)
    assert.equal(plan.reason, 'order-list-populated-or-invalid')
    assert.equal(plan.operation, undefined)
  }
})

test('skips empty and invalid project lists', () => {
  for (const responsaveis of [[], null, undefined, 'invalid', [null], [{ id: '', nome: 'Ana' }], [{ id: '1', nome: ' ' }], [{ ...person, email: 1 }]]) {
    const plan = planFill({ ...project, obra: { responsaveis } }, order, 1)
    assert.equal(plan.outcome, 'skipped')
    assert.equal(plan.operation, undefined)
  }
})

test('excludes secondary orders, shared/inconsistent links and solar non-assembly orders', () => {
  assert.equal(planFill(project, { ...order, _id: 'secondary' }, 1).reason, 'not-main-order')
  assert.equal(planFill(project, order, 2).reason, 'ambiguous-or-inconsistent-link')
  assert.equal(planFill(project, { ...order, projeto: { id: 'other' } }, 1).reason, 'ambiguous-or-inconsistent-link')
  assert.equal(planFill(project, { ...order, categoria: 'MANUTENÇÃO CORRETIVA' }, 1).reason, 'solar-main-order-not-assembly')
  assert.equal(planFill(null, order, 1).reason, 'missing-project-or-order')
})

test('apply rechecks reviewed source values, category and destination emptiness', () => {
  const reviewed = { projectId: 'project-1', orderId: 'order-1', projectType: project.tipoDeServico,
    orderCategory: 'MONTAGEM', beforeState: 'empty-array', after: [person] }
  assert.equal(prepareReviewedFill(reviewed, project, order, 1).outcome, 'would-update')
  assert.equal(prepareReviewedFill(reviewed, { ...project, obra: { responsaveis: [{ ...person, nome: 'Changed' }] } }, order, 1).reason, 'changed-since-review')
  assert.equal(prepareReviewedFill(reviewed, project, { ...order, responsaveis: [person] }, 1).reason, 'order-list-populated-or-invalid')
  assert.equal(prepareReviewedFill(reviewed, project, { ...order, responsaveis: null }, 1).reason, 'changed-since-review')
})
