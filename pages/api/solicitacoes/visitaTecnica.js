import connectToSolicitacoesDatabase from '../../../utils/solicitacoesDb'
import { ObjectId } from 'mongodb'
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY)
    const collection = db.collection('visitaTecnica')
    let arr = await collection.insertOne({ ...req.body })
    res.json(arr)
  } else if (req.method === 'GET') {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY)
    const collection = db.collection('visitaTecnica')

    let arr = await collection
      .aggregate([
        {
          $project: {
            nomeDoCliente: 1,
            cidade: 1,
            codigoSVB: 1,
            nomeVendedor: 1,
            qtdeModulos: 1,
            status: 1,
            tipoDeLaudo: 1,
            tipoDeSolicitacao: 1,
            dataDeAbertura: 1,
            dataDeConclusao: 1,
            analista: 1,
            solicitacaoContrato: 1,
          },
        },
        {
          $sort: {
            dataDeAbertura: -1,
          },
        },
      ])
      .toArray()
    res.json(arr)
  } else if (req.method === 'PUT') {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY)
    const collection = db.collection('visitaTecnica')
    const changes = { ...req.body }
    delete changes._id
    try {
      var newObj = await collection.updateOne({ _id: ObjectId(req.body._id) }, { $set: { ...changes } })
      res.json(newObj)
    } catch (error) {
      res.json('UM ERRO OCORREU')
    }
  }
}
