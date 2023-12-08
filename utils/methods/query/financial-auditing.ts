import { TProjectFinances } from '@/pages/api/stats/financial-auditing'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

async function fetchFinancialAuditingData({ after, before, field }: { after: string; before: string; field: string }) {
  try {
    const { data } = await axios.get(`/api/stats/financial-auditing?after=${after}&before=${before}&field=${field}`)
    return data as TProjectFinances[]
  } catch (error) {
    throw error
  }
}

type TFilters = {
  search: string
  sellerName: string[]
  city: string[]
}
export function useFinancialAuditing({ after, before, field }: { after: string; before: string; field: string }) {
  const [filters, setFilters] = useState<TFilters>({
    search: '',
    sellerName: [],
    city: [],
  })

  function matchSearch(project: TProjectFinances) {
    if (filters.search.trim().length == 0) return true
    return project.nome.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchCity(project: TProjectFinances) {
    if (filters.city.length == 0) return true
    return filters.city.includes(project.cidade)
  }
  function matchSeller(project: TProjectFinances) {
    if (filters.sellerName.length == 0) return true
    return filters.sellerName.includes(project.vendedor)
  }

  function handleModelData(data: TProjectFinances[]) {
    var modeledData = data
    return modeledData.filter((project) => matchSearch(project) && matchCity(project) && matchSeller(project))
  }
  return {
    ...useQuery({
      queryKey: ['financial-auditing', after, before, field],
      queryFn: async () => await fetchFinancialAuditingData({ after, before, field }),
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}

async function fetchFinancesByProjectId({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/stats/financial-auditing?id=${id}`)
    return data as TProjectFinances
  } catch (error) {
    throw error
  }
}

export function useProjectFinances({ id }: { id: string }) {
  return useQuery({
    queryKey: ['project-finances', id],
    queryFn: async () => await fetchFinancesByProjectId({ id }),
  })
}
