import { TProjectFinances } from '@/pages/api/stats/financial-auditing'
import axios from 'axios'
import { useQuery } from 'react-query'

async function fetchFinancialAuditingData({ after, before, field }: { after: string; before: string; field: string }) {
  try {
    const { data } = await axios.get(`/api/stats/financial-auditing?after=${after}&before=${before}&field=${field}`)
    return data as TProjectFinances[]
  } catch (error) {
    throw error
  }
}

export function useFinancialAuditing({ after, before, field }: { after: string; before: string; field: string }) {
  return useQuery({
    queryKey: ['financial-auditing', after, before, field],
    queryFn: async () => await fetchFinancialAuditingData({ after, before, field }),
  })
}
