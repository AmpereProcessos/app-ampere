import { ContractRequestSimplified, TContractRequest, TContractRequestSimplifiedDTO } from '@/utils/schemas/contract-requests'
import { Collection, Filter } from 'mongodb'

type GetContractRequestsByFilterParams = {
  collection: Collection<TContractRequest>
  query: Filter<TContractRequest>
  skip: number
  limit: number
}
export async function getContractRequestsByFilter({ collection, query, skip, limit }: GetContractRequestsByFilterParams) {
  // Getting the total purchases matched by the query
  const contractRequestsMatched = await collection.countDocuments({ ...query })
  const sort = { _id: -1 }
  const match = { ...query }
  const contractRequests = await collection
    .aggregate([{ $sort: sort }, { $match: match }, { $skip: skip }, { $project: ContractRequestSimplified }, { $limit: limit }])
    .toArray()

  return { contractRequests, contractRequestsMatched } as { contractRequests: TContractRequestSimplifiedDTO[]; contractRequestsMatched: number }
}
