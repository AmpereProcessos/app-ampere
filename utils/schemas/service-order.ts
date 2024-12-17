import { z } from 'zod'
import { AuthorSchema } from './users'
import { TProject, TProjectDTO } from './projects'

export const ServiceOrderTagSchema = z.object({
  titulo: z.string({ required_error: 'Título da tag de compra não informado.', invalid_type_error: 'Tipo não válido para o título da tag.' }),
  cores: z.object({
    primaria: z.string({
      required_error: 'Código da cor da etiqueta não fornecido.',
      invalid_type_error: 'Tipo não válido para o código de cor da etiqueta.',
    }),
    secundaria: z.string({
      required_error: 'Código da cor secundária da etiqueta não fornecido.',
      invalid_type_error: 'Tipo não válido para o código de cor secundária da etiqueta.',
    }),
  }),
  dataInsercao: z.string({
    required_error: 'Data de inserção da tag não informada.',
    invalid_type_error: 'Tipo não válido para a data de inserção.',
  }),
})
export type TServiceOrderTag = z.infer<typeof ServiceOrderTagSchema>
export type TServiceOrderTagDTO = TServiceOrderTag & { _id: string }

export const ServiceOrderStatusEnum = z.enum([
  'PENDENTE',
  'AGUARDANDO PLANEJAMENTO',
  'AGUARDANDO LIBERAÇÃO',
  'AGUARDANDO AGENDAMENTO',
  'AGUARDANDO EXECUÇÃO',
  'EM EXECUÇÃO',
  'CONCLUÍDA PARCIAL',
  'CONCLUÍDA',
  'CANCELADA',
  'PENDÊNCIAS',
])
export type TServiceOrderStatus = z.infer<typeof ServiceOrderStatusEnum>

export const ServiceOrderPendencies = z.object({
  diagramas: z
    .string({
      required_error: 'Conclusão da pendência de diagramas não informada.',
      invalid_type_error: 'Tipo não válido para a conclusão da pendência de diagramas.',
    })
    .optional()
    .nullable(),
  desenhos: z
    .string({
      required_error: 'Conclusão da pendência de desenhos não informada.',
      invalid_type_error: 'Tipo não válido para a conclusão da pendência de desenhos.',
    })
    .optional()
    .nullable(),
  mapasDeMicro: z
    .string({
      required_error: 'Conclusão da pendência de mapa de micro não informada.',
      invalid_type_error: 'Tipo não válido para a conclusão da pendência de mapa de micro.',
    })
    .optional()
    .nullable(),
})

const ServiceOrderCategories = z.enum(['MONTAGEM', 'MANUTENÇÃO CORRETIVA', 'MANUTENÇÃO PREVENTIVA', 'PADRÃO', 'ESTRUTURA', 'OUTROS']) // etc

export const ServiceOrderSchema = z.object({
  categoria: ServiceOrderCategories,
  status: ServiceOrderStatusEnum.optional().nullable(),
  pendencias: ServiceOrderPendencies.optional().nullable(),
  favorecido: z.object({
    nome: z.string({ required_error: 'Nome do favorecido não informado.', invalid_type_error: 'Tipo não válido para o nome do favorecido.' }),
    contato: z.string({
      required_error: 'Contato do favorecido não informado.',
      invalid_type_error: 'Tipo não válido para o contato do favorecido.',
    }),
  }),
  projeto: z.object({
    id: z.string({ invalid_type_error: 'Tipo não válido para o ID do projeto.' }).optional().nullable(),
    identificador: z.union([z.string(), z.number()]).optional().nullable(),
    nome: z.string({ invalid_type_error: 'Tipo não válido para o nome do projeto.' }).optional().nullable(),
    tipo: z.string({ invalid_type_error: 'Tipo não válido para o tipo do projeto.' }).optional().nullable(),
  }),
  etiquetas: z
    .array(
      z.object({
        id: z.string({ required_error: 'ID da etiqueta inválido.', invalid_type_error: 'Tipo não válido para o ID da etiqueta.' }),
        titulo: z.string({ required_error: 'Titulo não válido para etiqueta.' }),
        cores: z.object({
          primaria: z.string({
            required_error: 'Código da cor da etiqueta não fornecido.',
            invalid_type_error: 'Tipo não válido para o código de cor da etiqueta.',
          }),
          secundaria: z.string({
            required_error: 'Código da cor secundária da etiqueta não fornecido.',
            invalid_type_error: 'Tipo não válido para o código de cor secundária da etiqueta.',
          }),
        }),
      })
    )
    .optional()
    .nullable(),
  descricao: z.string({ required_error: 'Descrição não informada.', invalid_type_error: 'Tipo não válido para a descrição.' }),
  localizacao: z.object({
    cep: z.string({ required_error: 'CEP não foi informado.' }),
    uf: z.string({ required_error: 'UF não foi informada.' }),
    cidade: z.string({ required_error: 'Cidade não foi informada.' }),
    bairro: z.string({ required_error: 'Bairro não foi informado.' }),
    endereco: z.string({ required_error: 'Endereço não foi informado.' }),
    numeroOuIdentificador: z.string({ required_error: 'Número ou identificador não foi informado.' }).optional().nullable(),
    latitude: z.string({ invalid_type_error: 'Tipo não válido para a latitude.' }).optional().nullable(),
    longitude: z.string({ invalid_type_error: 'Tipo não válido para a longitude.' }).optional().nullable(),
    complemento: z.string({ invalid_type_error: 'Tipo não válido para o complemento.' }).optional().nullable(),
  }),
  responsavel: z.object({
    nome: z.string({ invalid_type_error: 'Tipo não válido para o nome do responsável.' }),
    tipo: z.enum(['INTERNO', 'EXTERNO']),
  }),
  urgencia: z.enum(['NÃO DEFINIDO', 'POUCO URGENTE', 'URGENTE', 'EMERGÊNCIA'], {
    required_error: 'Tipo de urgência não informado.',
    invalid_type_error: 'Tipo não válido para o tipo de urgência.',
  }),
  anotacoes: z.string({ invalid_type_error: 'Tipo não válido para as anotações.' }).optional().nullable(),
  detalhes: z.object({
    amperagemPadrao: z.string({ invalid_type_error: 'Tipo não válido para a amperagem padrão.' }).optional().nullable(),
    configuracaoMonitoramento: z.boolean({ invalid_type_error: 'Tipo não válido para a configuração de monitoramento.' }).optional().nullable(),
    pontoAgua: z.string({ invalid_type_error: ' Tipo não válido para o ponto de água.' }),
    responsabilidadePadrao: z.enum(['NÃO SE APLICA', 'AMPERE', 'CLIENTE']).optional().nullable(),
    possuiTrafo: z.boolean({ required_error: 'Trafo não informado.' }).optional().nullable(),
    senhaWifi: z.string({ invalid_type_error: 'Tipo não válido para a senha Wi-Fi.' }).optional().nullable(),
    tipoEstrutura: z.string({ invalid_type_error: 'Tipo não válido para o tipo de estrutura.' }).optional().nullable(),
    tipoPadrao: z.string({ invalid_type_error: 'Tipo não válido para o tipo padrão.' }).optional().nullable(),
    tipoSaidaPadrao: z
      .enum(['AEREO', 'SUBTERRANEO', 'N/A'], {
        invalid_type_error: 'Tipo não válido para o tipo de saída padrão.',
      })
      .optional()
      .nullable(),
    tipoTelha: z.string({ invalid_type_error: 'Tipo não válido para o tipo de telha.' }).optional().nullable(),
    topologia: z.string({ invalid_type_error: 'Tipo não válido para a topologia.' }).optional().nullable(), // corrigir para duas opções
  }),
  autor: AuthorSchema,
  cobranca: z.object({
    pagador: z.string({ invalid_type_error: 'Tipo não válido para o pagador.' }).optional().nullable(),
    valor: z.number({ invalid_type_error: 'Tipo não válido para o valor.' }).optional().nullable(),
  }),
  pagamento: z.object({
    recebedor: z.string({ invalid_type_error: 'Tipo não válido para o recebedor.' }).optional().nullable(),
    valor: z.string({ invalid_type_error: 'Tipo não válido para o valor.' }).optional().nullable(),
  }),
  observacoes: z.array(
    z.object({
      topico: z.string({ required_error: 'Tópico da observação não informado.', invalid_type_error: 'Tipo não válido para o tópico da observação.' }),
      descricao: z.string({
        required_error: 'Descrição da observação não informada.',
        invalid_type_error: 'Tipo não válido para a descrição da observação.',
      }),
    })
  ),
  equipamentos: z.object({
    disponivel: z
      .array(z.object({ descricao: z.string(), qtde: z.number().optional().nullable() }))
      .optional()
      .nullable(),
    retirada: z
      .array(z.object({ descricao: z.string(), qtde: z.number().optional().nullable() }))
      .optional()
      .nullable(),
    inversor: z.object({
      modelo: z.string().optional().nullable(),
      potencia: z.union([z.number(), z.string()]).optional().nullable(),
      qtde: z.number().optional().nullable(),
    }),
    modulos: z.object({
      modelo: z.string().optional().nullable(),
      potencia: z.union([z.number(), z.string()]).optional().nullable(),
      qtde: z.number().optional().nullable(),
    }),
  }),
  agendamento: z
    .object({
      inicio: z.string({ invalid_type_error: 'Data inválida para o início do agendamento.' }).nullable().optional(),
      fim: z.string({ invalid_type_error: 'Data inválida para o fim do agendamento.' }).nullable().optional(),
    })
    .optional()
    .nullable(),
  periodo: z.object({
    inicio: z.string({ invalid_type_error: 'Tipo não válido para o início do período.' }).optional().nullable(),
    fim: z.string({ invalid_type_error: 'Tipo não válido para o fim do período.' }).optional().nullable(),
    historico: z
      .array(
        z.object({
          anotacoes: z.string(),
          entrada: z.string(),
          saida: z.string(),
        })
      )
      .optional()
      .nullable(),
  }),
  calendarioId: z.string({ invalid_type_error: 'Tipo não válido para o ID do calendário.' }).optional().nullable(),
  googleCalendarId: z.string({ invalid_type_error: 'Tipo não válido para o ID do calendário no Google.' }).optional().nullable(),
  googleCalendarEventId: z.string({ invalid_type_error: 'Tipo não válido para o ID do evento no Google.' }).optional().nullable(),
  dataEfetivacao: z.string({ invalid_type_error: 'Tipo não válido para a data de efetivação.' }).datetime().optional().nullable(),
  dataInsercao: z.string({ required_error: 'Data de inserção não informada.', invalid_type_error: 'Tipo não válido para a data de inserção.' }), // fix undefined
})

export type TServiceOrder = z.infer<typeof ServiceOrderSchema>
export type TServiceOrderDTO = TServiceOrder & { _id: string }

export type TServiceOrderSimplified = Pick<
  TServiceOrder,
  | 'status'
  | 'descricao'
  | 'favorecido'
  | 'projeto'
  | 'categoria'
  | 'urgencia'
  | 'localizacao'
  | 'etiquetas'
  | 'responsavel'
  | 'googleCalendarEventId'
  | 'agendamento'
  | 'autor'
  | 'dataEfetivacao'
  | 'dataInsercao'
> & {
  periodo: {
    fim: TServiceOrder['periodo']['fim']
    inicio: TServiceOrder['periodo']['inicio']
  }
}
export type TServiceOrderSimplifiedDTO = TServiceOrderSimplified & { _id: string }
export const ServiceOrderSimplifiedProjection = {
  _id: 1,
  status: 1,
  descricao: 1,
  favorecido: 1,
  projeto: 1,
  categoria: 1,
  urgencia: 1,
  localizacao: 1,
  responsavel: 1,
  googleCalendarEventId: 1,
  agendamento: 1,
  etiquetas: 1,
  'periodo.inicio': 1,
  'periodo.fim': 1,
  autor: 1,
  dataEfetivacao: 1,
  dataInsercao: 1,
}

const PersonalizedFieldFilters = z.enum(['dataInsercao', 'dataEfetivacao'], {
  required_error: 'Tipo não válido para o campo de filtro de período.',
  invalid_type_error: 'Tipo não válido para o campo de filtro de período.',
})
export const PersonalizedFiltersSchema = z.object({
  page: z.number({ required_error: 'Página não informada.', invalid_type_error: 'Tipo não válido para a página.' }),
  name: z.string({
    required_error: 'Filtro de nome da ordem de serviço não informado.',
    invalid_type_error: 'Tipo não válido para o filtro de nome da ordem de serviço.',
  }),
  state: z.array(z.string({ required_error: 'Estado de filtro não informada.', invalid_type_error: 'Tipo não válido para estado de filtro.' }), {
    required_error: 'Lista de estados de filtro não informada.',
    invalid_type_error: 'Tipo não válido para lista de estados de filtro.',
  }),
  city: z.array(z.string({ required_error: 'Cidade de filtro não informada.', invalid_type_error: 'Tipo não válido para cidade de filtro.' }), {
    required_error: 'Lista de cidades de filtro não informada.',
    invalid_type_error: 'Tipo não válido para lista de cidades de filtro.',
  }),
  category: z.array(
    z.string({ required_error: 'Categoria de filtro não informada.', invalid_type_error: 'Tipo não válido para categoria de filtro.' }),
    {
      required_error: 'Lista de categorias de filtro não informada.',
      invalid_type_error: 'Tipo não válido para lista de categorias de filtro.',
    }
  ),
  urgency: z.array(
    z.string({ required_error: 'Urgência de filtro não informada.', invalid_type_error: 'Tipo não válido para urgência de filtro.' }),
    {
      required_error: 'Lista de urgências de filtro não informada.',
      invalid_type_error: 'Tipo não válido para lista de urgências de filtro.',
    }
  ),
  period: z.object({
    after: z
      .string({ required_error: 'Filtro de depois de não informado.', invalid_type_error: 'Tipo não válido para o filtro de depois de.' })
      .optional()
      .nullable(),
    before: z
      .string({ required_error: 'Filtro de antes de não informado.', invalid_type_error: 'Tipo não válido para o filtro de antes de.' })
      .optional()
      .nullable(),
    field: PersonalizedFieldFilters.optional().nullable(),
  }),
  pending: z.boolean({
    required_error: 'Filtro de somente pendentes não informado.',
    invalid_type_error: 'Tipo não válido para filtro de somente pendentes.',
  }),
})
export type TPersonalizedServiceOrderFilter = z.infer<typeof PersonalizedFiltersSchema>

export const ServiceOrderProjectProjection = {
  nomeDoContrato: 1,
  cpf_cnpj: 1,
  tipoDeServico: 1,
  cep: 1,
  uf: 1,
  cidade: 1,
  bairro: 1,
  logradouro: 1,
  numeroResidencia: 1,
  produtos: 1,
  servicos: 1,
  'compra.kitInfo': 1,
  'material.materialFaltante': 1,
  'obra.entrada': 1,
  'obra.saida': 1,
  'obra.statusDaObra': 1,
  'obra.equipeResp': 1,
  'obra.observacoes': 1,
  'obra.pendencias': 1,
  idVisitaTecnica: 1,
}

export type TServiceOrderProject = Pick<
  TProjectDTO,
  | '_id'
  | 'nomeDoContrato'
  | 'cpf_cnpj'
  | 'tipoDeServico'
  | 'cep'
  | 'uf'
  | 'cidade'
  | 'bairro'
  | 'logradouro'
  | 'numeroResidencia'
  | 'produtos'
  | 'servicos'
  | 'idVisitaTecnica'
> & {
  compra: {
    kitInfo: TProject['compra']['kitInfo']
  }
  material: {
    materialFaltante: TProject['material']['materialFaltante']
  }
  obra: {
    entrada: TProject['obra']['entrada']
    saida: TProject['obra']['saida']
    statusDaObra: TProject['obra']['statusDaObra']
    equipeResp: TProject['obra']['equipeResp']
    observacoes: TProject['obra']['observacoes']
    pendencias: TProject['obra']['pendencias']
  }
}
export type TServiceOrderProjectDTO = TServiceOrderProject & { _id: string }

export type TServiceOrderWithProjectDTO = TServiceOrderDTO & { projetoDados: TServiceOrderProjectDTO | null }
