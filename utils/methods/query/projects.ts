import { TProjectsByFiltersResult } from '@/pages/api/projects/search'
import { TPersonalizedProjectsFilter } from '@/utils/schemas/projects'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

async function fetchProjectsByPersonalizedFilters({ page, filters }: { page: number; filters: TPersonalizedProjectsFilter }) {
  try {
    const { data } = await axios.post(`/api/projects/search?page=${page}`, filters)

    return data.data as TProjectsByFiltersResult
  } catch (error) {
    throw error
  }
}

export function useProjectsByPersonalizedFilters({ page }: { page: number }) {
  const [filters, setFilters] = useState<TPersonalizedProjectsFilter>({
    name: '',
    period: { after: null, before: null, field: null },
    state: [],
    city: [],
    serviceType: [],
    seller: [],
    insider: [],
    technicalTeam: [],
    acquisitionChannel: [],
  })
  function updateFilters(filters: TPersonalizedProjectsFilter) {
    setFilters(filters)
  }
  return {
    ...useQuery({
      queryKey: ['projects-by-filters', page, filters],
      queryFn: async () => await fetchProjectsByPersonalizedFilters({ page, filters }),
    }),
    updateFilters,
  }
}
