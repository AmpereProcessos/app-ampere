import connectToDatabase from '../../../utils/services/mongodb/warehouse'
import { ObjectId } from 'mongodb'
import { getValidCurrentSessionUncached } from '../../../lib/authentication/session'
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { user } = await getValidCurrentSessionUncached()
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('material')
    let { changes } = req.body
    // console.log(req.body);
    changes = changes.map((mat) => {
      return {
        updateOne: {
          filter: { _id: new ObjectId(mat.id) },
          update: {
            $set: {
              recontagem: {
                responsavel: user.name,
                data: new Date().toISOString(),
              },
              qtde: mat.recontagem,
            },
            $push: {
              qtdeAlteracoes: {
                $each: [
                  {
                    dataAlteracao: new Date().toISOString(),
                    responsavel: user.name,
                    anterior: mat.qtdeAnterior,
                    novo: mat.recontagem,
                  },
                ],
                $slice: -10, // limit the array size to 10 items
              },
            },
          },
        },
      }
    })

    const filteredChanges = changes.filter((change) => !!change)
    console.log(filteredChanges)
    await collection.bulkWrite(filteredChanges)

    res.json('UEPA')
  }
}
