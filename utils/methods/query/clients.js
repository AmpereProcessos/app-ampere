import axios from 'axios'
import { useQuery } from 'react-query'

export async function fetchClients() {
  const { data } = await axios.get('/api/projects/todos')
  if (!data) return []
  if (!Array.isArray(data)) return []
  return data
}

export function useClients(enabled) {
  return useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    refetchOnWindowFocus: false,
    enabled: !!enabled,
  })
}
async function fetchClientById({ id }) {
  try {
    const { data } = await axios.get(`/api/projects/fetchDoc/${id}`)
    return data[0]
  } catch (error) {
    throw error
  }
}
export function useClientById({ enabled, id }) {
  return useQuery({
    queryKey: ['project-by-id', id],
    queryFn: async () => await fetchClientById({ id }),
    enabled: !!enabled,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}
