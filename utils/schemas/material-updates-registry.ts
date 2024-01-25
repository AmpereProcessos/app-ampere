import { ObjectId } from 'mongodb'
import { z } from 'zod'

const GeneralMaterialUpdateRegistry = z.object({
  alteracao: z.number(),
  tipo: z.union([z.literal('RETIRADA'), z.literal('DEVOLUÇÃO')], z.literal('ENTRADA')),
  idFormulario: z.string().optional().nullable(),
  material: z.object({
    id: z.string(),
    nome: z.string(),
  }),
  projeto: z.object({
    id: z.string().optional().nullable(),
    nome: z.string().optional().nullable(),
  }),
  qtdeAnterior: z.number(),
  qtdeNovo: z.number(),
  autor: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
})

const InsertMaterialUpdateRegistrySchema = z.object({
  alteracao: z.number({ required_error: 'Alteração não informada.', invalid_type_error: 'Tipo não válido para alteração.' }),
  tipo: z.union([z.literal('RETIRADA'), z.literal('DEVOLUÇÃO'), z.literal('ENTRADA')], {
    required_error: 'Tipo da alteração não informada.',
    invalid_type_error: 'Tipo não válido para o tipo da alteração.',
  }),
  idFormulario: z
    .string({ required_error: 'Referência do formulário não informada.', invalid_type_error: 'Tipo não válido para a referência do formulário.' })
    .optional()
    .nullable(),
  material: z.object({
    id: z.string({ required_error: 'Referência do material não informada.', invalid_type_error: 'Tipo não válido para a referência material.' }),
    nome: z.string(),
  }),
  projeto: z.object({
    id: z
      .string({ required_error: 'Nome do projeto não informado.', invalid_type_error: 'Tipo não válido para o nome do projeto.' })
      .optional()
      .nullable(),
    nome: z
      .string({ required_error: 'Nome do projeto não informado.', invalid_type_error: 'Tipo não válido para o nome do projeto.' })
      .optional()
      .nullable(),
  }),
  qtdeAnterior: z.number({ required_error: 'Quantidade anterior não informada.', invalid_type_error: 'Tipo não válido para quantidade anterior.' }),
  qtdeNovo: z.number({ required_error: 'Nova quantidade não informada.', invalid_type_error: 'Tipo não válido para nova quantidade.' }),
  autor: z.object({
    id: z.string({
      required_error: 'Referência do autor da alteração não informado.',
      invalid_type_error: 'Tipo não válido para a referência do autor da alteração.',
    }),
    nome: z.string({
      required_error: 'Nome do autor da alteração não informado.',
      invalid_type_error: 'Tipo não válido para o nome do autor da alteração.',
    }),
    avatar_url: z.string().optional().nullable(),
  }),
})

export type TMaterialUpdateRegistry = z.infer<typeof GeneralMaterialUpdateRegistry>
export type TMaterialUpdateRegistryDTO = TMaterialUpdateRegistry & { _id: string }
export type TMaterialUpdateRegistryEntity = TMaterialUpdateRegistry & { _id: ObjectId }
