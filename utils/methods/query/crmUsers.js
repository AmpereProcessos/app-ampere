import axios from 'axios'
import { useQuery } from 'react-query'

async function fetchCRMUsers() {
  try {
    const { data } = await axios.get('/api/crm/users')
    return data
  } catch (error) {
    throw error
  }
}

export function useCRMUsers({ enabled }) {
  return useQuery({
    queryKey: ['crm-users'],
    queryFn: fetchCRMUsers,
    enabled: !!enabled,
    refetchOnWindowFocus: false,
  })
}
