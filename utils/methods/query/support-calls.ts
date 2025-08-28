import { useDebounceMemo } from '@/lib/hooks/debounce'
import { TGetManySupportCallsInput, TGetSupportCallsInput, TGetSupportCallsOutput } from '@/pages/api/chamados/suporte'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'

async function fetchSupportCalls(input: TGetManySupportCallsInput) {
  const urlParams = new URLSearchParams()

  if (input.periodField) urlParams.set('periodField', input.periodField)
  if (input.periodAfter) urlParams.set('periodAfter', input.periodAfter)
  if (input.periodBefore) urlParams.set('periodBefore', input.periodBefore)
  if (input.status) urlParams.set('status', input.status.join(','))
  if (input.search) urlParams.set('search', input.search)

  const url = `/api/chamados/suporte?${urlParams.toString()}`

  const { data } = await axios.get<TGetSupportCallsOutput>(url)

  if (!data.data.default) throw new Error('Erro ao buscar chamados')

  return data.data.default
}

export function useSupportCalls() {
  const [filters, setFilters] = useState<TGetManySupportCallsInput>({
    status: ['EM ANDAMENTO', 'ABERTO'],
    search: '',
    periodField: null,
    periodAfter: null,
    periodBefore: null,
  })

  function updateFilters(changes: Partial<TGetManySupportCallsInput>) {
    setFilters((prev) => ({ ...prev, ...changes }))
  }

  const debouncedFilters = useDebounceMemo(filters, 500)
  return {
    ...useQuery({
      queryKey: ['support-calls', debouncedFilters],
      queryFn: () => fetchSupportCalls(debouncedFilters),
    }),
    queryKey: ['support-calls', debouncedFilters],
    filters,
    updateFilters,
  }
}

async function fetchSupportCallById(id: string) {
  const { data } = await axios.get<TGetSupportCallsOutput>(`/api/chamados/suporte?id=${id}`)

  if (!data.data.byId) throw new Error('Erro ao buscar chamado')

  return data.data.byId
}

export function useSupportCallById(id: string) {
  return useQuery({
    queryKey: ['support-call-by-id', id],
    queryFn: () => fetchSupportCallById(id),
  })
}
