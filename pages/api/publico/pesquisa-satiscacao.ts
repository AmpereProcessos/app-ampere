import { apiHandler } from '@/utils/api'
import { TNotification } from '@/utils/schemas/notifications'
import { TProject } from '@/utils/schemas/projects'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { Collection, Db, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

type PutResponse = {
  data: string
  message: string
}

const UpdateSchema = z.object({
  satisfaction: z.object({
    venda: z.number({
      required_error: 'Nota de satisfação com o processo de venda não informado.',
      invalid_type_error: 'Tipo não válido para a nota de satisfação com o processo de venda.',
    }),
    entrega: z.number({
      required_error: 'Nota de satisfação com o processo de entrega não informado.',
      invalid_type_error: 'Tipo não válido para a nota de satisfação com o processo de entrega.',
    }),
    execucao: z.number({
      required_error: 'Nota de satisfação com o processo de montagem/execução não informado.',
      invalid_type_error: 'Tipo não válido para a nota de satisfação com o processo de montagem/execução.',
    }),
    posVenda: z.number({
      required_error: 'Nota de satisfação com o processo de pós-venda não informado.',
      invalid_type_error: 'Tipo não válido para a nota de satisfação com o processo de pós-venda.',
    }),
  }),
  indications: z.array(
    z.object({
      nome: z.string({ required_error: 'Nome do indicado não informado.', invalid_type_error: 'Tipo não válido para o nome do indicado.' }),
      telefone: z.string({
        required_error: 'Telefone do indicado não informado.',
        invalid_type_error: 'Tipo não válido para o telefone do indicado.',
      }),
    })
  ),
})

export type TSatisfactionSurveyAnswer = z.infer<typeof UpdateSchema>
const answerSurver: NextApiHandler<PutResponse> = async (req, res) => {
  const { id } = req.query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
  const answer = UpdateSchema.parse(req.body)
  const points = Object.values(answer.satisfaction)
  const nps = Math.ceil(points.reduce((acc, current) => acc + current, 0) / points.length)
  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TProject> = db.collection('dados')
  const notificationsCollection: Collection<TNotification> = db.collection('notificacoes')

  const project = await collection.findOne({ _id: new ObjectId(id) }, { projection: { qtde: 1, nomeDoContrato: 1 } })
  if (!project) throw new createHttpError.NotFound('Projeto não encontrado.')
  await notifyAfterSales({
    projectName: project.nomeDoContrato || '',
    projectIdentifier: project.qtde,
    nps: nps,
    collection: notificationsCollection,
  })
  const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { satisfacao: answer.satisfaction, nps: nps } })
  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao responder a pesquisa.')
  if (!updateResponse.matchedCount) throw new createHttpError.NotFound('Projeto não encontrado.')
  return res.status(201).json({ data: 'Pesquisa respondida com sucesso !', message: 'Pesquisa respondida com sucesso !' })
}

export default apiHandler({ PUT: answerSurver })

type NotifyAfterSalesProps = {
  projectName: string
  projectIdentifier: string | number
  collection: Collection<TNotification>
  nps: number
}
async function notifyAfterSales({ projectName, projectIdentifier, collection, nps }: NotifyAfterSalesProps) {
  try {
    const notification = {
      destinatario: '6353ebc7ef4e1a367a87794b',
      remetente: 'SISTEMA',
      mensagem: `CLIENTE ${projectName} RESPONDEU A PESQUISA DE SATISFAÇÃO, DANDO UM NPS DE ${nps}`,
      projetoReferencia: projectIdentifier,
      nomeDoProjeto: projectName,
      dataDeEnvio: new Date(),
      lido: false,
    }
    const insertResponse = await collection.insertOne(notification)
    if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao criar notificação.')
    return insertResponse.insertedId.toString()
  } catch (error) {
    throw error
  }
}
