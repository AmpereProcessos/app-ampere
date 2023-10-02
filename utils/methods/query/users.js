import axios from 'axios'
import { useQuery } from 'react-query'

async function fetchUsers() {
  try {
    const { data } = await axios.get('/api/auth/user')
    return data
  } catch (error) {
    throw error
  }
}

export function useUsers({ enabled }) {
  return useQuery({
    queryKey: ['users-simplified'],
    queryFn: fetchUsers,
    enabled: !!enabled,
  })
}
