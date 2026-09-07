import type { ExecutionAnalytics, ExecutionFilters } from '@/lib/analytics/execution'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export function useExecutionAnalytics(filters: ExecutionFilters) {
  return useQuery({
    queryKey: ['execution-analytics', filters],
    queryFn: async ({ signal }) => (await axios.post<{ data: ExecutionAnalytics }>('/api/stats/execution', filters, { signal })).data.data,
    staleTime: 60_000,
  })
}
