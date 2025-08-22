import { apiHandler } from '@/utils/api'

import { Filter } from 'mongodb'

import { Db } from 'mongodb'

import { NextApiHandler } from 'next'

import { validateAuthenticationWithSession } from '@/utils/api'

import {
  MaterialSimplifiedProjection,
  QueryVinculationMaterialsFiltersSchema,
  TMaterial,
  TMaterialSimplifiedWithAlocatorDTO,
} from '@/utils/schemas/materials'
import connectToDatabase from '@/utils/services/mongodb/warehouse'

type PostResponse = {
  data: TMaterialSimplifiedWithAlocatorDTO[]
}
const getProjectsVinculationsBySearch: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { search } = QueryVinculationMaterialsFiltersSchema.parse(req.body)

  const db: Db = await connectToDatabase()
  const collection = db.collection<TMaterial>('material')

  const query: Filter<TMaterial> = {
    $or: [{ nome: search }, { nome: { $regex: search, $options: 'i' } }],
    dataExclusao: null,
  }

  const addFields = { alocadorIdAsObjectId: { $toObjectId: '$alocadorId' } }
  const lookup = { from: 'alocadores', localField: 'alocadorIdAsObjectId', foreignField: '_id', as: 'alocadorDados' }
  const materialsResult = await collection
    .aggregate([
      { $match: query },
      { $addFields: addFields },
      { $lookup: lookup },
      {
        $project: {
          ...MaterialSimplifiedProjection,
          'alocadorDados._id': 1,
          'alocadorDados.nome': 1,
        },
      },
    ])
    .toArray()

  const materials = materialsResult.map((material) => ({
    ...material,
    alocadorDados: material.alocadorDados[0],
  }))
  return res.status(200).json({ data: materials as TMaterialSimplifiedWithAlocatorDTO[] })
}

export default apiHandler({ POST: getProjectsVinculationsBySearch })
