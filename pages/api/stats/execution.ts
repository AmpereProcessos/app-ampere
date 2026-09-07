import {
  buildExecutionAnalytics,
  EXECUTION_COST_TAG,
  ExecutionFiltersSchema,
  matchesExecutionFilters,
  type ExecutionOrder,
  type ExecutionExpense,
  type ExecutionAnalytics,
} from '@/lib/analytics/execution'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import type { NextApiHandler } from 'next'

const handler: NextApiHandler<{ data: ExecutionAnalytics }> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  if (!session.user.permissoes.execucao.visualizar && !session.user.permissoes.ordensDeServico.visualizar) {
    throw new createHttpError.Forbidden('Sem permissão para visualizar os indicadores de obras.')
  }
  const filters = ExecutionFiltersSchema.parse(req.body)
  const db = await connectToDatabase()
  // A compact projection preserves older OS for carried workload and financial project links.
  const orders = await db
    .collection<ExecutionOrder>('ordensDeServico')
    .find(
      { status: { $ne: 'CANCELADA' } },
      {
        projection: {
          descricao: 1,
          categoria: 1,
          status: 1,
          'favorecido.nome': 1,
          'periodo.inicio': 1,
          'periodo.fim': 1,
          'responsaveis.id': 1,
          'responsaveis.nome': 1,
          'localizacao.cidade': 1,
          'localizacao.uf': 1,
          'projeto.id': 1,
          'projeto.nome': 1,
          'projeto.tipo': 1,
        },
      }
    )
    .toArray()
  const projectIds = [
    ...new Set(
      orders
        .filter((o) => matchesExecutionFilters(o, filters))
        .map((o) => o.projeto?.id)
        .filter((id): id is string => !!id)
    ),
  ]
  // Never query or return financial data to a user with operational access only.
  const expenses = session.user.permissoes.financeiro.visualizar
    ? projectIds.length
      ? await db
          .collection<ExecutionExpense>('despesas')
          .find(
            { identificador: EXECUTION_COST_TAG, 'projeto.id': { $in: projectIds } },
            {
              projection: { identificador: 1, descricao: 1, categoria: 1, projeto: 1, total: 1, efetivacao: 1, pagamentos: 1, itens: 1 },
            }
          )
          .toArray()
      : []
    : null
  res.setHeader('Cache-Control', 'private, no-store')
  return res.status(200).json({ data: buildExecutionAnalytics(orders, expenses, filters) })
}

export default apiHandler({ POST: handler })
