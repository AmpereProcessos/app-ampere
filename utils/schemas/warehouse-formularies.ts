import { z } from 'zod'

const GeneralWarehouseFormularySchema = z.object({
  nomeDoContrato: z.string(),
  codigoProjeto: z.string().optional().nullable(),
  servico: z.string(),
  uso: z.union([z.literal('CLIENTE'), z.literal('TERCEIRO')]),
  tipo: z.union([z.literal('RETIRADA'), z.literal('ENTRADA')]),
  topologia: z.string(),
  idPai: z.string().optional().nullable(),
  cidade: z.string().optional().nullable(),
  segmento: z.string().optional().nullable(),
  equipeResp: z.string().optional(),
  materiais: z.array(
    z.object({
      id: z.string(),
      nome: z.string(),
      precoUnit: z.number(),
      diff: z.number().optional().nullable(),
      grandeza: z.string(),
      qtdeDevolucao: z.number().optional().nullable(),
      qtdeSaida: z.number().optional().nullable(),
    })
  ),
  nomeTerceiro: z.string().optional().nullable(),
  responsavel: z.string(),
  efetivado: z.boolean().optional().nullable(),
  saidaDeObra: z.string().datetime().optional().nullable(),
  dataEfetivacao: z.string().datetime().optional().nullable(),
  abertura: z.string().datetime().optional().nullable(),
})

const InsertWarehouseFormularySchema = z.object({
  nomeDoContrato: z.string(),
  codigoProjeto: z.string().optional().nullable(),
  servico: z.string(),
  uso: z.union([z.literal('CLIENTE'), z.literal('TERCEIRO')]),
  tipo: z.union([z.literal('RETIRADA'), z.literal('ENTRADA')]),
  topologia: z.string(),
  idPai: z.string().optional(),
  cidade: z.string().optional().nullable(),
  segmento: z.string(),
  equipeResp: z.string().optional(),
  materiais: z.array(
    z.object({
      id: z.string(),
      nome: z.string(),
      precoUnit: z.number(),
      diff: z.number().optional().nullable(),
      grandeza: z.string(),
      qtdeDevolucao: z.number().optional().nullable(),
      qtdeSaida: z.number().optional().nullable(),
    })
  ),
  nomeTerceiro: z.string().optional().nullable(),
  responsavel: z.string(),
  efetivado: z.boolean().optional().nullable(),
  saidaDeObra: z.string().datetime().optional().nullable(),
  dataEfetivacao: z.string().datetime().optional().nullable(),
  abertura: z.string().datetime().optional().nullable(),
})

export type TWarehouseFormulary = z.infer<typeof GeneralWarehouseFormularySchema>

export type TWarehouseFormularyDTO = TWarehouseFormulary & { _id: string }
