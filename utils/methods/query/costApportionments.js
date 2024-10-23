import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export async function fetchCostApportionments() {
  try {
    const { data } = await axios.get('/api/configuracoes/centrosDeCusto')
    if (!data) return []
    if (!Array.isArray(data)) return []
    return data
  } catch (error) {
    throw error
  }
}

export function useCostApportionments(enabled) {
  return useQuery({
    queryKey: ['costApportionments'],
    queryFn: fetchCostApportionments,
    refetchOnWindowFocus: false,
    enabled: !!enabled,
  })
}

export async function fetchCostApportionmentById(id) {
  try {
    const { data } = await axios.get(`/api/configuracoes/centrosDeCusto?id=${id}`)
    return data
  } catch (error) {
    throw error
  }
}

export function useCostApportionmentByID(id) {
  return useQuery({
    queryKey: ['costApportionment', id],
    queryFn: async () => await fetchCostApportionmentById(id),
    refetchOnWindowFocus: false,
  })
}
