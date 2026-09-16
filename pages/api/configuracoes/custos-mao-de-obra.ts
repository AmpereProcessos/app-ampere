import { normalizeLaborCostTeamKey } from '@/lib/service-orders/labor-cost'
import type { TAuthSession } from '@/lib/authentication/types'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import type { TExpense } from '@/utils/schemas/expenses'
import {
  LABOR_COST_CONFIGURATIONS_COLLECTION_NAME,
  UpsertLaborCostConfigurationSchema,
  type TLaborCostConfiguration,
  type TLaborCostConfigurationDTO,
} from '@/utils/schemas/labor-costs'
import { ensureLaborCostIndexes } from '@/utils/services/labor-costs'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { type Collection, ObjectId } from 'mongodb'
import type { NextApiHandler } from 'next'
import { z } from 'zod'

function assertCanView(session: TAuthSession) {
  if (!session.user.permissoes.financeiro.visualizar)
    throw new createHttpError.Unauthorized('Usuário não possui permissão para visualizar configurações financeiras.')
}

function assertCanEdit(session: TAuthSession) {
  if (!session.user.permissoes.financeiro.editar)
    throw new createHttpError.Unauthorized('Usuário não possui permissão para editar configurações financeiras.')
}

function normalizeConfiguration(input: z.infer<typeof UpsertLaborCostConfigurationSchema>) {
  if (input.sujeito.tipo !== 'EQUIPE') return input
  return {
    ...input,
    sujeito: {
      ...input.sujeito,
      chave: normalizeLaborCostTeamKey(input.sujeito.chave || input.sujeito.nome),
    },
  }
}

async function getCollection() {
  const db = await connectToDatabase()
  return {
    configurations: db.collection<TLaborCostConfiguration>(LABOR_COST_CONFIGURATIONS_COLLECTION_NAME),
    expenses: db.collection<TExpense>('despesas'),
  }
}

async function ensureUniqueSubject({
  collection,
  configuration,
  exceptId,
}: {
  collection: Collection<TLaborCostConfiguration>
  configuration: z.infer<typeof UpsertLaborCostConfigurationSchema>
  exceptId?: ObjectId
}) {
  const subjectQuery =
    configuration.sujeito.tipo === 'USUARIO'
      ? { 'sujeito.tipo': 'USUARIO' as const, 'sujeito.id': configuration.sujeito.id }
      : { 'sujeito.tipo': 'EQUIPE' as const, 'sujeito.chave': configuration.sujeito.chave }
  const existent = await collection.findOne({
    ...subjectQuery,
    ...(exceptId ? { _id: { $ne: exceptId } } : {}),
  })
  if (existent) throw new createHttpError.Conflict('Já existe uma configuração para esse usuário ou equipe.')
}

export type TGetLaborCostConfigurationsOutput = {
  data: TLaborCostConfigurationDTO[]
}

const getHandler: NextApiHandler<TGetLaborCostConfigurationsOutput> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  assertCanView(session)
  const { configurations } = await getCollection()
  const data = await configurations.find({}).sort({ 'sujeito.nome': 1 }).toArray()
  return res.status(200).json({
    data: data.map((configuration) => ({
      ...configuration,
      _id: configuration._id.toString(),
    })),
  })
}

export type TCreateLaborCostConfigurationOutput = {
  data: TLaborCostConfigurationDTO
  message: string
}

const postHandler: NextApiHandler<TCreateLaborCostConfigurationOutput> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  assertCanEdit(session)
  const parsed = UpsertLaborCostConfigurationSchema.parse(req.body)
  const input = normalizeConfiguration(parsed)
  const { configurations, expenses } = await getCollection()
  await ensureLaborCostIndexes({
    configurationsCollection: configurations,
    expensesCollection: expenses,
  })
  await ensureUniqueSubject({ collection: configurations, configuration: input })
  if (input.padrao) {
    await configurations.updateMany({ padrao: true }, { $set: { padrao: false, dataAtualizacao: new Date().toISOString() } })
  }
  const now = new Date().toISOString()
  const configuration: TLaborCostConfiguration = {
    ...input,
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: now,
    dataAtualizacao: now,
  }
  const result = await configurations.insertOne(configuration)
  if (!result.acknowledged) throw new createHttpError.InternalServerError('Não foi possível criar a configuração.')
  return res.status(201).json({
    data: { ...configuration, _id: result.insertedId.toString() },
    message: 'Configuração de custo criada com sucesso.',
  })
}

const UpdateInputSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'ID da configuração inválido.'),
  configuration: UpsertLaborCostConfigurationSchema,
})
export type TUpdateLaborCostConfigurationOutput = TCreateLaborCostConfigurationOutput

const putHandler: NextApiHandler<TUpdateLaborCostConfigurationOutput> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  assertCanEdit(session)
  const parsed = UpdateInputSchema.parse(req.body)
  const input = normalizeConfiguration(parsed.configuration)
  const configurationId = new ObjectId(parsed.id)
  const { configurations, expenses } = await getCollection()
  await ensureLaborCostIndexes({
    configurationsCollection: configurations,
    expensesCollection: expenses,
  })
  await ensureUniqueSubject({
    collection: configurations,
    configuration: input,
    exceptId: configurationId,
  })
  if (input.padrao) {
    await configurations.updateMany(
      { _id: { $ne: configurationId }, padrao: true },
      { $set: { padrao: false, dataAtualizacao: new Date().toISOString() } }
    )
  }
  const dataAtualizacao = new Date().toISOString()
  const result = await configurations.findOneAndUpdate({ _id: configurationId }, { $set: { ...input, dataAtualizacao } }, { returnDocument: 'after' })
  if (!result.value) throw new createHttpError.NotFound('Configuração não encontrada.')
  return res.status(200).json({
    data: { ...result.value, _id: result.value._id.toString() },
    message: 'Configuração de custo atualizada com sucesso.',
  })
}

export default apiHandler({ GET: getHandler, POST: postHandler, PUT: putHandler })
