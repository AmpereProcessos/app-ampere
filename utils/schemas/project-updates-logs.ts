import { z } from 'zod'

const GeneralProjectUpdateLog = z.object({
  idProjetoAlterado: z.string({
    required_error: 'ID de referência do projeto alterado não informado.',
    invalid_type_error: 'Tipo não válido para o ID de referência do projeto alterado.',
  }),
  alteracoes: z.record(z.any(), { required_error: 'Alterações não informadas.', invalid_type_error: 'Tipo inválido para alterações.' }),
  autor: z.object({
    id: z.string({
      required_error: 'ID de referência do autor da alteração não informado.',
      invalid_type_error: 'Tipo inválido para o ID de referência do autor.',
    }),
    nome: z.string({
      required_error: 'Nome do autor da alteração não informado.',
      invalid_type_error: 'Tipo inválido para o nome do autor.',
    }),
    avatar_url: z
      .string({
        required_error: 'Avatar do autor da alteração não informado.',
        invalid_type_error: 'Tipo inválido para o avatar do autor.',
      })
      .optional()
      .nullable(),
  }),
  dataAlteracao: z
    .string({ required_error: 'Data de alteração não fornecida.', invalid_type_error: 'Tipo inválido para data de alteração.' })
    .datetime({ message: 'Formato inválido para data de alteração.' }),
  dataAlteracaoFormatada: z.string({
    required_error: 'Data de alteração não fornecida.',
    invalid_type_error: 'Tipo inválido para data de alteração.',
  }),
})

export type TProjectUpdateLog = z.infer<typeof GeneralProjectUpdateLog>
export type TProjectUpdateLogDTO = TProjectUpdateLog & { _id: string }
