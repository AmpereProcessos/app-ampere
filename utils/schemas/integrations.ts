import { z } from 'zod'
import { AuthorSchema } from './users'

const IntegrationIdentifierEnumSchema = z.enum(['CONTA_AZUL'])

export const ContaAzulIntegrationDataSchema = z.object({
  tokenRefresh: z.string({ required_error: 'Token de atualização não informado.', invalid_type_error: 'Tipo não válido para token de atualização.' }),
  tokenAcesso: z.string({ required_error: 'Token de acesso não informado.', invalid_type_error: 'Tipo não válido para token de acesso.' }),
  dataExpiracao: z.string({ required_error: 'Expiração do token não informada.', invalid_type_error: 'Tipo não válido para a expiração do token.' }),
})

export const IntegrationSchema = z.object({
  identificador: IntegrationIdentifierEnumSchema,
  dados: ContaAzulIntegrationDataSchema,
  autor: AuthorSchema,
  dataInsercao: z
    .string({ required_error: 'Data de inserção não informada.', invalid_type_error: 'Tipo não válido para a data de inserção.' })
    .datetime({ message: 'Formato inválido para a data de inserção.' }),
})
export type TIntegration = z.infer<typeof IntegrationSchema>
