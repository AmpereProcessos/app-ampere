import { TComercialAnalyticalItem } from '@/pages/api/projects/analitico/comercial'
import { TProjectDTO } from '@/utils/schemas/projects'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProjectNestedFieldValue } from '../formatting'

async function fetchProjects() {
  try {
    const { data } = await axios.get('/api/projects/comercial')
    return data
  } catch (error) {
    throw error
  }
}

type UseComercialProjectsFilters = {
  identifier: string | null
  search: string
  contractStatus: string[]
  serviceType: string[]
  sellerName: string[]
  insiderName: string[]
  supplyStatus: string[]
  grantingStatus: string[]
  pendingSupplyLiberation: boolean
  signaturePendency: boolean
  noCRMVinculation: boolean
  noAnalysisVinculation: boolean
  date: {
    after: string | null
    before: string | null
    field: string | null
  }
}
export function useComercialProjects({ enabled }: { enabled: boolean }) {
  const [filters, setFilters] = useState<UseComercialProjectsFilters>({
    identifier: null,
    search: '',
    contractStatus: [],
    serviceType: [],
    sellerName: [],
    insiderName: [],
    supplyStatus: [],
    grantingStatus: [],
    pendingSupplyLiberation: false,
    signaturePendency: false,
    noCRMVinculation: false,
    noAnalysisVinculation: false,
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
  function matchIdentifier(project: TProjectDTO) {
    if (!filters.identifier) return true
    if (typeof project.codigoSVB == 'string') return project.codigoSVB.includes(filters.identifier.toUpperCase())
    if (typeof project.codigoSVB == 'number') return project.codigoSVB.toString().includes(filters.identifier)
  }
  function matchContractStatus(project: TProjectDTO) {
    if (filters.contractStatus.length == 0) return true
    else return filters.contractStatus.includes(project.contrato?.status || '')
  }
  function matchServiceType(project: TProjectDTO) {
    if (filters.serviceType.length == 0) return true
    else return filters.serviceType.includes(project.tipoDeServico)
  }
  function matchSellerName(project: TProjectDTO) {
    if (filters.sellerName.length == 0) return true
    else return filters.sellerName.includes(project.vendedor?.nome)
  }
  function matchInsiderName(project: TProjectDTO) {
    if (filters.insiderName.length == 0) return true
    else return filters.insiderName.includes(project.insider || '')
  }
  function matchSupplyStatus(project: TProjectDTO) {
    if (filters.supplyStatus.length == 0) return true
    return filters.supplyStatus.includes(project.compra.status || '')
  }
  function matchGrantingStatus(project: TProjectDTO) {
    if (filters.grantingStatus.length == 0) return true
    return filters.grantingStatus.includes(project.homologacao.status || '')
  }
  function matchPendingSupplyLiberation(project: TProjectDTO) {
    if (!filters.pendingSupplyLiberation) return true
    return !project.compra.liberacao
  }
  function matchSignaturePendency(project: TProjectDTO) {
    if (!filters.signaturePendency) return true
    return !!project.contrato.dataLiberacao && !project.contrato.dataAssinatura
  }
  function matchNoCRMVinculation(project: TProjectDTO) {
    if (!filters.noCRMVinculation) return true
    return !project.idProjetoCRM
  }
  function matchNoAnalysisVinculation(project: TProjectDTO) {
    if (!filters.noAnalysisVinculation) return true
    return !project.idVisitaTecnica
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
        matchIdentifier(project) &&
        matchContractStatus(project) &&
        matchServiceType(project) &&
        matchSellerName(project) &&
        matchInsiderName(project) &&
        matchGrantingStatus(project) &&
        matchSupplyStatus(project) &&
        matchPendingSupplyLiberation(project) &&
        matchSignaturePendency(project) &&
        matchNoCRMVinculation(project) &&
        matchNoAnalysisVinculation(project) &&
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

async function fetchComercialAnalyticalData({ after, before }: { after: string; before: string }) {
  try {
    const { data } = await axios.get(`/api/projects/analitico/comercial?after=${after}&before=${before}&field=${'contrato.dataAssinatura'}`)
    return data.data as TComercialAnalyticalItem[]
  } catch (error) {
    throw error
  }
}

type UseComercialAnalyticalDataFilters = {
  search: string
  sellerName: string[]
  pendingVinculation: boolean
}
export function useComercialAnalyticalData({ after, before }: { after: string; before: string }) {
  const [filters, setFilters] = useState<UseComercialAnalyticalDataFilters>({
    search: '',
    sellerName: [],
    pendingVinculation: false,
  })
  function matchSearch(project: TComercialAnalyticalItem) {
    if (filters.search.trim().length == 0) return true
    return project.nome.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchSellerName(project: TComercialAnalyticalItem) {
    if (filters.sellerName.length == 0) return true
    else return filters.sellerName.includes(project.vendedor)
  }
  function matchPendingVinculation(project: TComercialAnalyticalItem) {
    if (!filters.pendingVinculation) return true
    return !project.proposta.id
  }
  function handleModelData(data: TComercialAnalyticalItem[]) {
    var modeledData = data
    return modeledData?.filter((project) => matchSearch(project) && matchPendingVinculation(project) && matchSellerName(project)) || []
  }
  return {
    ...useQuery({
      queryKey: ['analytical-comercial', after, before],
      queryFn: async () => await fetchComercialAnalyticalData({ after, before }),
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
