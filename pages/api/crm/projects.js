import { ObjectId } from 'mongodb'
import { errorHandler } from '../../../utils/methods/handlers'
import createHttpError from 'http-errors'
import connectToDatabase from '../../../utils/crmDb'

export default async function handler(req, res) {
  if (req.method == 'GET') {
    const { id, identifier } = req.query

    try {
      const crmDb = await connectToDatabase(process.env.CRM_KEY)
      const projectsCollection = crmDb.collection('projects')
      if (id) {
        if (!ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
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
        if (project) res.status(200).json(formatted)

        return
      } else if (identifier) {
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
        if (project) res.status(200).json(formatted)
      } else {
        const projects = await projectsCollection.find({}).toArray()
        res.status(200).json(projects)
      }

      return
    } catch (error) {
      errorHandler(error, res)
    }
  }
}
