import { NextApiHandler } from 'next'
import createHttpError from 'http-errors'

import connectToCRMDatabase from '../../../../utils/services/mongodb/crm/main'
import { Db, ObjectId } from 'mongodb'
import { apiHandler } from '@/utils/api'
type GetResponse = any

const getProjects: NextApiHandler<GetResponse> = async (req, res) => {
  const { id, identifier } = req.query
  const crmDb = await connectToCRMDatabase(process.env.CRM_KEY)
  const projectsCollection = crmDb.collection('projects')
  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
    const project = await projectsCollection
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $addFields: {
            clientObjectId: { $toObjectId: '$clienteId' },
          },
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'clientObjectId',
            foreignField: '_id',
            as: 'cliente',
          },
        },
      ])
      .toArray()
    if (project.length == 0) throw new createHttpError.NotFound('Projeto não encontrado.')
    const formatted = { ...project[0], cliente: project[0].cliente[0] }
    if (project) return res.status(200).json(formatted)
  }
  if (identifier) {
    if (typeof identifier != 'string') throw new createHttpError.BadRequest('Identificador de projeto inválido.')
    const project = await projectsCollection
      .aggregate([
        { $match: { identificador: identifier } },
        {
          $addFields: {
            clientObjectId: { $toObjectId: '$clienteId' },
          },
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'clientObjectId',
            foreignField: '_id',
            as: 'cliente',
          },
        },
      ])
      .toArray()

    if (project.length == 0) throw new createHttpError.NotFound('Projeto não encontrado.')
    const formatted = { ...project[0], cliente: project[0].cliente[0] }
    if (project) return res.status(200).json(formatted)
  } else {
    const projects = await projectsCollection.find({}).toArray()
    return res.status(200).json(projects)
  }
}

type PostResponse = string

const updateProject: NextApiHandler<PostResponse> = async (req, res) => {
  const { projectId } = req.query
  const { changes } = req.body
  if (!changes || Object.keys(changes).length == 0) throw new createHttpError.BadRequest('Objeto de alterações não fornecido.')
  if (typeof projectId != 'string' || !ObjectId.isValid(projectId)) throw new createHttpError.BadRequest('ID inválido.')
  const crmDb = await connectToCRMDatabase(process.env.CRM_KEY)
  const projectsCollection = crmDb.collection('projects')

  let newObj = await projectsCollection.findOneAndUpdate(
    { _id: new ObjectId(projectId) },
    {
      $set: {
        ...changes,
      },
    }
  )
  res.status(200).json('Atualizações feitas com sucesso!')
}

type PutResponse = string

const bulkwriteUpdateProjects: NextApiHandler<PutResponse> = async (req, res) => {
  const { changes } = req.body
  if (!changes || typeof changes != 'object' || !Array.isArray(changes))
    throw new createHttpError.BadRequest('Formato das alterações não é compatível.')
  const isUpdateObjectInCorrectShape = changes.every((p) => !!p.updateOne)
  if (!isUpdateObjectInCorrectShape) throw new createHttpError.BadRequest('Itens de atualização com formato inválido.')

  // Updates passed validations
  const crmDb: Db = await connectToCRMDatabase(process.env.CRM_KEY)
  const projectsCollection = crmDb.collection('projects')
  const dbResponse = await projectsCollection.bulkWrite(changes)
  if (dbResponse.ok) return res.status(200).json('Projetos atualizados com sucesso !')
  else throw new createHttpError.InternalServerError('Erro desconhecido ocorreu durente atualização dos projetos.')
}
export default apiHandler({
  GET: getProjects,
  POST: updateProject,
  PUT: bulkwriteUpdateProjects,
})
