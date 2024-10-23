import { TMonitoringProjectDTOSimplified, TProjectDTO } from '@/utils/schemas/projects'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatWithoutDiacritics, getProjectNestedFieldValue } from '../formatting'
import dayjs from 'dayjs'

export async function getSectorStats() {
  try {
    const { data } = await axios.get('/api/stats/sector-reports/oem')
    return data as TProjectDTO[]
  } catch (error) {
    throw error
  }
}

type UseOeMReportDataFilters = {
  city: string[]
}
export function useOeMReportData() {
  const [filters, setFilters] = useState<UseOeMReportDataFilters>({
    city: [],
  })

  function matchCity(project: TProjectDTO) {
    if (filters.city.length == 0) return true
    return filters.city.includes(project.cidade)
  }
  function handleModelData(data: TProjectDTO[]) {
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

async function fetchProjects() {
  try {
    const { data } = await axios.get('/api/projects/oem')
    return data as TProjectDTO[]
  } catch (error) {
    throw error
  }
}

type UseOeMProjectsFilters = {
  search: string
  neighborhoodSearch: string
  city: string[]
  technicalTeam: string[]
  executionStatus: string[]
  oemPlan: string[]
  serviceType: string[]
  pendingMaintenance: boolean
  overdueMaintenance: boolean
  systemOffline: boolean
  modulesQtyGte: number | null
  modulesQtyLte: number | null
  date: {
    after: string | null
    before: string | null
    field: string | null
  }
}
export function useOeMProjects() {
  const [filters, setFilters] = useState<UseOeMProjectsFilters>({
    search: '',
    neighborhoodSearch: '',
    city: [],
    technicalTeam: [],
    executionStatus: [],
    oemPlan: [],
    serviceType: [],
    pendingMaintenance: false,
    overdueMaintenance: false,
    systemOffline: false,
    modulesQtyGte: null,
    modulesQtyLte: null,
    date: {
      after: null,
      before: null,
      field: null,
    },
  })
  function matchSearch(project: TProjectDTO) {
    if (filters.search.trim().length == 0) return true
    return formatWithoutDiacritics(project.nomeDoContrato, true).includes(filters.search.toUpperCase())
  }
  function matchNeighborhoodSearchSearch(project: TProjectDTO) {
    if (filters.neighborhoodSearch.trim().length == 0) return true
    return formatWithoutDiacritics(project.bairro, true).includes(filters.neighborhoodSearch.toUpperCase())
  }
  function matchCity(project: TProjectDTO) {
    if (filters.city.length == 0) return true
    return filters.city.includes(project.cidade)
  }
  function matchTechnicalTeam(project: TProjectDTO) {
    if (filters.technicalTeam.length == 0) return true
    return filters.technicalTeam.includes(project.obra.equipeResp || '')
  }
  function matchExecutionStatus(project: TProjectDTO) {
    if (filters.executionStatus.length == 0) return true
    return filters.executionStatus.includes(project.obra.statusDaObra || '')
  }
  function matchOeMPlan(project: TProjectDTO) {
    if (filters.oemPlan.length == 0) return true
    return filters.oemPlan.includes(project.oem.plano || '')
  }
  function matchServiceType(project: TProjectDTO) {
    if (filters.serviceType.length == 0) return true
    return filters.serviceType.includes(project.tipoDeServico)
  }
  function matchPendingMaintenance(project: TProjectDTO) {
    if (!filters.pendingMaintenance) return true
    return project.manutencaoPreventiva.status == 'NÃO REALIZADO'
  }
  function matchOverdueMaintenance(project: TProjectDTO) {
    if (!filters.overdueMaintenance) return true
    const maintenanceQty = project.oem.qtdeManutencoes || 0
    const isOverDue = project.manutencaoPreventiva.data
      ? maintenanceQty > 2
        ? dayjs(new Date()).diff(project.manutencaoPreventiva.data, 'day') > 730
        : false
      : dayjs(new Date()).diff(project.medidor.data, 'day') > 365
    return isOverDue
  }
  function matchSystemOffline(project: TProjectDTO) {
    if (!filters.systemOffline) return true
    return project.conferencias.usinaLigada.status != 'REALIZADO'
  }
  function matchModulesQtyGte(project: TProjectDTO) {
    if (!filters.modulesQtyGte) return true
    return (project.sistema.qtdeModulos || 0) > filters.modulesQtyGte
  }
  function matchModulesQtyLte(project: TProjectDTO) {
    if (!filters.modulesQtyLte) return true
    return (project.sistema.qtdeModulos || 0) < filters.modulesQtyLte
  }
  function matchDate(project: TProjectDTO) {
    if (!filters.date.after || !filters.date.before || !filters.date.field) return true
    const fieldValue = getProjectNestedFieldValue(project, filters.date.field)
    return (
      // @ts-ignore
      fieldValue >= filters.date.after &&
      // @ts-ignore
      fieldValue <= filters.date.before
    )
  }
  function handleModelData(data: TProjectDTO[]) {
    var modeledData = data
    return modeledData.filter(
      (project) =>
        matchSearch(project) &&
        matchNeighborhoodSearchSearch(project) &&
        matchCity(project) &&
        matchTechnicalTeam(project) &&
        matchExecutionStatus(project) &&
        matchOeMPlan(project) &&
        matchServiceType(project) &&
        matchPendingMaintenance(project) &&
        matchOverdueMaintenance(project) &&
        matchSystemOffline(project) &&
        matchModulesQtyGte(project) &&
        matchModulesQtyLte(project) &&
        matchDate(project)
    )
  }
  return {
    ...useQuery({
      queryKey: ['oem-projects'],
      queryFn: fetchProjects,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}

async function fetchMonitoringProjects() {
  try {
    const { data } = await axios.get('/api/projects/monitoramento')
    return data.data as TMonitoringProjectDTOSimplified[]
  } catch (error) {
    throw error
  }
}

export function useMonitoringProjects() {
  return useQuery({
    queryKey: ['monitoring-projects'],
    queryFn: fetchMonitoringProjects,
  })
}

async function getExecutionCommissioningProjects() {
  try {
    const { data } = await axios.get('/api/projects/comissionamentoPosObra')
    return data as TProjectDTO[]
  } catch (error) {
    throw error
  }
}

type UseExecutionCommissioningProjectsFilters = {
  search: string
  city: string[]
  responsibleTeam: string[]
  seller: string[]
  appPending: boolean
  injectedEnergyPending: boolean
  plantPowerCheckPending: boolean
  monitoringPending: boolean
  date: {
    after: string | null
    before: string | null
    field: string | null
  }
}
export function useExecutionCommissioningProjects() {
  const [filters, setFilters] = useState<UseExecutionCommissioningProjectsFilters>({
    search: '',
    city: [],
    responsibleTeam: [],
    seller: [],
    appPending: false,
    injectedEnergyPending: false,
    plantPowerCheckPending: false,
    monitoringPending: false,
    date: {
      after: null,
      before: null,
      field: null,
    },
  })
  function matchSearch(project: TProjectDTO) {
    if (filters.search.trim().length == 0) return true
    return formatWithoutDiacritics(project.nomeDoContrato, true).includes(filters.search.toUpperCase())
  }
  function matchCity(project: TProjectDTO) {
    if (filters.city.length == 0) return true
    return filters.city.includes(project.cidade)
  }
  function matchResponsibleTeam(project: TProjectDTO) {
    if (filters.responsibleTeam.length == 0) return true
    return filters.responsibleTeam.includes(project.obra.equipeResp || '')
  }
  function matchSeller(project: TProjectDTO) {
    if (filters.seller.length == 0) return true
    return filters.seller.includes(project.vendedor.nome || '')
  }
  function matchAppPending(project: TProjectDTO) {
    if (!filters.appPending) return true
    return !project.app.data
  }
  function matchInjectedEnergyPending(project: TProjectDTO) {
    if (!filters.injectedEnergyPending) return true
    return !project.conferencias.energiaInjetada.data
  }
  function matchPlantPowerCheckPending(project: TProjectDTO) {
    if (!filters.plantPowerCheckPending) return true
    return !project.conferencias.usinaLigada.data
  }
  function matchMonitoringPending(project: TProjectDTO) {
    if (!filters.monitoringPending) return true
    return !project.conferencias.monitoramentoFeito.data
  }
  function matchDate(project: TProjectDTO) {
    if (!filters.date.after || !filters.date.before || !filters.date.field) return true
    const fieldValue = getProjectNestedFieldValue(project, filters.date.field)
    return (
      // @ts-ignore
      fieldValue >= filters.date.after &&
      // @ts-ignore
      fieldValue <= filters.date.before
    )
  }
  function handleModelData(data: TProjectDTO[]) {
    var modeledData = data
    return modeledData.filter(
      (project) =>
        matchSearch(project) &&
        matchCity(project) &&
        matchResponsibleTeam(project) &&
        matchSeller(project) &&
        matchAppPending(project) &&
        matchInjectedEnergyPending(project) &&
        matchPlantPowerCheckPending(project) &&
        matchMonitoringPending(project) &&
        matchDate(project)
    )
  }
  return {
    ...useQuery({
      queryKey: ['execution-commissioning-projects'],
      queryFn: getExecutionCommissioningProjects,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
