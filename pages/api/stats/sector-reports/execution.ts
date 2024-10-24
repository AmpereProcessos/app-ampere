import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { getHoursDiff } from '@/utils/methods/dates'
import { TProject } from '@/utils/schemas/projects'
import { TServiceOrder } from '@/utils/schemas/service-order'
import connectToDatabase from '@/utils/services/mongodb/projects'
import dayjs from 'dayjs'
import createHttpError from 'http-errors'
import { Collection, Db, Filter, WithId } from 'mongodb'
import { NextApiHandler } from 'next'

export type TExecutionStats = {
  periodo: TExecutionPeriodStatsResult
  adequacoesPadrao: {
    total: number
    pagos: number
  }
  adequacoesEstrutura: {
    total: number
    pagos: number
  }
  ordensServico: TServiceOrderStats
}

type GetResponse = {
  data: TExecutionStats
}

const getExecutionSectorStatsRoute: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const isAuthorized = !!session?.user.permissoes.execucao.visualizar
  if (!isAuthorized) throw new createHttpError.Unauthorized('Oops, seu usuário não possui acesso a esse módulo.')

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const projectsCollection: Collection<TProject> = db.collection('dados')
  const serviceOrdersCollection: Collection<TServiceOrder> = db.collection('ordensDeServico')

  const afterDate = dayjs().subtract(30, 'days').toDate()
  const beforeDate = dayjs().toDate()

  const periodResults = await getProjectsInPeriodScope({ collection: projectsCollection, afterDate, beforeDate })
  const paAdequations = await getPendingPAAdequations({ collection: projectsCollection })
  const structureAdequations = await getPendingStructureAdequations({ collection: projectsCollection })

  const serviceOrderStats = await getServiceOrdersInformation({ collection: serviceOrdersCollection, afterDate, beforeDate })
  return res.status(200).json({
    data: { periodo: periodResults, adequacoesPadrao: paAdequations, adequacoesEstrutura: structureAdequations, ordensServico: serviceOrderStats },
  })
}
export default apiHandler({ GET: getExecutionSectorStatsRoute })

type GetProjectsInPeriodScopeParams = {
  afterDate: Date
  beforeDate: Date
  collection: Collection<TProject>
}
type TExecutionPeriodStatsReduced = {
  iniciados: number
  executados: number
  tempoTotalPlanejamento: number
  tempoTotalExecucao: number
  entregasEfetivadas: number
  entregasPrevistas: number
}
type TExecutionPeriodStatsResult = {
  iniciados: number
  executados: number
  tempoTotalPlanejamento: number
  tempoMedioPlanejamento: number
  tempoTotalExecucao: number
  tempoMedioExecucao: number
  entregasEfetivadas: number
  entregasPrevistas: number
}
type TWorkableProject = Pick<TProject, 'obra' | 'compra'>
async function getProjectsInPeriodScope({ afterDate, beforeDate, collection }: GetProjectsInPeriodScopeParams): Promise<TExecutionPeriodStatsResult> {
  const afterDateAsString = afterDate.toISOString()
  const beforeDateAsString = beforeDate.toISOString()
  try {
    const match: Filter<TProject> = {
      $or: [
        { $and: [{ 'obra.entrada': { $gte: afterDateAsString } }, { 'obra.entrada': { $lte: beforeDateAsString } }] },
        { $and: [{ 'obra.saida': { $gte: afterDateAsString } }, { 'obra.saida': { $lte: beforeDateAsString } }] },
        { $and: [{ 'compra.previsaoEntrega': { $gte: afterDateAsString } }, { 'compra.previsaoEntrega': { $lte: beforeDateAsString } }] },
        { $and: [{ 'compra.dataEntrega': { $gte: afterDateAsString } }, { 'compra.dataEntrega': { $lte: beforeDateAsString } }] },
      ],
    }
    const project = { 'obra.entrada': 1, 'obra.saida': 1, 'compra.previsaoEntrega': 1, 'compra.dataEntrega': 1 }

    const projects = (await collection.aggregate([{ $match: match }, { $project: project }]).toArray()) as WithId<TWorkableProject>[]

    const periodResults = projects.reduce(
      (acc: TExecutionPeriodStatsReduced, current) => {
        const executionEntry = current.obra.entrada ? new Date(current.obra.entrada) : null
        const executionConclusion = current.obra.saida ? new Date(current.obra.saida) : null
        const deliveryPrediction = current.compra.previsaoEntrega ? new Date(current.compra.previsaoEntrega) : null
        const deliveryEfectivation = current.compra.dataEntrega ? new Date(current.compra.dataEntrega) : null

        // Updating execution information
        const wasStartedWithinPeriod = executionEntry && executionEntry >= afterDate && executionEntry <= beforeDate
        if (!!wasStartedWithinPeriod) acc.iniciados += 1
        const wasConcludedWithinPeriod = executionConclusion && executionConclusion >= afterDate && executionConclusion <= beforeDate
        if (!!wasConcludedWithinPeriod) acc.executados += 1
        // Updating time related information
        const timeToPlanExecution =
          !!deliveryEfectivation && !!executionEntry && wasStartedWithinPeriod
            ? getHoursDiff({ start: deliveryEfectivation, finish: executionEntry })
            : 0
        const timeToConcludedExecution =
          !!executionEntry && !!executionConclusion && wasConcludedWithinPeriod
            ? getHoursDiff({ start: executionEntry, finish: executionConclusion })
            : 0
        acc.tempoTotalPlanejamento += timeToPlanExecution
        acc.tempoTotalExecucao += timeToConcludedExecution

        // Delivery related information
        if (!!deliveryPrediction && !deliveryEfectivation) {
          const beforeDateWithMargin = dayjs(beforeDate).add(30, 'days').toDate()
          const isPredictedToPeriod = deliveryPrediction && deliveryPrediction >= afterDate && deliveryPrediction <= beforeDateWithMargin
          if (isPredictedToPeriod) acc.entregasPrevistas += 1
        }
        if (!!deliveryEfectivation) {
          const wasDeliveredWithinPeriod = deliveryEfectivation >= afterDate && deliveryEfectivation <= beforeDate
          if (wasDeliveredWithinPeriod) acc.entregasEfetivadas += 1
        }
        return acc
      },
      {
        iniciados: 0,
        executados: 0,
        tempoTotalPlanejamento: 0,
        tempoTotalExecucao: 0,
        entregasEfetivadas: 0,
        entregasPrevistas: 0,
      }
    )

    return {
      ...periodResults,
      tempoMedioExecucao: periodResults.tempoTotalExecucao / periodResults.executados,
      tempoMedioPlanejamento: periodResults.tempoTotalPlanejamento / periodResults.iniciados,
    }
  } catch (error) {
    throw error
  }
}
type GetPendingPAAdequationsParams = {
  collection: Collection<TProject>
}
async function getPendingPAAdequations({ collection }: GetPendingPAAdequationsParams) {
  try {
    const project = { 'compra.dataPagamento': 1 }
    const pendingAdequations = await collection
      .find({ 'padrao.aumentoCarga.aplicavel': true, 'padrao.aumentoCarga.dataEfetivacao': null }, { projection: project })
      .toArray()

    const pendingAdequationsPaid = pendingAdequations.filter((p) => !!p.compra.dataPagamento)

    return { total: pendingAdequations.length, pagos: pendingAdequationsPaid.length }
  } catch (error) {
    throw error
  }
}
type GetPendingStructureAdequationsParams = {
  collection: Collection<TProject>
}
async function getPendingStructureAdequations({ collection }: GetPendingStructureAdequationsParams) {
  try {
    const project = { 'compra.dataPagamento': 1 }
    const pendingAdequations = await collection
      .find({ 'estruturaPersonalizada.aplicavel': 'SIM', 'estruturaPersonalizada.status': { $ne: 'PRONTA' } }, { projection: project })
      .toArray()

    const pendingAdequationsPaid = pendingAdequations.filter((p) => !!p.compra.dataPagamento)

    return { total: pendingAdequations.length, pagos: pendingAdequationsPaid.length }
  } catch (error) {
    throw error
  }
}
type GetServiceOrdersInformationParams = {
  afterDate: Date
  beforeDate: Date
  collection: Collection<TServiceOrder>
}
type TPendingServiceOrdersReduced = {
  total: number
  porResponsavel: { [key: string]: number }
  porCategoria: { [key: string]: number }
}
type TConcludedServiceOrdersReduced = {
  total: number
  porResponsavel: { [key: string]: { qtde: number; tempoExecucao: number } }
  porCategoria: { [key: string]: { qtde: number; tempoExecucao: number } }
}
type TServiceOrderStats = {
  pendentes: {
    total: number
    porResponsavel: {
      responsavel: string
      qtde: number
    }[]
    porCategoria: {
      responsavel: string
      qtde: number
    }[]
  }
  finalizadas: {
    total: number
    porResponsavel: {
      responsavel: string
      qtde: number
      tempoMedioExecucao: number
    }[]
    porCategoria: {
      responsavel: string
      qtde: number
      tempoMedioExecucao: number
    }[]
  }
}
async function getServiceOrdersInformation({ collection, afterDate, beforeDate }: GetServiceOrdersInformationParams): Promise<TServiceOrderStats> {
  try {
    const afterDateAsString = afterDate.toISOString()
    const beforeDateAsString = beforeDate.toISOString()

    const matchPending: Filter<TServiceOrder> = { dataEfetivacao: null }
    const matchConcluded: Filter<TServiceOrder> = {
      $and: [{ dataEfetivacao: { $gte: afterDateAsString } }, { dataEfetivacao: { $lte: beforeDateAsString } }],
    }
    const project = { categoria: 1, 'responsavel.nome': 1, dataEfetivacao: 1, dataInsercao: 1 }
    const pendingServiceOrders = await collection.find(matchPending, { projection: project }).toArray()
    const concludedServiceOrders = await collection.find(matchConcluded, { projection: project }).toArray()

    const pendingResultsReduced = pendingServiceOrders.reduce(
      (acc: TPendingServiceOrdersReduced, current) => {
        const responsibleName = current.responsavel.nome || 'NÃO DEFINIDO'
        const category = current.categoria
        if (!acc.porResponsavel[responsibleName]) acc.porResponsavel[responsibleName] = 0
        if (!acc.porCategoria[category]) acc.porCategoria[category] = 0

        acc.total += 1
        acc.porResponsavel[responsibleName] += 1
        acc.porCategoria[category] += 1
        return acc
      },
      {
        total: 0,
        porResponsavel: {},
        porCategoria: {},
      }
    )
    const concludedResultsReduced = concludedServiceOrders.reduce(
      (acc: TConcludedServiceOrdersReduced, current) => {
        const responsibleName = current.responsavel.nome || 'NÃO DEFINIDO'
        const category = current.categoria
        if (!acc.porResponsavel[responsibleName]) {
          acc.porResponsavel[responsibleName] = { qtde: 0, tempoExecucao: 0 }
        }
        if (!acc.porCategoria[category]) {
          acc.porCategoria[category] = { qtde: 0, tempoExecucao: 0 }
        }

        const executionStart = current.dataInsercao ? new Date(current.dataInsercao) : null
        const executionEnd = current.dataEfetivacao ? new Date(current.dataEfetivacao) : null
        const executionHours = !!executionStart && !!executionEnd ? getHoursDiff({ start: executionStart, finish: executionEnd }) : 0

        acc.total += 1
        acc.porResponsavel[responsibleName].qtde += 1
        acc.porResponsavel[responsibleName].tempoExecucao += executionHours

        acc.porCategoria[category].qtde += 1
        acc.porCategoria[category].tempoExecucao += executionHours
        return acc
      },
      {
        total: 0,
        porResponsavel: {},
        porCategoria: {},
      }
    )
    const result = {
      pendentes: {
        total: pendingResultsReduced.total,
        porResponsavel: Object.entries(pendingResultsReduced.porResponsavel).map(([key, value]) => ({ responsavel: key, qtde: value })),
        porCategoria: Object.entries(pendingResultsReduced.porCategoria).map(([key, value]) => ({ responsavel: key, qtde: value })),
      },
      finalizadas: {
        total: concludedResultsReduced.total,
        porResponsavel: Object.entries(concludedResultsReduced.porResponsavel).map(([key, value]) => ({
          responsavel: key,
          qtde: value.qtde,
          tempoMedioExecucao: value.tempoExecucao / value.qtde,
        })),
        porCategoria: Object.entries(concludedResultsReduced.porCategoria).map(([key, value]) => ({
          responsavel: key,
          qtde: value.qtde,
          tempoMedioExecucao: value.tempoExecucao / value.qtde,
        })),
      },
    }
    return result
  } catch (error) {
    throw error
  }
}
