import { z } from 'zod'
import { AuthorSchema } from './users'
import { ObjectId } from 'mongodb'

const GeneralRevenueSchema = z.object({
  nome: z.string(),
  tipo: z.string(),
  autor: AuthorSchema,
  projeto: z.object({
    id: z.string().optional().nullable(),
    nome: z.string().optional().nullable(),
    identificador: z.union([z.string(), z.number()]).optional().nullable(),
  }),
  total: z.number(),
  metodo: z.string(),
  efetivacao: z.object({
    efetivado: z.boolean().optional().nullable(),
    data: z.string().datetime().optional().nullable(),
  }),
  fracionamento: z.array(
    z.object({
      valor: z.number().optional().nullable(),
      porcentagem: z.number(),
      dataPrevisaoRecebimento: z.string().datetime(),
      dataRecebimento: z.string().datetime().optional().nullable(),
    })
  ),
  dataInsercao: z.string().datetime(),
})

export const InsertRevenueSchema = z.object({
  nome: z
    .string({ required_error: 'Nome da receita não informada.', invalid_type_error: 'Tipo não o nome da receita.' })
    .min(5, 'Preencha um nome de ao menos 5 caracteres.'),
  tipo: z.string({ required_error: 'Tipo da receita não informada.', invalid_type_error: 'Tipo não válido para o tipo da receita.' }),
  autor: AuthorSchema,
  projeto: z.object({
    id: z
      .string({ required_error: 'ID do projeto não informado.', invalid_type_error: 'Tipo não válido para o ID do projeto.' })
      .optional()
      .nullable(),
    nome: z
      .string({ required_error: 'Nome do projeto não informado.', invalid_type_error: 'Tipo não válido para o nome do projeto.' })
      .optional()
      .nullable(),
    identificador: z
      .union([
        z.string({
          required_error: 'Identificador do projeto não informado.',
          invalid_type_error: 'Tipo não válido para o identificador do projeto.',
        }),
        z.number({
          required_error: 'Identificador do projeto não informado.',
          invalid_type_error: 'Tipo não válido para o identificador do projeto.',
        }),
      ])
      .optional()
      .nullable(),
  }),
  total: z.number({ required_error: 'Total da receita não informado.' }).min(0, 'Valor de receita inválido.'),
  metodo: z.string({ required_error: 'Método de recebimento não informado.', invalid_type_error: 'Tipo não válido para o método de recebimento.' }),
  efetivacao: z.object({
    efetivado: z
      .boolean({ required_error: 'Status de efetivação não informado.', invalid_type_error: 'Tipo não válido para o status de efetivação.' })
      .optional()
      .nullable(),
    data: z
      .string({ required_error: 'Data de efetivação não informada.', invalid_type_error: 'Tipo não válido para a data de efetivação.' })
      .datetime()
      .optional()
      .nullable(),
  }),
  fracionamento: z.array(
    z.object({
      valor: z
        .number({ required_error: 'Valor do fracionamento não informado.', invalid_type_error: 'Tipo não válido para o valor do fracionamento.' })
        .optional()
        .nullable(),
      porcentagem: z.number({
        required_error: 'Porcentagem do fracionamento de receita não informado.',
        invalid_type_error: 'Tipo não válido para a porcentagem do fracionamento.',
      }),
      dataPrevisaoRecebimento: z
        .string({
          required_error: 'Data de previsão de recebimento não informada.',
          invalid_type_error: 'Tipo não válido para a previsão da data de recebimento.',
        })
        .datetime(),
      dataRecebimento: z
        .string({
          required_error: 'Data de recebimento não informada.',
          invalid_type_error: 'Tipo não válido para a data de recebimento.',
        })
        .datetime()
        .optional()
        .nullable(),
    })
  ),
  dataInsercao: z
    .string({ required_error: 'Data de inserção não informada.', invalid_type_error: 'Tipo não válido para a data de inserção.' })
    .datetime(),
})

const RevenueEntitySchema = z.object({
  _id: z.instanceof(ObjectId),
  nome: z.string(),
  tipo: z.string(),
  autor: AuthorSchema,
  projeto: z.object({
    id: z.string().optional().nullable(),
    nome: z.string().optional().nullable(),
    identificador: z.union([z.string(), z.number()]).optional().nullable(),
  }),
  total: z.number(),
  metodo: z.string(),
  efetivacao: z.object({
    efetivado: z.boolean().optional().nullable(),
    data: z.string().datetime().optional().nullable(),
  }),
  fracionamento: z.array(
    z.object({
      valor: z.number().optional().nullable(),
      porcentagem: z.number(),
      dataPrevisaoRecebimento: z.string().datetime(),
      dataRecebimento: z.string().datetime().optional().nullable(),
    })
  ),
  dataInsercao: z.string().datetime(),
})

export type TRevenue = z.infer<typeof GeneralRevenueSchema>
export type TRevenueSimplified = Pick<
  TRevenue,
  'nome' | 'projeto' | 'tipo' | 'total' | 'fracionamento' | 'efetivacao' | 'metodo' | 'autor' | 'dataInsercao'
>
export type TRevenueDTO = TRevenue & { _id: string }
export type TRevenueSimplifiedDTO = TRevenueSimplified & { _id: string }

export type TReceiptUnwindSimplifiedDTO = {
  _id: string
  nome: TRevenue['nome']
  total: TRevenue['total']
  metodo: TRevenue['metodo']
  tipo: TRevenue['tipo']
  fracionamento: TRevenue['fracionamento'][number]
  indexFracionamento: number
}

export const RevenueSimplifiedProjection = {
  nome: 1,
  projeto: 1,
  tipo: 1,
  total: 1,
  'fracionamento.valor': 1,
  'fracionamento.porcentagem': 1,
  'fracionamento.dataRecebimento': 1,
  efetivacao: 1,
  metodo: 1,
  autor: 1,
  dataInsercao: 1,
}
export const RevenueQueryFilters = z.object({
  search: z.string({ required_error: 'Filtro de pesquisa não informado.', invalid_type_error: 'Tipo não válido para o filtro de pesquisa.' }),
  status: z.array(
    z.enum(['RECEBIDO', 'RECEBIDO PARCIAL', 'PENDENTE'], {
      required_error: 'Status de filtro não informado.',
      invalid_type_error: 'Tipo não válido para status de filtro.',
    }),
    {
      required_error: 'Lista de status de filtro não informada.',
      invalid_type_error: 'Tipo não válido para a lista de status de filtro.',
    }
  ),
  types: z.array(z.string({ invalid_type_error: 'Tipo não válido para o tipo da receita.' }), {
    required_error: 'Lista de tipos da receita não informada.',
    invalid_type_error: 'Tipo não válido para lista de tipos da receita.',
  }),
})
export type TRevenueQueryFilters = z.infer<typeof RevenueQueryFilters>
