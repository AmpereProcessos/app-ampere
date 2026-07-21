import type { TAuthSession } from '@/lib/authentication/types'
import { getVehicleReviewAlertLevelByKmDifference } from '@/lib/property-usage'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { PropertyTemporaryUsageSchema, type TProperty, type TPropertyTemporaryUsage } from '@/utils/schemas/properties'
import connectToAdministrationDatabase from '@/utils/services/mongodb/administration'
import clientPromise from '@/utils/services/mongodb/mongo-client'
import createHttpError from 'http-errors'
import { type Filter, ObjectId } from 'mongodb'
import type { NextApiHandler } from 'next'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { waitUntil } from '@vercel/functions'
import { randomUUID } from 'node:crypto'

const VEHICLE_REVIEW_ALERT_EMAIL = 'comercial@ampereenergias.com.br'
const PROPERTY_USAGE_METRICS_HEADER = 'x-property-usage-client-metrics'

const PropertyUsageClientMetricsSchema = z.object({
  fileCount: z.number().int().min(0).max(10),
  originalBytes: z.number().int().min(0).max(100_000_000),
  uploadedBytes: z.number().int().min(0).max(100_000_000),
  compressionDurationMs: z.number().int().min(0).max(120_000),
  uploadDurationMs: z.number().int().min(0).max(1_800_000),
  effectiveType: z.string().max(20).optional(),
  downlinkMbps: z.number().min(0).max(10_000).optional(),
  rttMs: z.number().min(0).max(120_000).optional(),
})

function getPropertyUsageClientMetrics(req: Parameters<NextApiHandler>[0]) {
  const header = req.headers[PROPERTY_USAGE_METRICS_HEADER]
  const serializedMetrics = Array.isArray(header) ? header[0] : header
  if (!serializedMetrics) return null

  try {
    const result = PropertyUsageClientMetricsSchema.safeParse(JSON.parse(serializedMetrics))
    return result.success ? result.data : null
  } catch {
    return null
  }
}

function logPropertyUsageMetric(event: string, data: Record<string, unknown>) {
  console.info('[PROPERTY_USAGE_METRIC]', JSON.stringify({ event, ...data }))
}

type TVehicleReviewAlertEmailPayload = {
  subject: string
  message: string
}

async function sendVehicleReviewAlertEmail(payload: TVehicleReviewAlertEmailPayload) {
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  if (!smtpUser || !smtpPass) {
    throw new Error('SMTP_USER e SMTP_PASS devem estar configurados.')
  }

  const msg = {
    from: smtpUser,
    to: VEHICLE_REVIEW_ALERT_EMAIL,
    subject: payload.subject,
    text: payload.message,
  }
  await nodemailer
    .createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      port: 587,
      host: 'smtp.gmail.com',
    })
    .sendMail(msg)
}

function scheduleVehicleReviewAlertEmail({
  payload,
  propertyId,
  requestId,
}: {
  payload: TVehicleReviewAlertEmailPayload
  propertyId: string
  requestId: string
}) {
  const startedAt = Date.now()
  const emailTask = sendVehicleReviewAlertEmail(payload)
    .then(() => {
      logPropertyUsageMetric('vehicle_review_email_sent', {
        requestId,
        propertyId,
        durationMs: Date.now() - startedAt,
      })
    })
    .catch((error) => {
      console.warn('[PROPERTY_USAGE_EMAIL_FAILED]', {
        requestId,
        propertyId,
        emailTo: VEHICLE_REVIEW_ALERT_EMAIL,
        durationMs: Date.now() - startedAt,
        error,
      })
    })

  try {
    waitUntil(emailTask)
  } catch (error) {
    // `next dev` may not expose Vercel's request context. The promise has already
    // started and remains fire-and-forget in the long-lived local Node process.
    console.warn('[PROPERTY_USAGE_WAIT_UNTIL_UNAVAILABLE]', { requestId, propertyId, error })
    void emailTask
  }
}

const PropertyTemporaryUsagesByPeriodQueryParams = z.object({
  search: z.string({ invalid_type_error: 'Tipo não válido para o search.' }).optional().nullable(),
  propertyIds: z
    .string({
      invalid_type_error: 'Tipo não válido para o propertyIds.',
      required_error: 'Property IDs não informados.',
    })
    .optional()
    .nullable()
    .transform((val) => (val ? val.split(',') : [])),
  type: z.enum(['all', 'open', 'closed']),
  periodAfter: z
    .string({
      required_error: 'Data de início não informada.',
      invalid_type_error: 'Tipo não válido para a data de início.',
    })
    .datetime({ message: 'Tipo inválido para a data de início.' })
    .optional()
    .nullable(),
  periodBefore: z
    .string({
      required_error: 'Data de término não informada.',
      invalid_type_error: 'Tipo não válido para a data de término.',
    })
    .datetime({ message: 'Tipo inválido para a data de término.' })
    .optional()
    .nullable(),
  periodType: z.enum(['dataInicio', 'dataFim']).optional().nullable(),
})
export type TPropertyTemporaryUsagesByPeriodInput = z.infer<typeof PropertyTemporaryUsagesByPeriodQueryParams>

const PropertyTemporaryUsageByIdQueryParams = z.object({
  id: z.string({
    required_error: 'ID da propriedade não informado.',
    invalid_type_error: 'Tipo não válido para o ID da propriedade.',
  }),
})
export type TPropertyTemporaryUsageByIdInput = z.infer<typeof PropertyTemporaryUsageByIdQueryParams>

const TemporaryUsagesQueryParams = z.union([PropertyTemporaryUsagesByPeriodQueryParams, PropertyTemporaryUsageByIdQueryParams])
export type TPropertyTemporaryUsagesInput = z.infer<typeof TemporaryUsagesQueryParams>

async function getTemporaryUsagesRoute({ params, session: _session }: { params: TPropertyTemporaryUsagesInput; session: TAuthSession }) {
  const db = await connectToAdministrationDatabase()
  const temporaryUsagesCollection = db.collection<TPropertyTemporaryUsage>('propriedades-uso-temporario')

  if ('id' in params) {
    if (!ObjectId.isValid(params.id)) throw new createHttpError.BadRequest('ID da propriedade inválido.')

    const temporaryUsageRecord = await temporaryUsagesCollection.findOne({
      _id: new ObjectId(params.id),
    })
    if (!temporaryUsageRecord) throw new createHttpError.NotFound('Uso temporário não encontrado.')

    return {
      data: {
        byId: { ...temporaryUsageRecord, _id: temporaryUsageRecord._id.toString() },
        default: undefined,
      },
    }
  }

  const { periodAfter, periodBefore, periodType, propertyIds, search } = params

  const typeQueryMap: Record<TPropertyTemporaryUsagesByPeriodInput['type'], Filter<TPropertyTemporaryUsage>> = {
    all: {},
    open: {
      dataFim: null,
    },
    closed: {
      dataFim: { $ne: null },
    },
  }

  const typeQuery = typeQueryMap[params.type]
  const periodQuery: Filter<TPropertyTemporaryUsage> =
    periodAfter && periodBefore && periodType
      ? {
          [periodType]: {
            $gte: periodAfter,
            $lte: periodBefore,
          },
        }
      : {}

  const propertyIdsQuery: Filter<TPropertyTemporaryUsage> =
    propertyIds && propertyIds.length > 0
      ? {
          'propriedade.id': { $in: propertyIds },
        }
      : {}

  const searchQuery: Filter<TPropertyTemporaryUsage> =
    search && search.trim().length > 0
      ? {
          $or: [{ 'propriedade.nome': { $regex: search, $options: 'i' } }, { 'responsaveis.nome': { $regex: search, $options: 'i' } }],
        }
      : {}

  const query = {
    ...typeQuery,
    ...periodQuery,
    ...propertyIdsQuery,
    ...searchQuery,
  }
  const temporaryUsages = await temporaryUsagesCollection
    .find(query, {
      sort: {
        _id: -1,
      },
    })
    .toArray()

  return {
    data: {
      byId: undefined,
      default: temporaryUsages.map((usage) => ({ ...usage, _id: usage._id.toString() })),
    },
  }
}
export type TGetPropertyTemporaryUsagesOutput = Awaited<ReturnType<typeof getTemporaryUsagesRoute>>
export type TGetPropertyTemporaryUsagesDefaultOutput = Exclude<TGetPropertyTemporaryUsagesOutput['data']['default'], undefined>
export type TGetPropertyTemporaryUsageByIdOutput = Exclude<TGetPropertyTemporaryUsagesOutput['data']['byId'], undefined>

const getTemporaryUsagesHandler: NextApiHandler<TGetPropertyTemporaryUsagesOutput> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const params = TemporaryUsagesQueryParams.parse(req.query)
  const temporaryUsages = await getTemporaryUsagesRoute({ params, session })
  res.status(200).json(temporaryUsages)
}

export type TCreateTemporaryUsageInput = TPropertyTemporaryUsage
async function createTemporaryUsageRoute({ payload }: { payload: TPropertyTemporaryUsage }) {
  const db = await connectToAdministrationDatabase()
  const temporaryUsagesCollection = db.collection<TPropertyTemporaryUsage>('propriedades-uso-temporario')

  const insertedTemporaryUseageResponse = await temporaryUsagesCollection.insertOne(payload)

  if (!insertedTemporaryUseageResponse.acknowledged) throw new createHttpError.InternalServerError('Erro ao inserir uso temporário.')

  const insertedTemporaryUsageId = insertedTemporaryUseageResponse.insertedId.toString()
  return {
    data: {
      insertedId: insertedTemporaryUsageId,
    },
    message: 'Uso temporário inserido com sucesso.',
  }
}
export type TCreateTemporaryUsageOutput = Awaited<ReturnType<typeof createTemporaryUsageRoute>>

const createTemporaryUsageHandler: NextApiHandler<TCreateTemporaryUsageOutput> = async (req, res) => {
  const requestId = randomUUID()
  const startedAt = Date.now()
  const clientMetrics = getPropertyUsageClientMetrics(req)
  try {
    const payload = PropertyTemporaryUsageSchema.parse(req.body)
    const temporaryUsage = await createTemporaryUsageRoute({ payload })
    res.status(200).json(temporaryUsage)
    logPropertyUsageMetric('request_completed', {
      requestId,
      operation: 'start',
      statusCode: 200,
      serverDurationMs: Date.now() - startedAt,
      propertyId: payload.propriedade.id,
      clientMetrics,
    })
  } catch (error) {
    logPropertyUsageMetric('request_failed', {
      requestId,
      operation: 'start',
      serverDurationMs: Date.now() - startedAt,
      clientMetrics,
    })
    throw error
  }
}

const UpdatePropertyTemporaryUsageSchema = z.object({
  id: z.string({
    required_error: 'ID da propriedade não informado.',
    invalid_type_error: 'Tipo não válido para o ID da propriedade.',
  }),
  changes: PropertyTemporaryUsageSchema,
})
export type TUpdatePropertyTemporaryUsageInput = z.infer<typeof UpdatePropertyTemporaryUsageSchema>

async function updateTemporaryUsageRoute({ payload, requestId }: { payload: TUpdatePropertyTemporaryUsageInput; requestId: string }) {
  console.log('[INFO] [UPDATE TEMPORARY USAGE] Updating temporary usage', {
    propertyId: payload.changes.propriedade.id,
    propertyUsageType: payload.changes.metadados.tipo,
  })
  const dbClient = await clientPromise
  const dbSession = dbClient.startSession()
  let vehicleReviewAlertEmailPayload: TVehicleReviewAlertEmailPayload | null = null

  try {
    const transactionResult = await dbSession.withTransaction(async () => {
      console.log('[INFO] [UPDATE TEMPORARY USAGE] Starting transaction')

      const db = dbClient.db('administracao')
      const propertiesCollection = db.collection<TProperty>('propriedades')
      const temporaryUsagesCollection = db.collection<TPropertyTemporaryUsage>('propriedades-uso-temporario')
      if (
        payload.changes.metadados.kmFinal !== null &&
        payload.changes.metadados.kmFinal !== undefined &&
        payload.changes.metadados.kmInicial > payload.changes.metadados.kmFinal
      ) {
        console.log('[ERROR] [UPDATE TEMPORARY USAGE] Kilometers inconsistency detected')
        // Checking for possible inconsistency in vehicle usage kilometers
        throw new createHttpError.BadRequest('Kilometragem inicial não pode ser maior que a kilometragem final.')
      }

      const updatedTemporaryUsageResponse = await temporaryUsagesCollection.updateOne(
        { _id: new ObjectId(payload.id) },
        { $set: payload.changes },
        { session: dbSession }
      )

      if (!updatedTemporaryUsageResponse.acknowledged) throw new createHttpError.InternalServerError('Erro ao atualizar uso temporário.')

      // Getting updated property usage
      const updatedPropertyUsage = await temporaryUsagesCollection.findOne({ _id: new ObjectId(payload.id) }, { session: dbSession })
      if (!updatedPropertyUsage) throw new createHttpError.NotFound('Uso temporário não encontrado.')

      if (updatedPropertyUsage.metadados.tipo === 'USO DE VEÍCULO' && updatedPropertyUsage.metadados.kmFinal) {
        console.log('[INFO] [UPDATE TEMPORARY USAGE] Updating property cumulative kilometers')
        const initialKilometers = updatedPropertyUsage.metadados.kmInicial ?? 0
        const finalKilometers = updatedPropertyUsage.metadados.kmFinal ?? 0

        const differenceKilometers = (finalKilometers || 0) - initialKilometers

        const currentProperty = await propertiesCollection.findOne({ _id: new ObjectId(updatedPropertyUsage.propriedade.id) }, { session: dbSession })
        if (!currentProperty) throw new createHttpError.NotFound('Propriedade não encontrada.')
        const currentAccumulatedKilometers = currentProperty.metadados.kmAcumulado
        const expectedAccumulatedKilometers = currentAccumulatedKilometers + differenceKilometers
        if (expectedAccumulatedKilometers !== finalKilometers) {
          console.warn('[WARNING] [UPDATE TEMPORARY USAGE] Expected accumulated kilometers do not match final kilometers', {
            expectedAccumulatedKilometers,
            finalKilometers,
            differenceKilometers,
            currentAccumulatedKilometers,
          })
        }
        if (currentProperty.metadados.tipo === 'VEÍCULO') {
          const kmDifferenceUntilNextReview = currentProperty.metadados.kmProximaRevisao - finalKilometers
          const vehicleReviewAlertLevel = getVehicleReviewAlertLevelByKmDifference(kmDifferenceUntilNextReview)
          if (vehicleReviewAlertLevel) {
            vehicleReviewAlertEmailPayload = {
              subject: `[ALERTA] Revisao de veiculo ${currentProperty.identificador}`,
              message: [
                'Atenção: a kilometragem de revisão do veículo está próxima/atingida.',
                '',
                `Propriedade: ${currentProperty.nome} (${currentProperty.identificador})`,
                `Quilometragem atual: ${finalKilometers}km`,
                `Próxima revisão: ${currentProperty.metadados.kmProximaRevisao}km`,
                `Diferença para revisão: ${kmDifferenceUntilNextReview}km`,
                `Nível de alerta: ${vehicleReviewAlertLevel.text}`,
                '',
                vehicleReviewAlertLevel.call,
              ].join('\n'),
            }
          }
        }

        const updatedProperty = await propertiesCollection.updateOne(
          { _id: new ObjectId(updatedPropertyUsage.propriedade.id) },
          { $set: { 'metadados.kmAcumulado': finalKilometers } }, // using final kilometers to update the property accumulated kilometers
          { session: dbSession }
        )
        if (!updatedProperty.acknowledged) throw new createHttpError.InternalServerError('Erro ao atualizar quilometragem acumulada da propriedade.')
        console.log(`[INFO] [UPDATE TEMPORARY USAGE] Property cumulative kilometers updated with ${differenceKilometers} kilometers`)
      }
      console.log('[SUCCESS] [UPDATE TEMPORARY USAGE] Transaction completed successfully')
      return {
        data: { updatedId: updatedTemporaryUsageResponse.upsertedId?.toString() },
        message: 'Uso temporário atualizado com sucesso.',
      }
    })
    if (vehicleReviewAlertEmailPayload) {
      scheduleVehicleReviewAlertEmail({
        payload: vehicleReviewAlertEmailPayload,
        propertyId: payload.changes.propriedade.id,
        requestId,
      })
    }
    return transactionResult as { data: { updatedId: string }; message: string }
  } catch (error) {
    console.log('[ERROR] [UPDATE TEMPORARY USAGE] Transaction failed', { error })
    throw error
  } finally {
    console.log('[INFO] [UPDATE TEMPORARY USAGE] Ending transaction')
    await dbSession.endSession()
  }
}
export type TUpdatePropertyTemporaryUsageOutput = Awaited<ReturnType<typeof updateTemporaryUsageRoute>>

const updateTemporaryUsageHandler: NextApiHandler<TUpdatePropertyTemporaryUsageOutput> = async (req, res) => {
  const requestId = randomUUID()
  const startedAt = Date.now()
  const clientMetrics = getPropertyUsageClientMetrics(req)
  try {
    const payload = UpdatePropertyTemporaryUsageSchema.parse(req.body)
    const temporaryUsage = await updateTemporaryUsageRoute({ payload, requestId })
    res.status(200).json(temporaryUsage)
    logPropertyUsageMetric('request_completed', {
      requestId,
      operation: 'finish',
      statusCode: 200,
      serverDurationMs: Date.now() - startedAt,
      propertyId: payload.changes.propriedade.id,
      clientMetrics,
    })
  } catch (error) {
    logPropertyUsageMetric('request_failed', {
      requestId,
      operation: 'finish',
      serverDurationMs: Date.now() - startedAt,
      clientMetrics,
    })
    throw error
  }
}

export default apiHandler({
  GET: getTemporaryUsagesHandler,
  POST: createTemporaryUsageHandler,
  PUT: updateTemporaryUsageHandler,
})
