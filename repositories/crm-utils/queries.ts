import { TEquipment } from '@/utils/schemas/crm/equipments'
import { TCreditor, TUtil } from '@/utils/schemas/crm/utils'
import { Collection, Filter, WithId } from 'mongodb'

type GetCreditorsParams = {
  collection: Collection<TUtil>
}
export async function getCreditors({ collection }: GetCreditorsParams) {
  try {
    const creditors = await collection.find({ identificador: 'CREDITOR' }).toArray()
    return creditors as WithId<TCreditor>[]
  } catch (error) {
    throw error
  }
}

type GetEquipments = {
  collection: Collection<TUtil>
  query: Filter<TUtil>
}
export async function getEquipments({ collection, query }: GetEquipments) {
  try {
    const equipments = await collection.find({ identificador: 'EQUIPMENT', ...query }).toArray()
    return equipments as WithId<TEquipment>[]
  } catch (error) {
    throw error
  }
}
