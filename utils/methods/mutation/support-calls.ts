import { TCreateSupportCallInput, TCreateSupportCallOutput, TUpdateSupportCallInput, TUpdateSupportCallOutput } from '@/pages/api/chamados/suporte'
import axios from 'axios'

export async function createSupportCall({ info }: { info: TCreateSupportCallInput }) {
  const { data } = await axios.post<TCreateSupportCallOutput>('/api/chamados/suporte', info)
  return data
}
export async function updateSupportCall({ info }: { info: TUpdateSupportCallInput }) {
  const { data } = await axios.put<TUpdateSupportCallOutput>(`/api/chamados/suporte?id=${info.id}`, info)
  return data
}
