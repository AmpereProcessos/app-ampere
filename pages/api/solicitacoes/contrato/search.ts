import { getContractRequestsByFilter } from '@/repositories/contract-requests/queries'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { ContractRequestsQueryFiltersSchema, TContractRequest, TContractRequestSimplifiedDTO } from '@/utils/schemas/contract-requests'
import connectToSolicitacoesDatabase from '@/utils/services/mongodb/requests'
import createHttpError from 'http-errors'
import { Db, Filter } from 'mongodb'
import { NextApiHandler } from 'next'

export type TContractRequestsByFiltersResult = {
  contractRequests: TContractRequestSimplifiedDTO[]
  contractRequestsMatched: number
  totalPages: number
}
const getContractRequestsBySearchRoute: NextApiHandler<{ data: TContractRequestsByFiltersResult }> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const PAGE_SIZE = 200
  const { page } = req.query
  const { name, cpfCnpj, serviceTypes, ufs, cities, pendingApproval, pendingConfection } = ContractRequestsQueryFiltersSchema.parse(req.body)

  // Validating page parameter
  if (!page || isNaN(Number(page))) throw new createHttpError.BadRequest('Parâmetro de paginação inválido ou não informado.')

  const andFiltersArr: Filter<TContractRequest>[] = []
  const searchFiltersArr: Filter<TContractRequest>[] = []

  if (name.trim().length > 0) {
    searchFiltersArr.push({ $or: [{ nomeDoContrato: { $regex: name, $options: 'i' } }, { nomeDoContrato: name }] })
  }
  if (cpfCnpj.trim().length > 0) {
    searchFiltersArr.push({ $or: [{ cpf_cnpj: { $regex: cpfCnpj, $options: 'i' } }, { cpf_cnpj: cpfCnpj }] })
  }
  if (serviceTypes.length > 0) {
    andFiltersArr.push({ tipoDeServico: { $in: serviceTypes } })
  }
  if (ufs.length > 0) {
    andFiltersArr.push({ uf: { $in: ufs } })
  }
  if (cities.length > 0) {
    andFiltersArr.push({ cidade: { $in: cities } })
  }
  if (pendingApproval) {
    andFiltersArr.push({ aprovacao: { $ne: true } })
  }
  if (pendingConfection) {
    andFiltersArr.push({ confeccionado: { $ne: true } })
  }

  const andFilters = andFiltersArr.reduce((acc, current) => ({ ...acc, ...current }), {})
  const orFilters = searchFiltersArr.length > 0 ? { $and: searchFiltersArr } : {}

  const queryFilters: Filter<TContractRequest> = { ...andFilters, ...orFilters }

  const skip = PAGE_SIZE * (Number(page) - 1)
  const limit = PAGE_SIZE

  const db: Db = await connectToSolicitacoesDatabase(process.env.DB_KEY)
  const collection = db.collection<TContractRequest>('contrato')

  const { contractRequests, contractRequestsMatched } = await getContractRequestsByFilter({
    collection,
    query: queryFilters,
    skip,
    limit,
  })
  const totalPages = Math.round(contractRequestsMatched / PAGE_SIZE)

  return res.status(200).json({ data: { contractRequests, contractRequestsMatched, totalPages } })
}

export default apiHandler({ POST: getContractRequestsBySearchRoute })
