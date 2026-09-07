import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { z } from 'zod'

dayjs.extend(utc)
dayjs.extend(timezone)
export const EXECUTION_TIMEZONE = 'America/Sao_Paulo'
export const EXECUTION_COST_TAG = 'CUSTOS-ORDEM-DE-SERVICO'
const DAY = 86_400_000
export const UNASSIGNED = '__unassigned__'
const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((s) => {
    const d = new Date(`${s}T12:00:00Z`)
    return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === s
  }, 'Data inválida.')
export const ExecutionFiltersSchema = z
  .object({
    start: dateOnly,
    end: dateOnly,
    granularity: z.enum(['day', 'week', 'month']).default('month'),
    categories: z.array(z.string().max(150)).max(100).default([]),
    people: z.array(z.string().max(150)).max(100).default([]),
    cities: z.array(z.string().max(200)).max(100).default([]),
    states: z.array(z.string().max(100)).max(100).default([]),
    projectTypes: z.array(z.string().max(150)).max(100).default([]),
  })
  .refine((f) => f.start <= f.end && (Date.parse(f.end) - Date.parse(f.start)) / DAY <= 365, {
    message: 'Selecione um período de até 366 dias, com início anterior ao fim.',
  })
  .refine((f) => f.end <= dayjs().tz(EXECUTION_TIMEZONE).format('YYYY-MM-DD'), {
    message: 'A data final não pode estar no futuro.',
  })
export type ExecutionFilters = z.infer<typeof ExecutionFiltersSchema>
export type ExecutionOrder = {
  _id: { toString(): string } | string
  descricao?: string
  categoria?: string
  status?: string | null
  favorecido?: { nome?: string }
  periodo?: { inicio?: string | null; fim?: string | null }
  responsaveis?: Array<{ id?: string; nome?: string }>
  localizacao?: { cidade?: string; uf?: string }
  projeto?: { id?: string | null; nome?: string | null; tipo?: string | null }
}
export type ExecutionExpense = {
  _id: { toString(): string } | string
  identificador?: string | null
  descricao?: string
  categoria?: string
  projeto?: { id?: string | null; nome?: string | null }
  total?: number
  efetivacao?: { data?: string | null; efetivado?: boolean | null }
  pagamentos?: Array<{ valor?: number; dataPagamento?: string | null }>
  itens?: Array<{ descricao?: string; qtde?: number; preco?: number }>
}
export type ExecutionMetric = 'initiated' | 'concluded' | 'ongoing' | 'open' | 'duration'
export type ExecutionDetail = {
  id: string
  title: string
  category: string
  city: string
  state: string
  projectId: string
  projectName: string
  people: Array<{ id: string; name: string }>
  start: string | null
  end: string | null
  duration: number | null
  age: number | null
  initiated: boolean
  concluded: boolean
  ongoing: boolean
  open: boolean
}
export type ExecutionSummary = {
  initiated: number
  concluded: number
  ongoing: number
  open: number
  average: number | null
  median: number | null
  durationCount: number
}
export type ExecutionGroup = ExecutionSummary & { key: string; label: string; share: number }
export type ExecutionBucket = ExecutionSummary & { key: string; label: string; start: string; end: string }
export type CostDetail = {
  id: string
  title: string
  projectId: string
  projectName: string
  category: string
  date: string | null
  recorded: number
  paid: number
  outstanding: number
  payments: Array<{ date: string; value: number }>
  items: Array<{ label: string; value: number }>
  allocations: Array<{ id: string; name: string; recorded: number; paid: number; outstanding: number }>
  attribution?: string
}
export type CostScope = {
  recorded: number
  paid: number
  outstanding: number
  projects: number
  coveredProjects: number
  coverage: number | null
  averagePerProject: number | null
  missingDates: number
  details: CostDetail[]
  projectsBreakdown: Array<{ key: string; label: string; value: number }>
  items: Array<{ key: string; label: string; value: number }>
  people: Array<{ key: string; label: string; value: number; paid: number; outstanding: number; projects: number }>
}
export type ExecutionAnalytics = {
  generatedAt: string
  summary: ExecutionSummary
  buckets: ExecutionBucket[]
  groups: { people: ExecutionGroup[]; cities: ExecutionGroup[]; categories: ExecutionGroup[] }
  aging: Array<{ key: string; label: string; count: number }>
  details: ExecutionDetail[]
  options: { categories: string[]; people: Array<{ id: string; name: string }>; cities: string[]; states: string[]; projectTypes: string[] }
  quality: { invalidDurations: number; invalidDates: number; unassigned: number; withoutProject: number }
  costs: null | {
    period: CostScope
    completed: CostScope
    trend: Array<{ key: string; label: string; start: string; end: string; recorded: number; paid: number }>
  }
}

export function timestamp(value?: string | null): number | null {
  if (!value?.trim()) return null
  const n = /^\d{4}-\d{2}-\d{2}$/.test(value) ? dayjs.tz(value, EXECUTION_TIMEZONE).valueOf() : Date.parse(value)
  return Number.isFinite(n) ? n : null
}
export function executionRange(filters: Pick<ExecutionFilters, 'start' | 'end'>) {
  return { start: dayjs.tz(filters.start, EXECUTION_TIMEZONE).valueOf(), end: dayjs.tz(filters.end, EXECUTION_TIMEZONE).endOf('day').valueOf() + 1 }
}
function within(n: number | null, start: number, end: number): boolean {
  return n !== null && n >= start && n < end
}
const money = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100
// Assign remainder cents in stable person-ID order so every split reconciles exactly.
export function splitCost(value: number, count: number, index: number) {
  const cents = Math.round(value * 100)
  const base = Math.trunc(cents / count)
  const remainder = cents - base * count
  return (base + (index < Math.abs(remainder) ? Math.sign(remainder) : 0)) / 100
}
const finite = (n?: number) => (typeof n === 'number' && Number.isFinite(n) ? n : 0)
const unique = (items: string[]) => [...new Set(items)].sort((a, b) => a.localeCompare(b, 'pt-BR'))
export function assignedPeople(order: ExecutionOrder) {
  const people = new Map<string, { id: string; name: string }>()
  for (const p of order.responsaveis || []) {
    const name = p.nome?.trim() || 'Responsável sem nome'
    const id = p.id?.trim() || (p.nome?.trim() ? `name:${p.nome.trim().toLocaleLowerCase('pt-BR')}` : '')
    if (id) people.set(id, { id, name })
  }
  return people.size ? [...people.values()] : [{ id: UNASSIGNED, name: 'Sem responsável' }]
}
export function matchesExecutionFilters(order: ExecutionOrder, filters: ExecutionFilters) {
  const matches = (values: string[], value?: string | null) => !values.length || values.includes(value?.trim() || 'Não informado')
  return (
    order.status !== 'CANCELADA' &&
    matches(filters.categories, order.categoria) &&
    matches(filters.cities, order.localizacao?.cidade) &&
    matches(filters.states, order.localizacao?.uf) &&
    matches(filters.projectTypes, order.projeto?.tipo) &&
    (!filters.people.length || assignedPeople(order).some((p) => filters.people.includes(p.id)))
  )
}
function summarize(details: ExecutionDetail[]): ExecutionSummary {
  const durations = details
    .filter((d) => d.concluded && d.duration !== null)
    .map((d) => d.duration as number)
    .sort((a, b) => a - b)
  const n = durations.length
  return {
    initiated: details.filter((d) => d.initiated).length,
    concluded: details.filter((d) => d.concluded).length,
    ongoing: details.filter((d) => d.ongoing).length,
    open: details.filter((d) => d.open).length,
    durationCount: n,
    average: n ? durations.reduce((a, b) => a + b, 0) / n : null,
    median: n ? (durations[Math.floor((n - 1) / 2)] + durations[Math.floor(n / 2)]) / 2 : null,
  }
}
function bucketsFor(filters: ExecutionFilters): ExecutionBucket[] {
  const result: ExecutionBucket[] = []
  const range = executionRange(filters)
  let cursor = filters.start
  while (cursor <= filters.end) {
    const day = dayjs.utc(cursor)
    const next =
      filters.granularity === 'month'
        ? day.startOf('month').add(1, 'month')
        : filters.granularity === 'week'
          ? day.add(8 - (day.day() || 7), 'day')
          : day.add(1, 'day')
    const end = Math.min(dayjs.tz(next.format('YYYY-MM-DD'), EXECUTION_TIMEZONE).valueOf(), range.end)
    result.push({
      ...summarize([]),
      key: cursor,
      label: filters.granularity === 'month' ? day.format('MM/YYYY') : day.format('DD/MM'),
      start: new Date(dayjs.tz(cursor, EXECUTION_TIMEZONE).valueOf()).toISOString(),
      end: new Date(end).toISOString(),
    })
    cursor = next.format('YYYY-MM-DD')
  }
  return result
}
export function agingKey(days: number) {
  return days < 8 ? '0-7' : days < 16 ? '8-15' : days < 31 ? '16-30' : '31+'
}

export function buildExecutionAnalytics(
  allOrders: ExecutionOrder[],
  allExpenses: ExecutionExpense[] | null,
  filters: ExecutionFilters,
  now = new Date()
): ExecutionAnalytics {
  const range = executionRange(filters)
  const orders = [...new Map(allOrders.filter((o) => o.status !== 'CANCELADA').map((o) => [o._id.toString(), o])).values()]
  const filtered = orders.filter((o) => matchesExecutionFilters(o, filters))
  const snapshot = Math.min(range.end, now.getTime() + 1)
  const details: ExecutionDetail[] = filtered
    .map((o) => {
      const start = timestamp(o.periodo?.inicio),
        end = timestamp(o.periodo?.fim)
      const open = start !== null && start < snapshot && (end === null ? !o.periodo?.fim?.trim() : end >= snapshot)
      return {
        id: o._id.toString(),
        title: o.favorecido?.nome || o.descricao || 'OS sem descrição',
        category: o.categoria || 'Não informado',
        city: o.localizacao?.cidade?.trim() || 'Não informado',
        state: o.localizacao?.uf?.trim() || 'Não informado',
        projectId: o.projeto?.id || '',
        projectName: o.projeto?.nome || 'Projeto sem nome',
        people: assignedPeople(o),
        start: start === null ? null : new Date(start).toISOString(),
        end: end === null ? null : new Date(end).toISOString(),
        duration: start !== null && end !== null && end >= start ? (end - start) / DAY : null,
        age: open ? Math.max(0, (snapshot - 1 - (start as number)) / DAY) : null,
        initiated: within(start, range.start, range.end),
        concluded: within(end, range.start, range.end),
        ongoing: within(start, range.start, range.end) && !o.periodo?.fim?.trim(),
        open,
      }
    })
    .filter((d) => d.initiated || d.concluded || d.open)
  const summary = summarize(details)
  const groupBy = (key: (d: ExecutionDetail) => Array<{ key: string; label: string }>): ExecutionGroup[] => {
    const groups = new Map<string, { label: string; details: ExecutionDetail[] }>()
    for (const d of details)
      for (const k of key(d)) {
        const group = groups.get(k.key) || { label: k.label, details: [] }
        group.details.push(d)
        groups.set(k.key, group)
      }
    return [...groups]
      .map(([key, g]) => ({
        key,
        label: g.label,
        ...summarize(g.details),
        share: summary.concluded ? (g.details.filter((d) => d.concluded).length / summary.concluded) * 100 : 0,
      }))
      .sort((a, b) => b.concluded - a.concluded || b.initiated - a.initiated || a.label.localeCompare(b.label, 'pt-BR'))
  }
  const buckets = bucketsFor(filters).map((b) => {
    const start = Date.parse(b.start),
      end = Math.min(Date.parse(b.end), snapshot)
    const bucketDetails = details.map((d) => ({
      ...d,
      initiated: within(timestamp(d.start), start, end),
      concluded: within(timestamp(d.end), start, end),
      open: d.start !== null && Date.parse(d.start) < end && (d.end === null ? d.open : Date.parse(d.end) >= end),
    }))
    return { ...b, ...summarize(bucketDetails) }
  })
  const result: ExecutionAnalytics = {
    generatedAt: now.toISOString(),
    summary,
    buckets,
    details,
    groups: {
      people: groupBy((d) =>
        d.people.filter((p) => !filters.people.length || filters.people.includes(p.id)).map((p) => ({ key: p.id, label: p.name }))
      ),
      cities: groupBy((d) => [{ key: `${d.city}/${d.state}`, label: `${d.city}/${d.state}` }]),
      categories: groupBy((d) => [{ key: d.category, label: d.category }]),
    },
    aging: ['0-7', '8-15', '16-30', '31+'].map((key) => ({
      key,
      label: `${key} dias`,
      count: details.filter((d) => d.age !== null && agingKey(d.age) === key).length,
    })),
    options: {
      categories: unique(orders.map((o) => o.categoria || 'Não informado')),
      people: [...new Map(orders.flatMap(assignedPeople).map((p) => [p.id, p])).values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
      cities: unique(orders.map((o) => o.localizacao?.cidade?.trim() || 'Não informado')),
      states: unique(orders.map((o) => o.localizacao?.uf?.trim() || 'Não informado')),
      projectTypes: unique(orders.map((o) => o.projeto?.tipo?.trim() || 'Não informado')),
    },
    quality: {
      invalidDurations: summary.concluded - summary.durationCount,
      invalidDates: filtered.filter(
        (o) => (o.periodo?.inicio && timestamp(o.periodo.inicio) === null) || (o.periodo?.fim && timestamp(o.periodo.fim) === null)
      ).length,
      unassigned: details.filter((d) => d.people[0].id === UNASSIGNED).length,
      withoutProject: details.filter((d) => !d.projectId).length,
    },
    costs: null,
  }
  if (allExpenses === null) return result
  const projectIds = new Set(filtered.map((o) => o.projeto?.id).filter(Boolean))
  const expenses = [
    ...new Map(
      allExpenses.filter((e) => e.identificador === EXECUTION_COST_TAG && projectIds.has(e.projeto?.id)).map((e) => [e._id.toString(), e])
    ).values(),
  ]
  const completedProjects = new Set(details.filter((d) => d.concluded && d.projectId).map((d) => d.projectId))
  const activeProjects = new Set(details.filter((d) => d.projectId).map((d) => d.projectId))
  // Build shares from every non-canceled OS on each project, before dashboard filters.
  // Selecting one person or category must never reassign somebody else's share.
  const projectPeople = new Map<string, Map<string, { id: string; name: string }>>()
  for (const order of orders) {
    if (!order.projeto?.id) continue
    const people = projectPeople.get(order.projeto.id) || new Map<string, { id: string; name: string }>()
    for (const person of assignedPeople(order)) if (person.id !== UNASSIGNED) people.set(person.id, person)
    projectPeople.set(order.projeto.id, people)
  }
  const costScope = (completed: boolean): CostScope => {
    const candidates = completed ? expenses.filter((e) => completedProjects.has(e.projeto?.id || '')) : expenses
    const relevant = completed
      ? candidates
      : candidates.filter(
          (e) =>
            within(timestamp(e.efetivacao?.data), range.start, range.end) ||
            e.pagamentos?.some((p) => within(timestamp(p.dataPagamento), range.start, range.end))
        )
    const costDetails = relevant.map((e): CostDetail => {
      const total = finite(e.total),
        recordedInPeriod = within(timestamp(e.efetivacao?.data), range.start, range.end)
      const paidAmount = (e.pagamentos || [])
        .filter((p) =>
          completed
            ? timestamp(p.dataPagamento) !== null && (timestamp(p.dataPagamento) as number) <= now.getTime()
            : within(timestamp(p.dataPagamento), range.start, range.end)
        )
        .reduce((sum, p) => sum + finite(p.valor), 0)
      const paidAtCutoff = (e.pagamentos || [])
        .filter((p) => timestamp(p.dataPagamento) !== null && (timestamp(p.dataPagamento) as number) < (completed ? now.getTime() + 1 : snapshot))
        .reduce((sum, p) => sum + finite(p.valor), 0)
      const recorded = completed || recordedInPeriod ? total : 0
      const items =
        completed || recordedInPeriod
          ? (e.itens || []).map((i) => ({ label: i.descricao?.trim() || 'Item sem descrição', value: money(finite(i.qtde) * finite(i.preco)) }))
          : []
      const adjustment = money(recorded - items.reduce((sum, i) => sum + i.value, 0))
      if (adjustment) items.push({ label: 'Valor não detalhado em itens', value: adjustment })
      const outstanding = completed || recordedInPeriod ? money(Math.max(0, total - paidAtCutoff)) : 0
      const assigned = [...(projectPeople.get(e.projeto?.id || '')?.values() || [])].sort((a, b) => a.id.localeCompare(b.id))
      const people = assigned.length ? assigned : [{ id: UNASSIGNED, name: 'Sem responsável' }]
      return {
        id: e._id.toString(),
        title: e.descricao || 'Despesa sem descrição',
        projectId: e.projeto?.id || '',
        projectName: e.projeto?.nome || 'Projeto sem nome',
        category: e.categoria || 'Não informado',
        date: timestamp(e.efetivacao?.data) === null ? null : new Date(timestamp(e.efetivacao?.data) as number).toISOString(),
        recorded: money(recorded),
        paid: money(paidAmount),
        outstanding,
        allocations: people.map((person, index) => ({
          ...person,
          recorded: splitCost(money(recorded), people.length, index),
          paid: splitCost(money(paidAmount), people.length, index),
          outstanding: splitCost(outstanding, people.length, index),
        })),
        items,
        payments: (e.pagamentos || [])
          .filter((p) => timestamp(p.dataPagamento) !== null)
          .map((p) => ({ date: new Date(timestamp(p.dataPagamento) as number).toISOString(), value: finite(p.valor) })),
      }
    })
    const projects = completed ? completedProjects : activeProjects
    const covered = new Set(candidates.filter((e) => projects.has(e.projeto?.id || '')).map((e) => e.projeto?.id))
    const breakdown = (entries: Array<{ key: string; label: string; value: number }>) => {
      const groups = new Map<string, { key: string; label: string; value: number }>()
      for (const entry of entries) {
        const current = groups.get(entry.key)
        groups.set(entry.key, { ...entry, value: money(entry.value + (current?.value || 0)) })
      }
      return [...groups.values()].sort((a, b) => b.value - a.value)
    }
    const recorded = money(costDetails.reduce((sum, e) => sum + e.recorded, 0))
    const peopleGroups = new Map<string, { key: string; label: string; value: number; paid: number; outstanding: number; projectIds: Set<string> }>()
    for (const expense of costDetails)
      for (const share of expense.allocations) {
        const group = peopleGroups.get(share.id) || {
          key: share.id,
          label: share.name,
          value: 0,
          paid: 0,
          outstanding: 0,
          projectIds: new Set<string>(),
        }
        group.value = money(group.value + share.recorded)
        group.paid = money(group.paid + share.paid)
        group.outstanding = money(group.outstanding + share.outstanding)
        group.projectIds.add(expense.projectId)
        peopleGroups.set(share.id, group)
      }
    const contributing = new Set(costDetails.filter((e) => completed || within(timestamp(e.date), range.start, range.end)).map((e) => e.projectId))
      .size
    return {
      recorded,
      paid: money(costDetails.reduce((sum, e) => sum + e.paid, 0)),
      outstanding: money(costDetails.reduce((sum, e) => sum + e.outstanding, 0)),
      projects: projects.size,
      coveredProjects: covered.size,
      coverage: projects.size ? (covered.size / projects.size) * 100 : null,
      averagePerProject: contributing ? recorded / contributing : null,
      missingDates: candidates.filter((e) => timestamp(e.efetivacao?.data) === null).length,
      details: costDetails,
      people: [...peopleGroups.values()]
        .map(({ projectIds, ...group }) => ({ ...group, projects: projectIds.size }))
        .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, 'pt-BR')),
      projectsBreakdown: breakdown(costDetails.map((e) => ({ key: e.projectId, label: e.projectName, value: e.recorded }))),
      items: breakdown(costDetails.flatMap((e) => e.items.map((i) => ({ key: i.label, ...i })))),
    }
  }
  result.costs = {
    period: costScope(false),
    completed: costScope(true),
    trend: buckets.map((b) => ({
      key: b.key,
      label: b.label,
      start: b.start,
      end: b.end,
      recorded: money(
        expenses.reduce((sum, e) => sum + (within(timestamp(e.efetivacao?.data), Date.parse(b.start), Date.parse(b.end)) ? finite(e.total) : 0), 0)
      ),
      paid: money(
        expenses.reduce(
          (sum, e) =>
            sum +
            (e.pagamentos || []).reduce(
              (n, p) => n + (within(timestamp(p.dataPagamento), Date.parse(b.start), Date.parse(b.end)) ? finite(p.valor) : 0),
              0
            ),
          0
        )
      ),
    })),
  }
  return result
}
