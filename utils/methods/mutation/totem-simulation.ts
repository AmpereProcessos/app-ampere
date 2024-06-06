import { TTotemSimulation } from '@/utils/schemas/totem-simulation'
import axios from 'axios'

export async function createTotemSimulation({ simulation }: { simulation: TTotemSimulation }) {
  try {
    const { data } = await axios.post('/api/totem-simulacoes', simulation)
    return 'Simulação concluída com sucesso !'
  } catch (error) {
    throw error
  }
}
