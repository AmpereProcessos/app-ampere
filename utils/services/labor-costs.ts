import { calculateLaborCost, roundMoney } from '@/lib/service-orders/labor-cost'
import type { TAuthSession } from '@/lib/authentication/types'
import { InsertExpenseSchema, type TExpense, type TExpenseDTO } from '@/utils/schemas/expenses'
import {
  LABOR_COST_CONFIGURATIONS_COLLECTION_NAME,
  LABOR_COST_EXPENSE_IDENTIFIER,
  LABOR_COST_METADATA_KEY,
  LaborCostConfigurationSchema,
  type TLaborCostConfiguration,
  type TLaborCostConfigurationDTO,
} from '@/utils/schemas/labor-costs'
import type { TServiceOrder } from '@/utils/schemas/service-order'
import createHttpError from 'http-errors'
import { type Collection, ObjectId, type WithId } from 'mongodb'
import connectToDatabase from './mongodb/projects'

const SERVICE_ORDERS_COLLECTION_NAME = 'ordensDeServico'
const EXPENSES_COLLECTION_NAME = 'despesas'

function authorFromSession(session: TAuthSession) {
  return {
    id: session.user.id,
    nome: session.user.nome,
    avatar_url: session.user.avatar_url,
  }
}

function mapConfiguration(configuration: WithId<TLaborCostConfiguration>) {
  return {
    ...configuration,
    _id: configuration._id.toString(),
  } satisfies TLaborCostConfigurationDTO
}

function mapExpense(expense: WithId<TExpense>) {
  return { ...expense, _id: expense._id.toString() } satisfies TExpenseDTO
}

export async function ensureLaborCostIndexes({
  configurationsCollection,
  expensesCollection,
}: {
  configurationsCollection: Collection<TLaborCostConfiguration>
  expensesCollection: Collection<TExpense>
}) {
  await Promise.all([
    configurationsCollection.createIndex(
      { 'sujeito.tipo': 1, 'sujeito.id': 1, 'sujeito.chave': 1 },
      { unique: true, name: 'unique_labor_cost_subject' }
    ),
    expensesCollection.createIndex(
      { 'ordemServico.id': 1, 'metadados.chave': 1 },
      {
        unique: true,
        name: 'unique_labor_cost_expense_by_service_order',
        partialFilterExpression: {
          'ordemServico.id': { $exists: true },
          'metadados.chave': LABOR_COST_METADATA_KEY,
        },
      }
    ),
    expensesCollection.createIndex({ 'ordemServico.id': 1 }, { name: 'expenses_by_service_order' }),
  ])
}

async function getCollections() {
  const db = await connectToDatabase()
  const configurationsCollection = db.collection<TLaborCostConfiguration>(LABOR_COST_CONFIGURATIONS_COLLECTION_NAME)
  const expensesCollection = db.collection<TExpense>(EXPENSES_COLLECTION_NAME)
  const serviceOrdersCollection = db.collection<TServiceOrder>(SERVICE_ORDERS_COLLECTION_NAME)
  return { configurationsCollection, expensesCollection, serviceOrdersCollection }
}

export async function getLaborCostExpense(serviceOrderId: string) {
  if (!ObjectId.isValid(serviceOrderId)) throw new createHttpError.BadRequest('ID da OS inválido.')
  const { expensesCollection } = await getCollections()
  const expense = await expensesCollection.findOne({
    'ordemServico.id': serviceOrderId,
    'metadados.chave': LABOR_COST_METADATA_KEY,
  })
  return expense ? mapExpense(expense) : null
}

export type TLaborCostSyncResult =
  | { status: 'SYNCED'; expense: TExpenseDTO }
  | { status: 'LOCKED'; expense: TExpenseDTO; message: string }
  | {
      status: 'UNSUPPORTED_CATEGORY' | 'MISSING_DATA' | 'NO_CONFIGURATION' | 'AMBIGUOUS_CONFIGURATION'
      expense: TExpenseDTO | null
      message: string
    }

export async function syncLaborCostExpense({
  serviceOrderId,
  session,
}: {
  serviceOrderId: string
  session: TAuthSession
}): Promise<TLaborCostSyncResult> {
  if (!ObjectId.isValid(serviceOrderId)) throw new createHttpError.BadRequest('ID da OS inválido.')
  const { configurationsCollection, expensesCollection, serviceOrdersCollection } = await getCollections()
  const [serviceOrder, configurations, existingExpense] = await Promise.all([
    serviceOrdersCollection.findOne({ _id: new ObjectId(serviceOrderId) }),
    configurationsCollection.find({ ativo: true }).toArray(),
    expensesCollection.findOne({
      'ordemServico.id': serviceOrderId,
      'metadados.chave': LABOR_COST_METADATA_KEY,
    }),
  ])
  if (!serviceOrder) throw new createHttpError.NotFound('Ordem de serviço não encontrada.')
  if (existingExpense?.efetivacao.efetivado) {
    return {
      status: 'LOCKED',
      expense: mapExpense(existingExpense),
      message: 'O custo já foi confirmado. Reabra-o antes de recalcular.',
    }
  }

  const calculation = calculateLaborCost({
    serviceOrder,
    configurations: configurations.map(mapConfiguration),
  })
  if (calculation.status !== 'CALCULATED') {
    return {
      ...calculation,
      expense: existingExpense ? mapExpense(existingExpense) : null,
    }
  }

  await ensureLaborCostIndexes({ configurationsCollection, expensesCollection })
  const now = new Date().toISOString()
  const expense = InsertExpenseSchema.parse({
    rateio: 'CUSTOS DIRETOS',
    identificador: LABOR_COST_EXPENSE_IDENTIFIER,
    categoria: 'MÃO DE OBRA',
    descricao: `Custo de mão de obra da OS: ${serviceOrder.descricao}`,
    projeto: {
      id: serviceOrder.projeto.id,
      nome: serviceOrder.projeto.nome,
      identificador: serviceOrder.projeto.identificador,
      tipo: serviceOrder.projeto.tipo,
    },
    ordemServico: { id: serviceOrderId, descricao: serviceOrder.descricao },
    metadados: calculation.metadata,
    idFormularioAlmoxarifado: null,
    itens: calculation.items,
    total: calculation.total,
    efetivacao: { efetivado: false, data: null },
    criterioReferencia: true,
    criterioCompetencia: true,
    pagamentos: existingExpense?.pagamentos || [],
    autor: existingExpense?.autor || authorFromSession(session),
    dataInsercao: existingExpense?.dataInsercao || now,
  })

  const response = await expensesCollection.findOneAndUpdate(
    {
      'ordemServico.id': serviceOrderId,
      'metadados.chave': LABOR_COST_METADATA_KEY,
    },
    { $set: expense },
    { upsert: true, returnDocument: 'after' }
  )
  if (!response.value) throw new createHttpError.InternalServerError('Não foi possível sincronizar o custo da OS.')
  return { status: 'SYNCED', expense: mapExpense(response.value) }
}

export async function saveManualLaborCostExpense({
  serviceOrderId,
  natureza,
  valor,
  motivo,
  session,
}: {
  serviceOrderId: string
  natureza: 'APROPRIACAO_INTERNA' | 'SERVICO_TERCEIRO'
  valor: number
  motivo: string
  session: TAuthSession
}) {
  if (!ObjectId.isValid(serviceOrderId)) throw new createHttpError.BadRequest('ID da OS inválido.')
  const roundedValue = roundMoney(valor)
  if (!Number.isFinite(roundedValue) || roundedValue < 0) throw new createHttpError.BadRequest('Valor manual inválido.')
  if (motivo.trim().length < 3) throw new createHttpError.BadRequest('Informe o motivo do custo manual.')

  const { configurationsCollection, expensesCollection, serviceOrdersCollection } = await getCollections()
  const [serviceOrder, existingExpense] = await Promise.all([
    serviceOrdersCollection.findOne({ _id: new ObjectId(serviceOrderId) }),
    expensesCollection.findOne({
      'ordemServico.id': serviceOrderId,
      'metadados.chave': LABOR_COST_METADATA_KEY,
    }),
  ])
  if (!serviceOrder) throw new createHttpError.NotFound('Ordem de serviço não encontrada.')
  if (existingExpense?.efetivacao.efetivado) throw new createHttpError.Conflict('Reabra o custo confirmado antes de alterá-lo.')

  await ensureLaborCostIndexes({ configurationsCollection, expensesCollection })
  const now = new Date().toISOString()
  const expense = InsertExpenseSchema.parse({
    rateio: 'CUSTOS DIRETOS',
    identificador: LABOR_COST_EXPENSE_IDENTIFIER,
    categoria: 'MÃO DE OBRA',
    descricao: `Custo de mão de obra da OS: ${serviceOrder.descricao}`,
    projeto: {
      id: serviceOrder.projeto.id,
      nome: serviceOrder.projeto.nome,
      identificador: serviceOrder.projeto.identificador,
      tipo: serviceOrder.projeto.tipo,
    },
    ordemServico: { id: serviceOrderId, descricao: serviceOrder.descricao },
    metadados: {
      chave: LABOR_COST_METADATA_KEY,
      versao: 1,
      natureza,
      calculo: { modelo: 'manual', motivo: motivo.trim() },
      valorCalculado: roundedValue,
      calculadoEm: now,
      ajuste: null,
    },
    idFormularioAlmoxarifado: null,
    itens: [
      {
        descricao: 'MÃO DE OBRA - VALOR MANUAL',
        unidade: 'SV',
        qtde: 1,
        preco: roundedValue,
      },
    ],
    total: roundedValue,
    efetivacao: { efetivado: false, data: null },
    criterioReferencia: true,
    criterioCompetencia: true,
    pagamentos: existingExpense?.pagamentos || [],
    autor: existingExpense?.autor || authorFromSession(session),
    dataInsercao: existingExpense?.dataInsercao || now,
  })
  const response = await expensesCollection.findOneAndUpdate(
    {
      'ordemServico.id': serviceOrderId,
      'metadados.chave': LABOR_COST_METADATA_KEY,
    },
    { $set: expense },
    { upsert: true, returnDocument: 'after' }
  )
  if (!response.value) throw new createHttpError.InternalServerError('Não foi possível salvar o custo manual.')
  return mapExpense(response.value)
}

export async function confirmLaborCostExpense({
  serviceOrderId,
  finalValue,
  adjustmentReason,
  session,
}: {
  serviceOrderId: string
  finalValue?: number | null
  adjustmentReason?: string | null
  session: TAuthSession
}) {
  if (!ObjectId.isValid(serviceOrderId)) throw new createHttpError.BadRequest('ID da OS inválido.')
  const { expensesCollection } = await getCollections()
  const expense = await expensesCollection.findOne({
    'ordemServico.id': serviceOrderId,
    'metadados.chave': LABOR_COST_METADATA_KEY,
  })
  if (!expense) throw new createHttpError.NotFound('Custo de mão de obra não encontrado.')
  if (!expense.metadados || expense.metadados.chave !== LABOR_COST_METADATA_KEY)
    throw new createHttpError.BadRequest('Metadados do custo de mão de obra inválidos.')

  const confirmedValue = roundMoney(finalValue ?? expense.total)
  if (!Number.isFinite(confirmedValue) || confirmedValue < 0) throw new createHttpError.BadRequest('Valor final inválido.')
  const hasAdjustment = confirmedValue !== roundMoney(expense.metadados.valorCalculado)
  if (hasAdjustment && (!adjustmentReason || adjustmentReason.trim().length < 3)) throw new createHttpError.BadRequest('Informe o motivo do ajuste.')

  const now = new Date().toISOString()
  const items = hasAdjustment
    ? [
        {
          descricao: 'MÃO DE OBRA - VALOR CONFIRMADO',
          unidade: 'SV',
          qtde: 1,
          preco: confirmedValue,
        },
      ]
    : expense.itens
  const metadata = {
    ...expense.metadados,
    ajuste: hasAdjustment
      ? {
          valorAnterior: expense.total,
          motivo: adjustmentReason!.trim(),
          autor: authorFromSession(session),
          data: now,
        }
      : null,
  }
  const response = await expensesCollection.findOneAndUpdate(
    { _id: expense._id },
    {
      $set: {
        total: confirmedValue,
        itens: items,
        metadados: metadata,
        efetivacao: { efetivado: true, data: now },
      },
    },
    { returnDocument: 'after' }
  )
  if (!response.value) throw new createHttpError.InternalServerError('Não foi possível confirmar o custo.')
  return mapExpense(response.value)
}

export async function reopenLaborCostExpense(serviceOrderId: string) {
  if (!ObjectId.isValid(serviceOrderId)) throw new createHttpError.BadRequest('ID da OS inválido.')
  const { expensesCollection } = await getCollections()
  const response = await expensesCollection.findOneAndUpdate(
    {
      'ordemServico.id': serviceOrderId,
      'metadados.chave': LABOR_COST_METADATA_KEY,
    },
    { $set: { efetivacao: { efetivado: false, data: null } } },
    { returnDocument: 'after' }
  )
  if (!response.value) throw new createHttpError.NotFound('Custo de mão de obra não encontrado.')
  return mapExpense(response.value)
}

export async function deleteLaborCostExpense({
  serviceOrderId,
  session,
}: {
  serviceOrderId: string
  session: TAuthSession
}) {
  if (!ObjectId.isValid(serviceOrderId)) throw new createHttpError.BadRequest('ID da OS inválido.')
  const { expensesCollection } = await getCollections()
  const expense = await expensesCollection.findOne({
    'ordemServico.id': serviceOrderId,
    'metadados.chave': LABOR_COST_METADATA_KEY,
  })
  if (!expense) throw new createHttpError.NotFound('Custo de mão de obra não encontrado.')
  if (expense.efetivacao.efetivado && !session.user.permissoes.financeiro.editar) {
    throw new createHttpError.Forbidden('Somente o financeiro pode excluir um custo confirmado.')
  }
  if ((expense.pagamentos?.length ?? 0) > 0) {
    throw new createHttpError.Conflict('Não é possível excluir uma despesa com pagamentos vinculados.')
  }
  const deleteResponse = await expensesCollection.deleteOne({ _id: expense._id })
  if (!deleteResponse.acknowledged || deleteResponse.deletedCount !== 1) {
    throw new createHttpError.InternalServerError('Não foi possível excluir o custo de mão de obra.')
  }
}

export function parseLaborCostConfiguration(value: unknown) {
  return LaborCostConfigurationSchema.parse(value)
}
