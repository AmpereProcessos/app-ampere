import { z } from 'zod'

const SimulationTypes = z.enum(['CALCULADORA DE ENERGIA SOLAR', 'CALCULADORA DE SEGURO SOLAR', 'CALCULADORA DE MANUTENÇÃO E LIMPEZA'])
export const GeneralTotemSimulationSchema = z.object({
  tipoSimulacao: SimulationTypes,
  nome: z.string(),
  cpfCpnj: z.string(),
  uf: z.string(),
  cidade: z.string(),
  email: z.string(),
  telefone: z.string(),
  dataNascimento: z.string().optional().nullable(),
  premissas: z.object({
    valorReferencia: z.number().optional().nullable(),
    numModulos: z.number().optional().nullable(),
    potenciaPico: z.number().optional().nullable(),
    valorFaturaEnergia: z.number().optional().nullable(),
  }),
  sugestao: z.object({
    numModulos: z.number().optional().nullable(),
    potModulos: z.number().optional().nullable(),
    potenciaPico: z.number().optional().nullable(),
    investimento: z.union([z.number(), z.string()]).optional().nullable(),
  }),
})

export type TTotemSimulation = z.infer<typeof GeneralTotemSimulationSchema>
