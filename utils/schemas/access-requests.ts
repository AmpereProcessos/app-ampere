import { z } from 'zod'

const GeneralAccessRequestSchema = z.object({
  identificador: z.string(),
  potenciaSolicitada: z.number(),
  potenciaEfetiva: z.number(),
  idSolicitacaoContrato: z.string(),
  proposta: z.object({
    id: z.string(),
    nome: z.string(),
  }),
  projeto: z.object({
    id: z.string().optional().nullable(),
    nome: z.string(),
    identificador: z.string().optional().nullable(),
    localizacao: z.string(),
  }),
  requerente: z.object({
    idCRM: z.string().optional().nullable(),
    nomeCRM: z.string().optional().nullable(),
    apelido: z.string(),
    avatar_url: z.string().optional().nullable(),
    contato: z.string().optional().nullable(), // telefone
  }),
  documentacoes: z.object({
    formaAssinatura: z.enum(['FISICA', 'DIGITAL']),
    dataLiberacao: z.string().datetime().optional().nullable(),
    dataAssinatura: z.string().datetime().optional().nullable(),
  }),
  resposta: z.object({
    texto: z.string(),
    data: z.string().datetime().optional().nullable(),
  }),
  dataInsercao: z.string().datetime(),
})
