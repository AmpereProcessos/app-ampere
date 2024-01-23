import { TWarehouseFormularyDTO } from '@/utils/schemas/warehouse-formularies'
import axios from 'axios'
import { useState } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'

export async function fetchWarehouseForms({ after, before }: { after: string; before: string }) {
  try {
    const { data } = await axios.get(`/api/almoxarifado/formularios?after=${after}&before=${before}`)

    return data.data as TWarehouseFormularyDTO[]
  } catch (error) {
    throw error
  }
}

type UseWarehouseFormsFilters = {
  search: string
  done: boolean
  notDone: boolean
  services: string[]
}
export function useWarehouseForms({ after, before }: { after: string; before: string }) {
  const [filters, setFilters] = useState<UseWarehouseFormsFilters>({
    search: '',
    done: false,
    notDone: false,
    services: [],
  })
  function matchSearch(form: TWarehouseFormularyDTO) {
    if (filters.search.trim().length == 0) return true
    return (
      form.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase()) ||
      form.nomeTerceiro?.toUpperCase().includes(filters.search.toUpperCase())
    )
  }
  function matchDone(form: TWarehouseFormularyDTO) {
    if (!filters.done) return true
    return !!form.dataEfetivacao
  }
  function matchNotDone(form: TWarehouseFormularyDTO) {
    if (!filters.notDone) return true
    return !form.dataEfetivacao
  }
  function matchService(form: TWarehouseFormularyDTO) {
    if (filters.services.length == 0) return true
    return filters.services.includes(form.servico)
  }
  function handleModelData(data: TWarehouseFormularyDTO[]) {
    var modeledData = data
    return modeledData.filter((form) => matchSearch(form) && matchDone(form) && matchNotDone(form) && matchService(form))
  }
  return {
    ...useQuery({
      queryKey: ['warehouse-forms', after, before],
      queryFn: async () => await fetchWarehouseForms({ after, before }),
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}

async function fetchWarehouseFormById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/almoxarifado/formularios?id=${id}`)

    return data.data as TWarehouseFormularyDTO
  } catch (error) {
    throw error
  }
}

export function useWarehouseFormById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['warehouse-form-by-id', id],
    queryFn: async () => await fetchWarehouseFormById({ id }),
  })
}
