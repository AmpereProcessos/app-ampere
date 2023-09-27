import connectToDatabase from '../../../utils/connectDb'
import { ObjectId } from 'mongodb'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    let arr = await collection
      .aggregate([
        {
          $sort: {
            qtde: 1,
          },
        },
        {
          $match: {
            'estruturaPersonalizada.aplicavel': 'SIM',
          },
        },
        {
          $project: {
            qtde: 1,
            nomeDoContrato: 1,
            'compra.statusLiberacao': 1,
            cidade: 1,
            uf: 1,
            cep: 1,
            telefone: 1,
            bairro: 1,
            logradouro: 1,
            numeroResidencia: 1,
            'projeto.dataAssDocumentacao': 1,
            'compra.statusEntrega': 1,
            'compra.dataEntrega': 1,
            'compra.previsaoEntrega': 1,
            estruturaPersonalizada: 1,
            'sistema.qtdeModulos': 1,
            ordensDeServico: 1,
          },
        },
      ])
      .toArray()
    res.json(arr)
  } else if (req.method === 'POST') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    var newObj = await collection.updateOne({ _id: ObjectId(req.body.id) }, { $set: { ...req.body.mudancas } })
    return res.json(newObj)
  }
}
