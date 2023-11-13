import { apiHandler } from '@/utils/api'
import connectToDatabase from '../../../utils/services/mongodb/projects'
import { NextApiHandler } from 'next'

type PostResponse = string

const runSMBOTTest: NextApiHandler<PostResponse> = async (req, res) => {
  const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection = db.collection('teste')
  const body = req.body
  await collection.insertOne(body)
  return res.status(201).json('Criado com sucesso !')
}

export default apiHandler({ POST: runSMBOTTest })
