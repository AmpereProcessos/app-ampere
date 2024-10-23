import { TUserDTO, TUserDTOSimplified, TUserDTOWithSaleGoals } from '@/utils/schemas/crm/users.schema'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

async function fetchUsers() {
  try {
    const { data } = await axios.get(`/api/crm/users`)
    return data.data as TUserDTO[]
  } catch (error) {
    throw error
  }
}
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}
async function fetchUserById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/crm/users?id=${id}`)
    return data.data as TUserDTO
  } catch (error) {
    throw error
  }
}

type UseUserByIdParams = {
  id: string
}
export function useUserById({ id }: UseUserByIdParams) {
  return useQuery({
    queryKey: ['user-by-id', id],
    queryFn: async () => await fetchUserById({ id }),
  })
}

async function fetchOpportunityCreators() {
  try {
    const { data } = await axios.get('/api/crm/users/personalized?type=opportunity-creators')
    return data.data as TUserDTOSimplified[]
  } catch (error) {
    throw error
  }
}
export function useOpportunityCreators() {
  return useQuery({
    queryKey: ['opportunity-creators'],
    queryFn: fetchOpportunityCreators,
  })
}
async function fetchTechnicalAnalysis() {
  try {
    const { data } = await axios.get('/api/crm/users/personalized?type=technical-analysts')
    return data.data as TUserDTOSimplified[]
  } catch (error) {
    throw error
  }
}
export function useTechnicalAnalysts() {
  return useQuery({
    queryKey: ['technical-analysts'],
    queryFn: fetchTechnicalAnalysis,
  })
}
async function fetchLeadReceivers() {
  try {
    const { data } = await axios.get('/api/crm/users/personalized?type=lead-receivers')
    return data.data as TUserDTOSimplified[]
  } catch (error) {
    throw error
  }
}
export function useLeadReceivers() {
  return useQuery({
    queryKey: ['lead-receivers'],
    queryFn: fetchLeadReceivers,
  })
}
async function fetchSalePromoters() {
  try {
    const { data } = await axios.get(`/api/management/sale-promoters`)
    return data.data as TUserDTOWithSaleGoals[]
  } catch (error) {
    throw error
  }
}
export function useSalePromoters() {
  return useQuery({
    queryKey: ['sale-promoters'],
    queryFn: fetchSalePromoters,
  })
}
