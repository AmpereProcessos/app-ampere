import { NextApiHandler } from 'next'
import connectToDatabase from '../../../utils/services/mongodb/projects'
import { Collection, Db, ObjectId } from 'mongodb'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TProject, TProjectDTO } from '@/utils/schemas/projects'

const InstallationStructureProjection = {
  qtde: 1,
  nomeDoContrato: 1,
  segmento: 1,
  'compra.statusLiberacao': 1,
  cidade: 1,
  uf: 1,
  cep: 1,
  telefone: 1,
  bairro: 1,
  logradouro: 1,
  numeroResidencia: 1,
  'homologacao.documentacao.dataAssinatura': 1,
  'compra.statusEntrega': 1,
  'compra.dataPedido': 1,
  'compra.dataEntrega': 1,
  'compra.previsaoEntrega': 1,
  'compra.dataPagamento': 1,
  'obra.saida': 1,
  estruturaPersonalizada: 1,
  'sistema.qtdeModulos': 1,
}

export type TInstallationStructureExecution = Pick<
  TProjectDTO,
  | '_id'
  | 'qtde'
  | 'nomeDoContrato'
  | 'segmento'
  | 'telefone'
  | 'compra'
  | 'obra'
  | 'cidade'
  | 'uf'
  | 'cep'
  | 'bairro'
  | 'logradouro'
  | 'numeroResidencia'
  | 'homologacao'
  | 'estruturaPersonalizada'
  | 'sistema'
>

type GetResponse = {
  data: TInstallationStructureExecution[]
}
export const getInstallationStructureExecutionsRoute: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TProject> = db.collection('dados')

  const projects = await collection.find({ 'estruturaPersonalizada.aplicavel': 'SIM' }, { projection: InstallationStructureProjection }).toArray()

  return res.status(200).json({ data: projects.map((p) => ({ ...p, _id: p._id.toString() })) as TInstallationStructureExecution[] })
}

export default apiHandler({ GET: getInstallationStructureExecutionsRoute })
