import { ObjectId } from 'mongodb'
import { z } from 'zod'

const GeneralMaterialSchema = z.object({
  alocadorId: z.string().optional().nullable(),
  nome: z.string(),
  nomeTecnico: z.string().optional().nullable(),
  preco: z.number(),
  qtde: z.number(),
  qtdeMaxima: z.number().optional().nullable(),
  qtdeMinima: z.number().optional().nullable(),
  localizacao: z.string().optional().nullable(),
  grandeza: z.string().optional().nullable(),
  codigo: z.string().optional().nullable(),
  anotacoes: z.string().optional().nullable(),
  recontagem: z
    .object({
      data: z.string(),
      responsavel: z.string(),
    })
    .optional()
    .nullable(),
  alteracao: z
    .object({
      id: z.string(),
      nome: z.string(),
      avatar_url: z.string().optional().nullable(),
      dataAlteracao: z.string(),
    })
    .optional()
    .nullable(),
  dataInsercao: z.string().datetime(),
})

export const InsertMaterialSchema = z.object({
  alocadorId: z
    .string({ required_error: 'Alocador do material não fornecido.', invalid_type_error: 'Tipo não válido para o alocador do material.' })
    .optional()
    .nullable(),
  nome: z
    .string({ required_error: 'Nome do material não fornecido.', invalid_type_error: 'Tipo não válido para o nome do material.' })
    .min(3, 'Nome do material deve conter ao menos 3 caracteres.'),
  nomeTecnico: z
    .string({ required_error: 'Nome técnico do material não fornecido.', invalid_type_error: 'Tipo não válido para o nome técnico do material.' })
    .optional()
    .nullable(),
  preco: z.number({ required_error: 'Preço do material não fornecido.', invalid_type_error: 'Tipo não válido para o preço do material.' }),
  qtde: z.number({ required_error: 'Quantidade do material não fornecido.', invalid_type_error: 'Tipo não válido para o quantidade do material.' }),
  qtdeMaxima: z
    .number({
      required_error: 'Quantidade máxima do material não fornecido.',
      invalid_type_error: 'Tipo não válido para o quantidade máxima do material.',
    })
    .optional()
    .nullable(),
  qtdeMinima: z
    .number({
      required_error: 'Quantidade mínima do material não fornecido.',
      invalid_type_error: 'Tipo não válido para o quantidade mínima do material.',
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
  anotacoes: z.string().optional().nullable(),
  recontagem: z
    .object({
      data: z.string(),
      responsavel: z.string(),
    })
    .optional()
    .nullable(),
  alteracao: z
    .object({
      id: z.string(),
      nome: z.string(),
      avatar_url: z.string().optional().nullable(),
      dataAlteracao: z.string(),
    })
    .optional()
    .nullable(),
  dataInsercao: z.string({ required_error: 'Data de inserção não informada.' }).datetime(),
})

export const InputMaterialUpdateSchema = z.object({
  qtdeEntrada: z.number({
    required_error: 'Quantidade em entrada não informada.',
    invalid_type_error: 'Tipo não válido para quantidade em entrada.',
  }),
  precoEntrada: z.number({
    required_error: 'Preço em entrada não informada.',
    invalid_type_error: 'Tipo não válido para preço em entrada.',
  }),
})

export type TInputMaterialData = z.infer<typeof InputMaterialUpdateSchema>
export type TMaterial = z.infer<typeof GeneralMaterialSchema>
export type TMaterialDTO = TMaterial & { _id: string }

export const MaterialSimplifiedProjection = {
  nome: 1,
  alocadorId: 1,
  qtde: 1,
  codigo: 1,
  preco: 1,
  grandeza: 1,
}
export type TMaterialSimplified = Pick<TMaterial, 'nome' | 'alocadorId' | 'qtde' | 'codigo' | 'preco' | 'grandeza'>
export type TMaterialSimplifiedDTO = TMaterialSimplified & { _id: string }

export type TMaterialSimplifiedWithAlocator = TMaterialSimplified & { alocadorDados?: { _id: string; nome: string } }
export type TMaterialSimplifiedWithAlocatorDTO = TMaterialSimplifiedWithAlocator & { _id: string }

export const QueryVinculationMaterialsFiltersSchema = z.object({
  search: z.string({ required_error: 'Filtro de pesquisa não informado.', invalid_type_error: 'Tipo não válido para o filtro de pesquisa.' }),
})
export type TQueryVinculationMaterialsFilter = z.infer<typeof QueryVinculationMaterialsFiltersSchema>
