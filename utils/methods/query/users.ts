import { TEmployeeDTO } from '@/utils/schemas/users'
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

export function useUsers({ enabled }: { enabled: boolean }) {
  return useQuery({
    queryKey: ['users-simplified'],
    queryFn: fetchUsers,
    enabled: !!enabled,
  })
}

async function fetchEmployees() {
  try {
    const { data } = await axios.get('/api/colaboradores')
    return data.data as TEmployeeDTO[]
  } catch (error) {
    throw error
  }
}

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  })
}

async function fetchEmployeeById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/colaboradores?id=${id}`)
    return data.data as TEmployeeDTO
  } catch (error) {
    throw error
  }
}

export function useEmployeeById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['employee-by-id', id],
    queryFn: async () => fetchEmployeeById({ id }),
  })
}
