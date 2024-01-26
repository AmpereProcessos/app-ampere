import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TExpense } from '@/utils/schemas/expenses'
import { TMaterialUpdateRegistry } from '@/utils/schemas/material-updates-registry'
import { TMaterial } from '@/utils/schemas/materials'
import { TProject } from '@/utils/schemas/projects'
import connectToDatabase from '@/utils/services/mongodb/projects'
import connectToWarehouseDatabase from '@/utils/services/mongodb/warehouse'
import createHttpError from 'http-errors'
import { Collection, Db, ObjectId, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

const FormularyIdSchema = z.string({ invalid_type_error: 'Tipo inválido para o ID do formulário.' }).optional().nullable()
const UpdateSchema = z.object({
  id: z.string({ invalid_type_error: 'Tipo inválido para o ID do materia.' }),
  nome: z.string({ invalid_type_error: 'Tipo inválido para o nome d' }),
  diferenca: z.number({ required_error: 'Diferença para atualização não informada.' }),
})
const ProjectReferenceSchema = z.object({
  id: z.string({ required_error: 'ID de referência do projeto não fornecido.' }).optional().nullable(),
  nome: z.string({ required_error: 'Nome de referência do projeto não fornecido.' }).optional().nullable(),
})

type PutResponse = {
  data: string
  message: string
}

const updateMaterials: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const author = { id: session.user.id, nome: session.user.name, avatar_url: session.user.image }
  // const { formularyId, project, updates } = req.body
  const formularyId = FormularyIdSchema.parse(req.body.formularyId)
  const project = ProjectReferenceSchema.parse(req.body.project)
  const updates = z.array(UpdateSchema).parse(req.body.updates)

  const warehouseDb: Db = await connectToWarehouseDatabase(process.env.DB_KEY)
  const materialCollection: Collection<TMaterial> = warehouseDb.collection('material')
  const logCollection: Collection<TMaterialUpdateRegistry> = warehouseDb.collection('alteracoes')

  const materials = await materialCollection.find({}).toArray()

  const bulkwrite = updates.map((update) => {
    return {
      updateOne: {
        filter: { _id: new ObjectId(update.id) },
        update: {
          $inc: { qtde: update.diferenca },
        },
      },
    }
  })
  const logs = updates
    .map((update) => {
      const equivalentMaterial = materials.find((material) => material._id.toString() == update.id)
      if (!equivalentMaterial) return null
      const previousQty = equivalentMaterial.qtde
      const newQty = equivalentMaterial.qtde + update.diferenca
      const log: TMaterialUpdateRegistry = {
        alteracao: update.diferenca,
        tipo: update.diferenca < 0 ? 'RETIRADA' : 'DEVOLUÇÃO',
        idFormulario: formularyId,
        material: {
          id: update.id,
          nome: update.nome,
        },
        projeto: {
          id: project.id,
          nome: project.nome,
        },
        qtdeAnterior: previousQty,
        qtdeNovo: newQty,
        autor: author,
      }
      return log
    })
    .filter((l) => !!l) as TMaterialUpdateRegistry[]

  const bulkwriteResponse = await materialCollection.bulkWrite(bulkwrite)
  console.log('BULKWRITE', bulkwriteResponse)
  const logInsertResponse = await logCollection.insertMany(logs)
  console.log('LOG', logInsertResponse)

  return res.status(201).json({ data: 'Atualizações feitas com sucesso !', message: 'Atualizações feitas com sucesso !' })
}

export default apiHandler({ PUT: updateMaterials })
