import { TEmployeeDTO, TUserDTO } from '@/utils/schemas/users'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

async function fetchUsers() {
  try {
    const { data } = await axios.get('/api/usuarios')
    return data.data as TUserDTO[]
  } catch (error) {
    throw error
  }
}
export function useUsers() {
  return useQuery({
    queryKey: ['users-simplified'],
    queryFn: fetchUsers,
  })
}
async function fetchUserById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/usuarios?id=${id}`)
    return data.data as TUserDTO
  } catch (error) {}
}
export function useUserById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['user-by-id', id],
    queryFn: async () => await fetchUserById({ id }),
  })
}
async function fetchEmployees({ active }: { active: boolean }) {
  try {
    const { data } = await axios.get(`/api/colaboradores?active=${active}`)
    return data.data as TEmployeeDTO[]
  } catch (error) {
    throw error
  }
}

export function useEmployees({ active }: { active: boolean }) {
  const [filters, setFilters] = useState({
    search: '',
  })

  function matchSearch(employee: TEmployeeDTO) {
    if (filters.search.trim().length == 0) return true
    return employee.nome.toUpperCase().includes(filters.search.toUpperCase())
  }
  function handleModelData(data: TEmployeeDTO[]) {
    var modeledData = data
    return modeledData.filter((employee) => matchSearch(employee))
  }
  return {
    ...useQuery({
      queryKey: ['employees', active],
      queryFn: async () => await fetchEmployees({ active }),
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
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
