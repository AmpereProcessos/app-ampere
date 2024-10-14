import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TProject } from '@/utils/schemas/projects'
import connectToDatabase from '@/utils/services/mongodb/projects'
import { Db } from 'mongodb'
import { NextApiHandler } from 'next'

const getProjectsInDeliveryProcessRoute: NextApiHandler<any> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection<TProject>('dados')

  const projects = await collection
    .find(
      {
        'contrato.status': 'ASSINADO',
        'compra.liberacao': true,
        'compra.dataLiberacao': { $ne: null },
        'compra.dataPedido': { $ne: null },
        'compra.statusEntrega': { $ne: 'ENTREGUE' },
        'compra.status': { $ne: 'CONCLUIDA' },
      },
      {
        projection: {
          _id: 1,
          nomeDoContrato: 1,
          qtde: 1,
          compra: 1,
          vendedor: 1,
          telefone: 1,
          cep: 1,
          uf: 1,
          cidade: 1,
          bairro: 1,
          logradouro: 1,
          numeroResidencia: 1,
        },
      }
    )
    .toArray()

  return res.status(200).json({ data: projects })
}

export default apiHandler({ GET: getProjectsInDeliveryProcessRoute })
