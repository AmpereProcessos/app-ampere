import z from 'zod'
import { ClientDTOSchema, InsertClientSchema, TClientDTO } from './client.schema'

import { TActivityDTO } from './activities.schema'
import { TProposal } from './proposal.schema'
import { TFunnelReference } from './funnel-reference.schema'
import { TPartnerSimplifiedDTO } from './partner.schema'

type ActivitiesByStatus = {
  [key: string]: number
}
export const ElectricalInstallationGroupsSchema = z.union(
  [z.literal('RESIDENCIAL'), z.literal('COMERCIAL'), z.literal('INDUSTRIAL'), z.literal('RURAL')],
  {
    required_error: 'Grupo da instalação elétrica não informado.',
    invalid_type_error: 'Tipo não válido para grupo da instalação elétrica.',
  }
)
export type TElectricalInstallationGroups = z.infer<typeof ElectricalInstallationGroupsSchema>
export const SaleCategorySchema = z.enum(['KIT', 'PLANO', 'PRODUTOS', 'SERVIÇOS'], {
  required_error: 'Categoria de venda não fornecida.',
  invalid_type_error: 'Tipo não válido para categoria de venda.',
})
export type TSaleCategory = z.infer<typeof SaleCategorySchema>

export const GeneralOpportunitySchema = z.object({
  nome: z.string(),
  idParceiro: z.string(),
  tipo: z.object({
    id: z
      .string({
        required_error: 'ID de referência do tipo de projeto não encontrado.',
        invalid_type_error: 'Tipo não válido para o ID de referência do tipo de projeto.',
      })
      .min(12, 'Tipo inválido de projeto.'),
    titulo: z.string({
      required_error: 'Titulo do tipo de projeto não encontrado.',
      invalid_type_error: 'Tipo não válido para o titulo do tipo de projeto.',
    }),
  }),
  categoriaVenda: SaleCategorySchema,
  descricao: z.string(),
  identificador: z.string(),
  responsaveis: z.array(
    z.object({
      id: z.string(),
      nome: z.string(),
      papel: z.string(),
      avatar_url: z.string().optional().nullable(),
      telefone: z.string().optional().nullable(),
    })
  ),
  segmento: z
    .union([z.literal('RESIDENCIAL'), z.literal('RURAL'), z.literal('COMERCIAL'), z.literal('INDUSTRIAL')])
    .optional()
    .nullable(),
  idCliente: z.string(),
  idPropostaAtiva: z.string().optional().nullable(),
  localizacao: z.object({
    cep: z.string().optional().nullable(),
    uf: z.string(),
    cidade: z.string(),
    bairro: z.string().optional().nullable(),
    endereco: z.string().optional().nullable(),
    numeroOuIdentificador: z.string().optional().nullable(),
    complemento: z.string().optional().nullable(),
    latitude: z.string().optional().nullable(),
    longitude: z.string().optional().nullable(),
    // distancia: z.number().optional().nullable(),
  }),
  perda: z.object({
    idMotivo: z.string().optional().nullable(),
    descricaoMotivo: z.string().optional().nullable(),
    data: z.string().optional().nullable(),
  }),
  ganho: z.object({
    idProposta: z.string().optional().nullable(),
    idProjeto: z.string().optional().nullable(),
    data: z.string().datetime().optional().nullable(),
    idSolicitacao: z.string().datetime({ message: 'Formato inválido para data de ganho.' }).optional().nullable(),
    dataSolicitacao: z.string().datetime({ message: 'Formato inválido para data de solicitação de contrato.' }).optional().nullable(),
  }),
  instalacao: z.object({
    concessionaria: z.string().optional().nullable(),
    numero: z.string().optional().nullable(),
    grupo: ElectricalInstallationGroupsSchema.optional().nullable(),
    tipoLigacao: z
      .union([z.literal('EXISTENTE'), z.literal('NOVA')])
      .optional()
      .nullable(),
    tipoTitular: z
      .union([z.literal('PESSOA FÍSICA'), z.literal('PESSOA JURÍDICA')])
      .optional()
      .nullable(),
    nomeTitular: z.string().optional().nullable(),
  }),
  autor: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
  idMarketing: z.string().optional().nullable(),
  dataInsercao: z.string().datetime(),
  // adicionar contrato e solicitação de contrato futuramente
})
export const InsertOpportunitySchema = z.object({
  nome: z
    .string({ required_error: 'Nome da oportunidade não informado.', invalid_type_error: 'Tipo não válido para nome da oportunidade.' })
    .min(3, 'É necessário um nome de ao menos 3 caractéres para a oportunidade.'),
  idParceiro: z.string({
    required_error: 'Referência a parceiro não informado.',
    invalid_type_error: 'Tipo não válido para a referência de parceiro.',
  }),
  tipo: z.object({
    id: z
      .string({
        required_error: 'ID de referência do tipo de projeto não encontrado.',
        invalid_type_error: 'Tipo não válido para o ID de referência do tipo de projeto.',
      })
      .min(12, 'Tipo inválido para ID de tipo deprojeto.'),
    titulo: z.string({
      required_error: 'Titulo do tipo de projeto não encontrado.',
      invalid_type_error: 'Tipo não válido para o titulo do tipo de projeto.',
    }),
  }),
  categoriaVenda: SaleCategorySchema,
  descricao: z.string({
    required_error: 'Descrição da oportunidade não informada.',
    invalid_type_error: 'Tipo não válido para descrição da oportunidade.',
  }),
  identificador: z.string({
    required_error: 'Identificador da oportunidade não informado.',
    invalid_type_error: 'Tipo inválido para identificador da oportunidade.',
  }),
  responsaveis: z
    .array(
      z.object({
        id: z.string(),
        nome: z.string(),
        papel: z.string(),
        avatar_url: z.string().optional().nullable(),
        telefone: z.string().optional().nullable(),
      }),
      { required_error: 'Responsável(is) da oportunidade não informados.', invalid_type_error: 'Tipo não válido para responsáveis da oportunidade.' }
    )
    .min(1, 'É necessário ao menos 1 responsável.'),
  segmento: z
    .union([z.literal('RESIDENCIAL'), z.literal('RURAL'), z.literal('COMERCIAL'), z.literal('INDUSTRIAL')], {
      required_error: 'Segmento da oportunidade não informado.',
      invalid_type_error: 'Tipo não válido para o segmento da oportunidade.',
    })
    .optional()
    .nullable(),
  idCliente: z.string({ required_error: 'Vínculo de cliente não informado.', invalid_type_error: 'Tipo não válido para vínculo de cliente.' }),
  idPropostaAtiva: z.string().optional().nullable(),
  localizacao: z.object({
    cep: z.string().optional().nullable(),
    uf: z.string({
      required_error: 'UF de localização da oportunidade não informada.',
      invalid_type_error: 'Tipo não válido para a UF de localização da oportunidade.',
    }),
    cidade: z.string({
      required_error: 'Cidade de localização da oportunidade não informada.',
      invalid_type_error: 'Tipo não válido para a cidade de localização da oportunidade.',
    }),
    bairro: z.string().optional().nullable(),
    endereco: z.string().optional().nullable(),
    numeroOuIdentificador: z.string().optional().nullable(),
    complemento: z.string().optional().nullable(),
    latitude: z.string({ invalid_type_error: 'Tipo não válido para latitude da localização da oportunidade.' }).optional().nullable(),
    longitude: z.string({ invalid_type_error: 'Tipo não válido para longitude da localização da oportunidade.' }).optional().nullable(),
    // distancia: z.number().optional().nullable(),
  }),
  perda: z.object({
    idMotivo: z.string().optional().nullable(),
    descricaoMotivo: z.string().optional().nullable(),
    data: z.string().datetime({ message: 'Formato inválido para data de perda.' }).optional().nullable(),
  }),
  ganho: z.object({
    idProposta: z.string().optional().nullable(),
    idProjeto: z.string().optional().nullable(),
    data: z.string().datetime({ message: 'Formato inválido para data de ganho.' }).optional().nullable(),
    idSolicitacao: z.string().optional().nullable(),
    dataSolicitacao: z.string().datetime({ message: 'Formato inválido para data de solicitação de contrato.' }).optional().nullable(),
  }),
  instalacao: z.object({
    concessionaria: z.string().optional().nullable(),
    numero: z.string().optional().nullable(),
    grupo: ElectricalInstallationGroupsSchema.optional().nullable(),
    tipoLigacao: z
      .union([z.literal('EXISTENTE'), z.literal('NOVA')])
      .optional()
      .nullable(),
    tipoTitular: z
      .union([z.literal('PESSOA FÍSICA'), z.literal('PESSOA JURÍDICA')])
      .optional()
      .nullable(),
    nomeTitular: z.string().optional().nullable(),
  }),
  autor: z.object({
    id: z.string({
      required_error: 'ID do criador da oportunidade não informado.',
      invalid_type_error: 'Tipo não válido para id do criador da oportunidade.',
    }),
    nome: z.string({
      required_error: 'Nome do criador da oportunidade não informado.',
      invalid_type_error: 'Tipo não válido para nome do criador da oportunidade.',
    }),
    avatar_url: z.string().optional().nullable(),
  }),
  idMarketing: z
    .string({
      required_error: 'ID de referência do Lead Marketing não fornecido.',
      invalid_type_error: 'Tipo não válido para o ID de referência do Lead Marketing',
    })
    .optional()
    .nullable(),
  dataInsercao: z.string().datetime(),
})
export const UpdateOpportunitySchema = z.object({
  _id: z.string({
    required_error: 'ID de referência da oportunidade não informado.',
    invalid_type_error: 'Tipo não válido para o ID de referência da oportunidade.',
  }),
  nome: z
    .string({ required_error: 'Nome da oportunidade não informado.', invalid_type_error: 'Tipo não válido para nome da oportunidade.' })
    .min(3, 'É necessário um nome de ao menos 3 caractéres para a oportunidade.'),
  idParceiro: z.string({
    required_error: 'Referência a parceiro não informado.',
    invalid_type_error: 'Tipo não válido para a referência de parceiro.',
  }),
  tipo: z.object({
    id: z
      .string({
        required_error: 'ID de referência do tipo de projeto não encontrado.',
        invalid_type_error: 'Tipo não válido para o ID de referência do tipo de projeto.',
      })
      .min(12, 'Tipo inválido para ID de tipo deprojeto.'),
    titulo: z.string({
      required_error: 'Titulo do tipo de projeto não encontrado.',
      invalid_type_error: 'Tipo não válido para o titulo do tipo de projeto.',
    }),
  }),
  categoriaVenda: SaleCategorySchema,
  descricao: z.string({
    required_error: 'Descrição da oportunidade não informada.',
    invalid_type_error: 'Tipo não válido para descrição da oportunidade.',
  }),
  identificador: z.string({
    required_error: 'Identificador da oportunidade não informado.',
    invalid_type_error: 'Tipo inválido para identificador da oportunidade.',
  }),
  responsaveis: z
    .array(
      z.object({
        id: z.string(),
        nome: z.string(),
        papel: z.string(),
        avatar_url: z.string().optional().nullable(),
        telefone: z.string().optional().nullable(),
      }),
      { required_error: 'Responsável(is) da oportunidade não informados.', invalid_type_error: 'Tipo não válido para responsáveis da oportunidade.' }
    )
    .min(1, 'É necessário ao menos 1 responsável.'),
  segmento: z
    .union([z.literal('RESIDENCIAL'), z.literal('RURAL'), z.literal('COMERCIAL'), z.literal('INDUSTRIAL')], {
      required_error: 'Segmento da oportunidade não informado.',
      invalid_type_error: 'Tipo não válido para o segmento da oportunidade.',
    })
    .optional()
    .nullable(),
  idCliente: z.string({ required_error: 'Vínculo de cliente não informado.', invalid_type_error: 'Tipo não válido para vínculo de cliente.' }),
  idPropostaAtiva: z.string().optional().nullable(),
  localizacao: z.object({
    cep: z.string().optional().nullable(),
    uf: z.string({
      required_error: 'UF de localização da oportunidade não informada.',
      invalid_type_error: 'Tipo não válido para a UF de localização da oportunidade.',
    }),
    cidade: z.string({
      required_error: 'Cidade de localização da oportunidade não informada.',
      invalid_type_error: 'Tipo não válido para a cidade de localização da oportunidade.',
    }),
    bairro: z.string().optional().nullable(),
    endereco: z.string().optional().nullable(),
    numeroOuIdentificador: z.string().optional().nullable(),
    complemento: z.string().optional().nullable(),
    latitude: z.string({ invalid_type_error: 'Tipo não válido para latitude da localização da oportunidade.' }).optional().nullable(),
    longitude: z.string({ invalid_type_error: 'Tipo não válido para longitude da localização da oportunidade.' }).optional().nullable(),
    // distancia: z.number().optional().nullable(),
  }),
  perda: z.object({
    idMotivo: z.string().optional().nullable(),
    descricaoMotivo: z.string().optional().nullable(),
    data: z.string().datetime({ message: 'Formato inválido para data de perda.' }).optional().nullable(),
  }),
  ganho: z.object({
    idProposta: z.string().optional().nullable(),
    idProjeto: z.string().optional().nullable(),
    data: z.string().datetime({ message: 'Formato inválido para data de ganho.' }).optional().nullable(),
    idSolicitacao: z.string().datetime({ message: 'Formato inválido para data de ganho.' }).optional().nullable(),
    dataSolicitacao: z.string().datetime({ message: 'Formato inválido para data de solicitação de contrato.' }).optional().nullable(),
  }),
  instalacao: z.object({
    concessionaria: z.string().optional().nullable(),
    numero: z.string().optional().nullable(),
    grupo: ElectricalInstallationGroupsSchema.optional().nullable(),
    tipoLigacao: z
      .union([z.literal('EXISTENTE'), z.literal('NOVA')])
      .optional()
      .nullable(),
    tipoTitular: z
      .union([z.literal('PESSOA FÍSICA'), z.literal('PESSOA JURÍDICA')])
      .optional()
      .nullable(),
    nomeTitular: z.string().optional().nullable(),
  }),
  autor: z.object({
    id: z.string({
      required_error: 'ID do criador da oportunidade não informado.',
      invalid_type_error: 'Tipo não válido para id do criador da oportunidade.',
    }),
    nome: z.string({
      required_error: 'Nome do criador da oportunidade não informado.',
      invalid_type_error: 'Tipo não válido para nome do criador da oportunidade.',
    }),
    avatar_url: z.string().optional().nullable(),
  }),
  idMarketing: z
    .string({
      required_error: 'ID de referência do Lead Marketing não fornecido.',
      invalid_type_error: 'Tipo não válido para o ID de referência do Lead Marketing',
    })
    .optional()
    .nullable(),
  dataInsercao: z.string().datetime(),
})
export const OpportunityWithClientSchema = z.object({
  _id: z.string({
    required_error: 'ID de referência da oportunidade não informado.',
    invalid_type_error: 'Tipo não válido para o ID de referência da oportunidade.',
  }),
  nome: z
    .string({ required_error: 'Nome da oportunidade não informado.', invalid_type_error: 'Tipo não válido para nome da oportunidade.' })
    .min(3, 'É necessário um nome de ao menos 3 caractéres para a oportunidade.'),
  idParceiro: z.string({
    required_error: 'Referência a parceiro não informado.',
    invalid_type_error: 'Tipo não válido para a referência de parceiro.',
  }),
  tipo: z.object({
    id: z
      .string({
        required_error: 'ID de referência do tipo de projeto não encontrado.',
        invalid_type_error: 'Tipo não válido para o ID de referência do tipo de projeto.',
      })
      .min(12, 'Tipo inválido para ID de tipo deprojeto.'),
    titulo: z.string({
      required_error: 'Titulo do tipo de projeto não encontrado.',
      invalid_type_error: 'Tipo não válido para o titulo do tipo de projeto.',
    }),
  }),
  categoriaVenda: SaleCategorySchema,
  descricao: z.string({
    required_error: 'Descrição da oportunidade não informada.',
    invalid_type_error: 'Tipo não válido para descrição da oportunidade.',
  }),
  identificador: z.string({
    required_error: 'Identificador da oportunidade não informado.',
    invalid_type_error: 'Tipo inválido para identificador da oportunidade.',
  }),
  responsaveis: z
    .array(
      z.object({
        id: z.string(),
        nome: z.string(),
        papel: z.string(),
        avatar_url: z.string().optional().nullable(),
        telefone: z.string().optional().nullable(),
      }),
      { required_error: 'Responsável(is) da oportunidade não informados.', invalid_type_error: 'Tipo não válido para responsáveis da oportunidade.' }
    )
    .min(1, 'É necessário ao menos 1 responsável.'),
  segmento: z
    .union([z.literal('RESIDENCIAL'), z.literal('RURAL'), z.literal('COMERCIAL'), z.literal('INDUSTRIAL')], {
      required_error: 'Segmento da oportunidade não informado.',
      invalid_type_error: 'Tipo não válido para o segmento da oportunidade.',
    })
    .optional()
    .nullable(),
  idCliente: z.string({ required_error: 'Vínculo de cliente não informado.', invalid_type_error: 'Tipo não válido para vínculo de cliente.' }),
  cliente: ClientDTOSchema,
  idPropostaAtiva: z.string().optional().nullable(),
  localizacao: z.object({
    cep: z.string().optional().nullable(),
    uf: z.string({
      required_error: 'UF de localização da oportunidade não informada.',
      invalid_type_error: 'Tipo não válido para a UF de localização da oportunidade.',
    }),
    cidade: z.string({
      required_error: 'Cidade de localização da oportunidade não informada.',
      invalid_type_error: 'Tipo não válido para a cidade de localização da oportunidade.',
    }),
    bairro: z.string().optional().nullable(),
    endereco: z.string().optional().nullable(),
    numeroOuIdentificador: z.string().optional().nullable(),
    complemento: z.string().optional().nullable(),
    latitude: z.string({ invalid_type_error: 'Tipo não válido para latitude da localização da oportunidade.' }).optional().nullable(),
    longitude: z.string({ invalid_type_error: 'Tipo não válido para longitude da localização da oportunidade.' }).optional().nullable(),
    // distancia: z.number().optional().nullable(),
  }),
  perda: z.object({
    idMotivo: z.string().optional().nullable(),
    descricaoMotivo: z.string().optional().nullable(),
    data: z.string().datetime({ message: 'Formato inválido para data de perda.' }).optional().nullable(),
  }),
  ganho: z.object({
    idProposta: z.string().optional().nullable(),
    idProjeto: z.string().optional().nullable(),
    data: z.string().datetime({ message: 'Formato inválido para data de ganho.' }).optional().nullable(),
    idSolicitacao: z.string().datetime({ message: 'Formato inválido para data de ganho.' }).optional().nullable(),
    dataSolicitacao: z.string().datetime({ message: 'Formato inválido para data de solicitação de contrato.' }).optional().nullable(),
  }),
  instalacao: z.object({
    concessionaria: z.string().optional().nullable(),
    numero: z.string().optional().nullable(),
    grupo: ElectricalInstallationGroupsSchema.optional().nullable(),
    tipoLigacao: z
      .union([z.literal('EXISTENTE'), z.literal('NOVA')])
      .optional()
      .nullable(),
    tipoTitular: z
      .union([z.literal('PESSOA FÍSICA'), z.literal('PESSOA JURÍDICA')])
      .optional()
      .nullable(),
    nomeTitular: z.string().optional().nullable(),
  }),
  autor: z.object({
    id: z.string({
      required_error: 'ID do criador da oportunidade não informado.',
      invalid_type_error: 'Tipo não válido para id do criador da oportunidade.',
    }),
    nome: z.string({
      required_error: 'Nome do criador da oportunidade não informado.',
      invalid_type_error: 'Tipo não válido para nome do criador da oportunidade.',
    }),
    avatar_url: z.string().optional().nullable(),
  }),
  idMarketing: z
    .string({
      required_error: 'ID de referência do Lead Marketing não fornecido.',
      invalid_type_error: 'Tipo não válido para o ID de referência do Lead Marketing',
    })
    .optional()
    .nullable(),
  dataInsercao: z.string().datetime(),
})

export type TOpportunity = z.infer<typeof GeneralOpportunitySchema>
export type TOpportunitySimplified = Pick<TOpportunity, 'nome' | 'identificador' | 'responsaveis' | 'ganho' | 'perda'>

export type TOpportunitySimplifiedWithProposalAndActivitiesAndFunnels = TOpportunitySimplified & {
  proposta: { nome: TProposal['nome']; valor: TProposal['valor']; potenciaPico: TProposal['potenciaPico'] }
  statusAtividades?: ActivitiesByStatus
  funil: { id: string; idFunil: TFunnelReference['idFunil']; idEstagio: TFunnelReference['idEstagioFunil'] }
}

export type TOpportunityWithFunnelReferenceAndActivitiesByStatus = TOpportunity & {
  funil: { id: string; idFunil: string; idEstagio: string }
  statusAtividades: ActivitiesByStatus
}
export type TOpportunityWithFunnelReferenceAndActivities = TOpportunity & {
  funil: { id: string; idFunil: string; idEstagio: string }
  atividades: TActivityDTO[]
}

// export type TOpportunityEntity = TOpportunity & {_id: ObjectId}
// export type TOpportunityEntityWithFunnelReference = TOpportunityEntity & { funil: { id: string; idFunil: string; idEstagio: string } }

export type TOpportunityDTO = TOpportunity & { _id: string }
export type TOpportunitySimplifiedDTO = Pick<TOpportunityDTO, '_id' | 'nome' | 'identificador' | 'responsaveis' | 'ganho' | 'perda'>

export type TOpportunitySimplifiedDTOWithProposalAndActivitiesAndFunnels = TOpportunitySimplifiedDTO & {
  proposta: { nome: TProposal['nome']; valor: TProposal['valor']; potenciaPico: TProposal['potenciaPico'] }
  statusAtividades?: ActivitiesByStatus
  funil: { id: string; idFunil: TFunnelReference['idFunil']; idEstagio: TFunnelReference['idEstagioFunil'] }
}

export type TOpportunityDTOWithClient = TOpportunityDTO & { cliente: TClientDTO }
export type TOpportunityDTOWithClientAndPartner = TOpportunityDTO & { cliente: TClientDTO; parceiro: TPartnerSimplifiedDTO }

export type TOpportunityDTOWithFunnelReferenceAndActivitiesByStatus = TOpportunityDTO & {
  funil: { id: string; idFunil: string; idEstagio: string }
  statusAtividades: ActivitiesByStatus
}
export type TOpportunityDTOWithFunnelReferenceAndActivities = TOpportunityDTO & {
  funil: { id: string; idFunil: string; idEstagio: string }
  atividades: TActivityDTO[]
}

export const SimplifiedOpportunityWithProposalProjection = {
  _id: 1,
  nome: 1,
  identificador: 1,
  responsaveis: 1,
  'ganho.data': 1,
  'perda.data': 1,
  'proposta.nome': 1,
  'proposta.valor': 1,
  'proposta.potenciaPico': 1,
}
