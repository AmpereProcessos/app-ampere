import { TNotification, TNotificationDTO } from '@/utils/schemas/notifications'
import axios from 'axios'
import { useQuery } from 'react-query'

async function fetchNotifications(id: string) {
  try {
    const { data } = await axios.get(`/api/notificacoes?recipientId=${id}`)
    return data.data as TNotificationDTO[]
  } catch (error) {
    throw error
  }
}

export function useNotifications({ id }: { id: string }) {
  return useQuery({
    queryKey: ['notifications', id],
    queryFn: async () => await fetchNotifications(id),
  })
}
