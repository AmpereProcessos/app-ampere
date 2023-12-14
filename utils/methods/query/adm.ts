import { TProjectDTO } from '@/utils/schemas/projects'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

async function fetchProjects() {
  try {
    const { data } = await axios.get('/api/projects/adm')
    return data as TProjectDTO[]
  } catch (error) {
    throw error
  }
}

type Filters = {
  search: string
  contractStatus: string[]
  technicalTeam: string[]
  billingCompany: string[]
  inspectionStatus: string[]
  toCharge: boolean
  chargeDone: boolean
  toBill: boolean
  billingDone: boolean
  date: {
    after: string | null
    before: string | null
    field1: string | null
    field2: string | null
  }
}
export function useADMProjects() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    contractStatus: [],
    technicalTeam: [],
    billingCompany: [],
    inspectionStatus: [],
    toCharge: false,
    chargeDone: false,
    toBill: false,
    billingDone: false,
    date: {
      after: null,
      before: null,
      field1: null,
      field2: null,
    },
  })

  function matchSearch(project: TProjectDTO) {
    if (filters.search.trim().length == 0) return true
    else return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchContractStatus(project: TProjectDTO) {
    if (filters.contractStatus.length == 0) return true
    else return filters.contractStatus.includes(project.contrato?.status || '')
  }
  function matchTechnicalTeam(project: TProjectDTO) {
    if (filters.technicalTeam.length == 0) return true
    return filters.technicalTeam.includes(project.obra.equipeResp || '')
  }
  function matchBillingCompany(project: TProjectDTO) {
    if (filters.billingCompany.length == 0) return true
    return filters.billingCompany.includes(project.faturamento.empresaFaturamento)
  }
  function matchInspectionStatus(project: TProjectDTO) {
    if (filters.inspectionStatus.length == 0) return true
    return filters.inspectionStatus.includes(project.vistoria.status || '')
  }
  function matchToCharge(project: TProjectDTO) {
    if (!filters.toCharge) return true
    return !project.pagamento.cobrancaFeita
  }
  function matchChargeDone(project: TProjectDTO) {
    if (!filters.chargeDone) return true
    return !!project.pagamento.cobrancaFeita
  }
  function matchToBill(project: TProjectDTO) {
    if (!filters.toBill) return true
    return !project.faturamento.concluido
  }
  function matchBillingDone(project: TProjectDTO) {
    if (!filters.billingDone) return true
    return !!project.faturamento.concluido
  }
  function matchDate(project: TProjectDTO) {
    if (!filters.date.after || !filters.date.before || !filters.date.field1 || !filters.date.field2) return true
    return (
      // @ts-ignore
      project[filters.date.field1][filters.date.field2] >= filters.date.after &&
      // @ts-ignore
      project[filters.date.field1][filters.date.field2] <= filters.date.before
    )
  }
  function handleModelData(data: TProjectDTO[]) {
    var modeledData = data
    return modeledData.filter(
      (project) =>
        matchSearch(project) &&
        matchContractStatus(project) &&
        matchTechnicalTeam(project) &&
        matchBillingCompany(project) &&
        matchInspectionStatus(project) &&
        matchToCharge(project) &&
        matchChargeDone(project) &&
        matchToBill(project) &&
        matchBillingDone(project) &&
        matchDate(project)
    )
  }
  return {
    ...useQuery({
      queryKey: ['adm-projects'],
      queryFn: fetchProjects,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
