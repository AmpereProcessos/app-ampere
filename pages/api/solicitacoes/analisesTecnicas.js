import createError from 'http-errors'
import { errorHandler } from '../../../utils/methods/handlers'
import connectToSolicitacoesDatabase from '../../../utils/solicitacoesDb'

import { ObjectId } from 'mongodb'
import createHttpError from 'http-errors'
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY)
    const collection = db.collection('visitaTecnica')
    let arr = await collection.insertOne({ ...req.body })
    res.json(arr)
  } else if (req.method === 'GET') {
    const { id } = req.query
    try {
      const db = await connectToSolicitacoesDatabase(process.env.DB_KEY)
      const collection = db.collection('analisesTecnicas')
      if (id && typeof id == 'string') {
        const analysisById = await collection.findOne({ _id: new ObjectId(id) })
        if (!analysisById) throw new createHttpError.NotFound('Nenhum análise com o ID fornecido.')
        return res.status(200).json(analysisById)
      }
      const allAnalysis = await collection
        .aggregate([
          {
            $project: {
              nome: 1,
              status: 1,
              tipoSolicitacao: 1,
              complexidade: 1,
              analista: 1,
              requerente: 1,
              'projeto.nome': 1,
              'projeto.identificador': 1,
              'localizacao.uf': 1,
              'localizacao.cidade': 1,
              dataInsercao: 1,
              dataEfetivacao: 1,
            },
          },
          {
            $sort: {
              dataInsercao: -1,
            },
          },
        ])
        .toArray()
      res.json(allAnalysis)
    } catch (error) {
      errorHandler(error, res)
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query
      if (!id || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
      const db = await connectToSolicitacoesDatabase(process.env.DB_KEY)
      const collection = db.collection('analisesTecnicas')
      const { changes } = req.body
      console.log(changes)
      delete changes._id

      var newObj = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } })
      res.json(newObj)
    } catch (error) {
      errorHandler(error, res)
    }
  }
}
