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
  valorFaturaEnergia: z.number().optional().nullable(),
  dataNascimento: z.string().optional().nullable(),
  investimentoEstimado: z.number().optional().nullable(),
})

export type TTotemSimulation = z.infer<typeof GeneralTotemSimulationSchema>
