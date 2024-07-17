import { simplifiedProjection, TUser, TUserDTOSimplified, TUserDTOWithSaleGoals } from '@/utils/schemas/crm/users.schema'
import { Collection, Filter, ObjectId, WithId } from 'mongodb'
import { Session } from 'next-auth'

type GetAllUsers = {
  collection: Collection<TUser>
}
export async function getAllUsers({ collection }: GetAllUsers) {
  try {
    const users = await collection.find({}, { projection: { senha: 0 }, sort: { nome: 1 } }).toArray()
    return users
  } catch (error) {
    throw error
  }
}
type GetPartnerUsers = {
  collection: Collection<TUser>
  query: Filter<TUser>
}
export async function getPartnerUsers({ collection, query }: GetPartnerUsers) {
  try {
    const users = await collection.find({ ...query }, { projection: { senha: 0 }, sort: { nome: 1 } }).toArray()
    return users
  } catch (error) {
    throw error
  }
}
type GetUserById = {
  collection: Collection<TUser>
  id: string
  query: Filter<TUser>
}
export async function getUserById({ collection, id, query }: GetUserById) {
  try {
    const user = await collection.findOne({ _id: new ObjectId(id), ...query }, { projection: { senha: 0 } })
    return user
  } catch (error) {
    throw error
  }
}
type GetOpportunityCreators = {
  collection: Collection<TUser>
  query: Filter<TUser>
}
export async function getOpportunityCreators({ collection, query }: GetOpportunityCreators) {
  try {
    const creators = await collection
      .find({ 'permissoes.oportunidades.criar': true, ...query }, { sort: { nome: 1 } })
      .project(simplifiedProjection)
      .toArray()
    return creators as WithId<TUserDTOSimplified>[]
  } catch (error) {
    throw error
  }
}
type GetTechnicalAnalystsParams = {
  collection: Collection<TUser>
  query: Filter<TUser>
}

export async function getTechnicalAnalysts({ collection, query }: GetTechnicalAnalystsParams) {
  try {
    const analysts = await collection
      .find({ 'permissoes.analisesTecnicas.editar': true, ...query }, { sort: { nome: 1 } })
      .project(simplifiedProjection)
      .toArray()
    return analysts as WithId<TUser>[]
  } catch (error) {
    throw error
  }
}

type GetLeadReceiversParams = {
  collection: Collection<TUser>
  query: Filter<TUser>
}
export async function getLeadReceivers({ collection, query }: GetLeadReceiversParams) {
  try {
    const receivers = await collection
      .find({ 'permissoes.integracoes.receberLeads': true, ...query }, { sort: { nome: 1 } })
      .project(simplifiedProjection)
      .toArray()
    return receivers as WithId<TUser>[]
  } catch (error) {
    throw error
  }
}

type GetSalePromotersParams = {
  collection: Collection<TUser>
  query: Filter<TUser>
}

export async function getSalePromoters({ collection, query }: GetSalePromotersParams) {
  try {
    const salePromoters = await collection
      .aggregate([
        {
          $match: {
            ativo: true,
            idGrupo: { $in: ['66562a2a812707dbf9f04832', '66562a2a812707dbf9f04833'] },
            ...query,
          },
        },
        {
          $project: {
            senha: 0,
          },
        },
        {
          $addFields: {
            userIdString: { $toString: '$_id' },
          },
        },
        {
          $lookup: {
            from: 'sale-goals',
            localField: 'userIdString',
            foreignField: 'usuario.id',
            as: 'metas',
          },
        },
        {
          $sort: {
            nome: 1,
          },
        },
      ])
      .toArray()
    return salePromoters as TUserDTOWithSaleGoals[]
  } catch (error) {
    throw error
  }
}
