import axios from 'axios'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

export async function fetchOpenPPSCalls() {
  try {
    const { data } = await axios.get('/api/chamados/pps/mainData?status=ABERTOS')
    return data
  } catch (error) {
    throw error
  }
}

export function useOpenPPSCalls() {
  const [filters, setFilters] = useState({
    sellerName: '',
    status: [],
    responsible: [],
  })

  function matchSellerName(call) {
    if (filters.sellerName.trim().length == 0) return true
    return call.requerente.apelido.toUpperCase().includes(filters.sellerName.toUpperCase())
  }
  function matchStatus(call) {
    if (filters.status.length == 0) return true
    return filters.status.includes(call.status)
  }
  function matchResponsible(call) {
    if (filters.responsible.length == 0) return true
    return filters.responsible.includes(call.responsavel?.apelido)
  }

  function handleModelData(data) {
    var modeledData = data
    return modeledData.filter((call) => matchSellerName(call) && matchStatus(call) && matchResponsible(call))
  }
  return {
    ...useQuery({
      queryKey: ['open-pps-calls'],
      queryFn: fetchOpenPPSCalls,
      refetchOnWindowFocus: true,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
export async function fetchClosedPPSCalls({ after, before }) {
  try {
    const { data } = await axios.get(`/api/chamados/pps/mainData?status=REALIZADOS&after=${after}&before=${before}`)
    return data
  } catch (error) {
    throw error
  }
}

export function useClosedPPSCalls(after, before) {
  const [filters, setFilters] = useState({
    sellerName: '',
    responsible: [],
  })
  function matchSellerName(call) {
    if (filters.sellerName.trim().length == 0) return true
    return call.requerente.apelido.toUpperCase().includes(filters.sellerName.toUpperCase())
  }

  function matchResponsible(call) {
    if (filters.responsible.length == 0) return true
    return filters.responsible.includes(call.responsavel?.apelido)
  }
  function handleModelData(data) {
    var modeledData = data
    return modeledData.filter((call) => matchSellerName(call) && matchResponsible(call))
  }
  return {
    ...useQuery({
      queryKey: ['closed-pps-calls', after, before],
      queryFn: async () => await fetchClosedPPSCalls({ after, before }),
      select: (data) => handleModelData(data),
      refetchOnWindowFocus: true,
    }),
    filters,
    setFilters,
  }
}

export async function fetchPPSCall(id) {
  try {
    const { data } = await axios.get(`/api/chamados/getPPS/${id}`)
    return data
  } catch (error) {
    throw error
  }
}
export function usePPSCall(id, enabled) {
  return useQuery({
    queryKey: ['pps-calls', id],
    queryFn: async () => await fetchPPSCall(id),
    enabled: !!enabled,
    refetchOnWindowFocus: false,
  })
}
