import { TRevenueDTO } from '@/utils/schemas/revenues'
import axios from 'axios'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useQuery } from 'react-query'

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

  function handleModelData(data: TRevenueDTO[]) {
    var modeledData = data
    return modeledData.filter(
      (revenue) => matchSearch(revenue) && matchReceived(revenue) && matchNotReceived(revenue) && matchDueToday(revenue) && matchOverDue(revenue)
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
