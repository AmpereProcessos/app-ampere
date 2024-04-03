import { z } from 'zod'

const GeneralServiceOrderSchema = z.object({
  _id: z.string({}).optional(),
  categoria: z.enum(['MONTAGEM', 'MANUTANÇÃO CORRETIVA']), // etc
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
    avatar_url: z.string(),
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
