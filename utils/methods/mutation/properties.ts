import { TProperty } from '@/utils/schemas/properties'
import axios from 'axios'

export async function createProperty({ info }: { info: TProperty }) {
  try {
    const { data } = await axios.post('/api/propriedades', info)
    if (typeof data.message != 'string') return 'Propriedade criada com sucesso !'
    return data.message
  } catch (error) {
    throw error
  }
}

export async function updateProperty({ id, changes }: { id: string; changes: Partial<TProperty> }) {
  try {
    const { data } = await axios.put(`/api/propriedades?id=${id}`, changes)
    if (typeof data.message != 'string') return 'Atualização feita com sucesso !'
    return data.message
  } catch (error) {
    throw error
  }
}
