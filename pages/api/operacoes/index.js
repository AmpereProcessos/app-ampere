import { ObjectId } from 'mongodb'
import connectToDatabase from '../../../utils/services/mongodb/operations'
export default async function handler(req, res) {
  if (req.method == 'POST') {
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('dados')
    const info = req.body
    try {
      await collection.insertOne(info)
      res.status(201).json('Operação criada com sucesso.')
    } catch (error) {
      res.status(500).json('Erro na criação da operação')
    }
  } else if (req.method == 'GET') {
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('dados')
    const { equipe } = req.query
    if (equipe == 'undefined') {
      const operations = await collection.find({}).toArray()
      res.status(200).json(operations)
    } else {
      const operations = await collection.find({ equipe: equipe }).toArray()
      res.status(200).json(operations)
    }
  } else if (req.method == 'PUT') {
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('dados')
    const id = req.body._id
    const body = { ...req.body }
    console.log(id, body)
    delete body._id
    var newObj = await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...body } })
    res.json(newObj)
  }
}
