import { TActivityDTO } from '@/utils/schemas/activities'
import axios from 'axios'
import { useQuery } from 'react-query'

async function fetchActivitiesByProjectId({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/atividades?projectId=${id}`)
    return data.data as TActivityDTO[]
  } catch (error) {
    throw error
  }
}

export function useProjectActivities({ id }: { id: string }) {
  return useQuery({
    queryKey: ['activities-by-project', id],
    queryFn: async () => await fetchActivitiesByProjectId({ id }),
  })
}

async function fetchActivitiesByResponsibleId({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/atividades?responsibleId=${id}`)
    return data.data as TActivityDTO[]
  } catch (error) {
    throw error
  }
}

export function useResponsibleActivities({ id }: { id: string }) {
  return useQuery({
    queryKey: ['activities-by-responsible', id],
    queryFn: async () => await fetchActivitiesByResponsibleId({ id }),
  })
}
