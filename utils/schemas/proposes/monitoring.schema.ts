import { z } from 'zod'
import { AuthorSchema } from '../users'

const GeneralMonitoringProposeSchema = z.object({
  nome: z.string(),
  template: z.string().optional().nullable(),
  projeto: z.object({
    id: z.string(),
    nome: z.string(),
  }),
  autor: AuthorSchema,
  premissas: z.object({
    qtdeModulos: z.number(),
    potModulos: z.number(),
    distancia: z.number(),
    tarifaEnergia: z.number(),
    configurar: z.boolean(),
    suporte: z.boolean(),
  }),
  precificacao: z.object({
    mensal: z.object({
      vendaProposto: z.number(),
      vendaFinal: z.number(),
    }),
    semestral: z.object({
      vendaProposto: z.number(),
      vendaFinal: z.number(),
    }),
    anual: z.object({
      vendaProposto: z.number(),
      vendaFinal: z.number(),
    }),
  }),
  idPlanoEscolhido: z.union([z.string(), z.number()]).optional().nullable(),
  valorProposta: z.number(),
  dataInsercao: z.string().datetime(),
})

export type TMonitoringPropose = z.infer<typeof GeneralMonitoringProposeSchema>

export type TMonitoringProposeDTO = TMonitoringPropose & { _id: string }
