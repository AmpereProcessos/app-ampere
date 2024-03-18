import { TIndicationBody } from '@/pages/api/publico/indicacoes'
import axios from 'axios'

export async function createIndication({ indication }: { indication: TIndicationBody }) {
  try {
    const { data } = await axios.post('/api/publico/indicacoes', indication)
    if (typeof data.message != 'string') return 'Indicação criada com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}
