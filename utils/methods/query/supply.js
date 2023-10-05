import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

async function fetchProjects() {
  try {
    const { data } = await axios.get('/api/projects/suprimentos')
    return data
  } catch (error) {
    throw error
  }
}
export function useSupplyProjects({ enabled }) {
  const [filters, setFilters] = useState({
    supplyStatus: [],
    deliveryStatus: [],
    search: '',
    date: {
      after: null,
      before: null,
      field1: null,
      field2: null,
    },
  })
  function matchSupplyStatus(project) {
    if (filters.supplyStatus.length == 0) return true
    return filters.supplyStatus.includes(project.compra.status)
  }
  function matchDeliveryStatus(project) {
    if (filters.deliveryStatus.length == 0) return true
    return filters.deliveryStatus.includes(project.compra.statusEntrega)
  }
  function matchDate(project) {
    if (!filters.date.after || !filters.date.before || !filters.date.field1 || !filters.date.field2) return true
    return (
      project[filters.date.field1][filters.date.field2] >= filters.date.after &&
      project[filters.date.field1][filters.date.field2] <= filters.date.before
    )
  }
  function matchSearch(project) {
    if (filters.search.trim().length == 0) return true
    else return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase())
  }
  function handleModelData(data) {
    var modeledData = data
    return modeledData.filter((project) => matchSupplyStatus(project) && matchDeliveryStatus(project) && matchDate(project) && matchSearch(project))
  }
  return {
    ...useQuery({
      queryKey: ['supply-projects'],
      queryFn: fetchProjects,
      select: (data) => handleModelData(data),
      enabled: !!enabled,
    }),
    filters,
    setFilters,
  }
}
