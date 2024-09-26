import { TCreditCardOption } from '@/utils/schemas/credit-card-options'
import axios from 'axios'

export async function createCreditCardOption(option: TCreditCardOption) {
  try {
    const { data } = await axios.post('/api/utils/opcoes-cartoes-credito', option)
    if (typeof data.message != 'string') return 'Opção de cartão de crédito criada com sucesso!'
    return data.message as string
  } catch (error) {
    throw error
  }
}
export async function updateCreditCardOption({ id, changes }: { id: string; changes: TCreditCardOption }) {
  try {
    const { data } = await axios.put(`/api/utils/opcoes-cartoes-credito?id=${id}`, changes)
    if (typeof data.message != 'string') return 'Opção de cartão de crédito atualizada com sucesso!'
    return data.message as string
  } catch (error) {
    throw error
  }
}
