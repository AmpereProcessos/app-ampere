import {
  TPurchaseControl,
  TPurchaseControlDTO,
  TPurchaseControlKanbanSimplifiedDTO,
  TPurchaseControlsQueryFilters,
  TPurchaseControlTag,
  TPurchaseControlTagDTO,
} from '@/utils/schemas/purchases'
import axios from 'axios'
import { useState } from 'react'
import { formatWithoutDiacritics } from '../formatting'
import { useQuery } from 'react-query'
import { TPurchaseControlsByFiltersResult } from '@/pages/api/controles-compras/search'

async function fetchPurchasesControls() {
  try {
    const { data } = await axios.get('/api/controles-compras')
    return data.data as TPurchaseControlKanbanSimplifiedDTO[]
  } catch (error) {
    throw error
  }
}

type TPurchaseControlFilters = {
  title: string
  status: string[]
  tags: string[]
  deliveryStatus: string[]
}
export function usePurchaseControls() {
  const [filters, setFilters] = useState<TPurchaseControlFilters>({
    title: '',
    status: [],
    tags: [],
    deliveryStatus: [],
  })

  function matchTitle(control: TPurchaseControlKanbanSimplifiedDTO) {
    if (filters.title.trim().length == 0) return true
    return formatWithoutDiacritics(control.titulo, true).includes(formatWithoutDiacritics(filters.title, true))
  }
  function matchStatus(control: TPurchaseControlKanbanSimplifiedDTO) {
    if (filters.status.length == 0) return true
    return filters.status.includes(control.status)
  }
  function matchTags(control: TPurchaseControlKanbanSimplifiedDTO) {
    if (filters.tags.length == 0) return true
    return control.etiquetas.some((t) => filters.tags.includes(t.id))
  }
  function matchDeliveryStatus(control: TPurchaseControlKanbanSimplifiedDTO) {
    if (filters.deliveryStatus.length == 0) return true
    return filters.deliveryStatus.includes(control.entrega.status)
  }

  function handleModelData(data: TPurchaseControlKanbanSimplifiedDTO[]) {
    return data.filter((control) => matchTitle(control) && matchStatus(control) && matchTags(control) && matchDeliveryStatus(control))
  }

  return {
    ...useQuery({
      queryKey: ['purchase-controls'],
      queryFn: fetchPurchasesControls,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}

async function fetchPurchaseControlsByFilters({ page, filters }: { page: number; filters: TPurchaseControlsQueryFilters }) {
  try {
    const { data } = await axios.post(`/api/controles-compras/search?page=${page}`, filters)

    return data.data as TPurchaseControlsByFiltersResult
  } catch (error) {
    throw error
  }
}

export type TUsePurchaseControlsByFiltersFilters = { page: number } & TPurchaseControlsQueryFilters
export function usePurchaseControlsByFilters() {
  const [filters, setFilters] = useState<TUsePurchaseControlsByFiltersFilters>({
    page: 1,
    title: '',
    supplier: '',
    carrier: '',
    period: {},
    tags: [],
    pendingOrder: false,
    pendingBilling: false,
    pendingDelivery: false,
  })

  function updateFilters(info: Partial<TUsePurchaseControlsByFiltersFilters>) {
    setFilters((prev) => ({ ...prev, ...info }))
  }

  const query = useQuery({
    queryKey: ['purchase-controls-by-filters', filters],
    queryFn: async () => await fetchPurchaseControlsByFilters({ page: filters.page, filters }),
  })

  return {
    ...query,
    filters,
    updateFilters,
  }
}
async function fetchPurchaseControlById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/controles-compras?id=${id}`)
    return data.data as TPurchaseControlDTO
  } catch (error) {
    throw error
  }
}

export function usePurchaseControlById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['purchase-control-by-id', id],
    queryFn: async () => await fetchPurchaseControlById({ id }),
  })
}

async function fetchPurchasesControlTags() {
  try {
    const { data } = await axios.get('/api/controles-compras/tags')
    return data.data as TPurchaseControlTagDTO[]
  } catch (error) {
    throw error
  }
}

export function usePurchaseControlsTags() {
  return useQuery({
    queryKey: ['purchase-controls-tags'],
    queryFn: fetchPurchasesControlTags,
  })
}
