import { z } from 'zod'
import { AuthorSchema } from './users'
import { ObjectId } from 'mongodb'

const PropertyResponsibleSchema = z.object({
  id: z.string({
    required_error: 'ID do responsável pela propriedade não informado.',
    invalid_type_error: 'Tipo não válido para o ID do responsável pela propriedade.',
  }),
  nome: z.string({
    required_error: 'Nome do responsável pela propriedade não informado.',
    invalid_type_error: 'Tipo não válido para o nome do responsável pela propriedade.',
  }),
  avatar_url: z
    .string({ required_error: 'Avatar do responsável não informado.', invalid_type_error: 'Tipo não válido para o avatar do responsável.' })
    .optional()
    .nullable(),
  quantidade: z
    .number({
      required_error: 'Quantidade em posse do responsável não informada.',
      invalid_type_error: 'Tipo não válido para a quantidade em posse do responsável.',
    })
    .min(1, 'A quantidade em posse do responsável deve ser no mínimo 1.'),
  dataRecebimento: z
    .string({
      required_error: 'Data de recebimento da propriedade não informada.',
      invalid_type_error: 'Tipo não válido para data de recebimento da propriedade.',
    })
    .datetime({ message: 'Tipo inválido para data de recebimento.' }),
  dataDevolucao: z
    .string({
      required_error: 'Data de devolução da propriedade não informada.',
      invalid_type_error: 'Tipo não válido para data de devolução da propriedade.',
    })
    .datetime({ message: 'Tipo inválido para data de devolução da propriedade.' })
    .optional()
    .nullable(),
})
const GeneralPropertySchema = z.object({
  nome: z.string(),
  identificador: z.string(),
  quantidade: z.number(),
  tags: z.array(z.string()),
  autor: AuthorSchema,
  responsaveis: z.array(PropertyResponsibleSchema),
  dataInsercao: z.string().datetime(),
})
export const InsertPropertySchema = z.object({
  nome: z.string({ required_error: 'Nome da propriedade não informado.', invalid_type_error: 'Tipo não válido para o nome da propriedade.' }),
  identificador: z.string({
    required_error: 'Identificador da propriedade não informado.',
    invalid_type_error: 'Tipo não válido para o identificador da propriedade.',
  }),
  quantidade: z
    .number({
      required_error: 'Quantidade de itens da propriedade não informada.',
      invalid_type_error: 'Tipo não válido para a quantidade de itens da propriedade.',
    })
    .min(1, 'A quantidade mínima de itens é 1.'),
  tags: z.array(z.string({ required_error: 'Tag não informada.', invalid_type_error: 'Tipo não válido para tag da propriedade.' })),
  autor: AuthorSchema,
  responsaveis: z.array(PropertyResponsibleSchema),
  dataInsercao: z
    .string({ required_error: 'Data de inserção não informada.', invalid_type_error: 'Tipo não válido para a data de inserção da propriedade.' })
    .datetime({ message: 'Tipo inválido para a data de inserção.' }),
})

const PropertyEntitySchema = z.object({
  _id: z.instanceof(ObjectId),
  nome: z.string(),
  identificador: z.string(),
  quantidade: z.number(),
  tags: z.array(z.string()),
  autor: AuthorSchema,
  responsaveis: z.array(PropertyResponsibleSchema),
  dataInsercao: z.string().datetime(),
})

export type TProperty = z.infer<typeof GeneralPropertySchema>

export type TPropertyDTO = TProperty & { _id: string }
