import { TPurchaseControl, TPurchaseControlTag } from '@/utils/schemas/purchases'
import axios from 'axios'

export async function createPurchaseControl(info: TPurchaseControl) {
  try {
    const { data } = await axios.post('/api/controles-compras', info)
    if (typeof data.message != 'string') return 'Controle de compra criado com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}

export async function updatePurchaseControl({ id, changes }: { id: string; changes: Partial<TPurchaseControl> }) {
  try {
    const { data } = await axios.put(`/api/controles-compras?id=${id}`, changes)
    if (typeof data.message != 'string') return 'Controle de compra criado com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}

export async function createPurchaseControlTag(info: TPurchaseControlTag) {
  try {
    const { data } = await axios.post('/api/controles-compras/tags', info)
    if (typeof data.message != 'string') return 'Etiqueta de controle de compra criado com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}
