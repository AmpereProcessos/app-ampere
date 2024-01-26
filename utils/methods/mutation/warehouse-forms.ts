import { TNewWarehouseFormulary } from '@/utils/schemas/warehouse-formularies'
import axios from 'axios'

export async function createStockFormulary({ info, mode }: { info: TNewWarehouseFormulary; mode: 'id' | 'message' }) {
  try {
    const { data } = await axios.post('/api/almoxarifado/formularios', info)
    if (mode == 'id') return data.data.insertedId
    if (typeof data.message != 'string') return 'Formulário criado com sucesso!'
    return data.message
  } catch (error) {
    throw error
  }
}

export async function updateWarehouseFormulary({ id, changes }: { id: string; changes: Partial<TNewWarehouseFormulary> }) {
  try {
    const { data } = await axios.put(`/api/almoxarifado/formularios/test?id=${id}`, changes)
    if (typeof data.message != 'string') return 'Formulário atualizado com sucesso !'
    return data.message
  } catch (error) {
    throw error
  }
}
