import { TIndicationProject } from '@/pages/api/publico/indicacoes'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

async function fetchIndicationsByIndicatorId({ projectId }: { projectId: string }) {
  try {
    const { data } = await axios.get(`/api/publico/indicacoes?projectId=${projectId}`)
    return data.data as TIndicationProject[]
  } catch (error) {
    throw error
  }
}

export function useIndicationsByIndicatorId({ projectId }: { projectId: string }) {
  return useQuery({
    queryKey: ['indications-by-indicator-id', projectId],
    queryFn: async () => await fetchIndicationsByIndicatorId({ projectId }),
  })
}
