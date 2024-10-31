import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TProject } from '@/utils/schemas/projects'
import { TPurchaseControl } from '@/utils/schemas/purchases'
import connectToDatabase from '@/utils/services/mongodb/projects'
import dayjs from 'dayjs'
import { Db } from 'mongodb'
import { NextApiHandler } from 'next'

const getProjectsInDeliveryProcessRoute: NextApiHandler<any> = async (req, res) => {
  const afterDateWithMargin = dayjs().subtract(7, 'days').startOf('day').toISOString()
  const session = await validateAuthenticationWithSession(req, res)

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  // const collection = db.collection<TProject>('dados')
  const purchaseControlsCollection = db.collection<TPurchaseControl>('controles-compras')

  const addFields = { projectIdAsObjectId: { $toObjectId: '$projeto.id' } }
  const lookup = { from: 'dados', localField: 'projectIdAsObjectId', foreignField: '_id', as: 'projetoDados' }
  const aggregationResult = await purchaseControlsCollection
    .aggregate([
      {
        $match: {
          dataPedido: { $ne: null },
          $or: [{ 'entrega.dataEfetivacao': null }, { 'entrega.dataEfetivacao': { $gte: afterDateWithMargin } }],
        },
      },
      { $addFields: addFields },
      { $lookup: lookup },
      {
        $project: {
          titulo: 1,
          dataPedido: 1,
          entrega: 1,
          fornecedor: 1,
          transporte: 1,
          dataInsercao: 1,
          'projetoDados._id': 1,
          'projetoDados.nomeDoContrato': 1,
          'projetoDados.telefone': 1,
          'projetoDados.vendedor': 1,
        },
      },
    ])
    .toArray()

  const purchaseControls = aggregationResult.map((r) => ({ ...r, projetoDados: r.projetoDados[0] }))
  return res.status(200).json({ data: purchaseControls })
  // const projects = await collection
  //   .find(
  //     {
  //       'contrato.status': 'ASSINADO',
  //       'compra.statusEntrega': 'EM ROTA',
  //       // 'compra.liberacao': true,
  //       // 'compra.dataLiberacao': { $ne: null },
  //       // // 'compra.dataPedido': { $ne: null },
  //       // $or: [{ 'compra.dataEntrega': null, 'compra.status': { $ne: 'CONCLUIDA' } }, { 'compra.dataEntrega': { $gte: afterDateWithMargin } }],
  //     },
  //     {
  //       projection: {
  //         _id: 1,
  //         nomeDoContrato: 1,
  //         qtde: 1,
  //         compra: 1,
  //         vendedor: 1,
  //         telefone: 1,
  //         cep: 1,
  //         uf: 1,
  //         cidade: 1,
  //         bairro: 1,
  //         logradouro: 1,
  //         numeroResidencia: 1,
  //       },
  //     }
  //   )
  //   .toArray()

  // return res.status(200).json({ data: projects })
}

export default apiHandler({ GET: getProjectsInDeliveryProcessRoute })
