import { ObjectId } from 'mongodb'
import connectToDatabase from '../../../../utils/services/mongodb/calls'
export default async function handler(req, res) {
  if (req.method == 'POST') {
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('adm')
    let arr = await collection.insertOne({
      ...req.body,
      status: 'ABERTO',
      dataAbertura: new Date(),
    })
    console.log(req.body)
    res.json('Chamado aberto!')
  } else if (req.method == 'GET') {
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('adm')
    let openCalls = await collection
      .find({
        status: 'ABERTO',
      })
      .toArray()
    let closedCalls = await collection
      .find({
        status: 'FINALIZADO',
      })
      .toArray()
    res.json({ openCalls: openCalls, closedCalls: closedCalls })
  } else if (req.method == 'PUT') {
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('adm')
    let newObj = await collection.findOneAndUpdate(
      { _id: ObjectId(req.body.id) },
      {
        $set: {
          ...req.body.changes,
          dataDeConclusao: req.body.changes.status == 'FINALIZADO' ? new Date() : null,
        },
      },
      { returnDocument: 'after' }
    )
    console.log(req.body)
    res.json(newObj)
  }
}
