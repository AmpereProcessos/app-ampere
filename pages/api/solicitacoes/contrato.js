import createHttpError from 'http-errors'
import { formatProjectCode } from '../../../utils/constants'
import connectToSolicitacoesDatabase from '../../../utils/services/mongodb/requests'
import { ObjectId } from 'mongodb'
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY)
    const collection = db.collection('contrato')
    const svbCode = formatProjectCode(req.body.codigoSVB)
    let arr = await collection.insertOne({
      ...req.body,
      codigoSVB: svbCode,
      dataSolicitacao: new Date().toISOString(),
    })
    res.json(arr)
  } else if (req.method === 'GET') {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY)
    const collection = db.collection('contrato')
    const { id } = req.query

    if (id) {
      if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
      const contractRequest = await collection.findOne({ _id: new ObjectId(id) })
      if (!contractRequest) throw new createHttpError.BadRequest('Solicitação de contrato não encontrada.')
      return res.status(200).json(contractRequest)
    }
    let arr = await collection
      .aggregate([
        {
          $project: {
            nomeDoContrato: 1,
            codigoSVB: 1,
            nomeVendedor: 1,
            tipoDeServico: 1,
            cidade: 1,
            confeccionado: 1,
            dataSolicitacao: 1,
            aprovacao: 1,
            dataAprovacao: 1,
            idVisitaTecnica: 1,
            idProjetoCRM: 1,
            idPropostaCRM: 1,
          },
        },
        {
          $sort: {
            dataSolicitacao: -1,
          },
        },
      ])
      .toArray()
    return res.status(200).json(arr)
  } else if (req.method === 'PUT') {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY)
    const collection = db.collection('contrato')
    const { id } = req.query
    if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
    delete req.body._id
    var newObj = await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...req.body } })
    return res.status(201).json(newObj)
  }
}
