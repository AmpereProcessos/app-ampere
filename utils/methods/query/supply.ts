import axios from 'axios'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatWithoutDiacritics, getProjectNestedFieldValue } from '../formatting'
import { TProjectDTO } from '@/utils/schemas/projects'
import { TPurchaseControlDeliveryTrackingDTO } from '@/utils/schemas/purchases'

async function fetchProjects() {
  try {
    const { data } = await axios.get('/api/projects/suprimentos')
    return data as TProjectDTO[]
  } catch (error) {
    throw error
  }
}

type TSupplyProjectsFilters = {
  supplyStatus: string[]
  deliveryStatus: string[]
  accessGrantingStatus: string[]
  yetToBuy: boolean
  search: string
  date: {
    after: string | null
    before: string | null
    field: string | null
  }
}
export function useSupplyProjects({ enabled }: { enabled: boolean }) {
  const [filters, setFilters] = useState<TSupplyProjectsFilters>({
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
  function matchSupplyStatus(project: TProjectDTO) {
    if (filters.supplyStatus.length == 0) return true
    return filters.supplyStatus.includes(project.compra.status || '')
  }
  function matchDeliveryStatus(project: TProjectDTO) {
    if (filters.deliveryStatus.length == 0) return true
    return filters.deliveryStatus.includes(project.compra.statusEntrega || '')
  }
  function matchAccessGrantingStatus(project: TProjectDTO) {
    if (filters.accessGrantingStatus.length == 0) return true
    return filters.accessGrantingStatus.includes(project.homologacao.status)
  }
  function matchDate(project: TProjectDTO) {
    if (!filters.date.after || !filters.date.before || !filters.date.field) return true
    const fieldValue = getProjectNestedFieldValue(project, filters.date.field)
    return fieldValue >= filters.date.after && fieldValue <= filters.date.before
  }
  function matchYetToBuy(project: TProjectDTO) {
    if (!filters.yetToBuy) return true
    return project.homologacao.status == 'APROVADO' && !project.compra.dataPedido
  }
  function matchSearch(project: TProjectDTO) {
    if (filters.search.trim().length == 0) return true
    else return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase())
  }
  function handleModelData(data: TProjectDTO[]) {
    var modeledData = data
    return modeledData.filter(
      (project: TProjectDTO) =>
        matchSupplyStatus(project) &&
        matchDeliveryStatus(project) &&
        matchYetToBuy(project) &&
        matchAccessGrantingStatus(project) &&
        matchDate(project) &&
        matchSearch(project)
    )
  }
  return {
    ...useQuery({ queryKey: ['supply-projects'], queryFn: fetchProjects, select: (data) => handleModelData(data) }),
    filters,
    setFilters,
  }
}

async function fetchProjectsInDelivery() {
  try {
    const { data } = await axios.get('/api/projects/entregas')
    return data.data as TPurchaseControlDeliveryTrackingDTO[]
  } catch (error) {
    throw error
  }
}

type TProjectsInDeliveryFilters = {
  search: string
  deliveryStatus: string[]
  cities: string[]
  ufs: string[]
}
export function useProjectsInDelivery() {
  const [filters, setFilters] = useState<TProjectsInDeliveryFilters>({
    search: '',
    deliveryStatus: [],
    cities: [],
    ufs: [],
  })
  function matchSearch(project: TPurchaseControlDeliveryTrackingDTO) {
    if (filters.search.trim().length == 0) return true
    return formatWithoutDiacritics(project.titulo, true).includes(formatWithoutDiacritics(filters.search, true))
  }

  function matchDeliveryStatus(project: TPurchaseControlDeliveryTrackingDTO) {
    if (filters.deliveryStatus.length == 0) return true
    return filters.deliveryStatus.includes(project.entrega.status || '')
  }
  function matchCity(project: TPurchaseControlDeliveryTrackingDTO) {
    if (filters.cities.length == 0) return true
    return filters.cities.includes(project.entrega.localizacao.cidade)
  }
  function matchUf(project: TPurchaseControlDeliveryTrackingDTO) {
    if (filters.ufs.length == 0) return true
    return filters.ufs.includes(project.entrega.localizacao.uf)
  }

  function handleModelData(data: TPurchaseControlDeliveryTrackingDTO[]) {
    return data.filter((project) => matchSearch(project) && matchDeliveryStatus(project) && matchCity(project) && matchUf(project))
  }
  const query = useQuery({ queryKey: ['projects-in-delivery'], queryFn: fetchProjectsInDelivery, select: (data) => handleModelData(data) })

  return { ...query, filters, setFilters }
}
