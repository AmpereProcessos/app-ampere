import { TEmployee } from '@/utils/schemas/users'
import axios from 'axios'

export async function createEmployee({ info }: { info: TEmployee }) {
  try {
    const { data } = await axios.post('/api/colaboradores', info)
    if (typeof data.message != 'string') return 'Colaborador atualizado com sucesso !'
    return data.message
  } catch (error) {
    throw error
  }
}

export async function updateEmployee({ id, changes }: { id: string; changes: Partial<TEmployee> }) {
  try {
    const { data } = await axios.put(`/api/colaboradores?id=${id}`, changes)
    if (typeof data.message != 'string') return 'Colaborador atualizado com sucesso !'
    return data.message
  } catch (error) {
    throw error
  }
}
