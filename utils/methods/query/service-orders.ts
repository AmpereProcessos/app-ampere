import { TServiceOrdersByFiltersResult } from '@/pages/api/ordensDeServico/search'
import { TPersonalizedServiceOrderFilter, TServiceOrderDTO } from '@/utils/schemas/service-order'
import axios from 'axios'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

type FetchServiceOrdersParams = {
  after: string
  before: string
  status: string
  simplified: boolean
  responsibleName: string
}

async function fetchServiceOrders({ after, before, status, simplified, responsibleName }: FetchServiceOrdersParams) {
  try {
    const { data } = await axios.get(
      `/api/ordensDeServico?after=${after}&before=${before}&status=${status}&simplified=${simplified}&responsibleName=${responsibleName}`
    )
    return data as TServiceOrderDTO[]
  } catch (error) {
    throw error
  }
}

type UseServiceOrdersFilters = {
  city: string[]
  category: string[]
  search: string
  urgency: string | null
  unfinished: boolean
  inProgress: boolean
  inExecution: boolean
  unassigned: boolean
}
export function useServiceOrders({ after, before, status, simplified, responsibleName }: FetchServiceOrdersParams) {
  const [filters, setFilters] = useState<UseServiceOrdersFilters>({
    city: [],
    category: [],
    search: '',
    urgency: null,
    unfinished: false,
    inProgress: false,
    inExecution: false,
    unassigned: false,
  })
  function matchCity(order: TServiceOrderDTO) {
    if (filters.city.length == 0) return true
    return filters.city.includes(order.localizacao.cidade)
  }
  function matchCategory(order: TServiceOrderDTO) {
    if (filters.category.length == 0) return true
    return filters.category.includes(order.categoria)
  }
  function matchSearch(order: TServiceOrderDTO) {
    if (filters.search.trim().length == 0) return true
    return order.favorecido.nome.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchUrgency(order: TServiceOrderDTO) {
    if (!filters.urgency) return true
    return order.urgencia == filters.urgency
  }
  function matchUnfinished(order: TServiceOrderDTO) {
    if (!filters.unfinished) return true
    return !order.dataEfetivacao
  }
  function matchInProgress(order: TServiceOrderDTO) {
    if (!filters.inProgress) return true
    return !!order.periodo.inicio && !order.periodo.fim
  }
  function matchInExecution(order: TServiceOrderDTO) {
    if (!filters.inExecution) return true
    const currentDayStart = dayjs().set('hour', 0).toDate()
    const currentDayEnd = dayjs().set('hour', 23).toDate()
    const hasExecutionLogToday = order.periodo.historico?.some(
      (h) => h && new Date(h.entrada) >= currentDayStart && new Date(h.entrada) <= currentDayEnd && !h.saida
    )
    return hasExecutionLogToday
  }
  function matchUnassigned(order: TServiceOrderDTO) {
    if (!filters.unassigned) return true
    return !order.responsavel.nome
  }
  function handleModelData(data: TServiceOrderDTO[]) {
    var modeledData = data
    return modeledData.filter(
      (order) =>
        matchCity(order) &&
        matchCategory(order) &&
        matchSearch(order) &&
        matchUrgency(order) &&
        matchUnfinished(order) &&
        matchInProgress(order) &&
        matchInExecution(order) &&
        matchUnassigned(order)
    )
  }
  return {
    ...useQuery({
      queryKey: ['service-orders', after, before],
      queryFn: async () => await fetchServiceOrders({ after, before, status, simplified, responsibleName }),
      refetchOnWindowFocus: false,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
async function fetchServiceOrdersByProject({ projectId }: { projectId: string }) {
  try {
    const { data } = await axios.get(`/api/ordensDeServico?projectId=${projectId}`)
    return data
  } catch (error) {
    throw error
  }
}

export function useProjectServiceOrders({ projectId }: { projectId: string }) {
  return useQuery({
    queryKey: ['project-service-orders', projectId],
    queryFn: async () => await fetchServiceOrdersByProject({ projectId }),

    refetchOnWindowFocus: false,
  })
}

async function fetchServiceOrderById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/ordensDeServico?id=${id}`)
    return data
  } catch (error) {
    throw error
  }
}
export function useServiceOrderById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['service-order', id],
    queryFn: async () => fetchServiceOrderById({ id }),
    refetchOnWindowFocus: false,
  })
}

async function fetchServiceOrdersByPersonalizedFilters({ page, filters }: { page: number; filters: TPersonalizedServiceOrderFilter }) {
  try {
    const { data } = await axios.post(`/api/ordensDeServico/search?page=${page}`, filters)

    return data.data as TServiceOrdersByFiltersResult
  } catch (error) {
    throw error
  }
}

export function useServiceOrdersByPersonalizedFilters({ page }: { page: number }) {
  const [filters, setFilters] = useState<TPersonalizedServiceOrderFilter>({
    name: '',
    state: [],
    city: [],
    category: [],
    urgency: [],
    period: {
      after: null,
      before: null,
      field: null,
    },
    pending: true,
  })

  function updateFilters(filters: TPersonalizedServiceOrderFilter) {
    setFilters(filters)
  }

  return {
    ...useQuery({
      queryKey: ['service-orders-by-filters', page, filters],
      queryFn: async () => await fetchServiceOrdersByPersonalizedFilters({ page, filters }),
    }),
    updateFilters,
  }
}
