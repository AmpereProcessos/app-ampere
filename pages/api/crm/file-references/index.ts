import { insertFileReference } from '@/repositories/crm-file-references/mutation'
import {
  getFileReferencesByAnalysisId,
  getFileReferencesByClientId,
  getFileReferencesByHomologationId,
  getFileReferencesByOpportunityId,
} from '@/repositories/crm-file-references/queries'

import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { InsertFileReferenceSchema, TFileReference, TFileReferenceEntity } from '@/utils/schemas/crm/file-reference.schema'

import connectToCRMDatabase from '@/utils/services/mongodb/crm/main'
import createHttpError from 'http-errors'
import { Collection, Filter, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type PostResponse = {
  data: {
    insertedId: string
  }
  message: string
}

const createFileReference: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  // Parsing payload and validating fields
  const fileReference = InsertFileReferenceSchema.parse(req.body)

  const db = await connectToCRMDatabase(process.env.DB_KEY)
  const collection: Collection<TFileReference> = db.collection('file-references')

  const insertResponse = await insertFileReference({
    collection: collection,
    info: fileReference,
    partnerId: '65454ba15cf3e3ecf534b308',
  })
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido no anexo do arquivo.')
  return res.status(201).json({ data: { insertedId: insertResponse.insertedId.toString() }, message: 'Arquivo anexado com sucesso !' })
}
type GetResponse = {
  data: TFileReferenceEntity | TFileReferenceEntity[]
}
const getFileReferences: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { opportunityId, clientId, analysisId, homologationId } = req.query
  // if (!opportunityId && !clientId && analysisId) throw new createHttpError.BadRequest('Necessário ID de referência do arquivo.')

  const db = await connectToCRMDatabase(process.env.DB_KEY)
  const collection: Collection<TFileReference> = db.collection('file-references')

  if (opportunityId) {
    if (typeof opportunityId != 'string' || !ObjectId.isValid(opportunityId)) throw new createHttpError.BadRequest('ID de oportunidade inválido.')

    const references = await getFileReferencesByOpportunityId({
      collection: collection,
      opportunityId: opportunityId,
      query: {},
    })

    return res.status(200).json({ data: references })
  }
  if (clientId) {
    if (typeof clientId != 'string' || !ObjectId.isValid(clientId)) throw new createHttpError.BadRequest('ID de cliente inválido.')
    const fileReferences = await getFileReferencesByClientId({ collection: collection, clientId: clientId })
    return res.status(200).json({ data: fileReferences })
  }
  if (analysisId) {
    if (typeof analysisId != 'string' || !ObjectId.isValid(analysisId)) throw new createHttpError.BadRequest('ID de análise técnica inválido.')
    const fileReferences = await getFileReferencesByAnalysisId({ collection: collection, analysisId: analysisId })
    return res.status(200).json({ data: fileReferences })
  }
  if (homologationId) {
    if (typeof homologationId != 'string' || !ObjectId.isValid(homologationId)) throw new createHttpError.BadRequest('ID de homologação inválido.')

    const fileReferences = await getFileReferencesByHomologationId({ collection: collection, homologationId: homologationId })

    return res.status(200).json({ data: fileReferences })
  }
  return res.status(200).json({ data: [] })
}

type DeleteResponse = {
  message: string
}
const deleteFileReferenceRoute: NextApiHandler<DeleteResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id } = req.query

  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const db = await connectToCRMDatabase(process.env.DB_KEY)
  const collection: Collection<TFileReference> = db.collection('file-references')

  const deleteResponse = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { dataExclusao: new Date().toISOString(), autorIdExclusao: session.user.id } }
  )
  if (!deleteResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro ao deletar o arquivo.')
  if (deleteResponse.matchedCount == 0) throw new createHttpError.NotFound('Arquivo não encontrado.')

  return res.status(200).json({ message: 'Arquivo deletado com sucesso !' })
}
export default apiHandler({
  GET: getFileReferences,
  POST: createFileReference,
  DELETE: deleteFileReferenceRoute,
})
