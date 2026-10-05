const assert = require('node:assert/strict')
const { test } = require('node:test')
const { ObjectId } = require('mongodb')
const { buildCorrection } = require('./correct-service-order-release-dates.cjs')

test('correction only changes release date and rechecks pending status and original value', () => {
  const order = { _id: new ObjectId(), projeto: { id: new ObjectId().toString() }, dataLiberacao: 'signature-date', source: { compra: {} } }
  const operation = buildCorrection(order).updateOne
  assert.deepEqual(operation.update, { $set: { dataLiberacao: null } })
  assert.equal(operation.filter.dataEfetivacao, null)
  assert.deepEqual(operation.filter.dataLiberacao, { $eq: 'signature-date' })
  assert.equal(operation.filter['projeto.id'], order.projeto.id)
})

test('correction uses delivery date and is idempotent for matching or empty values', () => {
  const order = { _id: new ObjectId(), projeto: { id: new ObjectId().toString() }, source: { compra: { dataEntrega: 'delivery-date' } } }
  assert.deepEqual(buildCorrection(order).updateOne.filter.dataLiberacao, { $exists: false })
  assert.equal(buildCorrection(order).updateOne.update.$set.dataLiberacao, 'delivery-date')
  order.dataLiberacao = 'delivery-date'
  assert.equal(buildCorrection(order), null)
  order.dataLiberacao = null
  order.source.compra.dataEntrega = null
  assert.equal(buildCorrection(order), null)
})
