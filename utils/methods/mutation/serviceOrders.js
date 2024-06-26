import axios from 'axios'
import { getErrorMessage } from '../handlers'

export async function createServiceOrder({ info, invalidateKey, queryClient }) {
  try {
    const { data } = await axios.post('/api/ordensDeServico', info)
    await queryClient.invalidateQueries({ queryKey: invalidateKey })
    if (data) return 'Ordem criada com sucesso !'
    return undefined
  } catch (error) {
    throw error
  }
}
export async function updateServiceOrder({ info, orderId, invalidateKey, queryClient }) {
  try {
    const { data } = await axios.put(`/api/ordensDeServico?id=${orderId}`, info)
    await queryClient.invalidateQueries({ queryKey: invalidateKey })
    if (data) return 'Ordem atualizada com sucesso !'
    return undefined
  } catch (error) {
    throw error
  }
}

export async function deleteServiceOrder({ id }) {
  try {
    const { data } = await axios.delete(`/api/ordensDeServico?id=${id}`)
    if (typeof data.message != 'string') return 'Ordem de serviço excluída com sucesso !'
    return data.message
  } catch (error) {
    throw error
  }
}
