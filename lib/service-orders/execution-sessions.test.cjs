const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function load(file) {
  const module = { exports: {} }
  const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText
  new Function('require', 'module', 'exports', code)(require, module, module.exports)
  return module.exports
}

const {
  summarizeExecutionSessions,
  parseExecutionInstant,
  formatExecutionDuration,
  formatExecutionDate,
  formatExecutionTime,
} = load('execution-sessions.ts')

const HOUR = 3_600_000
// São Paulo is UTC-3 year-round (no DST since 2019).
const sp = (day, time) => `2026-03-${day}T${time}:00-03:00`
const session = (day, from, to, anotacoes = '') => ({
  entrada: sp(day, from),
  saida: to ? sp(day, to) : undefined,
  anotacoes,
})

test('empty or missing history yields no records and a zero total that the UI can tell apart', () => {
  for (const history of [undefined, null, []]) {
    const summary = summarizeExecutionSessions(history)
    assert.equal(summary.recordCount, 0)
    assert.equal(summary.completedCount, 0)
    assert.equal(summary.totalMs, 0)
    assert.equal(summary.distinctDays, 0)
    assert.equal(summary.hasOverlap, false)
  }
})

test('sums completed sessions, counts them and counts distinct days', () => {
  const summary = summarizeExecutionSessions([
    session('10', '08:00', '12:00'),
    session('10', '13:00', '17:30'),
    session('11', '08:00', '12:00'),
  ])
  assert.equal(summary.totalMs, 12.5 * HOUR)
  assert.equal(summary.completedCount, 3)
  assert.equal(summary.distinctDays, 2)
  assert.equal(summary.overlapMs, 0)
  assert.equal(summary.hasOverlap, false)
  assert.deepEqual(summary.sessions.map((s) => s.index), [0, 1, 2])
})

test('does not depend on input order and does not mutate the history', () => {
  const history = [session('11', '08:00', '10:00'), session('10', '08:00', '09:00')]
  const snapshot = JSON.stringify(history)
  const summary = summarizeExecutionSessions(history)
  assert.equal(summary.totalMs, 3 * HOUR)
  assert.equal(JSON.stringify(history), snapshot)
})

test('days are São Paulo calendar days, not UTC days', () => {
  // 22:00-23:30 in São Paulo is 01:00-02:30Z of the next UTC day.
  const lateEvening = summarizeExecutionSessions([
    { entrada: '2026-03-11T01:00:00.000Z', saida: '2026-03-11T02:30:00.000Z', anotacoes: '' },
  ])
  assert.equal(lateEvening.distinctDays, 1)
  assert.equal(formatExecutionDate(lateEvening.sessions[0].startMs), '10/03/2026')
  assert.equal(formatExecutionTime(lateEvening.sessions[0].startMs), '22:00')
  assert.equal(formatExecutionTime(lateEvening.sessions[0].endMs), '23:30')

  // 23:00 -> 02:00 São Paulo is entirely inside one UTC day but touches two local days.
  const acrossMidnight = summarizeExecutionSessions([
    { entrada: '2026-03-11T02:00:00.000Z', saida: '2026-03-11T05:00:00.000Z', anotacoes: '' },
  ])
  assert.equal(acrossMidnight.totalMs, 3 * HOUR)
  assert.equal(acrossMidnight.distinctDays, 2)
})

test('an exit exactly at local midnight does not add the following day', () => {
  const summary = summarizeExecutionSessions([
    { entrada: sp('10', '20:00'), saida: sp('11', '00:00'), anotacoes: '' },
  ])
  assert.equal(summary.totalMs, 4 * HOUR)
  assert.equal(summary.distinctDays, 1)
})

test('datetimes without offset are read as São Paulo time, independent of the runtime zone', () => {
  assert.equal(parseExecutionInstant('2026-03-10T08:00'), Date.parse('2026-03-10T11:00:00Z'))
  assert.equal(parseExecutionInstant('2026-03-10T08:00:00'), Date.parse('2026-03-10T11:00:00Z'))
  assert.equal(parseExecutionInstant('2026-03-10T08:00:00Z'), Date.parse('2026-03-10T08:00:00Z'))
  assert.equal(parseExecutionInstant('2026-03-10T08:00:00-03:00'), Date.parse('2026-03-10T11:00:00Z'))
})

test('open sessions are listed but never added to the completed total', () => {
  const summary = summarizeExecutionSessions([session('10', '08:00', '12:00'), session('11', '08:00', undefined)])
  assert.equal(summary.totalMs, 4 * HOUR)
  assert.equal(summary.completedCount, 1)
  assert.equal(summary.openCount, 1)
  assert.equal(summary.recordCount, 2)
  assert.equal(summary.distinctDays, 1)
  assert.equal(summary.sessions[1].status, 'open')
  assert.equal(summary.sessions[1].durationMs, null)
})

test('blank exit strings are treated as open, not as a zero-length session', () => {
  const summary = summarizeExecutionSessions([{ entrada: sp('10', '08:00'), saida: '  ', anotacoes: '' }])
  assert.equal(summary.openCount, 1)
  assert.equal(summary.totalMs, 0)
})

test('invalid intervals are excluded and flagged with a reason', () => {
  const summary = summarizeExecutionSessions([
    session('10', '08:00', '12:00'),
    { entrada: sp('10', '15:00'), saida: sp('10', '14:00'), anotacoes: '' }, // exit before entry
    { entrada: sp('10', '16:00'), saida: sp('10', '16:00'), anotacoes: '' }, // zero length
    { entrada: 'not-a-date', saida: sp('10', '18:00'), anotacoes: '' },
    { entrada: sp('10', '09:00'), saida: 'garbage', anotacoes: '' },
    { entrada: '', saida: sp('10', '18:00'), anotacoes: '' },
  ])
  assert.equal(summary.totalMs, 4 * HOUR)
  assert.equal(summary.completedCount, 1)
  assert.equal(summary.invalidCount, 5)
  assert.deepEqual(
    summary.sessions.slice(1).map((s) => s.invalidReason),
    ['exit-not-after-entry', 'exit-not-after-entry', 'unreadable-date', 'unreadable-date', 'missing-entry'],
  )
  assert.ok(summary.sessions.slice(1).every((s) => s.durationMs === null && s.overlaps === false))
})

test('overlapping sessions are merged once and flagged', () => {
  const summary = summarizeExecutionSessions([session('10', '08:00', '12:00'), session('10', '10:00', '14:00')])
  assert.equal(summary.totalMs, 6 * HOUR)
  assert.equal(summary.overlapMs, 2 * HOUR)
  assert.equal(summary.hasOverlap, true)
  assert.equal(summary.completedCount, 2)
  assert.deepEqual(summary.sessions.map((s) => s.overlaps), [true, true])
})

test('contained, duplicated and chained overlaps never double count', () => {
  const contained = summarizeExecutionSessions([session('10', '08:00', '17:00'), session('10', '10:00', '11:00')])
  assert.equal(contained.totalMs, 9 * HOUR)
  assert.equal(contained.overlapMs, 1 * HOUR)

  const duplicated = summarizeExecutionSessions([session('10', '08:00', '12:00'), session('10', '08:00', '12:00')])
  assert.equal(duplicated.totalMs, 4 * HOUR)
  assert.equal(duplicated.overlapMs, 4 * HOUR)
  assert.equal(duplicated.completedCount, 2)

  const chained = summarizeExecutionSessions([
    session('10', '08:00', '10:00'),
    session('10', '09:00', '12:00'),
    session('10', '11:00', '13:00'),
    session('10', '15:00', '16:00'),
  ])
  assert.equal(chained.totalMs, 6 * HOUR) // 08-13 merged + 15-16
  assert.deepEqual(chained.sessions.map((s) => s.overlaps), [true, true, true, false])
})

test('sessions that only touch at the boundary are not overlaps', () => {
  const summary = summarizeExecutionSessions([session('10', '08:00', '12:00'), session('10', '12:00', '14:00')])
  assert.equal(summary.totalMs, 6 * HOUR)
  assert.equal(summary.hasOverlap, false)
  assert.equal(summary.overlapMs, 0)
})

test('only-open history has records but no completed time', () => {
  const summary = summarizeExecutionSessions([session('10', '08:00', undefined)])
  assert.equal(summary.recordCount, 1)
  assert.equal(summary.completedCount, 0)
  assert.equal(summary.totalMs, 0)
  assert.equal(summary.distinctDays, 0)
})

test('a corrupted multi-year session cannot hang the day walk', () => {
  const summary = summarizeExecutionSessions([
    { entrada: '2001-01-01T00:00:00Z', saida: '2026-01-01T00:00:00Z', anotacoes: '' },
  ])
  assert.equal(summary.completedCount, 1)
  assert.ok(summary.distinctDays <= 400)
})

test('duration formatting uses hours and minutes and rounds to the minute', () => {
  assert.equal(formatExecutionDuration(0), '0min')
  assert.equal(formatExecutionDuration(10_000), '<1min')
  assert.equal(formatExecutionDuration(45 * 60_000), '45min')
  assert.equal(formatExecutionDuration(8 * HOUR), '8h')
  assert.equal(formatExecutionDuration(8.5 * HOUR), '8h 30min')
  assert.equal(formatExecutionDuration(HOUR + 5 * 60_000), '1h 05min')
  assert.equal(formatExecutionDuration(125.5 * HOUR), '125h 30min')
  assert.equal(formatExecutionDuration(59.6 * 60_000), '1h')
  assert.equal(formatExecutionDuration(Number.NaN), '0min')
})

test('the same hour is displayed in São Paulo even when stored as UTC', () => {
  const [only] = summarizeExecutionSessions([
    { entrada: '2026-03-10T11:00:00.000Z', saida: '2026-03-10T20:00:00.000Z', anotacoes: ' nota ' },
  ]).sessions
  assert.equal(formatExecutionTime(only.startMs), '08:00')
  assert.equal(formatExecutionTime(only.endMs), '17:00')
  assert.equal(only.anotacoes, 'nota')
  assert.equal(formatExecutionDate(null), '—')
})
