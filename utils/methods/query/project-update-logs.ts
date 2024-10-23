import { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

async function fetchProjectUpdateLogs({ projectId }: { projectId: string }) {
  try {
    const { data } = await axios.get(`/api/projects/registros-alteracoes?projectId=${projectId}`)

    return data.data as TProjectUpdateLogDTO[]
  } catch (error) {
    throw error
  }
}

export function useProjectUpdateLogs({ projectId }: { projectId: string }) {
  return useQuery({
    queryKey: ['project-update-logs', projectId],
    queryFn: async () => await fetchProjectUpdateLogs({ projectId }),
  })
}
