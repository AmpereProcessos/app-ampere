import { ObjectId } from 'mongodb'
import { errorHandler } from '../../../utils/methods/handlers'
import createHttpError from 'http-errors'
import connectToDatabase from '../../../utils/crmDb'

export default async function handler(req, res) {
  if (req.method == 'POST') {
    const info = req.body

    try {
      const crmDb = await connectToDatabase(process.env.CRM_KEY)
      const eventsCollection = crmDb.collection('projectsEvents')

      const dbResponse = await eventsCollection.insertOne({
        ...info,
        dataInsercao: new Date().toISOString(),
      })
      return res.json(dbResponse)
    } catch (error) {
      errorHandler(error, res)
    }
  }
}
