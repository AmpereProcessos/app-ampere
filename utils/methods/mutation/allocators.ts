import { TAllocator, TAllocatorDTO } from '@/utils/schemas/allocators'
import axios from 'axios'
export async function createAllocator({ info }: { info: TAllocator }) {
  try {
    const { data } = await axios.post('/api/almoxarifado/alocadores', info)
    return data
  } catch (error) {
    throw error
  }
}

export async function updateAllocator({ id, changes }: { id: string; changes: Partial<TAllocatorDTO> }) {
  try {
    const { data } = await axios.put(`/api/almoxarifado/alocadores?id=${id}`, changes)
    return data
  } catch (error) {
    throw error
  }
}
