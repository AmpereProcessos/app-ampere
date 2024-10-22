import { TRevenuesByFiltersResult } from '@/pages/api/receitas/search'
import { TReceiptUnwindSimplifiedDTO, TRevenueDTO, TRevenueQueryFilters } from '@/utils/schemas/revenues'
import axios from 'axios'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { formatWithoutDiacritics } from '../formatting'
import { TRevenueStatsResult } from '@/pages/api/receitas/estatisticas'

// Expenses by Project
async function fetchProjectRevenues({ projectId }: { projectId: string }) {
  try {
    const { data } = await axios.get(`/api/receitas?projectId=${projectId}`)
    return data.data as TRevenueDTO[]
  } catch (error) {
    throw error
  }
}
export function useProjectRevenues({ projectId }: { projectId: string }) {
  return useQuery({
    queryKey: ['project-revenues', projectId],
    queryFn: async () => await fetchProjectRevenues({ projectId }),
  })
}

// General Revenues
async function fetchRevenues() {
  try {
    const { data } = await axios.get('/api/receitas')
    return data.data as TRevenueDTO[]
  } catch (error) {
    throw error
  }
}
export function useRevenues() {
  const [filters, setFilters] = useState({
    search: '',
    types: [] as string[],
    received: false,
    notReceived: false,
    dueToday: false,
    dueThisWeek: false,
    dueThisMonth: false,
    dueOverall: false,
    overDue: false,
  })

  function matchSearch(revenue: TRevenueDTO) {
    if (filters.search.trim().length == 0) return true
    return revenue.nome.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchReceived(revenue: TRevenueDTO) {
    if (!filters.received) return true
    const hasPendencies = revenue.fracionamento.some((fraction) => !fraction.dataRecebimento)
    return !hasPendencies
  }
  function matchNotReceived(revenue: TRevenueDTO) {
    if (!filters.notReceived) return true
    const hasPendencies = revenue.fracionamento.some((fraction) => !fraction.dataRecebimento)
    return hasPendencies
  }
  function matchDueToday(revenue: TRevenueDTO) {
    if (!filters.dueToday) return true
    const isSame = (date: string) => dayjs(date).add(3, 'hour').isSame(dayjs(), 'day')
    const hasPendenciesToday = revenue.fracionamento.some((fraction) => !fraction.dataRecebimento && isSame(fraction.dataPrevisaoRecebimento))
    return hasPendenciesToday
  }
  function matchOverDue(revenue: TRevenueDTO) {
    if (!filters.overDue) return true
    const isAfter = (date: string) => dayjs().isAfter(dayjs(date).add(3, 'hour'), 'day')
    const hasPendenciesOverdue = revenue.fracionamento.some((fraction) => !fraction.dataRecebimento && isAfter(fraction.dataPrevisaoRecebimento))
    return hasPendenciesOverdue
  }
  function matchTypes(revenue: TRevenueDTO) {
    if (filters.types.length == 0) return true
    return filters.types.includes(revenue.tipo)
  }
  function handleModelData(data: TRevenueDTO[]) {
    var modeledData = data
    return modeledData.filter(
      (revenue) =>
        matchSearch(revenue) &&
        matchReceived(revenue) &&
        matchNotReceived(revenue) &&
        matchDueToday(revenue) &&
        matchOverDue(revenue) &&
        matchTypes(revenue)
    )
  }
  return {
    ...useQuery({
      queryKey: ['revenues'],
      queryFn: async () => await fetchRevenues(),
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}

async function fetchRevenueById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/receitas?id=${id}`)
    return data.data as TRevenueDTO
  } catch (error) {
    throw error
  }
}
export function useRevenueById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['revenue-by-id', id],
    queryFn: () => fetchRevenueById({ id }),
  })
}

async function fetchRevenueByFilters({ page, ...filters }: TRevenueQueryFilters & { page: number }) {
  try {
    const { data } = await axios.post(`/api/receitas/search?page=${page}`, filters)
    return data.data as TRevenuesByFiltersResult
  } catch (error) {
    throw error
  }
}

type UseRevenueByFiltersParams = {
  initialQueryParams: TRevenueQueryFilters & { page: number }
}
export function useRevenueByFilters({ initialQueryParams }: UseRevenueByFiltersParams) {
  const [queryParams, setQueryParams] = useState<TRevenueQueryFilters & { page: number }>(initialQueryParams)

  function updateQueryParams(params: Partial<TRevenueQueryFilters & { page: number }>) {
    setQueryParams((prev) => ({ ...prev, ...params }))
  }

  const query = useQuery({
    queryKey: ['revenues-by-filters', queryParams],
    queryFn: async () => await fetchRevenueByFilters(queryParams),
  })

  return { ...query, queryParams, updateQueryParams }
}

async function fetchPendingReceipts() {
  try {
    const { data } = await axios.get('/api/receitas/recebimentos')
    return data.data as TReceiptUnwindSimplifiedDTO[]
  } catch (error) {
    throw error
  }
}

type UsePendingReceiptsParams = {
  initialFilters: { search: string; types: string[] }
}
export function usePendingReceipts({ initialFilters }: UsePendingReceiptsParams) {
  const [filters, setFilters] = useState(initialFilters)

  function matchSearch(receipt: TReceiptUnwindSimplifiedDTO) {
    if (filters.search.trim.length == 0) return true
    return formatWithoutDiacritics(receipt.nome, true).includes(formatWithoutDiacritics(filters.search, true))
  }
  function matchTypes(receipt: TReceiptUnwindSimplifiedDTO) {
    if (filters.types.length == 0) return true
    return filters.types.includes(receipt.tipo)
  }
  function handleModelData(data: TReceiptUnwindSimplifiedDTO[]) {
    return data.filter((receipt) => matchSearch(receipt) && matchTypes(receipt))
  }

  return {
    ...useQuery({
      queryKey: ['receipts'],
      queryFn: fetchPendingReceipts,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}

async function fetchRevenueStats() {
  try {
    const { data } = await axios.get('/api/receitas/estatisticas')
    return data.data as TRevenueStatsResult
  } catch (error) {
    throw error
  }
}

export function useRevenueStats() {
  return useQuery({
    queryKey: ['revenue-stats'],
    queryFn: fetchRevenueStats,
  })
}
