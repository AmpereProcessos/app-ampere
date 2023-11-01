import createHttpError from 'http-errors'
import connectToDatabase from '../../../../utils/services/mongodb/projects'
import { errorHandler } from '../../../../utils/methods/handlers'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('FUI CHAMADO OEM RELATORIO')
      const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
      const collection = db.collection('dados')
      const data = await collection
        .aggregate([
          {
            $match: {
              'contrato.status': 'ASSINADO',
              'medidor.data': { $ne: null },
              'manutencaoPreventiva.data': { $in: [null] },
              'oem.plano': { $nin: [null, 'NÃO SE APLICA'] },
            },
          },
          {
            $project: {
              nomeDoContrato: 1,
              'medidor.data': 1,
              'sistema.qtdeModulos': 1,
              cidade: 1,
              'sistema.topologia': 1,
            },
          },
          {
            $sort: {
              'medidor.data': 1,
            },
          },
        ])
        .toArray()
      if (!Array.isArray(data)) throw new createHttpError.InternalServerError('Erro ao buscar informações para relatório')
      res.json(data)
    } catch (error) {
      errorHandler(error, res)
    }
  }
}
