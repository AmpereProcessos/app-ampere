import { TPropertyDTO } from '@/utils/schemas/properties'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatWithoutDiacritics } from '../formatting'

async function fetchProperties() {
  try {
    const { data } = await axios.get('/api/propriedades')
    return data.data as TPropertyDTO[]
  } catch (error) {
    throw error
  }
}

type UsePropertiesFilters = {
  search: string
  responsibles: string[]
  tags: string[]
}
export function useProperties() {
  const [filters, setFilters] = useState<UsePropertiesFilters>({
    search: '',
    responsibles: [],
    tags: [],
  })
  function matchSearch(property: TPropertyDTO) {
    if (filters.search.trim().length == 0) return true
    return formatWithoutDiacritics(property.nome, true).includes(formatWithoutDiacritics(filters.search, true))
  }
  function matchResponsibles(property: TPropertyDTO) {
    if (filters.responsibles.length == 0) return true
    return property.responsaveis.some((resp) => filters.responsibles.includes(resp.id))
  }
  function matchTags(property: TPropertyDTO) {
    if (filters.tags.length == 0) return true
    return property.tags.some((tag) => filters.tags.includes(tag))
  }

  function handleModelData(data: TPropertyDTO[]) {
    var modeledData = data
    return modeledData.filter((property) => matchSearch(property) && matchResponsibles(property) && matchTags(property))
  }
  return {
    ...useQuery({
      queryKey: ['properties'],
      queryFn: fetchProperties,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}

async function fetchPropertyById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/propriedades?id=${id}`)
    return data.data as TPropertyDTO
  } catch (error) {
    throw error
  }
}

export function usePropertyById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['property-by-id', id],
    queryFn: async () => await fetchPropertyById({ id }),
  })
}
