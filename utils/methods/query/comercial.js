import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

async function fetchProjects() {
  try {
    const { data } = await axios.get('/api/projects/comercial')
    return data
  } catch (error) {
    throw error
  }
}
export function useComercialProjects({ enabled }) {
  const [filters, setFilters] = useState({
    identifier: null,
    search: '',
    contractStatus: [],
    serviceType: [],
    sellerName: [],
    insiderName: [],
    supplyStatus: [],
    date: {
      after: null,
      before: null,
      field1: null,
      field2: null,
    },
  })
  console.log(filters)
  function matchSearch(project) {
    if (filters.search.trim().length == 0) return true
    else return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchIdentifier(project) {
    if (!filters.identifier) return true
    if (typeof project.codigoSVB == 'string') return project.codigoSVB.includes(filters.identifier.toUpperCase())
    if (typeof project.codigoSVB == 'number') return project.codigoSVB.toString().includes(filters.identifier)
  }
  function matchContractStatus(project) {
    if (filters.contractStatus.length == 0) return true
    else return filters.contractStatus.includes(project.contrato?.status)
  }
  function matchServiceType(project) {
    if (filters.serviceType.length == 0) return true
    else return filters.serviceType.includes(project.tipoDeServico)
  }
  function matchSellerName(project) {
    if (filters.sellerName == 0) return true
    else return filters.sellerName.includes(project.vendedor?.nome)
  }
  function matchInsiderName(project) {
    if (filters.insiderName == 0) return true
    else return filters.insiderName.includes(project.insider)
  }
  function matchSupplyStatus(project) {
    if (filters.supplyStatus.length == 0) return true
    return filters.supplyStatus.includes(project.compra.status)
  }
  function matchDate(project) {
    if (!filters.date.after || !filters.date.before || !filters.date.field1 || !filters.date.field2) return true
    return (
      project[filters.date.field1][filters.date.field2] >= filters.date.after &&
      project[filters.date.field1][filters.date.field2] <= filters.date.before
    )
  }
  function handleModelData(data) {
    var modeledData = data
    return modeledData.filter(
      (project) =>
        matchSearch(project) &&
        matchIdentifier(project) &&
        matchContractStatus(project) &&
        matchServiceType(project) &&
        matchSellerName(project) &&
        matchInsiderName(project) &&
        matchSupplyStatus(project) &&
        matchDate(project)
    )
  }
  return {
    ...useQuery({
      queryKey: ['comercial-projects'],
      queryFn: fetchProjects,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
