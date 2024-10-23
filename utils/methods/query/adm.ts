import { TProjectDTO } from '@/utils/schemas/projects'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProjectNestedFieldValue } from '../formatting'
import { TProjectADMSimplifiedWithRevenue } from '@/pages/api/projects/adm'
import dayjs from 'dayjs'

async function fetchProjects() {
  try {
    const { data } = await axios.get('/api/projects/adm')
    return data as TProjectADMSimplifiedWithRevenue[]
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
  receiptsUndefined: boolean
  receiptToday: boolean
  receiptThisWeek: boolean
  receiptThisMonth: boolean
  date: {
    after: string | null
    before: string | null
    field: string | null
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
    receiptsUndefined: false,
    receiptToday: false,
    receiptThisWeek: false,
    receiptThisMonth: false,
    date: {
      after: null,
      before: null,
      field: null,
    },
  })

  function matchSearch(project: TProjectADMSimplifiedWithRevenue) {
    if (filters.search.trim().length == 0) return true
    else return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchContractStatus(project: TProjectADMSimplifiedWithRevenue) {
    if (filters.contractStatus.length == 0) return true
    else return filters.contractStatus.includes(project.contrato?.status || '')
  }
  function matchTechnicalTeam(project: TProjectADMSimplifiedWithRevenue) {
    if (filters.technicalTeam.length == 0) return true
    return filters.technicalTeam.includes(project.obra.equipeResp || '')
  }
  function matchBillingCompany(project: TProjectADMSimplifiedWithRevenue) {
    if (filters.billingCompany.length == 0) return true
    return filters.billingCompany.includes(project.faturamento.empresaFaturamento || '')
  }
  function matchInspectionStatus(project: TProjectADMSimplifiedWithRevenue) {
    if (filters.inspectionStatus.length == 0) return true
    return filters.inspectionStatus.includes(project.vistoria.status || '')
  }
  function matchToCharge(project: TProjectADMSimplifiedWithRevenue) {
    if (!filters.toCharge) return true
    return !project.pagamento.cobrancaFeita
  }
  function matchChargeDone(project: TProjectADMSimplifiedWithRevenue) {
    if (!filters.chargeDone) return true
    return !!project.pagamento.cobrancaFeita
  }
  function matchToBill(project: TProjectADMSimplifiedWithRevenue) {
    if (!filters.toBill) return true
    return !project.faturamento.concluido
  }
  function matchBillingDone(project: TProjectADMSimplifiedWithRevenue) {
    if (!filters.billingDone) return true
    return !!project.faturamento.concluido
  }
  function matchReceiptsUndefined(project: TProjectADMSimplifiedWithRevenue) {
    if (!filters.receiptsUndefined) return true
    return !project.receita || project.receita.fracionamento.length == 0
  }
  function matchReceiptToday(project: TProjectADMSimplifiedWithRevenue) {
    if (!filters.receiptToday) return true
    if (!project.receita) return false
    const receiptForToday = project.receita.fracionamento.some((receipt) => {
      const previewDate = dayjs(receipt.dataPrevisaoRecebimento).add(3, 'hours')
      return previewDate.isSame(dayjs(), 'day') && !receipt.dataRecebimento
    })
    return receiptForToday
  }
  function matchReceiptThisWeek(project: TProjectADMSimplifiedWithRevenue) {
    if (!filters.receiptThisWeek) return true
    if (!project.receita) return false
    const receiptForThisWeek = project.receita.fracionamento.some((receipt) => {
      const previewDate = dayjs(receipt.dataPrevisaoRecebimento).add(3, 'hours')
      return previewDate.isSame(dayjs(), 'week') && !receipt.dataRecebimento
    })
    return receiptForThisWeek
  }

  function matchReceiptThisMonth(project: TProjectADMSimplifiedWithRevenue) {
    if (!filters.receiptThisMonth) return true
    if (!project.receita) return false
    const receiptForThisMonth = project.receita.fracionamento.some((receipt) => {
      const previewDate = dayjs(receipt.dataPrevisaoRecebimento).add(3, 'hours')
      return previewDate.isSame(dayjs(), 'month') && !receipt.dataRecebimento
    })
    return receiptForThisMonth
  }

  function matchDate(project: TProjectADMSimplifiedWithRevenue) {
    if (!filters.date.after || !filters.date.before || !filters.date.field) return true
    const fieldValue = getProjectNestedFieldValue(project, filters.date.field)
    return (
      // @ts-ignore
      fieldValue >= filters.date.after &&
      // @ts-ignore
      fieldValue <= filters.date.before
    )
  }
  function handleModelData(data: TProjectADMSimplifiedWithRevenue[]) {
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
        matchReceiptsUndefined(project) &&
        matchReceiptToday(project) &&
        matchReceiptThisWeek(project) &&
        matchReceiptThisMonth(project) &&
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
