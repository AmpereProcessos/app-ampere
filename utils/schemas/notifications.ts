import { ObjectId } from 'mongodb'
import { z } from 'zod'

const GeneralNotificationSchema = z.object({
  remetente: z.string(),
  remetenteId: z.string().optional().nullable(),
  destinatario: z.string(),
  projetoReferencia: z.union([z.number(), z.string()]).optional().nullable(),
  nomeDoProjeto: z.string().optional().nullable(),
  mensagem: z.string(),
  lido: z.boolean(),
  dataDeEnvio: z.union([z.string(), z.date()]),
  dataDeLeitura: z.union([z.string(), z.date()]).optional().nullable(),
})
export const InsertNotificationSchema = z.object({
  remetente: z.string({ required_error: 'Remetente não informado.', invalid_type_error: 'Tipo não válido para remetente.' }),
  remetenteId: z.string({ invalid_type_error: 'Tipo não válido para o ID do remetente.' }).optional().nullable(),
  destinatario: z.string({ required_error: 'Destinatário não informado.', invalid_type_error: 'Tipo não válido para destinatário.' }),
  projetoReferencia: z
    .union([z.number(), z.string()], {
      required_error: 'Projeto referência não informado.',
      invalid_type_error: 'Tipo não válido para projeto referência.',
    })
    .optional()
    .nullable(),
  nomeDoProjeto: z
    .string({ required_error: 'Nome do projeto não informado.', invalid_type_error: 'Tipo não válido para nome do projeto.' })
    .optional()
    .nullable(),
  mensagem: z
    .string({
      required_error: 'Mensagem não informada.',
      invalid_type_error: 'Tipo não válido para mensagem.',
    })
    .min(3, 'Digite uma mensagem de ao menos 3 letras.'),
  lido: z.boolean({ required_error: 'Status de leitura não informado.', invalid_type_error: 'Tipo não válido para status de leitura.' }),
  dataDeEnvio: z.union([z.date(), z.string()], {
    required_error: 'Data de envio não informada.',
    invalid_type_error: 'Tipo não válido para data de envio.',
  }),
  dataDeLeitura: z
    .union([z.date(), z.string()], {
      required_error: 'Data de envio não informada.',
      invalid_type_error: 'Tipo não válido para data de envio.',
    })
    .optional()
    .nullable(),
})

const NotificationEntitySchema = z.object({
  _id: z.instanceof(ObjectId),
  remetente: z.string(),
  remetenteId: z.string().optional().nullable(),
  destinatario: z.string(),
  projetoReferencia: z.union([z.number(), z.string()]).optional().nullable(),
  nomeDoProjeto: z.string().optional().nullable(),
  mensagem: z.string(),
  lido: z.boolean(),
  dataDeEnvio: z.union([z.string(), z.date()]),
  dataDeLeitura: z.union([z.string(), z.date()]).optional().nullable(),
})

export type TNotification = z.infer<typeof GeneralNotificationSchema>

export type TNotificationDTO = TNotification & { _id: string }
