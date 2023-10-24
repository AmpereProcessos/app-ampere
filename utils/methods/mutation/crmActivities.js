import axios from 'axios'
import dayjs from 'dayjs'

export async function createActivityFromTechAnalysys({ activity, project, author, responsible }) {
  const oneDayUpDate = dayjs().add('1', 'day').toISOString()
  const insertObject = {
    projeto: project,
    responsavel: responsible,
    titulo: activity,
    categoria: 'ATIVIDADE',
    tipo: 'ANÁLISE TÉCNICA',
    dataVencimento: oneDayUpDate,
    observacoes: '',
    autor: author,
    dataInsercao: new Date().toISOString(),
  }
  try {
    const { data } = await axios.post('/api/crm/activities', insertObject)
    return 'Atividade criada !'
  } catch (error) {
    throw error
  }
}
