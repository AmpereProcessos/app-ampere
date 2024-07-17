import { TTechnicalAnalysis, TTechnicalAnalysisDTO } from '@/utils/schemas/technical-analysis'
import axios from 'axios'

export async function createTechnicalAnalysis({ info, returnId }: { info: TTechnicalAnalysis; returnId?: boolean }) {
  try {
    const { data } = await axios.post('/api/analises-tecnicas', info)
    if (returnId) return data.data?.insertedId as string
    if (typeof data.message != 'string') return 'Análise criada com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}

export async function editTechnicalAnalysis({ id, changes }: { id: string; changes: Partial<TTechnicalAnalysisDTO> }) {
  try {
    const { data } = await axios.put(`/api/analises-tecnicas?id=${id}`, changes)
    if (typeof data.message != 'string') return 'Análise técnica atualizada com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}
