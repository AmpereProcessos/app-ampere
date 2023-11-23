import { apiHandler } from '@/utils/api'
import { InsertActivitySchema, TActivity, TActivityDTO, TActivityEntity } from '@/utils/schemas/activities'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { Collection, Db, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type PostResponse = {
  data: {
    insertedId: string
  }
  message: string
}

const createActivity: NextApiHandler<PostResponse> = async (req, res) => {
  const activity = InsertActivitySchema.parse(req.body)

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TActivity> = db.collection('atividades')

  const insertResponse = await collection.insertOne({ ...activity, dataInsercao: new Date().toISOString() })

  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro na criação da atividade.')
  return res.status(201).json({ data: { insertedId: insertResponse.insertedId.toString() }, message: 'Atividade criada com sucesso!' })
}

type GetResponse = {
  data: TActivityEntity | TActivityEntity[]
}

const getActivities: NextApiHandler<GetResponse> = async (req, res) => {
  const { id, projectId, responsibleId, onlyOpen } = req.query

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TActivity> = db.collection('atividades')

  // In case query is for a specific activity
  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
    const activity = await collection.findOne({ _id: new ObjectId(id) })
    if (!activity) throw new createHttpError.NotFound('Atividade não encontrada.')
    return res.status(200).json({ data: activity })
  }
  // In case query is for activities from a given project
  if (projectId) {
    if (typeof projectId != 'string' || !ObjectId.isValid(projectId)) throw new createHttpError.BadRequest('ID inválido.')
    const activities = await collection.find({ 'projeto.id': projectId }).toArray()
    return res.status(200).json({ data: activities })
  }
  console.log(responsibleId)
  // In case query is for activities from a given project
  if (responsibleId) {
    if (typeof responsibleId != 'string' || !ObjectId.isValid(responsibleId)) throw new createHttpError.BadRequest('ID inválido.')
    const activities = await collection.find({ 'responsaveis.id': responsibleId }).toArray()

    return res.status(200).json({ data: activities })
  }
  return res.status(200).json({ data: [] })
}

type PutResponse = {
  data: string
  message: string
}

const updateActivity: NextApiHandler<PutResponse> = async (req, res) => {
  const { id } = req.query
  const UpdateActivitySchema = InsertActivitySchema.partial()
  const changes = UpdateActivitySchema.parse(req.body)
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TActivity> = db.collection('atividades')

  const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } })
  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro na atualização da atividade.')
  return res.status(201).json({ data: 'Atividade atualizada com sucesso !', message: 'Atividade atualizada com sucesso !' })
}
export default apiHandler({
  GET: getActivities,
  POST: createActivity,
  PUT: updateActivity,
})
