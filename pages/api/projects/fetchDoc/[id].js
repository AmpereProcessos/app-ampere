import { ObjectId } from 'mongodb'
import connectToDatabase from '../../../../utils/connectDb'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    let id = req.query.id
    console.log(id)
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    var obj = await collection.find({ _id: ObjectId(id) }).toArray()
    res.json(obj)
  }
}
