import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

async function fetchServiceOrders({ after, before, status, simplified, responsibleName }) {
  try {
    const { data } = await axios.get(
      `/api/ordensDeServico?after=${after}&before=${before}&status=${status}&simplified=${simplified}&responsibleName=${responsibleName}`
    )
    return data
  } catch (error) {
    throw error
  }
}

export function useServiceOrders({ after, before, status, simplified, responsibleName, enabled }) {
  const [filters, setFilters] = useState({
    city: [],
    category: [],
    search: '',
    unfinished: false,
  })
  function matchCity(order) {
    if (filters.city.length == 0) return true
    return filters.city.includes(order.localizacao.cidade)
  }
  function matchCategory(order) {
    if (filters.category.length == 0) return true
    return filters.category.includes(order.categoria)
  }
  function matchSearch(order) {
    if (filters.search.trim().length == 0) return true
    return order.favorecido.nome.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchUnfinished(order) {
    if (!filters.unfinished) return true
    return !!order.dataEfetivacao
  }
  function handleModelData(data) {
    var modeledData = data
    return modeledData.filter((order) => matchCity(order) && matchCategory(order) && matchSearch(order) && matchUnfinished(order))
  }
  return {
    ...useQuery({
      queryKey: ['service-orders', after, before],
      queryFn: async () => await fetchServiceOrders({ after, before, status, simplified, responsibleName }),
      enabled: !!enabled,
      refetchOnWindowFocus: false,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
async function fetchServiceOrdersByProject({ projectId }) {
  try {
    const { data } = await axios.get(`/api/ordensDeServico?projectId=${projectId}`)
    return data
  } catch (error) {
    throw error
  }
}

export function useProjectServiceOrders({ projectId, enabled }) {
  return useQuery({
    queryKey: ['project-service-orders', projectId],
    queryFn: async () => await fetchServiceOrdersByProject({ projectId }),
    enabled: !!enabled,
    refetchOnWindowFocus: false,
  })
}

async function fetchServiceOrderById({ id }) {
  try {
    const { data } = await axios.get(`/api/ordensDeServico?id=${id}`)
    return data
  } catch (error) {
    throw error
  }
}
export function useServiceOrderById({ id, enabled }) {
  return useQuery({
    queryKey: ['service-order', id],
    queryFn: async () => fetchServiceOrderById({ id }),
    refetchOnWindowFocus: false,
    enabled: !!enabled && !!id,
  })
}
