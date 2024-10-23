import axios from 'axios'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

async function fetchComissionData({ after, before }) {
  try {
    const { data } = await axios.get(`/api/gestao/comissoes?after=${after}&before=${before}`)
    return data
  } catch (error) {
    throw error
  }
}

export function useComissionData({ after, before }) {
  const [filters, setFilters] = useState({
    search: '',
    sellerName: [],
    insiderName: [],
    serviceType: [],
  })
  function matchSearch(project) {
    if (filters.search.trim() == 0) return true
    return project.nome.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchSellerName(project) {
    if (filters.sellerName.length == 0) return true
    return filters.sellerName.includes(project.vendedor)
  }
  function matchInsiderName(project) {
    if (filters.sellerName.length == 0) return true
    return filters.sellerName.includes(project.vendedor)
  }
  function matchServiceType(project) {
    if (filters.serviceType.length == 0) return true
    return filters.serviceType.includes(project.tipoServico)
  }
  function handleModelData(data) {
    var modeledData = data
    return modeledData.filter((project) => matchSearch(project) && matchSellerName(project) && matchInsiderName(project) && matchServiceType(project))
  }
  return {
    ...useQuery({
      queryKey: ['comissions', after, before],
      queryFn: async () => await fetchComissionData({ after, before }),
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
