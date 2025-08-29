import { useDebounceMemo } from '@/lib/hooks/debounce'
import { TGetManyEngineeringCallsInput, TGetEngineeringCallsInput, TGetEngineeringCallsOutput } from '@/pages/api/chamados/projetos'
import { TEngineeringCallsStatsInput, TEngineeringCallsStatsOutput } from '@/pages/api/chamados/projetos/stats'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import dayjs from 'dayjs'
import { useState } from 'react'

async function fetchEngineeringCalls(input: TGetManyEngineeringCallsInput) {
  const urlParams = new URLSearchParams()

  if (input.page) urlParams.set('page', input.page.toString())
  if (input.periodField) urlParams.set('periodField', input.periodField)
  if (input.periodAfter) urlParams.set('periodAfter', input.periodAfter)
  if (input.periodBefore) urlParams.set('periodBefore', input.periodBefore)
  if (input.status && input.status.length > 0) urlParams.set('status', input.status.join(','))
  if (input.search) urlParams.set('search', input.search)
  if (input.callTypes && input.callTypes.length > 0) urlParams.set('callTypes', input.callTypes.join(','))

  const url = `/api/chamados/projetos?${urlParams.toString()}`

  const { data } = await axios.get<TGetEngineeringCallsOutput>(url)

  if (!data.data.default) throw new Error('Erro ao buscar chamados')

  return data.data.default
}

export function useEngineeringCalls() {
  const [filters, setFilters] = useState<TGetManyEngineeringCallsInput>({
    page: 1,
    status: ['EM ANDAMENTO', 'PENDENTE'],
    search: '',
    periodField: null,
    periodAfter: null,
    periodBefore: null,
    callTypes: null,
  })

  function updateFilters(changes: Partial<TGetManyEngineeringCallsInput>) {
    setFilters((prev) => ({ ...prev, ...changes }))
  }

  const debouncedFilters = useDebounceMemo(filters, 500)
  return {
    ...useQuery({
      queryKey: ['engineering-calls', debouncedFilters],
      queryFn: () => fetchEngineeringCalls(debouncedFilters),
    }),
    queryKey: ['engineering-calls', debouncedFilters],
    filters,
    updateFilters,
  }
}

async function fetchEngineeringCallById(id: string) {
  const { data } = await axios.get<TGetEngineeringCallsOutput>(`/api/chamados/projetos?id=${id}`)

  if (!data.data.byId) throw new Error('Erro ao buscar chamado')

  return data.data.byId
}

export function useEngineeringCallById(id: string) {
  return useQuery({
    queryKey: ['engineering-call-by-id', id],
    queryFn: () => fetchEngineeringCallById(id),
  })
}

async function fetchEngineeringCallsStats(input: TEngineeringCallsStatsInput) {
  const urlParams = new URLSearchParams()

  if (input.periodAfter) urlParams.set('periodAfter', input.periodAfter)
  if (input.periodBefore) urlParams.set('periodBefore', input.periodBefore)

  const url = `/api/chamados/projetos/stats?${urlParams.toString()}`

  const { data } = await axios.get<TEngineeringCallsStatsOutput>(url)

  return data.data
}

export function useEngineeringCallsStats() {
  const monthStart = dayjs().startOf('month').toISOString()
  const monthEnd = dayjs().endOf('month').toISOString()
  const [filters, setFilters] = useState<TEngineeringCallsStatsInput>({
    periodAfter: monthStart,
    periodBefore: monthEnd,
  })

  function updateFilters(changes: Partial<TEngineeringCallsStatsInput>) {
    setFilters((prev) => ({ ...prev, ...changes }))
  }

  const debouncedFilters = useDebounceMemo(filters, 500)
  return {
    ...useQuery({
      queryKey: ['engineering-calls-stats', debouncedFilters],
      queryFn: () => fetchEngineeringCallsStats(debouncedFilters),
    }),
    queryKey: ['engineering-calls-stats', debouncedFilters],
    filters,
    updateFilters,
  }
}
