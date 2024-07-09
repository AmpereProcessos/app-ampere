import { NextApiHandler } from 'next'
import connectToDatabase from '../../../utils/services/mongodb/projects'
import { TProject, TProjectDTO } from '@/utils/schemas/projects'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import createHttpError from 'http-errors'
import { Collection, Db } from 'mongodb'

type GetResponse = {
  data: TProject[]
}
const getSellerSales: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const visualization = session.user.visualizacao.tipo
  if (visualization != 'VENDAS') throw new createHttpError.BadRequest('Grau de visualização inválido.')
  const seller = session.user.visualizacao.referencia || ''
  const query = { 'vendedor.nome': seller }
  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TProject> = db.collection('dados')

  const projects = await collection
    .find(
      { 'contrato.status': { $ne: 'RESCISÃO DE CONTRATO' }, ...query },
      {
        projection: {
          qtde: 1,
          nomeDoContrato: 1,
          tipoDeServico: 1,
          'contrato.status': 1,
          'contrato.dataAssinatura': 1,
          'compra.liberacao': 1,
          'compra.status': 1,
          'compra.dataPagamento': 1,
          'compra.dataEntrega': 1,
          'pagamento.status': 1,
          'pagamento.dataRecebimento': 1,
          'homologacao.status': 1,
          'homologacao.acesso': 1,
          cidade: 1,
          uf: 1,
          telefone: 1,
          'obra.statusDaObra': 1,
          'obra.saida': 1,
          'manutencaoPreventiva.data': 1,
          'homologacao.vistoria': 1,
          'oem.plano': 1,
          nps: 1,
        },
      }
    )
    .toArray()
  return res.status(200).json({ data: projects })
}

export default apiHandler({ GET: getSellerSales })
// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//     const collection = db.collection('dados')
//     var queryKey
//     var queryValue
//     if (req.body.filtrarPor == 'REGIONAL') {
//       queryKey = 'regional'
//       queryValue = req.body.parametro
//     } else if (req.body.filtrarPor == 'VENDEDOR') {
//       queryKey = 'vendedor.nome'
//       queryValue = req.body.parametro
//     } else if (req.body.filtrarPor == 'INSIDE') {
//       queryKey = 'insider'
//       queryValue = req.body.parametro
//     }

//     let vendas = await collection
//       .aggregate([
//         {
//           $match: {
//             'contrato.status': { $ne: 'RESCISÃO DE CONTRATO' },
//             [`${queryKey}`]: queryValue,
//           },
//         },
//         {
//           $project: {
//             qtde: 1,
//             nomeDoContrato: 1,
//             'contrato.status': 1,
//             'contrato.dataAssinatura': 1,
//             'compra.dataPagamento': 1,
//             'pagamento.status': 1,
//             cidade: 1,
//             'obra.statusDaObra': 1,
//             'vistoria.status': 1,
//             nps: 1,
//           },
//         },
//         {
//           $sort: {
//             qtde: -1,
//           },
//         },
//       ])
//       .toArray()
//     res.json(vendas)
//   }
// }
