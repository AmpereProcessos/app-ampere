import { TAllocatorDTO } from '@/utils/schemas/allocators'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

async function fetchAllocators() {
  try {
    const { data } = await axios.get(`/api/almoxarifado/alocadores`)
    return data.data as TAllocatorDTO[]
  } catch (error) {
    throw error
  }
}

export function useAllocators() {
  return useQuery({ queryKey: ['allocators'], queryFn: fetchAllocators })
}

async function fetchAllocatorById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/almoxarifado/alocadores?id=${id}`)
    return data.data as TAllocatorDTO
  } catch (error) {
    throw error
  }
}

export function useAllocatorById({ id }: { id: string }) {
  return useQuery({ queryKey: ['allocator-by-id', id], queryFn: async () => await fetchAllocatorById({ id }) })
}
