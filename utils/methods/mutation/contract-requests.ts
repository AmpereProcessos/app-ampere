import { TContractRequest } from '@/utils/schemas/contract-requests'
import axios from 'axios'

export async function editContractRequest({ id, changes }: { id: string; changes: Partial<TContractRequest> }) {
  try {
    const { data } = await axios.put(`/api/solicitacoes/contrato?id=${id}`, { ...changes })
    return 'Formulário atualizado com sucesso !'
  } catch (error) {
    throw error
  }
}
