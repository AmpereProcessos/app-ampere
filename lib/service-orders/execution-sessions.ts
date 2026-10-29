import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

export const EXECUTION_SESSIONS_TIMEZONE = 'America/Sao_Paulo'

const MINUTE = 60_000
const DAY_KEY_FORMAT = 'YYYY-MM-DD'
// Cap for the day-by-day walk so one corrupted record (e.g. year 1900 -> 2100) cannot freeze the UI.
const MAX_DAYS_PER_SESSION = 400
const ZONELESS_DATETIME = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/

export type TExecutionSessionInput = {
  entrada?: string | null
  saida?: string | null
  anotacoes?: string | null
}

export type TExecutionSessionStatus = 'completed' | 'open' | 'invalid'
export type TExecutionSessionInvalidReason = 'missing-entry' | 'unreadable-date' | 'exit-not-after-entry'

export type TExecutionSession = {
  /** Position in the original `periodo.historico` array. */
  index: number
  status: TExecutionSessionStatus
  invalidReason: TExecutionSessionInvalidReason | null
  entrada: string | null
  saida: string | null
  anotacoes: string
  startMs: number | null
  endMs: number | null
  /** Raw duration of the session itself (only for completed sessions). */
  durationMs: number | null
  /** True when a completed session shares time with another completed session. */
  overlaps: boolean
}

export type TExecutionSessionsSummary = {
  sessions: TExecutionSession[]
  /** Number of records in the history, whatever their state. */
  recordCount: number
  completedCount: number
  openCount: number
  invalidCount: number
  /** Distinct São Paulo calendar days touched by completed sessions. */
  distinctDays: number
  /** Worked time of completed sessions, overlapping time counted once. Never multiplied by people. */
  totalMs: number
  /** Time that would be double counted if the overlapping sessions were simply added up. */
  overlapMs: number
  hasOverlap: boolean
}

/**
 * Parses a stored datetime. Strings carrying an offset (`...Z`, `...-03:00`) are absolute instants;
 * strings without one are read as São Paulo wall-clock time instead of the runtime's local zone.
 */
export function parseExecutionInstant(value: string | null | undefined): number | null {
  if (typeof value !== 'string' || value.trim() === '') return null
  const text = value.trim()
  const ms = ZONELESS_DATETIME.test(text)
    ? dayjs.tz(text.replace(' ', 'T'), EXECUTION_SESSIONS_TIMEZONE).valueOf()
    : Date.parse(text)
  return Number.isFinite(ms) ? ms : null
}

function toSession(raw: TExecutionSessionInput, index: number): TExecutionSession {
  const entrada = raw.entrada?.trim() ? raw.entrada : null
  const saida = raw.saida?.trim() ? raw.saida : null
  const base = {
    index,
    entrada,
    saida,
    anotacoes: raw.anotacoes?.trim() ?? '',
    startMs: null as number | null,
    endMs: null as number | null,
    durationMs: null as number | null,
    overlaps: false,
  }
  const invalid = (invalidReason: TExecutionSessionInvalidReason): TExecutionSession => ({
    ...base,
    status: 'invalid',
    invalidReason,
  })

  if (!entrada) return invalid('missing-entry')
  const startMs = parseExecutionInstant(entrada)
  if (startMs === null) return invalid('unreadable-date')
  if (!saida) return { ...base, status: 'open', invalidReason: null, startMs }

  const endMs = parseExecutionInstant(saida)
  if (endMs === null) return { ...invalid('unreadable-date'), startMs }
  if (endMs <= startMs) return { ...invalid('exit-not-after-entry'), startMs, endMs }
  return { ...base, status: 'completed', invalidReason: null, startMs, endMs, durationMs: endMs - startMs }
}

export function getExecutionDayKey(ms: number) {
  return dayjs(ms).tz(EXECUTION_SESSIONS_TIMEZONE).format(DAY_KEY_FORMAT)
}

function collectDayKeys(startMs: number, endMs: number, into: Set<string>) {
  const first = getExecutionDayKey(startMs)
  // An exit exactly at midnight belongs to the previous day.
  const last = getExecutionDayKey(endMs - 1)
  let cursor = dayjs.utc(first)
  for (let step = 0; step < MAX_DAYS_PER_SESSION; step++) {
    const key = cursor.format(DAY_KEY_FORMAT)
    into.add(key)
    if (key >= last) return
    cursor = cursor.add(1, 'day')
  }
}

/** Length of the union of [start, end) intervals: overlapping stretches are counted once. */
function unionLength(intervals: Array<[number, number]>) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0])
  let total = 0
  let currentStart = 0
  let currentEnd = 0
  sorted.forEach(([start, end], position) => {
    if (position === 0 || start > currentEnd) {
      total += currentEnd - currentStart
      currentStart = start
      currentEnd = end
      return
    }
    currentEnd = Math.max(currentEnd, end)
  })
  return total + (currentEnd - currentStart)
}

/**
 * Summarises the working sessions in `periodo.historico` of a service order.
 * - Only completed sessions (valid entry + later exit) feed the total.
 * - Open sessions and invalid intervals are listed but never summed.
 * - Overlapping completed sessions are merged so shared time is counted once.
 */
export function summarizeExecutionSessions(
  history: ReadonlyArray<TExecutionSessionInput> | null | undefined,
): TExecutionSessionsSummary {
  const sessions = (history ?? []).map(toSession)
  const completed = sessions.filter((session) => session.status === 'completed')

  completed.forEach((session, position) => {
    session.overlaps = completed.some(
      (other, otherPosition) =>
        otherPosition !== position &&
        (session.startMs as number) < (other.endMs as number) &&
        (other.startMs as number) < (session.endMs as number),
    )
  })

  const intervals = completed.map((session): [number, number] => [session.startMs as number, session.endMs as number])
  const totalMs = unionLength(intervals)
  const summedMs = completed.reduce((sum, session) => sum + (session.durationMs as number), 0)
  const days = new Set<string>()
  completed.forEach((session) => collectDayKeys(session.startMs as number, session.endMs as number, days))

  return {
    sessions,
    recordCount: sessions.length,
    completedCount: completed.length,
    openCount: sessions.filter((session) => session.status === 'open').length,
    invalidCount: sessions.filter((session) => session.status === 'invalid').length,
    distinctDays: days.size,
    totalMs,
    overlapMs: summedMs - totalMs,
    hasOverlap: completed.some((session) => session.overlaps),
  }
}

/** "8h 30min", "8h", "45min", "<1min". Minutes are rounded to the nearest one. */
export function formatExecutionDuration(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) return '0min'
  if (ms < MINUTE / 2) return '<1min'
  const totalMinutes = Math.round(ms / MINUTE)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}min`
  return minutes === 0 ? `${hours}h` : `${hours}h ${String(minutes).padStart(2, '0')}min`
}

export function formatExecutionDate(ms: number | null) {
  return ms === null ? '—' : dayjs(ms).tz(EXECUTION_SESSIONS_TIMEZONE).format('DD/MM/YYYY')
}

export function formatExecutionTime(ms: number | null) {
  return ms === null ? '—' : dayjs(ms).tz(EXECUTION_SESSIONS_TIMEZONE).format('HH:mm')
}
