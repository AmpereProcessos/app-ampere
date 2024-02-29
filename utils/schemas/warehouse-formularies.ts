import { z } from 'zod'
import { AuthorSchema } from './users'

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

const GeneralNewWarehouseFormularySchema = z.object({
  titulo: z.string(),
  categoria: z.string(),
  responsaveis: z.string(),
  projeto: z.object({
    id: z.string().optional().nullable(),
    nome: z.string().optional().nullable(),
    identificador: z.union([z.string(), z.number()]).optional().nullable(),
  }),
  localizacao: z.object({
    cep: z.union([z.string(), z.number()]).optional().nullable(),
    uf: z.string().optional().nullable(),
    cidade: z.string().optional().nullable(),
    bairro: z.string(),
    endereco: z.string(),
    numeroOuIdentificador: z.string(),
    complemento: z.string(),
    distancia: z.number().optional().nullable(),
  }),
  materiais: z.array(
    z.object({
      id: z.string().optional().nullable(),
      nome: z.string(),
      preco: z.number(),
      idExterno: z.string().optional().nullable(),
      grandeza: z.string(),
      qtdeRetirada: z.number(),
      qtdeDevolucao: z.number(),
    })
  ),
  autor: AuthorSchema,
  dataEfetivacao: z.string().datetime().optional().nullable(),
  dataInsercao: z.string().datetime(),
})
export const InsertNewWarehouseFormularySchema = z.object({
  titulo: z.string({ required_error: 'Titulo do formulário não informado.', invalid_type_error: 'Tipo não válido para o tipo do formulário.' }),
  categoria: z.string({
    required_error: 'Categoria do formulário não informada.',
    invalid_type_error: 'Tipo não válido para a categoria do formulário.',
  }),
  responsaveis: z.string({
    required_error: 'Responsáveis do formulário não informados.',
    invalid_type_error: 'Tipo não válido para os responsáveis.',
  }),
  projeto: z.object({
    id: z.string({ invalid_type_error: 'Tipo não válido para o ID do projeto de referência.' }).optional().nullable(),
    nome: z.string({ invalid_type_error: 'Tipo não válido para o nome do projeto de referência.' }).optional().nullable(),
    identificador: z
      .union([z.string(), z.number()], { invalid_type_error: 'Tipo não válido para o identificador do projeto de referência.' })
      .optional()
      .nullable(),
  }),
  localizacao: z.object({
    cep: z.union([z.string(), z.number()], { invalid_type_error: 'Tipo inválido para CEP da localização.' }).optional().nullable(),
    uf: z.string({ invalid_type_error: 'Tipo inválido para a UF da localização.' }).optional().nullable(),
    cidade: z.string({ invalid_type_error: 'Tipo inválido para a cidade da localização.' }).optional().nullable(),
    bairro: z.string({ invalid_type_error: 'Tipo inválido para o bairro da localização.' }),
    endereco: z.string({ invalid_type_error: 'Tipo inválido para o endereço da localização.' }),
    numeroOuIdentificador: z.string({ invalid_type_error: 'Tipo inválido para o número/identificador da localização.' }),
    complemento: z.string({ invalid_type_error: 'Tipo inválido para o complemento da localização.' }),
    distancia: z.number().optional().nullable(),
  }),
  materiais: z.array(
    z.object({
      id: z.string({ invalid_type_error: 'Tipo inválido para CEP da localização.' }).optional().nullable(),
      nome: z.string(),
      preco: z.number(),
      idExterno: z.string().optional().nullable(),
      grandeza: z.string(),
      qtdeRetirada: z.number(),
      qtdeDevolucao: z.number(),
    })
  ),
  autor: AuthorSchema,
  dataEfetivacao: z.string().datetime().optional().nullable(),
  dataInsercao: z.string().datetime(),
})
export type TNewWarehouseFormulary = z.infer<typeof GeneralNewWarehouseFormularySchema>
export type TNewWarehouseFormularyDTO = TNewWarehouseFormulary & { _id: string }
export type TWarehouseFormulary = z.infer<typeof GeneralWarehouseFormularySchema>

export type TWarehouseFormularyDTO = TWarehouseFormulary & { _id: string }
