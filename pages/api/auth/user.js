import { errorHandler } from '../../../utils/methods/handlers'
import connectToDatabase from '../../../utils/usersDb'
import { ObjectId } from 'mongodb'
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('users')
    /*let credential = await collection.findOne({ user: user });
    try {
      if (!credential) {
        throw "Usuário inexistente";
      } else if (credential.password == password) {
        res.status(201).json({ credentials: credential });
      } else {
        throw "Senha inválida";
      }
    } catch (err) {
      res.json({ error: err });
    }*/
    await collection.insertOne(req.body)
    return res.json('Usuário criado')
  } else if (req.method === 'GET') {
    try {
      const db = await connectToDatabase(process.env.DB_KEY)
      const collection = db.collection('users')
      let users = await collection
        .aggregate([
          {
            $project: {
              _id: 1,
              nome: 1,
              avatar_url: 1,
            },
          },
          {
            $sort: {
              nome: 1,
            },
          },
        ])
        .toArray()
      res.status(200).json(users)
    } catch (error) {
      errorHandler(error, res)
    }
  } else if (req.method === 'PUT') {
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('users')
    const id = req.body.id
    const changes = req.body.changes
    delete changes._id
    console.log(id, changes)
    let item = await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...changes } })
    res.json('Informações do usuário alteradas.')
  }
}
