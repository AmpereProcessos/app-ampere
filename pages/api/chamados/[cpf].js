import connectToDatabase from '../../../utils/services/mongodb/projects'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const filter = Number(req.query.cpf)
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = await db.collection('data')
    let project = collection
      .find({
        cpfcnpj: filter,
      })
      .toArray()
    return res.json(filter)
  }
}
