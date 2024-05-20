import { ObjectId } from 'mongodb'
import z from 'zod'

const GeneralFileReferenceSchema = z.object({
  idOportunidade: z.string().optional().nullable(),
  idCliente: z.string().optional().nullable(),
  idAnaliseTecnica: z.string().optional().nullable(),
  idHomologacao: z.string().optional().nullable(),
  idParceiro: z.string(),
  titulo: z.string(),
  formato: z.string(),
  url: z.string(),
  tamanho: z.number().optional().nullable(),
  autor: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
  dataInsercao: z.string().datetime(),
})

export const InsertFileReferenceSchema = z.object({
  idOportunidade: z.string({ invalid_type_error: 'Tipo não válido para a referência de oportunidade.' }).optional().nullable(),
  idCliente: z.string({ invalid_type_error: 'Tipo não válido para a referência de cliente.' }).optional().nullable(),
  idParceiro: z.string({ required_error: 'Referência a parceiro não informada.', invalid_type_error: 'Tipo não válida para referência a parceiro.' }),
  idAnaliseTecnica: z
    .string({
      required_error: 'Referência de análise técnica não informada.',
      invalid_type_error: 'Tipo não válido para a referência de análise técnica.',
    })
    .optional()
    .nullable(),
  idHomologacao: z
    .string({
      required_error: 'Referência de homologação não informada.',
      invalid_type_error: 'Tipo não válido para a referência de homologação.',
    })
    .optional()
    .nullable(),
  titulo: z
    .string({ required_error: 'Titulo do arquivo não informado.', invalid_type_error: 'Tipo não válido para titulo do arquivo.' })
    .min(2, 'É necessário que o titulo do arquivo tenha ao menos 2 caracteres.'),
  formato: z.string({ required_error: 'Formato do arquivo não informado.', invalid_type_error: 'Tipo não válido para o formato do arquivo.' }),
  url: z.string({ required_error: 'URL do arquivo não informada.', invalid_type_error: 'Tipo válido para a URL do arquivo.' }),
  tamanho: z.number().optional().nullable(),
  autor: z.object({
    id: z.string({
      required_error: 'ID do criador do arquivo não informado.',
      invalid_type_error: 'Tipo não válido para id do criador do arquivo.',
    }),
    nome: z.string({
      required_error: 'Nome do criador do arquivo não informado.',
      invalid_type_error: 'Tipo não válido para nome do criador do arquivo.',
    }),
    avatar_url: z.string().optional().nullable(),
  }),
  dataInsercao: z.string().datetime(),
})

const FileReferenceEntitySchema = z.object({
  _id: z.instanceof(ObjectId),
  idOportunidade: z.string().optional().nullable(),
  idCliente: z.string().optional().nullable(),
  idAnaliseTecnica: z.string().optional().nullable(),
  idHomologacao: z.string().optional().nullable(),
  idParceiro: z.string(),
  titulo: z.string(),
  formato: z.string(),
  url: z.string(),
  tamanho: z.number().optional().nullable(),
  autor: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
  dataInsercao: z.string().datetime(),
})

export type TFileReference = z.infer<typeof GeneralFileReferenceSchema>

export type TFileReferenceEntity = z.infer<typeof FileReferenceEntitySchema>

export type TFileReferenceDTO = TFileReference & { _id: string }

export type TFileHolder = { [key: string]: File | string | null }
