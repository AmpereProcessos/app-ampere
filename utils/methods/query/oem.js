import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

export async function getSectorStats() {
  try {
    const { data } = await axios.get('/api/stats/sector-reports/oem')
    return data
  } catch (error) {
    throw error
  }
}

export function useOeMReportData() {
  const [filters, setFilters] = useState({
    city: [],
  })

  function matchCity(project) {
    if (filters.city.length == 0) return true
    return filters.city.includes(project.cidade)
  }
  function handleModelData(data) {
    var modeledData = data
    return modeledData.filter((project) => matchCity(project))
  }

  return {
    ...useQuery({
      queryKey: ['oem-report'],
      queryFn: getSectorStats,
      refetchOnWindowFocus: false,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
