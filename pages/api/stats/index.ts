import { NextApiHandler } from 'next'
import connectToDatabase from '../../../utils/services/mongodb/projects'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { Session } from 'next-auth'
import { Collection, Db, MatchKeysAndValues } from 'mongodb'
import { TProject } from '@/utils/schemas/projects'
import { getFirstDayOfMonth, getFirstDayOfYearString } from '@/utils/methods/dates'
import { TDashboardStats } from '@/utils/schemas/stats'

function getQueryByVisualization(session: Session) {
  const visualization = session.user.visualizacao.tipo
  const seller = session.user.visualizacao.referencia

  if (visualization == 'VENDAS') return { 'vendedor.nome': seller }
  return {}
}

type GetResponse = TDashboardStats
const getStats: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  // const visualization = null
  const partialQuery = getQueryByVisualization(session)
  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TProject> = db.collection('dados')

  const installationStats = await getInstallationStats({ collection: collection, partialQuery: partialQuery })
  const homologationStats = await getHomologationStats({ collection: collection, partialQuery: partialQuery })
  const supplyStats = await getSupplyStats({ collection: collection, partialQuery: partialQuery })
  const salesRanking = await getSalesRanking({ collection: collection, partialQuery: partialQuery })
  const nps = await getNPS({ collection: collection, partialQuery: partialQuery })
  const powerSold = await getAchievedPowerSale({ collection, partialQuery: partialQuery })
  const stats: TDashboardStats = {
    instalacao: installationStats,
    homologacao: homologationStats,
    suprimentos: supplyStats,
    ranking: salesRanking,
    potenciaMeta: powerSold,
    nps: nps,
  }
  res.status(200).json(stats)
}

type GetStats = {
  collection: Collection<TProject>
  partialQuery: any
}
async function getInstallationStats({ collection, partialQuery }: GetStats) {
  try {
    const installationStats = await collection
      .aggregate([
        {
          $match: {
            ...partialQuery,
            'contrato.status': 'ASSINADO',
            tipoDeServico: { $ne: 'OPERAÇÃO E MANUTENÇÃO' },
            'obra.saida': { $ne: '-' },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: { $dateFromString: { dateString: '$obra.saida' } },
              },
              mes: {
                $month: { $dateFromString: { dateString: '$obra.saida' } },
              },
            },
            total: {
              $sum: '$sistema.potPico',
            },
            count: { $count: {} },
          },
        },
        {
          $sort: {
            '_id.ano': -1,
            '_id.mes': -1,
          },
        },
        {
          $limit: 5,
        },
      ])
      .toArray()
    const obj = {
      _id: {
        ano: 2024,
        mes: 1,
      },
      total: 61.96,
      count: 12,
    }
    return {
      anterior: {
        identificador: `${installationStats[1]?._id.mes}/${installationStats[1]?._id.ano}`,
        valor: installationStats[1]?.total as number,
        contagem: installationStats[1]?.count as number,
      },
      atual: {
        identificador: `${installationStats[0]?._id.mes}/${installationStats[0]?._id.ano}`,
        valor: installationStats[0]?.total as number,
        contagem: installationStats[0]?.count as number,
      },
    }
  } catch (error) {
    throw error
  }
}
async function getHomologationStats({ collection, partialQuery }: GetStats) {
  try {
    const homologationStats = await collection
      .aggregate([
        {
          $match: {
            ...partialQuery,
            'contrato.status': { $ne: 'RESCISÃO DE CONTRATO' },
            tipoDeServico: { $ne: 'OPERAÇÃO E MANUTENÇÃO' },
            'parecer.statusDoParecerDeAcesso': { $ne: 'CANCELADO' },
            'obra.saida': { $ne: '-' },
            'obra.statusDaObra': { $ne: 'OBRA CANCELADA' },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: {
                  $dateFromString: {
                    dateString: '$parecer.dataParecerDeAcesso',
                  },
                },
              },
              mes: {
                $month: {
                  $dateFromString: {
                    dateString: '$parecer.dataParecerDeAcesso',
                  },
                },
              },
            },
            tempoMedio: {
              $avg: {
                $dateDiff: {
                  startDate: {
                    $dateFromString: {
                      dateString: '$projeto.dataAssDocumentacao',
                    },
                  },
                  endDate: {
                    $dateFromString: {
                      dateString: '$parecer.dataParecerDeAcesso',
                    },
                  },
                  unit: 'day',
                },
              },
            },
            potencia: { $sum: '$sistema.potPico' },
          },
        },
        {
          $sort: {
            '_id.ano': -1,
            '_id.mes': -1,
          },
        },
        {
          $limit: 5,
        },
      ])
      .toArray()
    return {
      anterior: {
        identificador: `${homologationStats[1]?._id.mes}/${homologationStats[1]?._id.ano}`,
        tempoMedio: homologationStats[1]?.tempoMedio as number,
        potencia: homologationStats[1]?.potencia as number,
      },
      atual: {
        identificador: `${homologationStats[0]?._id.mes}/${homologationStats[0]?._id.ano}`,
        tempoMedio: homologationStats[0]?.tempoMedio as number,
        potencia: homologationStats[0]?.potencia as number,
      },
    }
  } catch (error) {
    throw error
  }
}
async function getSupplyStats({ collection, partialQuery }: GetStats) {
  try {
    const supplyStats = await collection
      .aggregate([
        {
          $match: {
            ...partialQuery,
            'contrato.status': 'ASSINADO',
            tipoDeServico: { $ne: 'OPERAÇÃO E MANUTENÇÃO' },
            'obra.statusDaObra': { $ne: 'OBRA CANCELADA' },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: {
                  $dateFromString: {
                    dateString: '$compra.dataPedido',
                  },
                },
              },
              mes: {
                $month: {
                  $dateFromString: {
                    dateString: '$compra.dataPedido',
                  },
                },
              },
            },
            tempoMedio: {
              $avg: {
                $dateDiff: {
                  startDate: {
                    $dateFromString: {
                      dateString: '$compra.dataLiberacao',
                    },
                  },
                  endDate: {
                    $dateFromString: {
                      dateString: '$compra.dataPedido',
                    },
                  },
                  unit: 'day',
                },
              },
            },
          },
        },
        {
          $sort: {
            '_id.ano': -1,
            '_id.mes': -1,
          },
        },
        {
          $match: {
            '_id.ano': { $gte: 2021 },
          },
        },
        {
          $limit: 5,
        },
      ])
      .toArray()
    const obj = {
      _id: {
        ano: 2024,
        mes: 1,
      },
      tempoMedio: 30,
    }
    return {
      anterior: {
        identificador: `${supplyStats[1]?._id.mes}/${supplyStats[1]?._id.ano}`,
        tempoMedio: supplyStats[1]?.tempoMedio as number,
      },
      atual: {
        identificador: `${supplyStats[0]?._id.mes}/${supplyStats[0]?._id.ano}`,
        tempoMedio: supplyStats[0]?.tempoMedio as number,
      },
    }
  } catch (error) {
    throw error
  }
}
async function getSalesRanking({ collection, partialQuery }: GetStats) {
  const firstDayString = getFirstDayOfMonth({})
  console.log(firstDayString)
  try {
    const ranking = await collection
      .aggregate([
        {
          $match: {
            'contrato.dataAssinatura': { $gte: firstDayString },
            tipoDeServico: 'SISTEMA FOTOVOLTAICO',
          },
        },
        {
          $group: {
            _id: '$vendedor.nome',
            potencia: {
              $sum: '$sistema.potPico',
            },
          },
        },
        {
          $sort: {
            potencia: -1,
          },
        },
        {
          $limit: 5,
        },
      ])
      .toArray()
    return {
      primeiro: {
        nome: ranking[0]?._id as string,
        potencia: ranking[0]?.potencia as number,
      },
      segundo: {
        nome: ranking[1]?._id as string,
        potencia: ranking[1]?.potencia as number,
      },
      terceiro: {
        nome: ranking[2]?._id as string,
        potencia: ranking[2]?.potencia as number,
      },
      quarto: {
        nome: ranking[3]?._id as string,
        potencia: ranking[3]?.potencia as number,
      },
      quinto: {
        nome: ranking[4]?._id as string,
        potencia: ranking[4]?.potencia as number,
      },
    }
  } catch (error) {
    throw error
  }
}
async function getNPS({ collection, partialQuery }: GetStats) {
  try {
    let promotores = await collection
      .aggregate([
        {
          $match: {
            nps: { $gte: 9 },
          },
        },
        {
          $count: 'nps',
        },
      ])
      .toArray()
    let detratores = await collection
      .aggregate([
        {
          $match: {
            nps: { $lte: 6 },
          },
        },
        {
          $count: 'nps',
        },
      ])
      .toArray()
    let consultasTotais = await collection
      .aggregate([
        {
          $match: {
            $and: [{ nps: { $gte: 0 } }, { nps: { $lte: 10 } }],
          },
        },
        {
          $count: 'nps',
        },
      ])
      .toArray()
    var nps = ((promotores[0].nps - detratores[0].nps) * 100) / consultasTotais[0].nps
    return nps as number
  } catch (error) {
    throw error
  }
}
async function getAchievedPowerSale({ collection, partialQuery }: GetStats) {
  const firstDayString = getFirstDayOfMonth({})
  const powerAccumutated = await collection
    .aggregate([
      {
        $match: {
          'contrato.dataAssinatura': { $gte: firstDayString },
          tipoDeServico: 'SISTEMA FOTOVOLTAICO',
        },
      },
      {
        $group: {
          _id: {},
          sum: {
            $sum: '$sistema.potPico',
          },
        },
      },
    ])
    .toArray()
  const power = powerAccumutated[0].sum || 0
  return power
}

export default apiHandler({
  GET: getStats,
})
