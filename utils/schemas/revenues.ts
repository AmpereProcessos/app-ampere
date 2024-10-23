import { z } from 'zod'
import { AuthorSchema } from './users'
import { ObjectId } from 'mongodb'
import { TProject, TProjectDTO } from './projects'

const ReceiptItemSchema = z.object({
  titulo: z.string({ required_error: 'Titulo do recebimento não informado.', invalid_type_error: 'Tipo não válido para o titulo do recebimento.' }),
  valor: z
    .number({ required_error: 'Valor do recebimento não informado.', invalid_type_error: 'Tipo não válido para o valor do recebimento.' })
    .optional()
    .nullable(),
  porcentagem: z.number({
    required_error: 'Porcentagem do recebimento não informada.',
    invalid_type_error: 'Tipo não válido para a porcentagem do recebimento.',
  }),
  dataPrevisaoRecebimento: z
    .string({ required_error: 'Previsão de recebimento não informada', invalid_type_error: 'Tipo não válido para a previsão de recebimento.' })
    .datetime({ message: 'Tipo não válido para a previsão de recebimento.' }),
  dataRecebimento: z
    .string({ invalid_type_error: 'Tipo não válido para a previsão de recebimento.' })
    .datetime({ message: 'Tipo não válido para a previsão de recebimento.' })
    .optional()
    .nullable(),
})

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
  fracionamento: z.array(ReceiptItemSchema),
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
  fracionamento: z.array(ReceiptItemSchema),
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
  fracionamento: z.array(ReceiptItemSchema),
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

export const RevenueProjectProjection = {
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
export type TRevenueProject = Pick<
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

export type TRevenueProjectDTO = TRevenueProject & { _id: string }

export type TRevenueWithProjectDTO = TRevenueDTO & { projetoDados: TRevenueProjectDTO | null }
