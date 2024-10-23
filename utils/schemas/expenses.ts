import { z } from 'zod'
import { AuthorSchema } from './users'
import { ObjectId } from 'mongodb'
import { TProject, TProjectDTO } from './projects'

const PaymentItemSchema = z.object({
  valor: z.number({ required_error: 'Valor do item de pagamento não informado.', invalid_type_error: 'Tipo não válido para o item de pagamento.' }),
  porcentagem: z.number({
    required_error: 'Porcentagem do item de pagamento não informado.',
    invalid_type_error: 'Tipo não válido para a porcentagem do item de pagamento.',
  }),
  dataPrevisaoPagamento: z
    .string({
      required_error: 'Data de previsão de pagamento não informada.',
      invalid_type_error: 'Tipo não válido para data de previsão de pagamento.',
    })
    .datetime({ message: 'Tipo não válido para data de previsão pagamento.' }),
  dataPagamento: z
    .string({ invalid_type_error: 'Tipo não válido para data de pagamento.' })
    .datetime({ message: 'Tipo não válido para data de pagamento.' })
    .optional()
    .nullable(),
})

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
    identificador: z.union([z.string(), z.number()]).optional().nullable(),
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
  pagamentos: z.array(PaymentItemSchema),
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
    identificador: z
      .union([z.string(), z.number()], { invalid_type_error: 'Tipo não válido para o identificador do projeto de referência.' })
      .optional()
      .nullable(),
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
  pagamentos: z.array(PaymentItemSchema),
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
    identificador: z.union([z.string(), z.number()]).optional().nullable(),
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
  pagamentos: z.array(PaymentItemSchema),
  autor: AuthorSchema,
  dataInsercao: z.string().datetime(),
})

export type TExpense = z.infer<typeof GeneralExpenseSchema>
export type TExpenseSimplified = Pick<TExpense, 'rateio' | 'categoria' | 'total' | 'pagamentos' | 'efetivacao' | 'autor' | 'dataInsercao'>
export type TExpenseDTO = TExpense & { _id: string }
export type TExpenseSimplifiedDTO = TExpenseSimplified & { _id: string }

export type TPaymentUnwindSimplifiedDTO = {
  _id: string
  rateio: TExpense['rateio']
  categoria: TExpense['categoria']
  total: TExpense['total']
  pagamento: TExpense['pagamentos'][number]
  indexPagamento: number
}

export const ExpenseSimplifiedProjection = {
  rateio: 1,
  categoria: 1,
  total: 1,
  pagamentos: 1,
  efetivacao: 1,
  autor: 1,
  dataInsercao: 1,
}

export const ExpenseQueryFilters = z.object({
  search: z.string({ required_error: 'Filtro de pesquisa não informado.', invalid_type_error: 'Tipo não válido para o filtro de pesquisa.' }),
  status: z.array(
    z.enum(['PAGO', 'PAGO PARCIAL', 'PENDENTE'], {
      required_error: 'Status de filtro não informado.',
      invalid_type_error: 'Tipo não válido para status de filtro.',
    }),
    {
      required_error: 'Lista de status de filtro não informada.',
      invalid_type_error: 'Tipo não válido para a lista de status de filtro.',
    }
  ),
  apportionments: z.array(z.string({ invalid_type_error: 'Tipo não válido para o rateio da despesa.' }), {
    required_error: 'Lista de rateios da despesa não informada.',
    invalid_type_error: 'Tipo não válido para lista de rasteios da despesa.',
  }),
  categories: z.array(z.string({ invalid_type_error: 'Tipo não válido para a categoria da despesa.' }), {
    required_error: 'Lista  a categorias da despesa não informada.',
    invalid_type_error: 'Tipo não válido para lista de categorias da despesa.',
  }),
})
export type TExpenseQueryFilters = z.infer<typeof ExpenseQueryFilters>

export const ExpenseProjectProjection = {
  nomeDoContrato: 1,
  cpf_cnpj: 1,
  inscricaoRural: 1,
  tipoDeServico: 1,
  telefone: 1,
  email: 1,
  cep: 1,
  uf: 1,
  cidade: 1,
  bairro: 1,
  logradouro: 1,
  numeroResidencia: 1,
  'pagamento.pagador': 1,
  'pagamento.contatoPagador': 1,
  'pagamento.cpf_cnpjPagador': 1,
  'pagamento.forma': 1,
  'pagamento.metodo': 1,
  'pagamento.credor': 1,
  'pagamento.credorNomeGerente': 1,
  'pagamento.credorContatoGerente': 1,
  'pagamento.negociacao': 1,
  produtos: 1,
  servicos: 1,
}
export type TExpenseProject = Pick<
  TProject,
  | 'nomeDoContrato'
  | 'cpf_cnpj'
  | 'inscricaoRural'
  | 'tipoDeServico'
  | 'telefone'
  | 'email'
  | 'cep'
  | 'uf'
  | 'cidade'
  | 'bairro'
  | 'logradouro'
  | 'numeroResidencia'
  | 'produtos'
  | 'servicos'
> & {
  pagamento: {
    forma: TProjectDTO['pagamento']['forma']
    metodo: TProjectDTO['pagamento']['metodo']
    pagador: TProjectDTO['pagamento']['pagador']
    contatoPagador: TProjectDTO['pagamento']['contatoPagador']
    cpf_cnpjPagador: TProjectDTO['pagamento']['cpf_cnpjPagador']
    credor: TProjectDTO['pagamento']['credor']
    credorNomeGerente: TProjectDTO['pagamento']['credorNomeGerente']
    credorContatoGerente: TProjectDTO['pagamento']['credorContatoGerente']
    negociacao: TProjectDTO['pagamento']['negociacao']
  }
}

export type TExpenseProjectDTO = TExpenseProject & { _id: string }

export type TExpenseWithProjectDTO = TExpenseDTO & { projetoDados: TExpenseProjectDTO | null }
