import { apiHandler } from '@/utils/api'
import connectToDatabase from '../../../utils/services/mongodb/projects'
import { NextApiHandler } from 'next'

type PostResponse = any

const runSMBOTTest: NextApiHandler<PostResponse> = async (req, res) => {
  const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection = db.collection('teste')
  const body = req.body
  await collection.insertOne(body)
  //f191433e-0d40-40f4-97ed-2abc52477c36
  return res.status(201).json({
    type: 'CREATE_CUSTOMER_SERVICE',
    departmentUUID: 'f191433e-0d40-40f4-97ed-2abc52477c36',
    text: '',
  })
}

export default apiHandler({ POST: runSMBOTTest })
