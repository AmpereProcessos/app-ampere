import connectToDatabase from '../../../../utils/services/mongodb/calls'
import { ObjectId } from 'mongodb'
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('suporte')
    var changes = { ...req.body }
    delete changes._id
    let newDocument = await collection.findOneAndUpdate(
      {
        _id: ObjectId(req.body._id),
      },
      {
        $set: { ...changes },
      },
      { returnNewDocument: true }
    )
    return res.json(newDocument)
  } else if (req.method === 'PUT') {
    const db = await connectToDatabase(process.env.DB_KEY, 'chamados')
    const collection = db.collection('suporte')
    var changes = { ...req.body }
    delete changes._id
    let newDocument = await collection.findOneAndUpdate(
      {
        _id: ObjectId(req.body._id),
      },
      {
        $set: { ...changes },
      },
      { returnNewDocument: true }
    )
    return res.json('Alterações feitas!')
  }
}
