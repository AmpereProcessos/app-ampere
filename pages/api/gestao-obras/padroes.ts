import { NextApiHandler } from 'next'
import connectToDatabase from '../../../utils/services/mongodb/projects'
import { Collection, Db, ObjectId } from 'mongodb'
import { validateAuthenticationWithSession } from '@/utils/api'
import { TProject } from '@/utils/schemas/projects'

const EnergyPAExecutionProjection = {
  _id: 1,
  qtde: 1,
  nomeDoContrato: 1,
  'compra.dataPedido': 1,
  'compra.previsaoEntrega': 1,
  cidade: 1,
  uf: 1,
  telefone: 1,
  cep: 1,
  bairro: 1,
  logradouro: 1,
  numeroResidencia: 1,
  'homologacao.documentacao.dataAssinatura': 1,
  'homologacao.status': 1,
  padrao: 1,
  visitaTecnica: 1,
  ordensDeServico: 1,
}

type TEnergyPAExecution = Pick<
  TProject,
  | 'nomeDoContrato'
  | 'compra'
  | 'cidade'
  | 'uf'
  | 'telefone'
  | 'cep'
  | 'bairro'
  | 'logradouro'
  | 'numeroResidencia'
  | 'homologacao'
  | 'padrao'
  | 'visitaTecnica'
>

// const getEnergyPAExecutions: NextApiHandler<any> = async (req, res) => {
//   const session = await validateAuthenticationWithSession(req, res)

//   const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//   const collection: Collection<TProject> = db.collection('dados')

//   const projects = await collection.find({ 'padrao.aumentoCarga.aplicavel': true })
// }

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    let arr = await collection
      .aggregate([
        {
          $sort: {
            qtde: 1,
          },
        },
        {
          $match: {
            'padrao.aumentoCarga.aplicavel': true,
          },
        },
        {
          $project: {
            _id: 1,
            qtde: 1,
            nomeDoContrato: 1,
            'compra.dataPedido': 1,
            'compra.previsaoEntrega': 1,
            cidade: 1,
            uf: 1,
            telefone: 1,
            cep: 1,
            bairro: 1,
            logradouro: 1,
            numeroResidencia: 1,
            'homologacao.documentacao.dataAssinatura': 1,
            'homologacao.status': 1,
            padrao: 1,
            visitaTecnica: 1,
            ordensDeServico: 1,
          },
        },
      ])
      .toArray()
    res.json(arr)
  } else if (req.method === 'POST') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    var newObj = await collection.updateOne({ _id: ObjectId(req.body.id) }, { $set: { ...req.body.mudancas } })
    return res.json(newObj)
  }
}
