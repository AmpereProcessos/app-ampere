import { z } from 'zod'
import { AuthorSchema } from './users'

export const LABOR_COST_CONFIGURATIONS_COLLECTION_NAME = 'configuracoesCustosMaoDeObra'
export const LABOR_COST_METADATA_KEY = 'custo-mao-de-obra' as const
export const LABOR_COST_EXPENSE_IDENTIFIER = 'CUSTOS-ORDEM-DE-SERVICO' as const

const MoneySchema = z.number().finite().nonnegative()

export const LaborCostUserSubjectSchema = z.object({
  tipo: z.literal('USUARIO'),
  id: z.string().min(1),
  nome: z.string().min(1),
})

export const LaborCostTeamSubjectSchema = z.object({
  tipo: z.literal('EQUIPE'),
  chave: z.string().min(1),
  nome: z.string().min(1),
})

export const LaborCostSubjectSchema = z.discriminatedUnion('tipo', [LaborCostUserSubjectSchema, LaborCostTeamSubjectSchema])

export const InternalDailyLaborCostRuleSchema = z.object({
  modelo: z.literal('EQUIPE_INTERNA_DIARIA'),
  valorDiaria: MoneySchema,
  faixas: z
    .array(
      z.object({
        minimoModulos: z.number().int().nonnegative(),
        maximoModulos: z.number().int().positive(),
        dias: z.number().finite().positive(),
      })
    )
    .min(1),
})

export const ExternalEquipmentLaborCostRuleSchema = z.object({
  modelo: z.literal('TERCEIRO_POR_EQUIPAMENTO'),
  valorPorModulo: MoneySchema,
  valorPorInversor: MoneySchema,
  excecoes: z
    .array(
      z.object({
        quantidadeModulos: z.number().int().nonnegative(),
        valorFixo: MoneySchema,
      })
    )
    .default([]),
})

export const LaborCostRuleSchema = z.discriminatedUnion('modelo', [InternalDailyLaborCostRuleSchema, ExternalEquipmentLaborCostRuleSchema])

export const LaborCostConfigurationSchema = z.object({
  ativo: z.boolean(),
  padrao: z.boolean().default(false),
  sujeito: LaborCostSubjectSchema,
  regra: LaborCostRuleSchema,
  autor: AuthorSchema,
  dataInsercao: z.string().datetime(),
  dataAtualizacao: z.string().datetime(),
})

export const UpsertLaborCostConfigurationSchema = LaborCostConfigurationSchema.omit({
  autor: true,
  dataInsercao: true,
  dataAtualizacao: true,
}).superRefine((configuration, context) => {
  if (configuration.padrao && configuration.sujeito.tipo !== 'EQUIPE') {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['padrao'],
      message: 'Somente uma equipe pode ser a configuração padrão.',
    })
  }

  if (configuration.regra.modelo === 'EQUIPE_INTERNA_DIARIA' && configuration.sujeito.tipo !== 'EQUIPE') {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['sujeito'],
      message: 'A regra de diária interna deve pertencer a uma equipe.',
    })
  }

  if (configuration.regra.modelo === 'TERCEIRO_POR_EQUIPAMENTO' && configuration.sujeito.tipo !== 'USUARIO') {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['sujeito'],
      message: 'A regra de terceiro deve pertencer a um usuário.',
    })
  }

  if (configuration.padrao && configuration.regra.modelo !== 'EQUIPE_INTERNA_DIARIA') {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['padrao'],
      message: 'A configuração padrão deve utilizar a regra de equipe interna.',
    })
  }

  if (configuration.regra.modelo === 'EQUIPE_INTERNA_DIARIA') {
    const ranges = [...configuration.regra.faixas].sort((a, b) => a.minimoModulos - b.minimoModulos)
    for (let index = 0; index < ranges.length; index += 1) {
      const current = ranges[index]
      if (current.minimoModulos > current.maximoModulos) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['regra', 'faixas', index],
          message: 'O mínimo de módulos não pode ser maior que o máximo.',
        })
      }
      const previous = ranges[index - 1]
      if (previous && current.minimoModulos <= previous.maximoModulos) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['regra', 'faixas', index],
          message: 'As faixas de módulos não podem se sobrepor.',
        })
      }
    }
  }
})

export const InternalLaborCalculationSchema = z.object({
  modelo: z.literal('equipe-interna-diaria'),
  configuracao: z.object({
    id: z.string(),
    tipo: z.literal('EQUIPE'),
    chave: z.string(),
    nome: z.string(),
  }),
  quantidadeModulos: z.number().int().nonnegative(),
  faixa: z.object({
    minimo: z.number().int().nonnegative(),
    maximo: z.number().int().positive(),
  }),
  diasCalculados: z.number().finite().positive(),
  valorDiaria: MoneySchema,
})

export const ExternalLaborCalculationSchema = z.object({
  modelo: z.literal('terceiro-por-equipamento'),
  configuracao: z.object({
    id: z.string(),
    tipo: z.literal('USUARIO'),
    usuarioId: z.string(),
    nome: z.string(),
  }),
  quantidadeModulos: z.number().int().nonnegative(),
  quantidadeInversores: z.number().int().nonnegative(),
  valorPorModulo: MoneySchema,
  valorPorInversor: MoneySchema,
  excecaoAplicada: z
    .object({
      quantidadeModulos: z.number().int().nonnegative(),
      valorFixo: MoneySchema,
    })
    .optional()
    .nullable(),
})

export const ManualLaborCalculationSchema = z.object({
  modelo: z.literal('manual'),
  motivo: z.string().min(3),
})

export const LaborCalculationSchema = z.discriminatedUnion('modelo', [
  InternalLaborCalculationSchema,
  ExternalLaborCalculationSchema,
  ManualLaborCalculationSchema,
])

export const LaborCostMetadataSchema = z.object({
  chave: z.literal(LABOR_COST_METADATA_KEY),
  versao: z.literal(1),
  natureza: z.enum(['APROPRIACAO_INTERNA', 'SERVICO_TERCEIRO']),
  calculo: LaborCalculationSchema,
  valorCalculado: MoneySchema,
  calculadoEm: z.string().datetime(),
  ajuste: z
    .object({
      valorAnterior: MoneySchema,
      motivo: z.string().min(3),
      autor: AuthorSchema,
      data: z.string().datetime(),
    })
    .optional()
    .nullable(),
})

export const ExpenseMetadataSchema = z.discriminatedUnion('chave', [LaborCostMetadataSchema])

export type TLaborCostSubject = z.infer<typeof LaborCostSubjectSchema>
export type TLaborCostRule = z.infer<typeof LaborCostRuleSchema>
export type TLaborCostConfiguration = z.infer<typeof LaborCostConfigurationSchema>
export type TLaborCostConfigurationDTO = TLaborCostConfiguration & { _id: string }
export type TUpsertLaborCostConfiguration = z.infer<typeof UpsertLaborCostConfigurationSchema>
export type TLaborCalculation = z.infer<typeof LaborCalculationSchema>
export type TLaborCostMetadata = z.infer<typeof LaborCostMetadataSchema>
export type TExpenseMetadata = z.infer<typeof ExpenseMetadataSchema>
