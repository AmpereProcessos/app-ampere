import { TEmployee, TUser, TUserDTO } from '@/utils/schemas/users'
import axios from 'axios'

export async function createUser({ info }: { info: TEmployee }) {
  try {
    const { data } = await axios.post('/api/usuarios', info)
    if (typeof data.message != 'string') return 'Usuário criado com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}

export async function updateUser({ id, changes }: { id: string; changes: Partial<TUserDTO> }) {
  try {
    const { data } = await axios.put(`/api/usuarios?id=${id}`, changes)
    if (typeof data.message != 'string') return 'Usuário criado com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}
