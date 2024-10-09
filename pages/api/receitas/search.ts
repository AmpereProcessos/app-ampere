import { validateAuthenticationWithSession } from '@/utils/api'
import { RevenueQueryFilters, TRevenue } from '@/utils/schemas/revenues'
import createHttpError from 'http-errors'
import { Filter } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

const QuerySchema = z.object({
  page: z.string({ required_error: 'Parâmetro de páginação não informado.' }),
})

const getRevenuesSearchByPersonalizedFiltersRoute: NextApiHandler<any> = async (req, res) => {
  const PAGE_SIZE = 200
  const session = await validateAuthenticationWithSession(req, res)

  const { page } = QuerySchema.parse(req.query)

  const filters = RevenueQueryFilters.parse(req.body)

  // Validating page parameter
  if (!page || isNaN(Number(page))) throw new createHttpError.BadRequest('Parâmetro de paginação inválido ou não informado.')

  const andConditions: Filter<TRevenue>[] = []
  const orConditions: Filter<TRevenue>[] = []

  if (filters.search.trim().length > 0) {
    orConditions.push({ nome: { $regex: filters.search, $options: 'i' } }, { nome: filters.search })
  }
  if (filters.status.includes('RECEBIDO')) {
    orConditions.push({
      recebimentos: {
        $elemMatch: {
          efetivado: true,
        },
      },
    })
  }
  if (filters.status.includes('RECEBIDO PARCIAL')) {
    orConditions.push({
      recebimentos: {
        $elemMatch: {
          efetivado: false,
        },
      },
    })
  }
  if (filters.status.includes('PENDENTE')) {
    orConditions.push({
      recebimentos: {
        $not: {
          $elemMatch: {
            efetivado: true,
          },
        },
      },
    })
  }
  if (filters.types.length > 0) {
    andConditions.push({
      tipo: { $in: filters.types },
    })
  }

  const andConditionsQuery = andConditions.reduce((acc, current) => ({ ...acc, ...current }), {})
  const orConditionsQuery = orConditions.reduce((acc, current) => ({ ...acc, ...current }), {})

  const query: Filter<TRevenue> = {}
}
