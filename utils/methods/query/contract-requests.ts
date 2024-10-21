import { TContractRequestsByFiltersResult } from '@/pages/api/solicitacoes/contrato/search'
import { TContractRequestDTO, TContractRequestSimplifiedDTO, TContractRequestsQueryFilters } from '@/utils/schemas/contract-requests'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

async function fetchRequests() {
  try {
    const { data } = await axios.get('/api/solicitacoes/contrato')
    return data as TContractRequestSimplifiedDTO[]
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

  function matchSearch(request: TContractRequestSimplifiedDTO) {
    if (filters.search.trim().length == 0) return true
    return request.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchPendingApproval(request: TContractRequestSimplifiedDTO) {
    if (!filters.pendingApproval) return true
    return !request.aprovacao
  }
  function matchPendingConfection(request: TContractRequestSimplifiedDTO) {
    if (!filters.pendingConfection) return true
    return !!request.aprovacao && !request.confeccionado
  }
  function matchSeller(request: TContractRequestSimplifiedDTO) {
    if (filters.seller.length == 0) return true
    return filters.seller.includes(request.nomeVendedor || '')
  }
  function matchServiceType(request: TContractRequestSimplifiedDTO) {
    if (filters.serviceType.length == 0) return true
    return filters.serviceType.includes(request.tipoDeServico)
  }
  function handleModelData(data: TContractRequestSimplifiedDTO[]) {
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

async function fetchContractRequestsByFilter({ page, filters }: { page: number; filters: TContractRequestsQueryFilters }) {
  try {
    const { data } = await axios.post(`/api/solicitacoes/contrato/search?page=${page}`, filters)

    return data.data as TContractRequestsByFiltersResult
  } catch (error) {
    throw error
  }
}

export type TUseContractRequestsByFilters = { page: number } & TContractRequestsQueryFilters
export function useContractRequestsByFilters() {
  const [filters, setFilters] = useState<TUseContractRequestsByFilters>({
    page: 1,
    name: '',
    cpfCnpj: '',
    serviceTypes: [],
    ufs: [],
    cities: [],
    pendingApproval: false,
    pendingConfection: false,
  })
  function updateFilters(info: Partial<TUseContractRequestsByFilters>) {
    setFilters((prev) => ({ ...prev, ...info }))
  }

  const query = useQuery({
    queryKey: ['contract-requests-by-filters', filters],
    queryFn: async () => await fetchContractRequestsByFilter({ page: filters.page, filters }),
  })

  return {
    ...query,
    filters,
    updateFilters,
  }
}
