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
    // {
    //   $addFields: {
    //     dataInsercao: {
    //       $toDate: "$_id";
    //     }
    //   }
    // }
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
          },
        },
        {
          $sort: {
            dataSolicitacao: -1,
          },
        },
      ])
      .toArray()
    res.status(200).json(arr)
  } else if (req.method === 'PUT') {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY)
    const collection = db.collection('contrato')
    const id = req.body._id
    delete req.body._id
    var newObj = await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...req.body } })
    res.json(newObj)
  }
}
