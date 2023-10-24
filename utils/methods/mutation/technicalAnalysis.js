import axios from 'axios'

export async function updateTechnicalAnalysis({ id, changes }) {
  try {
    const { data } = await axios.put(`/api/solicitacoes/analisesTecnicas?id=${id}`, { changes })
    if (typeof data != 'string') return 'Análise técnica atualizada com sucesso !'
    else return data
  } catch (error) {}
}
