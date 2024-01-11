import { TDashboardStats, TSaleGraphStat } from '@/utils/schemas/stats'
import axios from 'axios'
import { useQuery } from 'react-query'

async function fetchDashboardStats() {
  const { data } = await axios.get('/api/stats')
  return data as TDashboardStats
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  })
}

async function fetchSalesGraphStats({ year }: { year: number }) {
  try {
    const { data } = await axios.get(`/api/stats/getByYear/${year}`)
    return data as TSaleGraphStat[]
  } catch (error) {
    throw error
  }
}

export function useSalesGraphStats({ year }: { year: number }) {
  return useQuery({
    queryKey: ['sales-graph-stats', year],
    queryFn: async () => await fetchSalesGraphStats({ year }),
  })
}
