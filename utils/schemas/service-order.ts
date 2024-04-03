import { z } from 'zod'

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

export type TServiceOrder = z.infer<typeof GeneralServiceOrderSchema>
