import connectToDatabase from '../../../utils/services/mongodb/warehouse'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { materialId } = req.query
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('alteracoes')
    if (materialId) {
      const materialLogs = await collection
        .aggregate([
          {
            $match: {
              'material.id': materialId,
            },
          },
          {
            $project: {
              autor: 1,
              alteracao: 1,
              qtdeAnterior: 1,
              qtdeNovo: 1,
              tipo: 1,
              dataInsercao: 1,
            },
          },
        ])
        .toArray()
      res.status(200).json(materialLogs)
    } else {
      const logs = await collection.find().toArray()
      res.status(200).json(logs)
    }
  }
}
