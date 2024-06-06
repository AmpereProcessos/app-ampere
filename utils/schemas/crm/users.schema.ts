import { ObjectId } from 'mongodb'
import z from 'zod'
export const AuthorSchema = z.object({
  id: z.string({ required_error: 'ID de referência do autor não fornecido.', invalid_type_error: 'Tipo não válido para o ID do autor.' }),
  nome: z.string({ required_error: 'Nome do autor não fornecido.', invalid_type_error: 'Tipo não válido para o nome do autor.' }),
  avatar_url: z.string({ invalid_type_error: 'Avatar do autor não fornecido.' }).optional().nullable(),
})

const PermissionsSchema = z.object({
  usuarios: z.object({
    visualizar: z.boolean({
      required_error: 'Permissão para visualização de usuários não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de visualização de usuários.',
    }), //visualizar área de usuário em auth/users
    editar: z.boolean({
      required_error: 'Permissão para edição de usuários não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de edição de usuários.',
    }), //criar usuários e editar informações de usuários em auth/users
  }),
  comissoes: z.object({
    visualizar: z.boolean({
      required_error: 'Permissão para visualização de comissões não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de visualização de comissões.',
    }), //visualizar comissões de todos os usuários
    editar: z.boolean({
      required_error: 'Permissão para edição de comissões não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de edição de comissões.',
    }), //editar comissões de todos os usuários
  }),
  kits: z.object({
    visualizar: z.boolean({
      required_error: 'Permissão para visualização de kits não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de visualização de kits.',
    }), //visualizar área de kits e kits possíveis
    editar: z.boolean({
      required_error: 'Permissão para edição de kits não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de edição de kits.',
    }), //editar e criar kits
  }),
  propostas: z.object({
    visualizar: z.boolean({
      required_error: 'Permissão para visualização de propostas não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de visualização de propostas.',
    }), //visualizar área de controle de propostas
    editar: z.boolean({
      required_error: 'Permissão para edição de propostas não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de edição de propostas.',
    }), //criar propostas em qualquer projeto e editar propostas de outros usuários
  }),
  projetos: z.object({
    serResponsavel: z.boolean({
      required_error: 'Permissão para criação de projetos não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de criação de projetos.',
    }), //habilitado a ser responsável de projetos
    serRecebedor: z.boolean({
      required_error: 'Permissão para recebimento de projetos não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de recebimento de projetos.',
    }), // recebedor de leads
    editar: z.boolean({
      required_error: 'Permissão para edição de projetos não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de edição de projetos.',
    }), //editar informações de todos os projetos
  }),
  clientes: z.object({
    serRepresentante: z.boolean({
      required_error: 'Permissão para criação de clientes não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de criação de clientes.',
    }), //habilitado a ser representante de clientes
    editar: z.boolean(), //editar informações de todos os clientes
  }),
  precos: z.object({
    visualizar: z.boolean({
      required_error: 'Permissão para visualização de preços não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de visualização de preços.',
    }), //visualizar precificacao geral, com custos, impostos, lucro e afins de propostas e kits
    editar: z.boolean({
      required_error: 'Permissão para edição de preços não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de edição de preços.',
    }), //editar precificacao de propostas
  }),
  parceiros: z.object({
    visualizar: z.boolean({
      required_error: 'Autorização para visualização de parceiros não informada.',
      invalid_type_error: 'Tipo não válido para autorização de visualização de parceiros.',
    }),
    editar: z.boolean({
      required_error: 'Autorização para edição de parceiros não informada.',
      invalid_type_error: 'Tipo não válido para autorização de edição de parceiros.',
    }),
  }),
})
export type TPermissions = z.infer<typeof PermissionsSchema>
export const GeneralUserSchema = z.object({
  ativo: z.boolean(),
  nome: z.string(),
  idParceiro: z.string().optional().nullable(),
  email: z.string(),
  senha: z.string(),
  telefone: z.string(),
  avatar_url: z.string().optional().nullable(),
  visibilidade: z.union([z.literal('GERAL'), z.literal('PRÓPRIA'), z.array(z.string())]),
  funisVisiveis: z.union([z.literal('TODOS'), z.array(z.number())]),
  comissao: z.object({
    comRepresentante: z.number(),
    semRepresentante: z.number(),
  }),
  grupo: z.object({
    id: z.number(),
    nome: z.string(),
  }),
  permissoes: PermissionsSchema,
  dataAlteracao: z.string().datetime().optional().nullable(),
  dataInsercao: z.string().datetime(),
})

export const InsertUserSchema = z.object({
  ativo: z.boolean({ required_error: 'Status de ativação não fornecido.', invalid_type_error: 'Tipo não válido para o status de ativação.' }),
  nome: z.string({ required_error: 'Nome do usuário não informado.', invalid_type_error: 'Tipo não válido para o nome do usuário.' }),
  idParceiro: z.string().optional().nullable(),
  email: z.string({ required_error: 'Email do usuário não informado.', invalid_type_error: 'Tipo não válido para o email do usuário.' }),
  senha: z.string({ required_error: 'Senha do usuário não informada', invalid_type_error: 'Tipo não válido para a senha do usuário.' }),
  telefone: z.string({ required_error: 'Telefone do usuário não informado.', invalid_type_error: 'Tipo não válido para o telefone do usuário.' }),
  avatar_url: z
    .string({ required_error: 'Avatar do usuário não informada.', invalid_type_error: 'Tipo não válido para o avatar do usuário.' })
    .optional()
    .nullable(),
  visibilidade: z.union([z.literal('GERAL'), z.literal('PRÓPRIA'), z.array(z.string())], {
    required_error: 'Visibilidade do usuário não informada.',
    invalid_type_error: 'Tipo não válido para a visibilidade do usuário.',
  }),
  funisVisiveis: z.union([z.literal('TODOS'), z.array(z.number())], {
    required_error: 'Funis visíveis para o usuário não informados.',
    invalid_type_error: 'Tipo não váido para os funis visíveis do usuário.',
  }),
  comissao: z.object({
    comRepresentante: z.number({
      required_error: 'Comissão com representante não informada.',
      invalid_type_error: 'Tipo não válido para a comissão com representante.',
    }),
    semRepresentante: z.number({
      required_error: 'Comissão sem representante não informada.',
      invalid_type_error: 'Tipo não válido para a comissão sem representante.',
    }),
  }),
  grupo: z.object({
    id: z.number({ required_error: 'ID do grupo do usuário não informado.', invalid_type_error: 'Tipo não válido para o ID do grupo do usuário.' }),
    nome: z.string({
      required_error: 'Nome do grupo do usuário não informado.',
      invalid_type_error: 'Tipo não válido para o nome do grupo do usuário.',
    }),
  }),
  permissoes: PermissionsSchema,
  dataAlteracao: z
    .string({ required_error: 'Data de alteração não informada.', invalid_type_error: 'Tipo não válido para data de alteração.' })
    .datetime()
    .optional()
    .nullable(),
  dataInsercao: z
    .string({ required_error: 'Data de inserção não informada.', invalid_type_error: 'Tipo não válido para data de inserção.' })
    .datetime(),
})

export const UserEntitySchema = z.object({
  _id: z.instanceof(ObjectId),
  ativo: z.boolean(),
  nome: z.string(),
  idParceiro: z.string().optional().nullable(),
  email: z.string(),
  senha: z.string(),
  telefone: z.string(),
  avatar_url: z.string().optional().nullable(),
  visibilidade: z.union([z.literal('GERAL'), z.literal('PRÓPRIA'), z.array(z.string())]),
  funisVisiveis: z.union([z.literal('TODOS'), z.array(z.number())]),
  comissao: z.object({
    semSDR: z.number().optional().nullable(),
    comSDR: z.number().optional().nullable(),
  }),
  grupo: z.object({
    id: z.number(),
    nome: z.string(),
  }),
  permissoes: PermissionsSchema,
  dataAlteracao: z.string().datetime().optional().nullable(),
  dataInsercao: z.string().datetime(),
})
export type TCRMUser = z.infer<typeof GeneralUserSchema>

export type TCRMUserDTO = TCRMUser & { _id: string }

export type TLeadReceiverDTO = Pick<TCRMUserDTO, '_id' | 'nome' | 'email' | 'telefone' | 'avatar_url' | 'permissoes'> & { recebidos: number }

export type TCRMResponsibleDTO = {
  id: string
  nome: string
  avatar_url: string | null | undefined
  telefone: string
  email: string
}
export type TCRMRepresentativeDTO = {
  id: string
  nome: string
  avatar_url: string | null | undefined
  telefone: string
  email: string
}
