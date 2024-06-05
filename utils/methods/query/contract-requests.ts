import { TContractRequestDTO, TContractRequestPartialDTO } from '@/utils/schemas/contract-requests'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

async function fetchRequests() {
  try {
    const { data } = await axios.get('/api/solicitacoes/contrato')
    return data as TContractRequestPartialDTO[]
  } catch (error) {
    throw error
  }
}

type UseContractRequestsFilters = {
  search: string
  pendingApproval: boolean
  pendingConfection: boolean
  seller: string[]
  serviceType: string[]
}
export function useContractRequests() {
  const [filters, setFilters] = useState<UseContractRequestsFilters>({
    search: '',
    pendingApproval: false,
    pendingConfection: false,
    seller: [],
    serviceType: [],
  })

  function matchSearch(request: TContractRequestPartialDTO) {
    if (filters.search.trim().length == 0) return true
    return request.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchPendingApproval(request: TContractRequestPartialDTO) {
    if (!filters.pendingApproval) return true
    return !request.aprovacao
  }
  function matchPendingConfection(request: TContractRequestPartialDTO) {
    if (!filters.pendingConfection) return true
    return !!request.aprovacao && !request.confeccionado
  }
  function matchSeller(request: TContractRequestPartialDTO) {
    if (filters.seller.length == 0) return true
    return filters.seller.includes(request.nomeVendedor || '')
  }
  function matchServiceType(request: TContractRequestPartialDTO) {
    if (filters.serviceType.length == 0) return true
    return filters.serviceType.includes(request.tipoDeServico)
  }
  function handleModelData(data: TContractRequestPartialDTO[]) {
    var modeledData = data
    return modeledData.filter(
      (request) =>
        matchSearch(request) && matchPendingApproval(request) && matchPendingConfection(request) && matchSeller(request) && matchServiceType(request)
    )
  }
  return {
    ...useQuery({
      queryKey: ['contract-requests'],
      queryFn: fetchRequests,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}

async function fetchRequestById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/solicitacoes/contrato?id=${id}`)
    return data as TContractRequestDTO
  } catch (error) {}
}

export function useContractRequestById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['contract-request-by-id', id],
    queryFn: async () => await fetchRequestById({ id }),
  })
}
