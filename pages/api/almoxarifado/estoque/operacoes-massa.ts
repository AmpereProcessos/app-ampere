import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TExpense } from '@/utils/schemas/expenses'
import { TMaterialUpdateRegistry } from '@/utils/schemas/material-updates-registry'
import { TMaterial } from '@/utils/schemas/materials'
import { TProject } from '@/utils/schemas/projects'
import connectToDatabase from '@/utils/services/mongodb/projects'
import connectToWarehouseDatabase from '@/utils/services/mongodb/warehouse'
import createHttpError from 'http-errors'
import { AnyBulkWriteOperation, Collection, Db, ObjectId, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

const FormularyIdSchema = z.string({ invalid_type_error: 'Tipo inválido para o ID do formulário.' }).optional().nullable()
const UpdateSchema = z.object({
  id: z.string({ invalid_type_error: 'Tipo inválido para o ID do material.' }),
  nome: z.string({ invalid_type_error: 'Tipo inválido para o nome do material' }),
  diferenca: z.number({ required_error: 'Diferença para atualização do material não informada.' }),
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
  const author = { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url }
  // const { formularyId, project, updates } = req.body
  const formularyId = FormularyIdSchema.parse(req.body.formularyId)
  const project = ProjectReferenceSchema.parse(req.body.project)
  const updates = z.array(UpdateSchema).parse(req.body.updates)

  if (updates.length == 0) return res.status(201).json({ data: 'Atualizações feitas com sucesso !', message: 'Atualizações feitas com sucesso !' })

  const warehouseDb: Db = await connectToWarehouseDatabase(process.env.DB_KEY)
  const materialCollection: Collection<TMaterial> = warehouseDb.collection('material')
  const logCollection: Collection<TMaterialUpdateRegistry> = warehouseDb.collection('alteracoes')

  const materials = await materialCollection.find({}).toArray()

  const bulkwrite = updates
    .map((update) => {
      console.log(update.nome, update.diferenca)
      const equivalentMaterial = materials.find((material) => material._id.toString() == update.id)
      if (!equivalentMaterial) return null
      // Checking for inconsistency in qty update
      const currentQty = equivalentMaterial.qtde
      const newQty = currentQty + update.diferenca
      // if (newQty < 0)
      //   throw new createHttpError.BadRequest(
      //     `Quantidade retirada de ${equivalentMaterial.nome} excede o estoque atual contabilizado de ${currentQty}`
      //   )
      // If passed validations, creating bulkwrite operation object
      return {
        updateOne: {
          filter: { _id: new ObjectId(update.id) },
          update: {
            $inc: { qtde: update.diferenca },
          },
        },
      }
    })
    .filter((b) => !!b?.updateOne)

  const logs = updates
    .filter((u) => u.diferenca != 0)
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
        dataInsercao: new Date().toISOString(),
      }
      return log
    })
    .filter((l) => !!l)
  // @ts-ignore
  const bulkwriteResponse = await materialCollection.bulkWrite(bulkwrite)

  // @ts-ignore
  if (logs.length > 0) await logCollection.insertMany(logs)

  return res.status(201).json({ data: 'Atualizações feitas com sucesso !', message: 'Atualizações feitas com sucesso !' })
}

export default apiHandler({ PUT: updateMaterials })
