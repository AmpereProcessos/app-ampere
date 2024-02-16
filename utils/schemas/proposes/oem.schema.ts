import { z } from 'zod'

const GeneralOeMProposeSchema = z.object({
  nome: z.string(),
  template: z.string(),
  projeto: z.object({
    id: z.string(),
    nome: z.string(),
  }),
  autor: z.object({
    id: z.string(),
    nome: z.string(),
  }),
  premissas: z.object({
    consumoEnergiaMensal: z.number(),
    tarifaEnergia: z.number(),
    distancia: z.number(),
    qtdeModulos: z.number(),
    potModulos: z.number(),
    eficienciaAtual: z.number(),
  }),
  precificacao: z.object({
    manutencaoSimples: z.object({
      vendaProposto: z.number(),
      vendaFinal: z.number(),
    }),
    planoSol: z.object({
      vendaProposto: z.number(),
      vendaFinal: z.number(),
    }),
    planoSolPlus: z.object({
      vendaProposto: z.number(),
      vendaFinal: z.number(),
    }),
  }),
  dataInsercao: z.string(),
})
