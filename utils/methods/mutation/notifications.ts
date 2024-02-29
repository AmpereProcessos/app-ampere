import { TNotification, TNotificationDTO } from '@/utils/schemas/notifications'
import axios from 'axios'

export async function createNotification({ info }: { info: TNotification }) {
  try {
    const { data } = await axios.post('/api/notificacoes', info)
    if (typeof data.message != 'string') return 'Notificação criada com sucesso !'
    return data.message
  } catch (error) {
    throw error
  }
}

export async function editNotification({ id, changes }: { id: string; changes: Partial<TNotificationDTO> }) {
  try {
    const { data } = await axios.put(`/api/notificacoes?id=${id}`, changes)
    if (typeof data.message != 'string') return 'Notificação atualizada com sucesso !'
    return data.message
  } catch (error) {
    throw error
  }
}
