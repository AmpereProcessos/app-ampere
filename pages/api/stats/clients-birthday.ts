import { NextApiHandler } from 'next'
import connectToDatabase from '../../../utils/services/mongodb/projects'
import { getFirstDayOfMonth, getLastDayOfMonth } from '@/utils/methods/dates'
import { Collection, Db } from 'mongodb'
import { TProject } from '@/utils/schemas/projects'
import { TBirthdayRecord } from '@/utils/schemas/stats'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import type { TAuthSession } from '@/lib/authentication/types'

function getQueryByVisualization(session: TAuthSession) {
  const visualization = session.user.visualizacao.tipo
  const seller = session.user.visualizacao.referencia
  if (visualization == 'VENDAS') return { 'vendedor.nome': seller }
  return {}
}
type GetResponse = TBirthdayRecord[]
const getClientsBirthDays: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const partialQuery = getQueryByVisualization(session)

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TProject> = db.collection('dados')

  const birthdays = await getBirthDays({ collection, partialQuery })
  res.status(200).json(birthdays)
}

type GetBirthDaysParams = {
  collection: Collection<TProject>
  partialQuery: any
}
async function getBirthDays({ collection, partialQuery }: GetBirthDaysParams) {
  const currentMonth = new Date().getMonth() + 1
  try {
    const clients = await collection
      .aggregate([
        {
          $match: {
            ...partialQuery,
            dataNascimento: { $ne: '-' },
            tipoDeServico: { $ne: 'OPERAÇÃO E MANUTENÇÃO' },
          },
        },
        {
          $project: {
            nomeDoContrato: 1,
            dataNascimento: 1,
            data: {
              ano: {
                $year: { $dateFromString: { dateString: '$dataNascimento' } },
              },
              mes: {
                $month: { $dateFromString: { dateString: '$dataNascimento' } },
              },
            },
          },
        },
        {
          $match: {
            'data.mes': Number(currentMonth),
          },
        },
      ])
      .toArray()

    const birthdays = clients.map((client) => ({ nome: client.nomeDoContrato, dataNascimento: client.dataNascimento as string }))
    return birthdays
  } catch (error) {
    throw error
  }
}

export default apiHandler({ GET: getClientsBirthDays })
