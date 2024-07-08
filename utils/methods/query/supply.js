import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { getProjectNestedFieldValue } from '../formatting'

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
    accessGrantingStatus: [],
    yetToBuy: false,
    search: '',
    date: {
      after: null,
      before: null,
      field: null,
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
  function matchAccessGrantingStatus(project) {
    if (filters.accessGrantingStatus.length == 0) return true
    return filters.accessGrantingStatus.includes(project.homologacao.status)
  }
  function matchDate(project) {
    if (!filters.date.after || !filters.date.before || !filters.date.field) return true
    const fieldValue = getProjectNestedFieldValue(project, filters.date.field)
    return fieldValue >= filters.date.after && fieldValue <= filters.date.before
  }
  function matchYetToBuy(project) {
    if (!filters.yetToBuy) return true
    return project.homologacao.status == 'APROVADO' && !project.compra.dataPedido
  }
  function matchSearch(project) {
    if (filters.search.trim().length == 0) return true
    else return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase())
  }
  function handleModelData(data) {
    var modeledData = data
    return modeledData.filter(
      (project) =>
        matchSupplyStatus(project) &&
        matchDeliveryStatus(project) &&
        matchYetToBuy(project) &&
        matchAccessGrantingStatus(project) &&
        matchDate(project) &&
        matchSearch(project)
    )
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
