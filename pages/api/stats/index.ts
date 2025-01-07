import { NextApiHandler } from 'next'
import connectToDatabase from '../../../utils/services/mongodb/projects'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { Session } from 'next-auth'
import { Collection, Db, MatchKeysAndValues, ObjectId } from 'mongodb'
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
  const goals = await getCompanyGoalsStats({ collection, partialQuery: {} })
  const stats: TDashboardStats = {
    instalacao: installationStats,
    homologacao: homologationStats,
    suprimentos: supplyStats,
    ranking: salesRanking,
    meta: goals,
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
            'homologacao.status': { $ne: 'CANCELADO' },
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
                    dateString: '$homologacao.acesso.dataResposta',
                  },
                },
              },
              mes: {
                $month: {
                  $dateFromString: {
                    dateString: '$homologacao.acesso.dataResposta',
                  },
                },
              },
            },
            tempoMedio: {
              $avg: {
                $dateDiff: {
                  startDate: {
                    $dateFromString: {
                      dateString: '$homologacao.dataLiberacao',
                    },
                  },
                  endDate: {
                    $dateFromString: {
                      dateString: '$homologacao.acesso.dataResposta',
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
            tipoDeServico: { $in: ['SISTEMA FOTOVOLTAICO', 'AUMENTO DE SISTEMA FOTOVOLTAICO'] },
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
          tipoDeServico: { $in: ['SISTEMA FOTOVOLTAICO', 'AUMENTO DE SISTEMA FOTOVOLTAICO'] },
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
  const power = powerAccumutated[0]?.sum || 0
  return power
}

export async function getCompanyGoalsStats({ collection, partialQuery }: GetStats) {
  const GOAL_INITIAL_DATE_PARAM = '2024-07-01T00:00:00.000Z'
  const GOAL_INITIAL_DATE_CONSORTIUM_PARAM = '2024-06-01T00:00:00.000Z'
  // Define queries for all company goals
  // 1 - Sistema Fotovoltaico + Aumento - R$ 5.000.000,00 geral /  R$ 833.333,33/mes (contando a partir de 01/07 )
  // 2 - O&M + Montagem e Desmontagem - R$ 90.000,00 geral /  R$ 15.000,00/mes (contando a partir de 01/07 )
  // 3 - Inside Sales (somente OUTBOUND) - R$ 700.000,00 geral / R$ 83.333,33/mes (contando a partir de 01/07)
  // 4 - Seguro Solar - R$ 12.000,00 geral / R$ 2.000,00/mes (contando a partir de 01/07)
  // 4 - Consórcio de Energia - R$ 150.000,00 geral / R$ 25.000,00/mes (contando a partir de 01/07)

  // SISTEMA FOTOVOLTAICO
  const solarPowerPlants = await collection
    .aggregate([
      {
        $match: {
          'contrato.dataAssinatura': { $gte: GOAL_INITIAL_DATE_PARAM, $lte: '2024-12-31T23:59:59.999Z' },
          tipoDeServico: { $in: ['SISTEMA FOTOVOLTAICO', 'AUMENTO DE SISTEMA FOTOVOLTAICO'] },
        },
      },
      {
        $group: {
          _id: '$vendedor.nome',
          valorProjeto: {
            $sum: '$sistema.valorProjeto',
          },
          valorPadrao: {
            $sum: '$padrao.valor',
          },
          valorEstrutura: {
            $sum: '$estruturaPersonalizada.valor',
          },
        },
      },
    ])
    .toArray()
  const SISTEMA_FOTOVOLTAICO = solarPowerPlants.reduce(
    (acc: { total: number; porVendedor: { [key: string]: number } }, current) => {
      const currentTotal = current.valorProjeto + current.valorPadrao + current.valorEstrutura
      const currentSeller = current._id as string
      if (!acc.porVendedor[currentSeller]) acc.porVendedor[currentSeller] = 0

      acc.porVendedor[currentSeller] += currentTotal
      acc.total += currentTotal
      return acc
    },
    { total: 0, porVendedor: {} }
  )
  // O&M + MONTAGEM DESMONTAGEM
  const maintenance = await collection
    .aggregate([
      {
        $match: {
          _id: { $ne: new ObjectId('66981e5340f27828dd49a6cb') },
          'contrato.dataAssinatura': { $gte: GOAL_INITIAL_DATE_PARAM },
          tipoDeServico: {
            $in: [
              'OPERAÇÃO E MANUTENÇÃO',
              'MONTAGEM E DESMONTAGEM',
              'PRODUTOS',
              'MANUTENÇÃO CORRETIVA',
              'PRODUTOS E SERVIÇOS AVULSOS',
              'MONITORAMENTO',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$vendedor.nome',
          valorProjeto: {
            $sum: '$sistema.valorProjeto',
          },
          valorPadrao: {
            $sum: '$padrao.valor',
          },
          valorEstrutura: {
            $sum: '$estruturaPersonalizada.valor',
          },
        },
      },
    ])
    .toArray()
  const OEM_MONTAGEM_DESMONTAGEM = maintenance.reduce(
    (acc: { total: number; porVendedor: { [key: string]: number } }, current) => {
      const currentTotal = current.valorProjeto + current.valorPadrao + current.valorEstrutura
      const currentSeller = current._id as string
      if (!acc.porVendedor[currentSeller]) acc.porVendedor[currentSeller] = 0

      acc.porVendedor[currentSeller] += currentTotal
      acc.total += currentTotal
      return acc
    },
    { total: 0, porVendedor: {} }
  )

  // INSIDE SALES
  // TODO: utilizar dos responsáveis do CRM para atualizar o campo de INSIDER dos projetos
  // TODO: utilizar do campo de idOportunidade do CRM para demarcar vendas por INBOUND marketing
  const insideSales = await collection
    .aggregate([
      {
        $match: {
          idMarketing: null,
          'contrato.dataAssinatura': { $gte: '2024-07-01T00:00:00.000Z' },
          $or: [
            { insider: { $nin: [null, 'NÃO DEFINIDO'] } },
            { 'vendedor.nome': { $in: ['ALESSANDER IDALECIO', 'LAYANE FERNANDA', 'AMANDA SANTOS'] } },
          ],
        },
      },
      {
        $group: {
          _id: {
            vendedor: '$vendedor.nome',
            insider: '$insider',
          },
          valorProjeto: {
            $sum: '$sistema.valorProjeto',
          },
          valorPadrao: {
            $sum: '$padrao.valor',
          },
          valorEstrutura: {
            $sum: '$estruturaPersonalizada.valor',
          },
        },
      },
    ])
    .toArray()
  const INSIDE_SALES = insideSales.reduce(
    (acc: { total: number; porVendedor: { [key: string]: number } }, current) => {
      const currentTotal = current.valorProjeto + current.valorPadrao + current.valorEstrutura
      const currentInsider = current._id.insider as string
      const currentSeller = current._id.vendedor as string
      const currentReference = currentInsider || currentSeller
      if (!acc.porVendedor[currentReference]) acc.porVendedor[currentReference] = 0

      acc.porVendedor[currentReference] += currentTotal
      acc.total += currentTotal
      return acc
    },
    { total: 0, porVendedor: {} }
  )

  // SEGURO
  const insurance = await collection
    .aggregate([
      {
        $match: {
          'contrato.dataAssinatura': { $gte: '2024-07-01T00:00:00.000Z' },
          tipoDeServico: 'SEGURO DE SISTEMA FOTOVOLTAICO',
        },
      },
      {
        $group: {
          _id: '$vendedor.nome',
          valorProjeto: {
            $sum: '$sistema.valorProjeto',
          },
          valorPadrao: {
            $sum: '$padrao.valor',
          },
          valorEstrutura: {
            $sum: '$estruturaPersonalizada.valor',
          },
        },
      },
    ])
    .toArray()
  const SEGURO_FOTOVOLTAICO = insurance.reduce(
    (acc: { total: number; porVendedor: { [key: string]: number } }, current) => {
      const currentTotal = current.valorProjeto + current.valorPadrao + current.valorEstrutura
      const currentSeller = current._id as string
      if (!acc.porVendedor[currentSeller]) acc.porVendedor[currentSeller] = 0

      acc.porVendedor[currentSeller] += currentTotal
      acc.total += currentTotal
      return acc
    },
    { total: 0, porVendedor: {} }
  )
  // CONSÓRCIO DE ENERGIA
  const energyConsortium = await collection
    .aggregate([
      {
        $match: {
          'contrato.dataAssinatura': { $gte: GOAL_INITIAL_DATE_CONSORTIUM_PARAM },
          tipoDeServico: 'CONSÓRCIO DE ENERGIA',
        },
      },
      {
        $group: {
          _id: '$vendedor.nome',
          valorProjeto: {
            $sum: '$sistema.valorProjeto',
          },
          valorPadrao: {
            $sum: '$padrao.valor',
          },
          valorEstrutura: {
            $sum: '$estruturaPersonalizada.valor',
          },
        },
      },
    ])
    .toArray()

  const CONSORCIO_ENERGIA = energyConsortium.reduce(
    (acc: { total: number; porVendedor: { [key: string]: number } }, current) => {
      const currentTotal = current.valorProjeto + current.valorPadrao + current.valorEstrutura
      const currentSeller = current._id as string

      if (!acc.porVendedor[currentSeller]) acc.porVendedor[currentSeller] = 0
      acc.porVendedor[currentSeller] += currentTotal
      acc.total += currentTotal
      return acc
    },
    {
      total: 0,
      porVendedor: {},
    }
  )
  return {
    'SISTEMA FOTOVOLTAICO': {
      TOTAL: SISTEMA_FOTOVOLTAICO.total,
      RANKING: Object.entries(SISTEMA_FOTOVOLTAICO.porVendedor)
        .map(([seller, total]) => ({ RESPONSAVEL: seller, TOTAL: total }))
        .sort((a, b) => b.TOTAL - a.TOTAL),
    },
    'OPERAÇÃO E MANUTENÇÃO': {
      TOTAL: OEM_MONTAGEM_DESMONTAGEM.total,
      RANKING: Object.entries(OEM_MONTAGEM_DESMONTAGEM.porVendedor)
        .map(([seller, total]) => ({ RESPONSAVEL: seller, TOTAL: total }))
        .sort((a, b) => b.TOTAL - a.TOTAL),
    },
    'INSIDE SALES': {
      TOTAL: INSIDE_SALES.total,
      RANKING: Object.entries(INSIDE_SALES.porVendedor)
        .map(([seller, total]) => ({ RESPONSAVEL: seller, TOTAL: total }))
        .sort((a, b) => b.TOTAL - a.TOTAL),
    },
    'SEGURO DE SISTEMA FOTOVOLTAICO': {
      TOTAL: SEGURO_FOTOVOLTAICO.total,
      RANKING: Object.entries(SEGURO_FOTOVOLTAICO.porVendedor)
        .map(([seller, total]) => ({ RESPONSAVEL: seller, TOTAL: total }))
        .sort((a, b) => b.TOTAL - a.TOTAL),
    },
    'CONSÓRCIO DE ENERGIA': {
      TOTAL: CONSORCIO_ENERGIA.total,
      RANKING: Object.entries(CONSORCIO_ENERGIA.porVendedor)
        .map(([seller, total]) => ({ RESPONSAVEL: seller, TOTAL: total }))
        .sort((a, b) => b.TOTAL - a.TOTAL),
    },
  }
}
export default apiHandler({
  GET: getStats,
})
