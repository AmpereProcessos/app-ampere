import createHttpError from 'http-errors'
import connectToSolicitacoesDatabase from '../../../../utils/solicitacoesDb'
import { ObjectId } from 'mongodb'
import { errorHandler } from '../../../../utils/methods/handlers'
export default async function handler(req, res) {
  if (req.method == 'GET') {
    try {
      let id = req.query.id
      const db = await connectToSolicitacoesDatabase(process.env.DB_KEY)
      const collection = db.collection('analisesTecnicas')
      var arr = await collection.find({ _id: ObjectId(id) }).toArray()
      res.json(arr[0])
    } catch (error) {
      res.status(500).send({ success: false, msg: error })
    }
  } else if (req.method == 'POST') {
    try {
      const id = req.query.id
      const toProject = req.body
      if (!ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
      const db = await connectToSolicitacoesDatabase(process.env.DB_KEY)
      const collection = db.collection('analisesTecnicas')
      const anaysis = await collection.findOne({ _id: ObjectId(id) }, { projection: { ...toProject } })
      if (!anaysis) throw new createHttpError.NotFound('Análise técnica não encontrada.')
      // var arr = await collection
      //   .aggregate([
      //     {
      //       $match: {
      //         _id: ObjectId(id),
      //       },
      //     },
      //     {
      //       $project: toProject,
      //     },
      //   ])
      //   .toArray()
      res.json(anaysis)
    } catch (error) {
      errorHandler(error, res)
    }
  }
}
