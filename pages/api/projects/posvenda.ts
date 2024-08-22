import { NextApiHandler } from 'next'
import connectToDatabase from '../../../utils/services/mongodb/projects'
import { Collection, Db } from 'mongodb'
import { apiHandler } from '@/utils/api'
import { TProject } from '@/utils/schemas/projects'

type GetResponse = any

const getProjects: NextApiHandler<GetResponse> = async (req, res) => {
  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TProject> = db.collection('dados')
  const projects = await collection
    .aggregate([
      {
        $match: {
          'contrato.status': {
            $in: ['ASSINADO'],
          },
          tipoDeServico: { $nin: ['OPERAÇÃO E MANUTENÇÃO', 'CONSÓRCIO DE ENERGIA'] },
          'jornada.jornadaConcluida': { $ne: true },
        },
      },
      {
        $addFields: {
          idString: { $toString: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'atividades',
          localField: 'idString',
          foreignField: 'projeto.id',
          as: 'atividades',
        },
      },
      {
        $project: {
          _id: 1,
          qtde: 1,
          nomeDoContrato: 1,
          tipoDeServico: 1,
          telefone: 1,
          jornada: 1,
          cidade: 1,
          'contrato.status': 1,
          'contrato.dataAssinatura': 1,
          'vendedor.nome': 1,
          'homologacao.status': 1,
          'homologacao.acesso': 1,
          'homologacao.documentacao': 1,
          'homologacao.dataLiberacao': 1,
          'homologacao.vistoria': 1,
          'homologacao.instalacao': 1,
          'compra.status': 1,
          'compra.statusEntrega': 1,
          'compra.statusLiberacao': 1,
          'compra.previsaoEntrega': 1,
          'compra.dataPedido': 1,
          'compra.dataEntrega': 1,
          'compra.dataPagamento': 1,
          'compra.fornecedor': 1,
          'obra.entrada': 1,
          'obra.saida': 1,
          'obra.statusDaObra': 1,
          'faturamento.previsaoFaturamento': 1,
          'faturamento.dataFaturamento': 1,
          'sistema.qtdeModulos': 1,
          seguro: 1,
          possuiDeficiencia: 1,
          qualDeficiencia: 1,
          nps: 1,
          atividades: 1,
        },
      },
      {
        $sort: {
          qtde: 1,
        },
      },
    ])
    .toArray()
  res.status(200).json(projects)
}
export default apiHandler({
  GET: getProjects,
})
