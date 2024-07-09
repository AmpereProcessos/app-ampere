import { TEnergyPAExecution } from '@/pages/api/gestao-obras/padroes'
import { TProjectDTO } from '@/utils/schemas/projects'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { formatWithoutDiacritics } from '../formatting'

async function fetchProjects() {
  try {
    const { data } = await axios.get('/api/projects/obras')
    return data as TProjectDTO[]
  } catch (error) {
    throw error
  }
}

export function useExecutionProjects() {
  type Filters = {
    search: string
    roofTileType: string
    serviceType: string[]
    city: string[]
    topology: string[]
    technicalTeam: string[]
    deliveryStatus: string[]
    executionStatus: string[]
    personalizedStructureApplied: boolean
    personalizedStructureStatus: string[]
    paAlterationApplied: boolean
    paAlterationPending: boolean
    partialPaymentDone: boolean
    partialExecutionPending: boolean
    missingObservations: boolean
    outsideMatrix: boolean
  }
  const [filters, setFilters] = useState<Filters>({
    search: '',
    roofTileType: '',
    serviceType: [],
    city: [],
    topology: [],
    technicalTeam: [],
    deliveryStatus: [],
    executionStatus: [],
    personalizedStructureApplied: false,
    personalizedStructureStatus: [],
    paAlterationApplied: false,
    paAlterationPending: false,
    partialPaymentDone: false,
    partialExecutionPending: false,
    missingObservations: false,
    outsideMatrix: false,
  })
  function matchSearch(project: TProjectDTO) {
    if (filters.search.trim().length == 0) return true
    return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchRoofTileType(project: TProjectDTO) {
    if (filters.roofTileType.trim().length == 0) return true
    return project.visitaTecnica.tipoDaTelha?.toUpperCase().includes(filters.roofTileType.toUpperCase())
  }
  function matchServiceType(project: TProjectDTO) {
    if (filters.serviceType.length == 0) return true
    return filters.serviceType.includes(project.tipoDeServico)
  }
  function matchCity(project: TProjectDTO) {
    if (filters.city.length == 0) return true
    return filters.city.includes(project.cidade)
  }
  function matchTopology(project: TProjectDTO) {
    if (filters.topology.length == 0) return true
    return filters.topology.includes(project.sistema.topologia || '')
  }
  function matchTechnicalTeam(project: TProjectDTO) {
    if (filters.technicalTeam.length == 0) return true
    return filters.technicalTeam.includes(project.obra.equipeResp || '')
  }
  function matchDeliveryStatus(project: TProjectDTO) {
    if (filters.deliveryStatus.length == 0) return true
    return filters.deliveryStatus.includes(project.compra.statusEntrega || '')
  }
  function matchExecutionStatus(project: TProjectDTO) {
    if (filters.executionStatus.length == 0) return true
    return filters.executionStatus.includes(project.obra.statusDaObra || '')
  }
  function matchPersonalizedStructureApplied(project: TProjectDTO) {
    if (!filters.personalizedStructureApplied) return true
    return project.estruturaPersonalizada.aplicavel == 'SIM'
  }
  function matchPersonalizedStructureStatus(project: TProjectDTO) {
    if (filters.personalizedStructureStatus.length == 0) return true
    return filters.personalizedStructureStatus.includes(project.estruturaPersonalizada.status || '')
  }
  function matchPaAlterationApplied(project: TProjectDTO) {
    if (!filters.paAlterationApplied) return true
    return !!project.padrao.aumentoCarga.aplicavel
  }
  function matchPaAlterationPending(project: TProjectDTO) {
    if (!filters.paAlterationPending) return true
    return !project.padrao.aumentoCarga.dataEfetivacao
  }
  function matchPartialPaymentDone(project: TProjectDTO) {
    if (!filters.partialPaymentDone) return true
    return !!project.compra.dataPagamento
  }
  function matchPartialExecutionPending(project: TProjectDTO) {
    if (!filters.partialExecutionPending) return true
    return project.obra.statusDaObra == 'CONCLUIDA PARCIAL' && !!project.homologacao.vistoria.dataEfetivacao
  }
  function matchMissingObservations(project: TProjectDTO) {
    if (!filters.missingObservations) return true
    return project.obra.observacoes?.trim().length <= 2
  }
  function matchOutsideMatrix(project: TProjectDTO) {
    if (!filters.outsideMatrix) return true
    return project.cidade != 'ITUIUTABA'
  }
  function handleModelData(data: TProjectDTO[]) {
    var modeledData = data
    return modeledData.filter(
      (project) =>
        matchSearch(project) &&
        matchRoofTileType(project) &&
        matchServiceType(project) &&
        matchCity(project) &&
        matchTopology(project) &&
        matchTechnicalTeam(project) &&
        matchDeliveryStatus(project) &&
        matchExecutionStatus(project) &&
        matchPersonalizedStructureApplied(project) &&
        matchPersonalizedStructureStatus(project) &&
        matchPaAlterationApplied(project) &&
        matchPaAlterationPending(project) &&
        matchPartialPaymentDone(project) &&
        matchPartialExecutionPending(project) &&
        matchMissingObservations(project) &&
        matchOutsideMatrix(project)
    )
  }
  return {
    ...useQuery({
      queryKey: ['execution-projects'],
      queryFn: fetchProjects,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}

async function fetchPAExecutionProjects() {
  try {
    const { data } = await axios.get('/api/gestao-obras/padroes')
    return data.data as TEnergyPAExecution[]
  } catch (error) {
    throw error
  }
}

export type UsePAExecutionProjectsFilters = {
  search: string
  segments: string[]
  accessStatus: string[]
  pendingPaid: boolean
}
export function usePAExecutionProjects() {
  const [filters, setFilters] = useState<UsePAExecutionProjectsFilters>({
    search: '',
    segments: [],
    accessStatus: [],
    pendingPaid: false,
  })

  function matchSearch(project: TEnergyPAExecution) {
    if (filters.search.trim().length == 0) return true
    return formatWithoutDiacritics(project.nomeDoContrato, true).includes(formatWithoutDiacritics(filters.search, true))
  }

  function matchSegments(project: TEnergyPAExecution) {
    if (filters.segments.length == 0) return true
    return filters.segments.includes(project.segmento)
  }
  function matchAccessStatus(project: TEnergyPAExecution) {
    if (filters.accessStatus.length == 0) return true
    return filters.accessStatus.includes(project.homologacao.status)
  }

  function matchPendingReady(project: TEnergyPAExecution) {
    if (!filters.pendingPaid) return true
    return !project.padrao.aumentoCarga.dataEfetivacao && !!project.compra.dataPagamento
  }

  function handleModelData(data: TEnergyPAExecution[]) {
    var modeledData = data
    return modeledData.filter((project) => matchSearch(project) && matchSegments(project) && matchAccessStatus(project) && matchPendingReady(project))
  }
  return {
    ...useQuery({
      queryKey: ['pa-execution-projects'],
      queryFn: fetchPAExecutionProjects,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
