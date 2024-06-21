import { z } from 'zod'
import { AuthorSchema } from './users'

const GeneralServiceOrderSchema = z.object({
  _id: z.string({}).optional(),
  categoria: z.enum(['MONTAGEM', 'MANUTENÇÃO CORRETIVA', 'MANUTENÇÃO PREVENTIVA', 'PADRÃO', 'ESTRUTURA', 'OUTROS']), // etc
  favorecido: z.object({
    nome: z.string(),
    contato: z.string(),
  }),
  projeto: z.object({
    id: z.string(),
    nome: z.string(),
    identificador: z.number(),
    tipo: z.string(),
  }),
  descricao: z.string(),
  localizacao: z.object({
    cep: z.string(),
    uf: z.string(),
    cidade: z.string(),
    bairro: z.string(),
    endereco: z.string(),
    numeroOuIdentificador: z.string(),
  }),
  responsavel: z.object({
    nome: z.string(),
    tipo: z.enum(['INTERNO', 'EXTERNO']),
  }),
  urgencia: z.enum(['POUCO URGENTE', 'URGENTE', 'EMERGÊNCIA']),
  periodo: z.object({
    inicio: z.string().nullable(),
    fim: z.string().nullable(),
  }),
  pagamento: z.object({
    recebedor: z.string().nullable(),
    valor: z.number().nullable(),
  }),
  cobranca: z.object({
    pagador: z.string().nullable(),
    valor: z.number().nullable(),
  }),
  autor: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
  equipamentos: z.object({
    modulos: z.object({
      modelo: z.string().nullable(),
      qtde: z.number().nullable(),
      potencia: z.number().nullable(),
    }),
    inversor: z.object({
      modelo: z.string().nullable(),
      qtde: z.number().nullable(),
      potencia: z.number().nullable(),
    }),
    disponivel: z.array(
      z.object({
        qtde: z.number().nullable(),
        descricao: z.string().nullable(),
      })
    ),
    retirada: z.array(
      z.object({
        qtde: z.number().nullable(),
        descricao: z.string().nullable(),
      })
    ),
  }),
  detalhes: z.object({
    pontoAgua: z.string(),
    senhaWifi: z.string(),
    configuracaoMonitoramento: z.boolean(),
    possuiTrafo: z.boolean(),
    tipoEstrutura: z.string(),
    tipoTelha: z.string().optional(),
    tipoPadrao: z.string().optional(),
    tipoSaidaPadrao: z.string().optional(),
    amperagemPadrao: z.string().optional(),
    responsabilidadePadrao: z.string().optional(),
    topologia: z.string(),
  }),
  anotacoes: z.string(),
  observacoes: z.string(),
  dataEfetivacao: z.string().optional(),
  dataInsercao: z.string(),
})

const InsertServiceOrderSchema = z.object({
  _id: z.string().optional(),
  categoria: z.enum(['MONTAGEM', 'MANUTANÇÃO CORRETIVA']).optional(),
  favorecido: z.object({
    nome: z.string({ required_error: 'Nome do favorecido não foi informado.' }),
    contato: z.string({ required_error: 'Contato do favorecido não foi informado.' }),
  }),
  projeto: z.object({
    id: z.string({ required_error: 'ID do projeto não foi informado.' }),
    nome: z.string({ required_error: 'Nome do projeto não foi informado.' }),
    identificador: z.number({ required_error: 'Identificador do projeto não foi informado.' }),
    tipo: z.string({ required_error: 'Tipo do projeto não foi informado.' }),
  }),
  descricao: z.string({ required_error: 'Descrição não foi informada.' }),
  localizacao: z.object({
    cep: z.string({ required_error: 'CEP não foi informado.' }),
    uf: z.string({ required_error: 'UF não foi informada.' }),
    cidade: z.string({ required_error: 'Cidade não foi informada.' }),
    bairro: z.string({ required_error: 'Bairro não foi informado.' }),
    endereco: z.string({ required_error: 'Endereço não foi informado.' }),
    numeroOuIdentificador: z.string({ required_error: 'Número ou identificador não foi informado.' }),
  }),
  responsavel: z.object({
    nome: z.string({ required_error: 'Nome do responsável não foi informado.' }),
    tipo: z.enum(['INTERNO', 'EXTERNO']).optional(),
  }),
  urgencia: z.enum(['POUCO URGENTE', 'URGENTE', 'EMERGÊNCIA']).optional(),
  periodo: z.object({
    inicio: z.string().nullable(),
    fim: z.string().nullable(),
  }),
  pagamento: z.object({
    recebedor: z.string().nullable(),
    valor: z.number().nullable(),
  }),
  cobranca: z.object({
    pagador: z.string().nullable(),
    valor: z.number().nullable(),
  }),
  autor: z.object({
    id: z.string({ required_error: 'ID do autor não foi informado.' }),
    nome: z.string({ required_error: 'Nome do autor não foi informado.' }),
    avatar_url: z.string({ required_error: 'Avatar do autor não foi informado.' }).optional().nullable(),
  }),
  equipamentos: z.object({
    modulos: z.object({
      modelo: z.string({ invalid_type_error: 'Tipo não válido para modelo de módulos.' }).nullable(),
      qtde: z.number({ invalid_type_error: 'Tipo não válido para quantidade de módulos.' }).nullable(),
      potencia: z.number({ invalid_type_error: 'Tipo não válido para potência de módulos.' }).nullable(),
    }),
    inversor: z.object({
      modelo: z.string({ invalid_type_error: 'Tipo não válido para modelo de inversor.' }).nullable(),
      qtde: z.number({ invalid_type_error: 'Tipo não válido para quantidade de inversor.' }).nullable(),
      potencia: z.number({ invalid_type_error: 'Tipo não válido para potência de inversor.' }).nullable(),
    }),
    disponivel: z.array(
      z.object({
        qtde: z.number({ invalid_type_error: 'Tipo não válido para quantidade de item disponível.' }).nullable(),
        descricao: z.string({ invalid_type_error: 'Tipo não válido para descrição de item disponível.' }).nullable(),
      })
    ),
    retirada: z.array(
      z.object({
        qtde: z.number({ invalid_type_error: 'Tipo não válido para quantidade de item de retirada.' }).nullable(),
        descricao: z.string({ invalid_type_error: 'Tipo não válido para descrição de item de retirada.' }).nullable(),
      })
    ),
  }),
  detalhes: z.object({
    pontoAgua: z.string({ required_error: 'Ponto de água não foi informado.' }),
    senhaWifi: z.string({ required_error: 'Senha do Wi-Fi não foi informada.' }),
    configuracaoMonitoramento: z.boolean({ required_error: 'Configuração de monitoramento não foi informada.' }),
    possuiTrafo: z.boolean({ required_error: 'Informação sobre transformador não foi informada.' }),
    tipoEstrutura: z.string({ required_error: 'Tipo de estrutura não foi informado.' }),
    tipoTelha: z.string({ invalid_type_error: 'Tipo não válido para tipo de telha.' }).optional(),
    tipoPadrao: z.string({ invalid_type_error: 'Tipo não válido para tipo de padrão.' }).optional(),
    tipoSaidaPadrao: z.string({ invalid_type_error: 'Tipo não válido para tipo de saída padrão.' }).optional(),
    amperagemPadrao: z.string({ invalid_type_error: 'Tipo não válido para amperagem do padrão.' }).optional(),
    responsabilidadePadrao: z.string({ invalid_type_error: 'Tipo não válido para responsabilidade do padrão.' }).optional(),
    topologia: z.string({ required_error: 'Topologia não foi informada.' }),
  }),
  anotacoes: z.string({ required_error: 'Anotações não foram informadas.' }),
  observacoes: z.string({ required_error: 'Observações não foram informadas.' }),
  dataEfetivacao: z.string({ invalid_type_error: 'Tipo não válido para data de efetivação.' }).optional(),
  dataInsercao: z.string({ required_error: 'Data de inserção não foi informada.' }),
})

const ServiceOrderCategories = z.enum(['MONTAGEM', 'MANUTENÇÃO CORRETIVA', 'MANUTENÇÃO PREVENTIVA', 'PADRÃO', 'ESTRUTURA', 'OUTROS']) // etc

const Model = z.object({
  anotacoes: z.string().optional().nullable(),
  autor: AuthorSchema,
  categoria: ServiceOrderCategories,
  cobranca: z.object({
    pagador: z.string().optional().nullable(),
    valor: z.number().optional().nullable(),
  }),
  dataEfetivacao: z.string().datetime().optional().nullable(),
  dataInsercao: z.string(), // fix undefined
  descricao: z.string(),
  detalhes: z.object({
    amperagemPadrao: z.string().optional().nullable(),
    configuracaoMonitoramento: z.boolean().optional().nullable(),
    pontoAgua: z.string(),
    responsabilidadePadrao: z.enum(['NÃO SE APLICA', 'AMPERE', 'CLIENTE']).optional().nullable(),
    possuiTrafo: z.boolean(),
    senhaWifi: z.string().optional().nullable(),
    tipoEstrutura: z.string().optional().nullable(),
    tipoPadrao: z.string().optional().nullable(), // Agrupar, analisar opções e corrigir
    tipoSaidaPadrao: z.enum(['AEREO', 'SUBTERRANEO', 'N/A']).optional().nullable(),
    tipoTelha: z.string().optional().nullable(),
    topologia: z.string().optional().nullable(), // corrigir para duas opções
  }),
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
  favorecido: z.object({
    nome: z.string(),
    contato: z.string(),
  }),
  localizacao: z.object({
    cep: z.string({ required_error: 'CEP não foi informado.' }),
    uf: z.string({ required_error: 'UF não foi informada.' }),
    cidade: z.string({ required_error: 'Cidade não foi informada.' }),
    bairro: z.string({ required_error: 'Bairro não foi informado.' }),
    endereco: z.string({ required_error: 'Endereço não foi informado.' }),
    numeroOuIdentificador: z.string({ required_error: 'Número ou identificador não foi informado.' }).optional().nullable(),
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
  pagamento: z.object({
    recebedor: z.string().optional().nullable(),
    valor: z.string().optional().nullable(),
  }),
  periodo: z.object({
    inicio: z.string().optional().nullable(),
    fim: z.string().optional().nullable(),
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
  projeto: z.object({
    id: z.string().optional().nullable(),
    identificador: z.number().optional().nullable(),
    nome: z.string().optional().nullable(),
    tipo: z.string().optional().nullable(),
  }),
  responsavel: z.object({
    nome: z.string().optional(),
    tipo: z.enum(['INTERNO', 'EXTERNO']),
  }),
  urgencia: z.enum(['NÃO DEFINIDO', 'POUCO URGENTE', 'URGENTE', 'EMERGÊNCIA']),
})

export type TServiceOrder = z.infer<typeof Model>
export type TServiceOrderDTO = TServiceOrder & { _id: string }

export type TServiceOrderSimplified = Pick<
  TServiceOrder,
  'favorecido' | 'projeto' | 'categoria' | 'urgencia' | 'localizacao' | 'responsavel' | 'observacoes' | 'autor' | 'dataEfetivacao' | 'dataInsercao'
>
export type TServiceOrderSimplifiedDTO = TServiceOrderSimplified & { _id: string }
export const ServiceOrderSimplifiedProjection = {
  favorecido: 1,
  projeto: 1,
  categoria: 1,
  urgencia: 1,
  'localizacao.uf': 1,
  'localizacao.cidade': 1,
  'responsavel.nome': 1,
  observacoes: 1,
  autor: 1,
  dataEfetivacao: 1,
  dataInsercao: 1,
}

const PersonalizedFieldFilters = z.enum(['dataInsercao', 'dataEfetivacao'], {
  required_error: 'Tipo não válido para o campo de filtro de período.',
  invalid_type_error: 'Tipo não válido para o campo de filtro de período.',
})
export const PersonalizedFiltersSchema = z.object({
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
