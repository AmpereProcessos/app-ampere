import { ObjectId } from 'mongodb'
import connectToDatabase from '../../../utils/services/mongodb/inside-sales'
export default async function handler(req, res) {
  if (req.method == 'GET') {
    const after = req.query.after
    const before = req.query.before
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('leads')
    var arr = await collection
      .aggregate([
        {
          $match: {
            dataDeEnvio: {
              $gte: after,
              $lt: before,
            },
          },
        },
        {
          $sort: {
            dataDeEnvio: -1,
          },
        },
      ])
      .toArray()
    res.json(arr)
  } else if (req.method == 'POST') {
    // const after = req.body.after;
    // const before = req.body.before;
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('leads')
    console.log(req.body)
    var arr = await collection
      .aggregate([
        {
          $match: req.body.match,
        },
        {
          $sort: {
            dataDeEnvio: -1,
          },
        },
      ])
      .toArray()
    res.json(arr)
  } else if (req.method == 'PUT') {
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('leads')
    var id = req.body.id
    var changes = req.body.changes
    delete changes._id
    console.log(changes)
    var newObj = await collection.updateOne(
      {
        _id: ObjectId(id),
      },
      {
        $set: { ...changes },
      }
    )
    res.json('OK')
  } else if (req.method === 'DELETE') {
    try {
      const db = await connectToDatabase(process.env.DB_KEY).catch((err) => {
        throw new Error('Erro ao se conectar com o servidor.')
      })
      const collection = db.collection('leads')
      const id = req.query.id
      console.log(id)
      var newObj = await collection.deleteOne({ _id: ObjectId(id) })
      res.json(newObj)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
