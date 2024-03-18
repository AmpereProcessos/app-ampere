import { TSatisfactionSurveyAnswer } from '@/pages/api/publico/pesquisa-satiscacao'
import axios from 'axios'

export async function answerSatisfactionSurvey({ id, answer }: { id: string; answer: TSatisfactionSurveyAnswer }) {
  try {
    const { data } = await axios.put(`/api/publico/pesquisa-satiscacao?id=${id}`, answer)
    if (typeof data.message != 'string') return 'Pesquisa respondida com sucesso'
    return data.message
  } catch (error) {
    throw error
  }
}
