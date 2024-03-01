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
  tags: z.array(z.string()),
  autor: AuthorSchema,
  responsaveis: z.array(PropertyResponsibleSchema),
  dataInsercao: z.string().datetime(),
})

export type TProperty = z.infer<typeof GeneralPropertySchema>

export type TPropertyDTO = TProperty & { _id: string }
