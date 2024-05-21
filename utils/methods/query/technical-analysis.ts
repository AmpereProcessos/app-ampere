import { TTechnicalAnalysisDTO } from '@/utils/schemas/technical-analysis'
import axios from 'axios'
import { useQuery } from 'react-query'

async function fetchAllTechnicalAnalysis() {
  try {
    const { data } = await axios.get('/api/crm/technical-analysis')
    return data.data as TTechnicalAnalysisDTO[]
  } catch (error) {
    throw error
  }
}

export function useTechnicalAnalysis() {
  return useQuery({
    queryKey: ['technical-analysis'],
    queryFn: fetchAllTechnicalAnalysis,
  })
}

export async function fetchTechnicalAnalysisById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/crm/technical-analysis?id=${id}`)
    return data.data as TTechnicalAnalysisDTO
  } catch (error) {
    throw error
  }
}

export function useTechnicalAnalysisById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['technical-analysis-by-id', id],
    queryFn: async () => await fetchTechnicalAnalysisById({ id }),
  })
}
