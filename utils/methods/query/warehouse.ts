import { TProjectDTO } from '@/utils/schemas/projects'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { formatWithoutDiacritics } from '../formatting'

async function fetchWarehouseProjects() {
  try {
    const { data } = await axios.get('/api/almoxarifado/projetos')
    return data.data as TProjectDTO[]
  } catch (error) {
    throw error
  }
}

export type UseWarehouseProjectsParams = {
  search: string
  deliveryStatus: string[]
  executionStatus: string[]
  topology: string[]
  modulesQtyGte: number | null
  modulesQtyLte: number | null
}
export function useWarehouseProjects() {
  const [filters, setFilters] = useState<UseWarehouseProjectsParams>({
    search: '',
    deliveryStatus: [],
    executionStatus: [],
    topology: [],
    modulesQtyGte: null,
    modulesQtyLte: null,
  })
  function matchSearch(project: TProjectDTO) {
    if (filters.search.trim().length == 0) return true
    return formatWithoutDiacritics(project.nomeDoContrato, true).includes(formatWithoutDiacritics(filters.search, true))
  }
  function matchDeliveryStatus(project: TProjectDTO) {
    if (filters.deliveryStatus.length == 0) return true
    return filters.deliveryStatus.includes(project.compra.statusEntrega || '')
  }
  function matchExecutionStatus(project: TProjectDTO) {
    if (filters.executionStatus.length == 0) return true
    return filters.executionStatus.includes(project.obra.statusDaObra || '')
  }
  function matchTopology(project: TProjectDTO) {
    if (filters.topology.length == 0) return true
    return filters.topology.includes(project.sistema.topologia || '')
  }
  function matchModulesQtyGte(project: TProjectDTO) {
    if (!filters.modulesQtyGte) return true
    return (project.sistema.qtdeModulos || 0) > filters.modulesQtyGte
  }
  function matchModulesQtyLte(project: TProjectDTO) {
    if (!filters.modulesQtyLte) return true
    return (project.sistema.qtdeModulos || 0) < filters.modulesQtyLte
  }
  function handleModelData(data: TProjectDTO[]) {
    var modeledData = data
    return modeledData.filter(
      (project) =>
        matchSearch(project) &&
        matchDeliveryStatus(project) &&
        matchExecutionStatus(project) &&
        matchTopology(project) &&
        matchModulesQtyGte(project) &&
        matchModulesQtyLte(project)
    )
  }
  return {
    ...useQuery({
      queryKey: ['warehouse-projects'],
      queryFn: fetchWarehouseProjects,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
