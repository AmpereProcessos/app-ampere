import { TProject } from '@/utils/schemas/projects'
import connectToDatabase from '@/utils/services/mongodb/projects'
import { Collection, Db } from 'mongodb'
import { NextApiHandler } from 'next'

const getFileReferencesRoute: NextApiHandler<any> = async (req, res) => {
  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TProject> = db.collection('dados')

  const projects = await collection.find(
    {},
    {
      projection: {
        _id: 1,
        links: 1,
      },
    }
  )
}
