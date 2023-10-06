import { ObjectId } from 'mongodb'
import connectToDatabase from '../../../../utils/connectDb'
import { getSession } from 'next-auth/react'
import { errorHandler } from '../../../../utils/methods/handlers'
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const session = await getSession({ req: req })
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    const logCollection = db.collection('logAlteracoes')
    delete req.body._id

    // logging changes in changes collections
    const logObject = {
      autor: {
        id: session?.user?.id,
        nome: session?.user?.name,
      },
      idProjetoAlterado: req.query.id,
      alteracoes: req.body,
      dataAlteracao: new Date().toISOString(),
      dataAlteracaoFormatada: new Date().toLocaleString('pt-br'),
    }
    if (session && Object.keys(req.body).length > 0) {
      await logCollection.insertOne(logObject)
    }
    // let obj = await collection.findOne({ _id: ObjectId(req.query.id) });
    var newObj = await collection.updateOne({ _id: ObjectId(req.query.id) }, { $set: { ...req.body } })
    // var newObj = { ...obj, ...req.body };
    return res.json(newObj)
  } else if (req.method == 'PUT') {
    try {
      const db = await connectToDatabase(process.env.DB_KEY, 'projetos').catch((err) => {
        throw err
      })
      const collection = db.collection('dados')
      const id = req.query.id
      const operation = req.body.operation
      console.log(operation)
      var newObj = await collection.updateOne(
        {
          _id: ObjectId(id),
        },
        { ...operation }
      )
      res.json(newObj)
    } catch (error) {
      errorHandler(error, res)
    }
  }
}
