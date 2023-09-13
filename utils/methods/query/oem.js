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

export function useOeMReportData(enabled) {
  const [filters, setFilters] = useState({
    cityArr: null,
  })

  function filterData(data) {
    const isSameCity = (d) => {
      if (!filters.cityArr || filters.cityArr?.length == 0) return true
      else return filters.cityArr.includes(d.cidade)
    }
    return data.filter((d) => isSameCity(d))
  }
  const query = useQuery({
    queryKey: ['oem-report'],
    queryFn: getSectorStats,
    enabled: !!enabled,
    refetchOnWindowFocus: false,
    select: (data) => filterData(data),
  })
  return {
    ...query,
    filters,
    setFilters,
  }
}
