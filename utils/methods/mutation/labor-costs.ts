import type { TCreateLaborCostConfigurationOutput } from '@/pages/api/configuracoes/custos-mao-de-obra'
import type { TExpenseDTO } from '@/utils/schemas/expenses'
import type { TUpsertLaborCostConfiguration } from '@/utils/schemas/labor-costs'
import axios from 'axios'

export async function createLaborCostConfiguration(input: TUpsertLaborCostConfiguration) {
  const { data } = await axios.post<TCreateLaborCostConfigurationOutput>('/api/configuracoes/custos-mao-de-obra', input)
  return data
}

export async function updateLaborCostConfiguration({ id, configuration }: { id: string; configuration: TUpsertLaborCostConfiguration }) {
  const { data } = await axios.put<TCreateLaborCostConfigurationOutput>('/api/configuracoes/custos-mao-de-obra', { id, configuration })
  return data
}

export type TLaborCostActionInput =
  | { acao: 'RECALCULAR'; serviceOrderId: string }
  | {
      acao: 'SALVAR_MANUAL'
      serviceOrderId: string
      natureza: 'APROPRIACAO_INTERNA' | 'SERVICO_TERCEIRO'
      valor: number
      motivo: string
    }
  | {
      acao: 'CONFIRMAR'
      serviceOrderId: string
      valorFinal?: number | null
      motivoAjuste?: string | null
    }
  | { acao: 'REABRIR'; serviceOrderId: string }
  | { acao: 'EXCLUIR'; serviceOrderId: string }

export async function mutateLaborCostExpense(input: TLaborCostActionInput) {
  const { data } = await axios.post<{
    data: TExpenseDTO | { status: string; expense: TExpenseDTO | null; message?: string }
    message: string
  }>('/api/ordensDeServico/custos/mao-de-obra', input)
  return data
}
