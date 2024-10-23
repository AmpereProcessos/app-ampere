import { TProjectDTO } from '@/utils/schemas/projects'
import axios from 'axios'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProjectNestedFieldValue } from '../formatting'

function getNestedFieldValue(project: TProjectDTO, path: string) {
  // @ts-ignore
  return path.split('.').reduce((acc, part) => acc && acc[part as keyof TProjectDTO], project)
}

async function fetchNPSData() {
  const { data } = await axios.get('/api/projects/nps')
  if (!data) return []
  if (!Array.isArray(data)) return []
  return data
}

export function useNPS(enabled: boolean) {
  type Filters = {
    city: string[]
    sellerName: string[]
    search: string
    unCollected: boolean
    onlyPromoters: boolean
    onlyDetrators: boolean
    onlyNeutrals: boolean
    withObs: boolean
    withoutObs: boolean
    npsRange: {
      min: number | null
      max: number | null
    }
    date: {
      after: string | null
      before: string | null
      field: string | null
    }
    npsValue: number | null
  }
  const [filters, setFilters] = useState<Filters>({
    city: [],
    sellerName: [],
    search: '',
    unCollected: false,
    onlyPromoters: false,
    onlyDetrators: false,
    onlyNeutrals: false,
    withObs: false,
    withoutObs: false,
    npsRange: {
      min: null,
      max: null,
    },
    date: {
      after: null,
      before: null,
      field: null,
    },
    npsValue: null,
  })
  function matchCity(project: TProjectDTO) {
    if (filters.city.length == 0) return true
    return filters.city.includes(project.cidade)
  }
  function matchSeller(project: TProjectDTO) {
    if (filters.sellerName.length == 0) return true
    return filters.sellerName.includes(project.vendedor.nome)
  }
  function matchUnCollected(project: TProjectDTO) {
    if (!filters.unCollected) return true
    return !project.nps
  }
  function matchOnlyPromoters(project: TProjectDTO) {
    if (!filters.onlyPromoters) return true
    return project.nps != null && project.nps >= 9
  }
  function matchOnlyDetrators(project: TProjectDTO) {
    if (!filters.onlyDetrators) return true
    return project.nps != null && project.nps <= 6
  }
  function matchOnlyNeutrals(project: TProjectDTO) {
    if (!filters.onlyNeutrals) return true
    return project.nps != null && project.nps > 6 && project.nps < 9
  }
  function matchWithObs(project: TProjectDTO) {
    if (!filters.withObs) return true
    return project.jornada.obsNps != undefined && project.jornada.obsNps != null && project.jornada.obsNps?.trim().length > 2
  }
  function matchWithoutObs(project: TProjectDTO) {
    if (!filters.withoutObs) return true
    return project.jornada.obsNps == undefined || project.jornada.obsNps == null || project.jornada.obsNps?.trim().length < 2
  }
  function matchNpsRange(project: TProjectDTO) {
    if (filters.npsRange.min == null || !filters.npsRange.max) return true
    return !!project.nps && project.nps >= filters.npsRange.min && project.nps <= filters.npsRange.max
  }
  function matchNpsValue(project: TProjectDTO) {
    if (filters.npsValue == null) return true
    return project.nps == filters.npsValue
  }
  function matchSearch(project: TProjectDTO) {
    if (filters.search.trim().length == 0) return true
    else return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase())
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

  function handelModelData(data: TProjectDTO[]) {
    var modeledData = data
    return modeledData.filter(
      (project: TProjectDTO) =>
        matchCity(project) &&
        matchSeller(project) &&
        matchUnCollected(project) &&
        matchOnlyPromoters(project) &&
        matchOnlyNeutrals(project) &&
        matchOnlyDetrators(project) &&
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

async function fetchProjects() {
  try {
    const { data } = await axios.get('/api/projects/posvenda')
    return data as TProjectDTO[]
  } catch (error) {
    throw error
  }
}

export function useAfterSalesProjects() {
  type AfterSalesFilters = {
    search: string
    moduleQty: number | null
    city: string[]
    deliveryStatus: string[]
    sellerName: string[]
    grantingStatus: string[]
    inspectionStatus: string[]
    executionStatus: string[]
    journeyPendings: string[]
    necessaryDistribution: boolean
    missingSignature: boolean
    pendingContact: boolean
    contactOrder: 'ASC' | 'DESC' | null
    date: {
      after: string | null
      before: string | null
      field: string | null
    }
  }
  const [filters, setFilters] = useState<AfterSalesFilters>({
    search: '',
    moduleQty: null,
    city: [],
    deliveryStatus: [],
    sellerName: [],
    grantingStatus: [],
    inspectionStatus: [],
    executionStatus: [],
    journeyPendings: [],
    necessaryDistribution: false,
    missingSignature: false,
    pendingContact: false,
    contactOrder: null,
    date: {
      after: null,
      before: null,
      field: null,
    },
  })

  function matchSearch(project: TProjectDTO) {
    if (filters.search.trim().length == 0) return true
    else return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchModuleQty(project: TProjectDTO) {
    if (!filters.moduleQty || filters.moduleQty <= 0) return true
    return project.sistema.qtdeModulos == filters.moduleQty
  }
  function matchSeller(project: TProjectDTO) {
    if (filters.sellerName.length == 0) return true
    else return filters.sellerName.includes(project.vendedor?.nome)
  }
  function matchCity(project: TProjectDTO) {
    if (filters.city.length == 0) return true
    else return filters.city.includes(project.cidade)
  }
  function matchDeliveryStatus(project: TProjectDTO) {
    if (filters.deliveryStatus.length == 0) return true
    else return filters.deliveryStatus.includes(project.compra?.statusEntrega || '')
  }
  function matchExecutionStatus(project: TProjectDTO) {
    if (filters.executionStatus.length == 0) return true
    else return filters.executionStatus.includes(project.obra?.statusDaObra || '')
  }
  function matchJourneyPendings(project: TProjectDTO) {
    if (filters.journeyPendings.length == 0) return true
    const matchesPendings = filters.journeyPendings.every((field) => !project.jornada[field as keyof TProjectDTO['jornada']])
    return matchesPendings
  }
  function matchInspectionStatus(project: TProjectDTO) {
    if (filters.inspectionStatus.length == 0) return true
    else return filters.inspectionStatus.includes(project.vistoria?.status || '')
  }
  function matchGrantingStatus(project: TProjectDTO) {
    if (filters.grantingStatus.length == 0) return true
    else return filters.grantingStatus.includes(project.homologacao.status || '')
  }
  function matchNecessaryDistribution(project: TProjectDTO) {
    if (!filters.necessaryDistribution) return true
    else return project.homologacao.instalacao.dependentes.length > 0
  }
  function matchMissingSignature(project: TProjectDTO) {
    if (!filters.missingSignature) return true
    else return !!project.homologacao.documentacao.dataLiberacao && !project.homologacao.documentacao.dataAssinatura
  }
  function matchPendingContact(project: TProjectDTO) {
    if (!filters.pendingContact) return true
    const lastContact = project.jornada.dataUltimoContato
    // In case there's no contact
    if (!lastContact) return true
    // In case there's more than 7 days since contact
    const sinceLastContact = dayjs().diff(lastContact, 'day')
    if (sinceLastContact >= 7) return true
    return false
  }
  function matchDate(project: TProjectDTO) {
    if (!filters.date.after || !filters.date.before || !filters.date.field) return true
    const fieldValue = getNestedFieldValue(project, filters.date.field)
    return (
      // @ts-ignore
      fieldValue >= filters.date.after &&
      // @ts-ignore
      fieldValue <= filters.date.before
    )
  }
  function orderByContact(projects: TProjectDTO[]) {
    var newArr
    const nulls = projects.filter((p) => !p.jornada.dataUltimoContato)
    const filtered = projects.filter((p) => !!p.jornada.dataUltimoContato)
    switch (filters.contactOrder) {
      case 'ASC':
        // @ts-ignore
        newArr = filtered.sort((a, b) => new Date(a.jornada.dataUltimoContato) - new Date(b.jornada.dataUltimoContato))
        return [...nulls, ...newArr]
      case 'DESC':
        // @ts-ignore
        newArr = filtered.sort((a, b) => new Date(b.jornada.dataUltimoContato) - new Date(a.jornada.dataUltimoContato))
        return [...newArr, ...nulls]

      default:
        return projects
    }
  }
  function handelModelData(data: TProjectDTO[]) {
    var modeledData = data
    modeledData = orderByContact(modeledData)
    return modeledData.filter(
      (project) =>
        matchSearch(project) &&
        matchModuleQty(project) &&
        matchSeller(project) &&
        matchCity(project) &&
        matchDeliveryStatus(project) &&
        matchExecutionStatus(project) &&
        matchJourneyPendings(project) &&
        matchInspectionStatus(project) &&
        matchGrantingStatus(project) &&
        matchNecessaryDistribution(project) &&
        matchMissingSignature(project) &&
        matchPendingContact(project) &&
        matchDate(project)
    )
  }
  return {
    ...useQuery({
      queryKey: ['after-sales-projects'],
      queryFn: fetchProjects,
      select: (data) => handelModelData(data),
    }),
    filters,
    setFilters,
  }
}
