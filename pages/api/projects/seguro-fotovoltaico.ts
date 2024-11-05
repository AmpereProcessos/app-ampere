import { apiHandler } from '@/utils/api'
import { TProject } from '@/utils/schemas/projects'
import { TRevenue } from '@/utils/schemas/revenues'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { Db, Filter, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

const UFVInsuranceProjectProjection = {
  _id: 1,
  qtde: 1,
  nomeDoContrato: 1,
  cpf_cnpj: 1,
  telefone: 1,
  email: 1,
  cep: 1,
  uf: 1,
  cidade: 1,
  bairro: 1,
  logradouro: 1,
  numeroResidencia: 1,
  longitude: 1,
  latitude: 1,
  'contrato.dataAssinatura': 1,
  'contrato.status': 1,
  'sistema.valorProjeto': 1,
  seguro: 1,
  'receita._id': 1,
  'receita.nome': 1,
  'receita.total': 1,
  'receita.metodo': 1,
  'receita.fracionamento': 1,
}
export type TProjectUFVInsurance = Pick<
  TProject,
  | 'qtde'
  | 'nomeDoContrato'
  | 'cpf_cnpj'
  | 'telefone'
  | 'email'
  | 'cep'
  | 'uf'
  | 'cidade'
  | 'bairro'
  | 'logradouro'
  | 'numeroResidencia'
  | 'longitude'
  | 'latitude'
  | 'seguro'
> & {
  sistema: {
    valorProjeto: TProject['sistema']['valorProjeto']
  }
  contrato: {
    dataAssinatura: TProject['contrato']['dataAssinatura']
    status: TProject['contrato']['status']
  }
  receita: {
    _id: string
    nome: TRevenue['nome']
    total: TRevenue['total']
    metodo: TRevenue['metodo']
    fracionamento: TRevenue['fracionamento']
  } | null
}
export type TProjectUFVInsuranceDTO = TProjectUFVInsurance & { _id: string }

type GetResponse = {
  data: TProjectUFVInsurance | TProjectUFVInsurance[]
}
const getUFVInsuranceProjectsRoute: NextApiHandler<GetResponse> = async (req, res) => {
  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection<TProject>('dados')

  const { id } = req.query

  const match: Filter<TProject> = { tipoDeServico: 'SEGURO DE SISTEMA FOTOVOLTAICO' }
  const addFields = { idAsString: { $toString: '$_id' } }
  const lookup = { from: 'receitas', localField: 'idAsString', foreignField: 'projeto.id', as: 'receita' }

  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
    const projectsArr = await collection
      .aggregate([
        {
          $match: { ...match, _id: new ObjectId(id) },
        },
        {
          $addFields: addFields,
        },
        {
          $lookup: lookup,
        },
        {
          $project: UFVInsuranceProjectProjection,
        },
      ])
      .toArray()

    const projectsArrFormatted = projectsArr.map((p) => ({ ...p, receita: p.receita[0] || null })) as TProjectUFVInsurance[]

    const project = projectsArrFormatted[0]
    if (!project) throw new createHttpError.NotFound('Projeto não encontrado.')

    return res.status(200).json({ data: project })
  }

  const projectsArr = await collection
    .aggregate([
      {
        $match: match,
      },
      {
        $addFields: addFields,
      },
      {
        $lookup: lookup,
      },
      {
        $project: UFVInsuranceProjectProjection,
      },
    ])
    .toArray()

  const projects = projectsArr.map((p) => ({ ...p, receita: p.receita[0] || null })) as TProjectUFVInsurance[]

  return res.status(200).json({ data: projects })
}

export default apiHandler({ GET: getUFVInsuranceProjectsRoute })
