import connectToDatabase from '../../../utils/services/mongodb/projects'
import { ObjectId } from 'mongodb'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    let arr = await collection
      .aggregate([
        {
          $match: {
            'compra.statusEntrega': 'ENTREGUE',
            'compra.previsaoEntrega': { $ne: null },
            'compra.dataEntrega': { $ne: null },
          },
        },
        {
          $addFields: {
            tempoPassado: {
              $dateDiff: {
                startDate: { $toDate: '$compra.dataEntrega' },
                endDate: { $toDate: new Date().toISOString() },
                unit: 'day',
              },
            },
          },
        },
        {
          $project: {
            qtde: 1,
            nomeDoContrato: 1,
            compra: 1,
            material: 1,
            tempoPassado: 1,
          },
        },
        {
          $match: {
            $and: [{ tempoPassado: { $gte: 0 } }, { tempoPassado: { $lt: 15 } }],
          },
        },
        {
          $sort: {
            tempoPassado: -1,
          },
        },
      ])
      .toArray()
    res.json(arr)
  } else if (req.method === 'POST') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    var newObj = await collection.updateOne({ _id: ObjectId(req.body.id) }, { $set: { ...req.body.mudancas } })
    console.log(req.body)
    return res.json('OK')
  }
}
