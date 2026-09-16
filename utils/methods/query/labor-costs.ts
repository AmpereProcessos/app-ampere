import type { TGetLaborCostConfigurationsOutput } from '@/pages/api/configuracoes/custos-mao-de-obra'
import type { TExpenseDTO } from '@/utils/schemas/expenses'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const laborCostConfigurationsQueryKey = ['labor-cost-configurations'] as const

export function useLaborCostConfigurations({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: laborCostConfigurationsQueryKey,
    queryFn: async () => {
      const { data } = await axios.get<TGetLaborCostConfigurationsOutput>('/api/configuracoes/custos-mao-de-obra')
      return data.data
    },
    enabled,
  })
}

export function laborCostExpenseQueryKey(serviceOrderId: string) {
  return ['service-order-labor-cost', serviceOrderId] as const
}

export function useLaborCostExpense({ serviceOrderId, enabled = true }: { serviceOrderId: string; enabled?: boolean }) {
  return useQuery({
    queryKey: laborCostExpenseQueryKey(serviceOrderId),
    queryFn: async () => {
      const { data } = await axios.get<{ data: TExpenseDTO | null }>('/api/ordensDeServico/custos/mao-de-obra', { params: { serviceOrderId } })
      return data.data
    },
    enabled: enabled && Boolean(serviceOrderId),
  })
}
