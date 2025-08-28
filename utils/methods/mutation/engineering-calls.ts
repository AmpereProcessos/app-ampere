import {
  TCreateEngineeringCallInput,
  TCreateEngineeringCallOutput,
  TUpdateEngineeringCallInput,
  TUpdateEngineeringCallOutput,
} from '@/pages/api/chamados/projetos'
import axios from 'axios'

export async function createEngineeringCall({ info }: { info: TCreateEngineeringCallInput }) {
  const { data } = await axios.post<TCreateEngineeringCallOutput>('/api/chamados/projetos', info)
  return data
}

export async function updateEngineeringCall({ info }: { info: TUpdateEngineeringCallInput }) {
  const { data } = await axios.put<TUpdateEngineeringCallOutput>('/api/chamados/projetos', info)
  return data
}
