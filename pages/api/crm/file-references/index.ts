import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { InsertFileReferenceSchema, TFileReference, TFileReferenceEntity } from '@/utils/schemas/file-reference.schema'
import connectToCRMDatabase from '@/utils/services/mongodb/crm/main'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
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

  const db = await connectToCRMDatabase(process.env.MONGODB_URI)
  const collection: Collection<TFileReference> = db.collection('file-references')

  const insertResponse = await collection.insertOne({ ...fileReference, dataInsercao: new Date().toISOString() })
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

  const db = await connectToCRMDatabase(process.env.CRM_KEY)
  const collection: Collection<TFileReference> = db.collection('file-references')

  if (opportunityId) {
    if (typeof opportunityId != 'string' || !ObjectId.isValid(opportunityId)) throw new createHttpError.BadRequest('ID de oportunidade inválido.')

    const references = await collection.find({ idOportunidade: opportunityId }).toArray()

    return res.status(200).json({ data: references })
  }
  if (clientId) {
    if (typeof clientId != 'string' || !ObjectId.isValid(clientId)) throw new createHttpError.BadRequest('ID de cliente inválido.')
    const references = await collection.find({ idCliente: clientId }).toArray()
    return res.status(200).json({ data: references })
  }
  if (analysisId) {
    if (typeof analysisId != 'string' || !ObjectId.isValid(analysisId)) throw new createHttpError.BadRequest('ID de análise técnica inválido.')
    const references = await collection.find({ idAnaliseTecnica: analysisId }).toArray()
    return res.status(200).json({ data: references })
  }
  if (homologationId) {
    if (typeof homologationId != 'string' || !ObjectId.isValid(homologationId)) throw new createHttpError.BadRequest('ID de homologação inválido.')

    const references = await collection.find({ idHomologacao: homologationId }).toArray()

    return res.status(200).json({ data: references })
  }
  return res.status(200).json({ data: [] })
}
export default apiHandler({
  GET: getFileReferences,
  POST: createFileReference,
})
