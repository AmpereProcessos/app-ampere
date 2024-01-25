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
