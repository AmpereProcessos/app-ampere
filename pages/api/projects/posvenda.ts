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
          tipoDeServico: { $ne: 'OPERAÇÃO E MANUTENÇÃO' },
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
          'dadosCemig.distCreditos': 1,
          'parecer.statusDoParecerDeAcesso': 1,
          'parecer.dataParecerDeAcesso': 1,
          'projeto.iniciar': 1,
          'projeto.dataLiberacaoDocumentacao': 1,
          'projeto.dataAssDocumentacao': 1,
          'projeto.dataSolicitacaoAcesso': 1,
          'compra.status': 1,
          'compra.statusEntrega': 1,
          'compra.statusLiberacao': 1,
          'compra.previsaoEntrega': 1,
          'compra.dataPagamento': 1,
          'obra.entrada': 1,
          'obra.saida': 1,
          'obra.statusDaObra': 1,
          'faturamento.previsaoFaturamento': 1,
          'faturamento.dataFaturamento': 1,
          'sistema.qtdeModulos': 1,
          'medidor.data': 1,
          'vistoria.status': 1,
          'vistoria.dataPedido': 1,
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
