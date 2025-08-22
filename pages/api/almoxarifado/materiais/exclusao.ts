import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TMaterial } from '@/utils/schemas/materials'
import { TProject } from '@/utils/schemas/projects'
import { TPurchaseControl } from '@/utils/schemas/purchases'
import { TTechnicalAnalysis } from '@/utils/schemas/technical-analysis'
import { TNewWarehouseFormulary } from '@/utils/schemas/warehouse-formularies'
import { purchases, TPurchase } from '@/utils/services/drizzle/schema'
import connectToCRMDatabase from '@/utils/services/mongodb/crm/main'
import clientPromise from '@/utils/services/mongodb/mongo-client'
import connectToDatabase from '@/utils/services/mongodb/projects'
import connectToWarehouseDatabase from '@/utils/services/mongodb/warehouse'
import createHttpError from 'http-errors'
import { Db, ObjectId } from 'mongodb'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const DeletionTypesEnumSchema = z.enum(['hard-delete', 'soft-delete', 'merge'])
export type TDeletionTypesEnum = z.infer<typeof DeletionTypesEnumSchema>

const GetMaterialDeletionDataSchema = z.object({
  id: z
    .string({
      required_error: 'ID do material não informado.',
      invalid_type_error: 'Tipo não válido para o ID do material.',
    })
    .refine((v) => ObjectId.isValid(v), {
      message: 'ID do material inválido.',
    }),
})

async function getMaterialDeletionData(input: z.infer<typeof GetMaterialDeletionDataSchema>) {
  const { id } = input

  const warehouseDb = await connectToWarehouseDatabase()
  const materialsCollection = warehouseDb.collection<TMaterial>('materials')
  const warehouseFormulariesCollection = warehouseDb.collection<TNewWarehouseFormulary>('formularios')

  const projectsDb = await connectToDatabase()
  const projectsCollection = projectsDb.collection<TProject>('dados')
  const purchasesCollection = projectsDb.collection<TPurchaseControl>('controles-compras')

  const crmDb = await connectToCRMDatabase()
  const crmTechnicalAnalyses = crmDb.collection<TTechnicalAnalysis>('technical-analysis')

  const material = await materialsCollection.findOne({ _id: new ObjectId(id) }, { projection: { dataExclusao: 1 } })

  if (!material) {
    throw new createHttpError.NotFound('Material não encontrado.')
  }
  const allowedTypesOfDeletion: TDeletionTypesEnum[] = []

  if (material.dataExclusao) {
    return {
      data: {
        status: 'EXCLUÍDO',
        dataExclusao: material.dataExclusao,
        tiposExclusaoHabilitados: allowedTypesOfDeletion,
        dependencias: null,
      },
    }
  }

  const references = {
    purchases: await purchasesCollection.count({
      'composicao.materialId': id,
    }),
    warehouseFormularies: await warehouseFormulariesCollection.count({
      'materiais.id': id,
    }),
    technicalAnalysis: await crmTechnicalAnalyses.count({
      'suprimentos.itens.idMaterial': id,
    }),
    projects: await projectsCollection.count({
      'alocacoes.idMaterial': id,
    }),
  }

  const totalReferences = Object.values(references).reduce((acc, curr) => acc + curr, 0)

  if (totalReferences === 0) allowedTypesOfDeletion.push('hard-delete')
  if (totalReferences > 0) allowedTypesOfDeletion.push('soft-delete')
  allowedTypesOfDeletion.push('merge')

  return {
    data: {
      status: 'ATIVO',
      dataExclusao: null,
      tiposExclusaoHabilitados: allowedTypesOfDeletion,
      dependencias: {
        compras: references.purchases,
        formularios: references.warehouseFormularies,
        analisesTecnicas: references.technicalAnalysis,
        projetos: references.projects,
      },
    },
  }
}
export type TMaterialDeletionDataOutput = Awaited<ReturnType<typeof getMaterialDeletionData>>

const getMaterialDeletionDataHandler: NextApiHandler<TMaterialDeletionDataOutput> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id } = GetMaterialDeletionDataSchema.parse(req.query)

  const data = await getMaterialDeletionData({ id })

  res.status(200).json(data)
}

const DeleteMaterialInputSchema = z.object({
  id: z
    .string({
      required_error: 'ID do material não informado.',
      invalid_type_error: 'Tipo não válido para o ID do material.',
    })
    .refine((v) => ObjectId.isValid(v), {
      message: 'ID do material inválido.',
    }),
  type: DeletionTypesEnumSchema,
  mergeIntoId: z
    .string({
      required_error: 'ID do material para mesclagem não informado.',
      invalid_type_error: 'Tipo não válido para o ID do material para mesclagem.',
    })
    .refine((v) => ObjectId.isValid(v), {
      message: 'ID do material para mesclagem inválido.',
    })
    .optional()
    .nullable(),
})
export type TDeleteMaterialInput = z.infer<typeof DeleteMaterialInputSchema>

async function deleteMaterial(payload: TDeleteMaterialInput) {
  const { id, type, mergeIntoId } = payload

  const dbClient = await clientPromise
  const warehouseDb: Db = dbClient.db('almoxarifado')
  const materialsCollection = warehouseDb.collection<TMaterial>('material')
  const warehouseFormulariesCollection = warehouseDb.collection<TNewWarehouseFormulary>('formularios')

  const projectsDb: Db = dbClient.db('projetos')
  const projectsCollection = projectsDb.collection<TProject>('dados')
  const purchasesCollection = projectsDb.collection<TPurchaseControl>('controles-compras')

  const crmDb: Db = dbClient.db('crm')
  const crmTechnicalAnalyses = crmDb.collection<TTechnicalAnalysis>('technical-analysis')

  const dbSession = dbClient.startSession()

  try {
    const result = await dbSession.withTransaction(async () => {
      // Verificar dependências DENTRO da transação
      const references = {
        purchases: await purchasesCollection.count(
          {
            'composicao.materialId': id,
          },
          { session: dbSession }
        ),
        warehouseFormularies: await warehouseFormulariesCollection.count(
          {
            'materiais.id': id,
          },
          { session: dbSession }
        ),
        technicalAnalysis: await crmTechnicalAnalyses.count(
          {
            'suprimentos.itens.idMaterial': id,
          },
          { session: dbSession }
        ),
        projects: await projectsCollection.count(
          {
            'alocacoes.idMaterial': id,
          },
          { session: dbSession }
        ),
      }

      const totalReferences = Object.values(references).reduce((acc, curr) => acc + curr, 0)

      if (type === 'hard-delete') {
        if (totalReferences > 0) {
          throw new createHttpError.BadRequest('Material possui dependências e não pode ser excluído.')
        }
        await materialsCollection.deleteOne({ _id: new ObjectId(id) }, { session: dbSession })

        return {
          data: { deletedId: id },
          message: 'Material excluído com sucesso.',
        }
      }

      if (type === 'soft-delete') {
        await materialsCollection.updateOne({ _id: new ObjectId(id) }, { $set: { dataExclusao: new Date().toISOString() } }, { session: dbSession })

        return {
          data: { deletedId: id },
          message: 'Material excluído com sucesso.',
        }
      }

      if (type === 'merge') {
        if (!mergeIntoId) {
          throw new createHttpError.BadRequest('ID do material para mesclagem não informado.')
        }

        await materialsCollection.updateOne({ _id: new ObjectId(id) }, { $set: { dataExclusao: new Date().toISOString() } }, { session: dbSession })

        // Atualizações com session em todas as operações
        const updatePurchasesResponse = await purchasesCollection.updateMany(
          { 'composicao.materialId': id },
          { $set: { 'composicao.$[elem].materialId': mergeIntoId } },
          {
            session: dbSession,
            arrayFilters: [{ 'elem.materialId': id }],
          }
        )

        const updateWarehouseFormulariesResponse = await warehouseFormulariesCollection.updateMany(
          { 'materiais.id': id },
          { $set: { 'materiais.$[elem].id': mergeIntoId } },
          {
            session: dbSession,
            arrayFilters: [{ 'elem.id': id }],
          }
        )

        const updateTechnicalAnalysisResponse = await crmTechnicalAnalyses.updateMany(
          { 'suprimentos.itens.idMaterial': id },
          { $set: { 'suprimentos.itens.$[elem].idMaterial': mergeIntoId } },
          {
            session: dbSession,
            arrayFilters: [{ 'elem.idMaterial': id }],
          }
        )

        const updateProjectsResponse = await projectsCollection.updateMany(
          { 'alocacoes.idMaterial': id },
          { $set: { 'alocacoes.$[elem].idMaterial': mergeIntoId } },
          {
            session: dbSession,
            arrayFilters: [{ 'elem.idMaterial': id }],
          }
        )

        return {
          data: { deletedId: id },
          message: 'Material mesclado com sucesso.',
          mergeStats: {
            purchases: { matched: updatePurchasesResponse.matchedCount, updated: updatePurchasesResponse.modifiedCount },
            warehouseFormularies: {
              matched: updateWarehouseFormulariesResponse.matchedCount,
              updated: updateWarehouseFormulariesResponse.modifiedCount,
            },
            technicalAnalysis: { matched: updateTechnicalAnalysisResponse.matchedCount, updated: updateTechnicalAnalysisResponse.modifiedCount },
            projects: { matched: updateProjectsResponse.matchedCount, updated: updateProjectsResponse.modifiedCount },
          },
        }
      }
    })

    return result as {
      data: { deletedId: string }
      message: string
      mergeStats?: {
        purchases: { matched: number; updated: number }
        warehouseFormularies: { matched: number; updated: number }
        technicalAnalysis: { matched: number; updated: number }
        projects: { matched: number; updated: number }
      }
    }
  } catch (error) {
    console.log('[ERROR] [DELETE-MATERIAL] Error deleting material.', error)
    throw error
  } finally {
    console.log('[INFO] [DELETE-MATERIAL] Transaction ended.')
    await dbSession.endSession()
  }
}
export type TDeleteMaterialOutput = Awaited<ReturnType<typeof deleteMaterial>>

const deleteMaterialHandler: NextApiHandler<TDeleteMaterialOutput> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id, type, mergeIntoId } = DeleteMaterialInputSchema.parse(req.body)

  const data = await deleteMaterial({ id, type, mergeIntoId })

  res.status(200).json(data)
}

export default apiHandler({
  POST: deleteMaterialHandler,
  GET: getMaterialDeletionDataHandler,
})
