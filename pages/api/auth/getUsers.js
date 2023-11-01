import connectToDatabase from '../../../utils/services/mongodb/users'
export default async function handler(req, res) {
  if (req.method == 'GET') {
    try {
      const db = await connectToDatabase(process.env.DB_KEY).catch((err) => {
        throw 'Não foi possível se conectar ao bando de dados.'
      })
      const collection = db.collection('users')
      let allUsers = await collection
        .aggregate([
          {
            $project: {
              password: 0,
            },
          },
        ])
        .toArray()
      res.json(allUsers)
    } catch (error) {
      res.status(400).send(error)
    }
  }
}
