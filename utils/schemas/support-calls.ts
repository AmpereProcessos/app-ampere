import { z } from 'zod'

// ObjectId schema for MongoDB
const ObjectIdSchema = z.object({
  $oid: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido'),
})

// Schema for annotation changes
const AnotacaoAlteracaoSchema = z.object({
  antes: z.string().optional(),
  data: z.string({
    required_error: 'Data não informada',
    invalid_type_error: 'Tipo não válido para data',
  }),
  depois: z.string({
    required_error: 'Valor posterior não informado',
    invalid_type_error: 'Tipo não válido para valor posterior',
  }),
  usuario: z.string({
    required_error: 'Usuário não informado',
    invalid_type_error: 'Tipo não válido para usuário',
  }),
})

// Schema for status changes
const StatusAlteracaoSchema = z.object({
  antes: z.string({
    required_error: 'Status anterior não informado',
    invalid_type_error: 'Tipo não válido para status anterior',
  }),
  data: z.string({
    required_error: 'Data não informada',
    invalid_type_error: 'Tipo não válido para data',
  }),
  depois: z.string({
    required_error: 'Status posterior não informado',
    invalid_type_error: 'Tipo não válido para status posterior',
  }),
  usuario: z.string({
    required_error: 'Usuário não informado',
    invalid_type_error: 'Tipo não válido para usuário',
  }),
})

// Schema for last changes
const UltAlteracoesSchema = z.object({
  anotAlteracoes: AnotacaoAlteracaoSchema,
  statusAlteracoes: StatusAlteracaoSchema,
})

// Main support call schema
export const SupportCallSchema = z.object({
  _id: ObjectIdSchema,
  abertura: z.string({
    required_error: 'Data de abertura não informada',
    invalid_type_error: 'Tipo não válido para data de abertura',
  }),
  anotacoes: z.string().optional(),
  cidade: z.string().optional(),
  demanda: z.string().optional(),
  descricaoProblema: z.string().optional(),
  equipamento: z.string().optional(),
  equipeResp: z.string().optional(),
  fechamento: z.string().optional(),
  feedbackValor: z.number().nullable().optional(),
  idPai: z.string().nullable().optional(),
  linkMonitoramento: z.string().optional(),
  nomeCliente: z.string().optional(),
  nomeUsina: z.string().optional(),
  oemConcluido: z.boolean().nullable().optional(),
  osGerada: z.boolean().optional(),
  plano: z.string().nullable().optional(),
  responsavel: z.string({
    required_error: 'Responsável não informado',
    invalid_type_error: 'Tipo não válido para responsável',
  }),
  statusChamado: z.string({
    required_error: 'Status do chamado não informado',
    invalid_type_error: 'Tipo não válido para status do chamado',
  }),
  statusGarantia: z.string().optional(),
  tipoChamado: z.string({
    required_error: 'Tipo do chamado não informado',
    invalid_type_error: 'Tipo não válido para tipo do chamado',
  }),
  ultAlteracoes: UltAlteracoesSchema.optional(),
  ultAtualizacaoCliente: z.string().optional(),
})

// Type inference
export type TSupportCall = z.infer<typeof SupportCallSchema>
