import { z } from 'zod'
import { AuthorSchema } from './users'
import { ObjectId } from 'mongodb'

const ExpenseItemSchema = z.object({
  idMaterial: z.string().optional().nullable(),
  descricao: z.string({
    required_error: 'Descrição do item de despesa não fornecida.',
    invalid_type_error: 'TIpo não válido para a descrição do item de despesa.',
  }),
  unidade: z.string({
    required_error: 'Unidade do item de despesa não fornecida.',
    invalid_type_error: 'Tipo não válido para a unidade do item de despesa.',
  }),
  preco: z.number({
    required_error: 'Preço do item de despesa não fornecido.',
    invalid_type_error: 'Tipo não válido para o preço do item de despesa.',
  }),
  qtde: z.number({
    required_error: 'Quantidade do item de despesa não fornecida.',
    invalid_type_error: 'Tipo não válido para a quantidade do item de despesa.',
  }),
})
export type TExpenseItem = z.infer<typeof ExpenseItemSchema>

const GeneralExpenseSchema = z.object({
  rateio: z.string(),
  categoria: z.string(),
  descricao: z.string(),
  projeto: z.object({
    id: z.string().optional().nullable(),
    nome: z.string().optional().nullable(),
    identificador: z.number().optional().nullable(),
    tipo: z.string().optional().nullable(),
  }),
  idFormularioAlmoxarifado: z.string().optional().nullable(),
  itens: z.array(ExpenseItemSchema),
  total: z.number(),
  efetivacao: z.object({
    efetivado: z.boolean().optional().nullable(),
    data: z.string().datetime().optional().nullable(),
  }),
  criterioReferencia: z.boolean(),
  criterioCompetencia: z.boolean(),
  autor: AuthorSchema,
  dataInsercao: z.string().datetime(),
})

const InsertExpenseSchema = z.object({
  rateio: z.string({ required_error: 'Rateio da despesa não informado.', invalid_type_error: 'Tipo não válido para o rateio da despesa.' }),
  categoria: z.string({ required_error: 'Categoria da despesa não informada.', invalid_type_error: 'Tipo não válido para a categoria da despesa.' }),
  descricao: z.string({ required_error: 'Descrição da despesa não fornecida.', invalid_type_error: 'Tipo não válido para a descrição da despesa.' }),
  projeto: z.object({
    id: z.string({ invalid_type_error: 'Tipo não válido para o ID do projeto de referência.' }).optional().nullable(),
    nome: z.string({ invalid_type_error: 'Tipo não válido para o nome do projeto de referência.' }).optional().nullable(),
    identificador: z.number({ invalid_type_error: 'Tipo não válido para o identificador do projeto de referência.' }).optional().nullable(),
    tipo: z.string({ invalid_type_error: 'Tipo não válido para o tipo do projeto de referência.' }).optional().nullable(),
  }),
  idFormularioAlmoxarifado: z.string({ invalid_type_error: 'Tipo não válido para o ID de formulário de almoxarifado.' }).optional().nullable(),
  itens: z.array(ExpenseItemSchema),
  total: z.number({ required_error: 'Total da despesa não fornecido.', invalid_type_error: 'Tipo não válido para o total da despesa.' }),
  efetivacao: z.object({
    efetivado: z.boolean({ invalid_type_error: 'Tipo não válido para o status de efetivação da despesa.' }).optional().nullable(),
    data: z.string({ invalid_type_error: 'Tipo não válido para data ou previsão de efetivação da despesa.' }).datetime().optional().nullable(),
  }),
  criterioReferencia: z.boolean({
    required_error: 'Condição do critério de referência não informada.',
    invalid_type_error: 'Tipo não válido para condição do critério de referência.',
  }),
  criterioCompetencia: z.boolean({
    required_error: 'Condição do critério de competência não informada.',
    invalid_type_error: 'Tipo não válido para condição do critério de competência.',
  }),
  autor: AuthorSchema,
  dataInsercao: z
    .string({ required_error: 'Data de inserção não fornecida.', invalid_type_error: 'Tipo não válido para a data de inserção.' })
    .datetime({ message: 'Formato inválido para data de inserção.' }),
})

const ExpenseEntitySchema = z.object({
  _id: z.instanceof(ObjectId),
  rateio: z.string(),
  categoria: z.string(),
  descricao: z.string(),
  projeto: z.object({
    id: z.string().optional().nullable(),
    nome: z.string().optional().nullable(),
    identificador: z.number().optional().nullable(),
    tipo: z.string().optional().nullable(),
  }),
  idFormularioAlmoxarifado: z.string().optional().nullable(),
  itens: z.array(ExpenseItemSchema),
  total: z.number(),
  efetivacao: z.object({
    efetivado: z.boolean().optional().nullable(),
    data: z.string().datetime().optional().nullable(),
  }),
  criterioReferencia: z.boolean(),
  criterioCompetencia: z.boolean(),
  autor: AuthorSchema,
  dataInsercao: z.string().datetime(),
})

export type TExpense = z.infer<typeof GeneralExpenseSchema>

export type TExpenseDTO = TExpense & { _id: string }
