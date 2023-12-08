import z from 'zod'
export const AuthorSchema = z.object({
  id: z.string({ required_error: 'ID de referência do autor não fornecido.', invalid_type_error: 'Tipo não válido para o ID do autor.' }),
  nome: z.string({ required_error: 'Nome do autor não fornecido.', invalid_type_error: 'Tipo não válido para o nome do autor.' }),
  avatar_url: z.string({ invalid_type_error: 'Avatar do autor não fornecido.' }).optional().nullable(),
})
