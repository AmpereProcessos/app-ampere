import { TCreditorDTO } from '@/utils/schemas/crm/utils'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

async function fetchCreditors() {
  try {
    const { data } = await axios.get(`/api/crm/utils?identifier=CREDITOR`)
    return data.data as TCreditorDTO[]
  } catch (error) {
    throw error
  }
}

export function useCreditors() {
  return useQuery({ queryKey: ['creditors'], queryFn: fetchCreditors })
}
