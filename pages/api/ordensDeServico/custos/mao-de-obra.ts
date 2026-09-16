import type { TAuthSession } from '@/lib/authentication/types'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import {
  confirmLaborCostExpense,
  deleteLaborCostExpense,
  getLaborCostExpense,
  reopenLaborCostExpense,
  saveManualLaborCostExpense,
  syncLaborCostExpense,
} from '@/utils/services/labor-costs'
import createHttpError from 'http-errors'
import type { NextApiHandler } from 'next'
import { z } from 'zod'

const ServiceOrderIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'ID da OS inválido.')

function canView(session: TAuthSession) {
  return session.user.permissoes.ordensDeServico.visualizar || session.user.permissoes.financeiro.visualizar
}

function canOperate(session: TAuthSession) {
  return session.user.permissoes.ordensDeServico.editar || session.user.permissoes.financeiro.editar
}

const getHandler: NextApiHandler = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  if (!canView(session)) throw new createHttpError.Unauthorized('Usuário sem permissão para visualizar o custo da OS.')
  const serviceOrderId = ServiceOrderIdSchema.parse(req.query.serviceOrderId)
  const expense = await getLaborCostExpense(serviceOrderId)
  return res.status(200).json({ data: expense })
}

const RecalculateInputSchema = z.object({
  acao: z.literal('RECALCULAR'),
  serviceOrderId: ServiceOrderIdSchema,
})

const SaveManualInputSchema = z.object({
  acao: z.literal('SALVAR_MANUAL'),
  serviceOrderId: ServiceOrderIdSchema,
  natureza: z.enum(['APROPRIACAO_INTERNA', 'SERVICO_TERCEIRO']),
  valor: z.number().finite().nonnegative(),
  motivo: z.string().min(3),
})

const ConfirmInputSchema = z.object({
  acao: z.literal('CONFIRMAR'),
  serviceOrderId: ServiceOrderIdSchema,
  valorFinal: z.number().finite().nonnegative().optional().nullable(),
  motivoAjuste: z.string().optional().nullable(),
})

const ReopenInputSchema = z.object({
  acao: z.literal('REABRIR'),
  serviceOrderId: ServiceOrderIdSchema,
})

const DeleteInputSchema = z.object({
  acao: z.literal('EXCLUIR'),
  serviceOrderId: ServiceOrderIdSchema,
})

const ActionInputSchema = z.discriminatedUnion('acao', [
  RecalculateInputSchema,
  SaveManualInputSchema,
  ConfirmInputSchema,
  ReopenInputSchema,
  DeleteInputSchema,
])

const postHandler: NextApiHandler = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const input = ActionInputSchema.parse(req.body)
  if (!canOperate(session)) throw new createHttpError.Unauthorized('Usuário sem permissão para operar o custo da OS.')

  if (input.acao === 'EXCLUIR') {
    await deleteLaborCostExpense({ serviceOrderId: input.serviceOrderId, session })
    return res.status(200).json({ data: null, message: 'Custo de mão de obra excluído.' })
  }

  if (input.acao === 'RECALCULAR') {
    const data = await syncLaborCostExpense({ serviceOrderId: input.serviceOrderId, session })
    return res.status(200).json({ data, message: 'Custo de mão de obra sincronizado.' })
  }

  if (input.acao === 'CONFIRMAR') {
    const isAdjustment = input.valorFinal != null
    if (isAdjustment && !session.user.permissoes.financeiro.editar)
      throw new createHttpError.Unauthorized('Somente o financeiro pode confirmar um valor diferente do calculado.')
    const data = await confirmLaborCostExpense({
      serviceOrderId: input.serviceOrderId,
      finalValue: input.valorFinal,
      adjustmentReason: input.motivoAjuste,
      session,
    })
    return res.status(200).json({ data, message: 'Custo de mão de obra confirmado.' })
  }

  if (!session.user.permissoes.financeiro.editar)
    throw new createHttpError.Unauthorized('Somente o financeiro pode informar ou reabrir custos manualmente.')

  if (input.acao === 'SALVAR_MANUAL') {
    const data = await saveManualLaborCostExpense({
      serviceOrderId: input.serviceOrderId,
      natureza: input.natureza,
      valor: input.valor,
      motivo: input.motivo,
      session,
    })
    return res.status(200).json({ data, message: 'Custo manual salvo com sucesso.' })
  }

  const data = await reopenLaborCostExpense(input.serviceOrderId)
  return res.status(200).json({ data, message: 'Custo de mão de obra reaberto.' })
}

export default apiHandler({ GET: getHandler, POST: postHandler })
