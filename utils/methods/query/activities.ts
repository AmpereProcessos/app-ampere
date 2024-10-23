import { TActivityDTO } from '@/utils/schemas/activities'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

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

export type UseResponsibleActivitiesFilters = {
  search: string
}
export function useResponsibleActivities({ id }: { id: string }) {
  const [filters, setFilters] = useState<UseResponsibleActivitiesFilters>({
    search: '',
  })
  function matchSearch(activity: TActivityDTO) {
    if (filters.search.trim().length == 0) return true
    return activity.titulo.toUpperCase().includes(filters.search.toUpperCase())
  }

  function handleModelData(data: TActivityDTO[]) {
    var modeledData = data
    return modeledData.filter((activity) => matchSearch(activity))
  }
  return {
    ...useQuery({
      queryKey: ['activities-by-responsible', id],
      queryFn: async () => await fetchActivitiesByResponsibleId({ id }),
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
