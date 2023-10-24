import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

async function fetchAnalysisById({ id }) {
  try {
    const { data } = await axios.get(`/api/solicitacoes/analisesTecnicas?id=${id}`)
    return data
  } catch (error) {
    throw error
  }
}

export function useTechnicalAnalysisById({ enabled, id }) {
  return useQuery({
    queryKey: ['technical-analysis-by-id', id],
    queryFn: async () => await fetchAnalysisById({ id }),
    enabled: !!enabled,
    refetchOnWindowFocus: false,
  })
}

async function fetchAnalysis() {
  try {
    const { data } = await axios.get(`/api/solicitacoes/analisesTecnicas`)
    return data
  } catch (error) {
    throw error
  }
}
export function useTechnicalAnalysis({ enabled }) {
  const [filters, setFilters] = useState({
    search: '',
    status: [],
    analyst: null,
    date: {
      after: null,
      before: null,
      field: null,
    },
  })

  function matchSearch(analysis) {
    if (filters.search.trim().length == 0) return true
    else return analysis.nome.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchStatus(analysis) {
    if (filters.status.length == 0) return true
    else return filters.status.includes(analysis.status)
  }
  function matchAnalyst(analysis) {
    if (!filters.analyst) return true
    else return filters.analyst == analysis.analista?.nome
  }
  function matchDate(analysis) {
    if (!filters.date.after || !filters.date.before || !filters.date.field) return true
    return analysis[filters.date.field] >= filters.date.after && analysis[filters.date.field] <= filters.date.before
  }
  function handleModelData(data) {
    var modeledData = data
    return modeledData.filter((analysis) => matchSearch(analysis) && matchStatus(analysis) && matchAnalyst(analysis) && matchDate(analysis))
  }

  return {
    ...useQuery({
      queryKey: ['technical-analysis'],
      queryFn: fetchAnalysis,
      select: (data) => handleModelData(data),
      enabled: !!enabled,
      refetchOnWindowFocus: false,
    }),
    filters,
    setFilters,
  }
}
