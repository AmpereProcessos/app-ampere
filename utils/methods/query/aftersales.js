import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

async function fetchNPSData() {
  const { data } = await axios.get('/api/projects/nps')
  if (!data) return []
  if (!Array.isArray(data)) return []
  return data
}

export function useNPS(enabled) {
  const [filters, setFilters] = useState({
    city: [],
    sellerName: [],
    search: '',
    unCollected: false,
    withObs: false,
    withoutObs: false,
    npsRange: {
      min: null,
      max: null,
    },
    date: {
      after: null,
      before: null,
      field1: null,
      field2: null,
    },
    npsValue: null,
  })
  function matchCity(project) {
    if (filters.city.length == 0) return true
    return filters.city.includes(project.cidade)
  }
  function matchSeller(project) {
    if (filters.sellerName.length == 0) return true
    return filters.sellerName.includes(project.vendedor.nome)
  }
  function matchUnCollected(project) {
    if (!filters.unCollected) return true
    return !project.nps
  }
  function matchWithObs(project) {
    if (!filters.withObs) return true
    return project.jornada.obsNps != undefined && project.jornada.obsNps != null && project.jornada.obsNps?.trim().length > 2
  }
  function matchWithoutObs(project) {
    if (!filters.withoutObs) return true
    return project.jornada.obsNps == undefined || project.jornada.obsNps == null || project.jornada.obsNps?.trim().length < 2
  }
  function matchNpsRange(project) {
    if (filters.npsRange.min == null || !filters.npsRange.max) return true
    return !!project.nps && project.nps >= filters.npsRange.min && project.nps <= filters.npsRange.max
  }
  function matchNpsValue(project) {
    if (filters.npsValue == null) return true
    return project.nps == filters.npsValue
  }
  function matchSearch(project) {
    if (filters.search.trim().length == 0) return true
    else return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchDate(project) {
    if (!filters.date.after || !filters.date.before || !filters.date.field1 || !filters.date.field2) return true
    return (
      project[filters.date.field1][filters.date.field2] >= filters.date.after &&
      project[filters.date.field1][filters.date.field2] <= filters.date.before
    )
  }

  function handelModelData(data) {
    var modeledData = data
    return modeledData.filter(
      (project) =>
        matchCity(project) &&
        matchSeller(project) &&
        matchUnCollected(project) &&
        matchWithObs(project) &&
        matchWithoutObs(project) &&
        matchNpsRange(project) &&
        matchNpsValue(project) &&
        matchSearch(project) &&
        matchDate(project)
    )
  }
  return {
    ...useQuery({
      queryKey: ['nps'],
      queryFn: fetchNPSData,
      refetchOnWindowFocus: false,
      select: (data) => handelModelData(data),
      enabled: !!enabled,
    }),
    filters,
    setFilters,
  }
}
