import axios from 'axios'
import { useQuery } from 'react-query'

export async function fetchOpenPPSCalls() {
  try {
    const { data } = await axios.get('/api/calls/pps/mainData?status=ABERTOS')
    return data
  } catch (error) {
    throw error
  }
}

export function useOpenPPSCalls(enabled) {
  return useQuery({
    queryKey: ['open-pps-calls'],
    queryFn: fetchOpenPPSCalls,
    enabled: !!enabled,
    refetchOnWindowFocus: true,
  })
}
export async function fetchClosedPPSCalls() {
  try {
    const { data } = await axios.get('/api/calls/pps/mainData?status=REALIZADOS')
    return data
  } catch (error) {
    throw error
  }
}

export function useClosedPPSCalls(enabled) {
  return useQuery({
    queryKey: ['closed-pps-calls'],
    queryFn: fetchClosedPPSCalls,
    enabled: !!enabled,
    refetchOnWindowFocus: true,
  })
}

export async function fetchPPSCall(id) {
  try {
    const { data } = await axios.get(`/api/calls/getPPS/${id}`)
    return data
  } catch (error) {
    throw error
  }
}
export function usePPSCall(id, enabled) {
  return useQuery({
    queryKey: ['pps-calls', id],
    queryFn: async () => await fetchPPSCall(id),
    enabled: !!enabled,
    refetchOnWindowFocus: false,
  })
}
