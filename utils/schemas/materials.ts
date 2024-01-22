import { ObjectId } from 'mongodb'
import { z } from 'zod'

const GeneralMaterialSchema = z.object({
  nome: z.string(),
  nomeTecnico: z.string().optional().nullable(),
  preco: z.number(),
  qtde: z.number(),
  qtdeMaxima: z.number().optional().nullable(),
  qtdeMinima: z.number().optional().nullable(),
  localizacao: z.string().optional().nullable(),
  grandeza: z.string().optional().nullable(),
  codigo: z.string().optional().nullable(),
  recontagem: z
    .object({
      data: z.string(),
      responsavel: z.string(),
    })
    .optional()
    .nullable(),
})

const InsertMaterialSchema = z.object({
  nome: z.string({ required_error: 'Nome do material não fornecido.', invalid_type_error: 'Tipo não válido para o nome do material.' }),
  nomeTecnico: z
    .string({ required_error: 'Nome técnico do material não fornecido.', invalid_type_error: 'Tipo não válido para o nome técnico do material.' })
    .optional()
    .nullable(),
  preco: z.number({ required_error: 'Preço do material não fornecido.', invalid_type_error: 'Tipo não válido para o preço do material.' }),
  qtde: z.number({ required_error: 'Quantidade do material não fornecido.', invalid_type_error: 'Tipo não válido para o quantidade do material.' }),
  qtdeMaxima: z
    .number({
      required_error: 'uantidade máxima do material não fornecido.',
      invalid_type_error: 'Tipo não válido para o quantidade máxima do material.',
    })
    .optional()
    .nullable(),
  qtdeMinima: z
    .number({
      required_error: 'Quantidade miníma do material não fornecido.',
      invalid_type_error: 'Tipo não válido para o quantidade miníma do material.',
    })
    .optional()
    .nullable(),
  localizacao: z
    .string({ required_error: 'Localização do material não fornecido.', invalid_type_error: 'Tipo não válido para o Localização do material.' })
    .optional()
    .nullable(),
  grandeza: z
    .string({ required_error: 'Grandeza do material não fornecido.', invalid_type_error: 'Tipo não válido para o grandeza do material.' })
    .optional()
    .nullable(),
  codigo: z
    .string({ required_error: 'Código do material não fornecido.', invalid_type_error: 'Tipo não válido para o código do material.' })
    .optional()
    .nullable(),
  recontagem: z
    .object({
      data: z.string(),
      responsavel: z.string(),
    })
    .optional()
    .nullable(),
})

export type TMaterial = z.infer<typeof GeneralMaterialSchema>

export type TMaterialDTO = TMaterial & { _id: string }
type TMaterialEntity = TMaterial & { _id: ObjectId }
