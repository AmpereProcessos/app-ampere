import axios from 'axios'
import { useQuery } from 'react-query'
import { isEmpty } from '../shared'

export async function fetchMaterials() {
  const { data } = await axios.get('/api/almoxarifado/materiais')
  if (!data) return []
  if (!Array.isArray(data)) return []
  return data
}
async function fetchMaterialLogs(materialId) {
  const { data } = await axios.get(`/api/almoxarifado/logMateriais?materialId=${materialId}`)

  if (!data) return []
  if (!Array.isArray(data)) return []
  return data
}
export function useMaterials(enabled) {
  return useQuery({
    queryKey: ['materials'],
    queryFn: fetchMaterials,
    refetchOnWindowFocus: false,
    enabled: !!enabled,
  })
}
export function useMaterialsWithFilters(enabled, filters) {
  const { search, qtyLessThan } = filters
  console.log(qtyLessThan)
  function checkName(materialName, searchFilter) {
    if (isEmpty(searchFilter)) return true
    return materialName?.toUpperCase().includes(searchFilter.toUpperCase())
  }
  function checkQty(materialQty, lessThanFilter) {
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
export function useMaterialLogs(materialId, enabled) {
  return useQuery({
    queryKey: ['materialLog', materialId],
    queryFn: async () => await fetchMaterialLogs(materialId),
    refetchOnWindowFocus: false,
    enabled: !!enabled,
  })
}
