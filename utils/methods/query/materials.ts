import axios from 'axios'
import { useQuery } from 'react-query'
import { isEmpty } from '../shared'
import { TMaterial, TMaterialDTO } from '@/utils/schemas/materials'
import { useState } from 'react'

export async function fetchMaterials() {
  try {
    const { data } = await axios.get('/api/almoxarifado/materiais')
    return data as TMaterialDTO[]
  } catch (error) {
    throw error
  }
}
async function fetchMaterialLogs(materialId: string) {
  const { data } = await axios.get(`/api/almoxarifado/logMateriais?materialId=${materialId}`)

  if (!data) return []
  if (!Array.isArray(data)) return []
  return data
}

type UseMaterialsFilters = {
  search: string
  lessThan: number
  moreThan: number
  minimumUndefined: boolean
  maximumUndefined: boolean
  belowMinimum: boolean
  aboveMaximum: boolean
}
export function useMaterials() {
  const [filters, setFilters] = useState<UseMaterialsFilters>({
    search: '',
    lessThan: 0,
    moreThan: 0,
    minimumUndefined: false,
    maximumUndefined: false,
    belowMinimum: false,
    aboveMaximum: false,
  })

  function matchSearch(material: TMaterialDTO) {
    if (filters.search.trim().length == 0) return true
    return material.nome.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchLessThan(material: TMaterialDTO) {
    if (!filters.lessThan) return true
    return material.qtde < filters.lessThan
  }
  function matchMoreThan(material: TMaterialDTO) {
    if (!filters.moreThan) return true
    return material.qtde > filters.moreThan
  }
  function matchMinimumUndefined(material: TMaterialDTO) {
    if (!filters.minimumUndefined) return true
    return !material.qtdeMinima
  }
  function matchMaximumUndefined(material: TMaterialDTO) {
    if (!filters.maximumUndefined) return true
    return !material.qtdeMaxima
  }
  function matchBelowMinimum(material: TMaterialDTO) {
    if (!filters.belowMinimum) return true
    return material.qtde < (material.qtdeMinima || 0)
  }
  function matchAboveMaximum(material: TMaterialDTO) {
    if (!filters.aboveMaximum) return true
    return material.qtdeMaxima && material.qtde > material.qtdeMaxima
  }
  function handleModelData(data: TMaterialDTO[]) {
    var modeledData = data
    return modeledData.filter(
      (material) =>
        matchSearch(material) &&
        matchLessThan(material) &&
        matchMoreThan(material) &&
        matchMinimumUndefined(material) &&
        matchMaximumUndefined(material) &&
        matchBelowMinimum(material) &&
        matchAboveMaximum(material)
    )
  }
  return {
    ...useQuery({
      queryKey: ['materials'],
      queryFn: fetchMaterials,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
export function useMaterialsWithFilters(enabled: boolean, filters: any) {
  const { search, qtyLessThan } = filters

  function checkName(materialName: string, searchFilter: string) {
    if (isEmpty(searchFilter)) return true
    return materialName?.toUpperCase().includes(searchFilter.toUpperCase())
  }
  function checkQty(materialQty: number, lessThanFilter: number) {
    if (!materialQty || materialQty <= 0 || typeof materialQty != 'number') return true
    if (!lessThanFilter || lessThanFilter <= 0 || typeof lessThanFilter != 'number') return true
    return materialQty <= lessThanFilter
  }
  return useQuery({
    queryKey: ['materials'],
    queryFn: fetchMaterials,
    refetchOnWindowFocus: false,
    enabled: !!enabled,
    select: (materials) => materials.filter((material) => checkName(material.nome, search) && checkQty(material.qtde, qtyLessThan)),
  })
}
export function useMaterialLogs(materialId: string) {
  return useQuery({
    queryKey: ['materialLog', materialId],
    queryFn: async () => await fetchMaterialLogs(materialId),
    refetchOnWindowFocus: false,
  })
}
