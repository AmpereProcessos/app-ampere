import connectToDatabase from '../../../utils/services/mongodb/projects'
import { InsertRevenueSchema, TRevenue, TRevenueWithProjectDTO } from '../../../utils/schemas/revenues'
import { NextApiHandler } from 'next'
import { apiHandler, validateAuthenticationWithSession } from '../../../utils/api'
import createHttpError from 'http-errors'
import { Collection, Db, ObjectId } from 'mongodb'
import { TIntegration } from '@/utils/schemas/integrations'
import { getContaAzulAccessToken } from '@/repositories/integrations/conta-azul/queries'
import { createSaleFromRevenue } from '@/lib/integrations/conta-azul'
type GetResponse = {
  data: TRevenue | TRevenue[]
}

const getRevenues: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id, projectId } = req.query

  const db: Db = await connectToDatabase()
  const collection: Collection<TRevenue> = db.collection('receitas')

  // Query for a specific revenue
  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

    const addFields = { projectIdAsObjectId: { $toObjectId: '$projeto.id' } }
    const lookup = { from: 'dados', localField: 'projectIdAsObjectId', foreignField: '_id', as: 'projetoDados' }
    const revenueArr = await collection
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        { $addFields: addFields },
        { $lookup: lookup },
        {
          $project: {
            nome: 1,
            tipo: 1,
            autor: 1,
            projeto: 1,
            total: 1,
            metodo: 1,
            efetivacao: 1,
            fracionamento: 1,
            dataInsercao: 1,
            'projetoDados._id': 1,
            'projetoDados.nomeDoContrato': 1,
            'projetoDados.cpf_cnpj': 1,
            'projetoDados.inscricaoRural': 1,
            'projetoDados.tipoDeServico': 1,
            'projetoDados.telefone': 1,
            'projetoDados.email': 1,
            'projetoDados.cep': 1,
            'projetoDados.uf': 1,
            'projetoDados.cidade': 1,
            'projetoDados.bairro': 1,
            'projetoDados.logradouro': 1,
            'projetoDados.numeroResidencia': 1,
            'projetoDados.pagamento.pagador': 1,
            'projetoDados.pagamento.contatoPagador': 1,
            'projetoDados.pagamento.cpf_cnpjPagador': 1,
            'projetoDados.pagamento.forma': 1,
            'projetoDados.pagamento.metodo': 1,
            'projetoDados.pagamento.credor': 1,
            'projetoDados.pagamento.credorNomeGerente': 1,
            'projetoDados.pagamento.credorContatoGerente': 1,
            'projetoDados.pagamento.negociacao': 1,
            'projetoDados.produtos': 1,
            'projetoDados.servicos': 1,
          },
        },
      ])
      .toArray()
    const revenue = revenueArr.map((p) => ({ ...p, projetoDados: p.projetoDados[0] }))[0]
    if (!revenue) throw new createHttpError.NotFound('Receita não encontrada.')
    return res.status(200).json({ data: revenue as TRevenueWithProjectDTO })
  }
  // Query for a given project revenues
  if (projectId) {
    if (typeof projectId != 'string') throw new createHttpError.BadRequest('ID de projeto inválido.')
    const revenues = await collection.find({ 'projeto.id': projectId }, { sort: { 'efetivacao.data': -1, dataInsercao: 1 } }).toArray()
    return res.status(200).json({ data: revenues })
  }
  // Query for all revenues
  const revenues = await collection.find({}, { sort: { 'efetivacao.data': -1, dataInsercao: 1 } }).toArray()
  return res.status(200).json({ data: revenues })
}

type PostResponse = {
  data: {
    insertedId: string
  }
  message: string
}

const createRevenue: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const revenue = InsertRevenueSchema.parse(req.body)
  const author = { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url }
  const db: Db = await connectToDatabase()
  const revenuesCollection: Collection<TRevenue> = db.collection('receitas')
  const integrationsCollection: Collection<TIntegration> = db.collection('integracoes')

  // const contaAzulAccessToken = await getContaAzulAccessToken({ collection: integrationsCollection })

  // const { contaAzulSaleId } = await createSaleFromRevenue({ revenue, accessToken: contaAzulAccessToken })
  const insertResponse = await revenuesCollection.insertOne({
    ...revenue,
    // idContaAzulVenda: contaAzulSaleId,
    autor: author,
    dataInsercao: new Date().toISOString(),
  })

  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro na criação da receita.')

  return res.status(201).json({ data: { insertedId: insertResponse.insertedId.toString() }, message: 'Receita criada com sucesso !' })
}

type PutResponse = {
  data: string
  message: string
}

const editRevenue: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id } = req.query
  if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
  const changes = InsertRevenueSchema.partial().parse(req.body)

  console.log(changes)
  const db: Db = await connectToDatabase()
  const collection: Collection<TRevenue> = db.collection('receitas')

  const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } })

  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro ao atualizar receita.')

  return res.status(201).json({ data: 'Receita atualizada com sucesso!', message: 'Receita atualizada com sucesso!' })
}
export default apiHandler({ GET: getRevenues, POST: createRevenue, PUT: editRevenue })
// async function handler(req, res) {
//   if (req.method == 'GET') {
//     const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//     const collection = db.collection('receitas')
//     const { projectId } = req.query
//     try {
//       if (projectId && typeof projectId == 'string') {
//         // Project related revenues
//         const revenues = await collection
//           .aggregate([
//             {
//               $match: {
//                 'projeto.id': projectId,
//               },
//             },
//           ])
//           .toArray()
//         res.status(200).json(revenues)
//       } else {
//         // All revenues
//         const revenues = await collection.aggregate([{ $sort: { dataInsercao: -1 } }]).toArray()
//         res.status(200).json(revenues)
//       }
//     } catch (error) {
//       errorHandler(error, res)
//     }
//   }
// }
