import { z } from 'zod'
import { AuthorSchema } from './users'

const PurchaseStatus = z.enum(
  ['PENDENTE', 'EM ANÁLISE', 'AGUARDANDO APROVAÇÃO', 'AGUARDANDO PAGAMENTO', 'AGUARDANDO ENTREGA', 'PENDÊNCIAS', 'CONCLUÍDA'],
  {
    required_error: 'Status da compra não informado.',
    invalid_type_error: 'Tipo não válido para o status da compra.',
  }
)
const PurchaseDeliveryStatus = z.enum(['AGUARDANDO COMPRA', 'EM ROTA', 'ENTREGUE'], {
  required_error: 'Status da entrega não informado.',
  invalid_type_error: 'Tipo não válido para o status de entrega.',
})

const PurchaseProject = z.object({
  id: z.string({ invalid_type_error: 'Tipo não válido para o ID do projeto.' }).optional().nullable(),
  nome: z.string({ invalid_type_error: 'Tipo não válido para o nome do projeto.' }).optional().nullable(),
})

const PurchaseCompositionItemCategory = z.enum(['MÓDULO', 'INVERSOR', 'INSUMO', 'ESTRUTURA', 'PADRÃO', 'OUTROS'], {
  required_error: 'Categoria do item de composição da compra não informada.',
  invalid_type_error: 'Tipo não válido para a categoria do item de composição da compra.',
})
const PurchaseCompositionItemSchema = z.object({
  categoria: PurchaseCompositionItemCategory,
  descricao: z.string({
    required_error: 'Descrição do item de composição da compra não informada.',
    invalid_type_error: 'Tipo não válido para a descrição do item de composição da compra.',
  }),
  unidade: z.string({
    required_error: 'Unidade do item de composição da compra não informada.',
    invalid_type_error: 'Tipo não válido para a unidade do item de composição da compra.',
  }),
  valor: z.number({
    required_error: 'Valor do item de composição da compra não informado.',
    invalid_type_error: 'Tipo não válido para o valor do item de composição da compra.',
  }),
  qtde: z.number({
    required_error: 'Quantidade do item de composição da compra não informada.',
    invalid_type_error: 'Tipo não válido para a quantidade do item de composição da compra.',
  }),
})

const PurchaseUpdateItemSchema = z.object({
  data: z
    .string({ required_error: 'Data da atualização não informada.', invalid_type_error: 'Tipo inválido para a data de atualização.' })
    .datetime({ message: 'Formato inválido para a data da atualização.' }),
  descricao: z.string({
    required_error: 'Descrição da atualização não informada.',
    invalid_type_error: 'Tipo não válido para a descrição da atualização.',
  }),
  autor: AuthorSchema,
})

export const GeneralPurchaseControlSchema = z.object({
  status: PurchaseStatus,
  titulo: z.string({ required_error: 'Título do registro de compra não informado.', invalid_type_error: 'Tipo não válido para o título da compra.' }),
  anotacoes: z.string({ required_error: 'Anotações da compra não informadas.', invalid_type_error: 'Tipo não válido para anotações da compra.' }),
  projeto: PurchaseProject,
  etiquetas: z.array(
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
  ),
  atualizacoes: z.array(PurchaseUpdateItemSchema, {
    required_error: 'Lista de atualizações da compra não informado.',
    invalid_type_error: 'Tipo não válido para lista de atualizações da compra.',
  }),
  totalPrevisto: z
    .number({ required_error: 'Total da compra não informado.', invalid_type_error: 'Tipo não válido para o valor total da compra.' })
    .optional()
    .nullable(),
  liberacao: z.object({
    data: z.string({ invalid_type_error: 'Tipo não válido para a data de liberação.' }).optional().nullable(),
    autor: z.object({
      id: z
        .string({
          required_error: 'ID de referência do autor da liberação não fornecido.',
          invalid_type_error: 'Tipo não válido para o ID do autor da liberação.',
        })
        .optional()
        .nullable(),
      nome: z
        .string({
          required_error: 'Nome do autor da liberação não fornecido.',
          invalid_type_error: 'Tipo não válido para o nome do autor da liberação.',
        })
        .optional()
        .nullable(),
      avatar_url: z.string({ invalid_type_error: 'Avatar do autor da liberação não fornecido.' }).optional().nullable(),
    }),
  }),
  composicao: z.array(PurchaseCompositionItemSchema, {
    required_error: 'Lista de atualizações não informada.',
    invalid_type_error: 'Tipo não válido para a lista de atualizações.',
  }),
  dataPedido: z.string({ invalid_type_error: 'Tipo não válido para a data do pedido.' }).optional().nullable(),
  fornecedor: z.object({
    nome: z.string({ invalid_type_error: 'Tipo não válido para o nome do fornecedor.' }).optional().nullable(),
    contato: z.string({ invalid_type_error: 'Tipo não válido para o contato do fornecedor.' }).optional().nullable(),
  }),
  total: z
    .number({ required_error: 'Total da compra não informado.', invalid_type_error: 'Tipo não válido para o valor total da compra.' })
    .min(0, 'Valor total de compra inválido.'),
  transporte: z.object({
    transportadora: z.object({
      nome: z.string({ invalid_type_error: 'Tipo não válido para o nome da transportadora.' }).optional().nullable(),
      contato: z.string({ invalid_type_error: 'Tipo não válido para o contato da transportadora.' }).optional().nullable(),
    }),
    linkRastreio: z.string({ invalid_type_error: 'Tipo não válido para o link de rastreio.' }).optional().nullable(),
  }),
  faturamento: z.object({
    data: z.string({ invalid_type_error: 'Tipo não válido para data de faturamento.' }).optional().nullable(),
    codigoNotaFiscal: z.string({ invalid_type_error: 'Tipo não válido para o código da nota fiscal.' }).optional().nullable(),
  }),
  entrega: z.object({
    status: PurchaseDeliveryStatus,
    dataPrevisao: z.string({ invalid_type_error: 'Tipo não válido para data de previsão de entrega.' }).optional().nullable(),
    dataEfetivacao: z.string({ invalid_type_error: 'Tipo não válido para data de entrega.' }).optional().nullable(),
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
  }),
  autor: AuthorSchema,
  dataInsercao: z.string({ invalid_type_error: 'Tipo não válido para data de inserção do controle de compra.' }),
  dataEfetivacao: z.string({ invalid_type_error: 'Tipo não válido para data de conclusão do controle de compra.' }).optional().nullable(),
})
export type TPurchaseControl = z.infer<typeof GeneralPurchaseControlSchema>
export type TPurchaseControlDTO = TPurchaseControl & { _id: string }

export const PurchaseTagSchema = z.object({
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
export type TPurchaseControlTag = z.infer<typeof PurchaseTagSchema>
export type TPurchaseControlTagDTO = TPurchaseControlTag & { _id: string }

export type TPurchaseControlSimplified = Pick<
  TPurchaseControl,
  'status' | 'etiquetas' | 'titulo' | 'projeto' | 'liberacao' | 'dataPedido' | 'fornecedor' | 'autor' | 'dataInsercao' | 'dataEfetivacao'
> & {
  faturamento: TPurchaseControl['faturamento']
  entrega: {
    status: TPurchaseControl['entrega']['status']
    dataPrevisao: TPurchaseControl['entrega']['dataPrevisao']
    dataEfetivacao: TPurchaseControl['entrega']['dataEfetivacao']
  }
  transporte: TPurchaseControl['transporte']
  composicao: {
    descricao: TPurchaseControl['composicao'][number]['descricao']
    qtde: TPurchaseControl['composicao'][number]['qtde']
  }[]
}
export type TPurchaseControlSimplifiedDTO = TPurchaseControlSimplified & { _id: string }
export const PurchaseControlSimplifiedProjection = {
  status: 1,
  etiquetas: 1,
  titulo: 1,
  projeto: 1,
  liberacao: 1,
  dataPedido: 1,
  fornecedor: 1,
  faturamento: 1,
  'entrega.status': 1,
  'entrega.dataPrevisao': 1,
  'entrega.dataEfetivacao': 1,
  transporte: 1,
  'composicao.descricao': 1,
  'composicao.qtde': 1,
  autor: 1,
  dataInsercao: 1,
  dataEfetivacao: 1,
}

export type TPurchaseControlKanbanSimplified = Pick<
  TPurchaseControl,
  'status' | 'titulo' | 'etiquetas' | 'autor' | 'dataInsercao' | 'dataEfetivacao'
> & {
  liberacao: {
    data: TPurchaseControl['liberacao']['data']
  }
  fornecedor: {
    nome: TPurchaseControl['fornecedor']['nome']
  }
  transporte: {
    transportadora: { nome: TPurchaseControl['transporte']['transportadora']['nome'] }
  }
  entrega: {
    status: TPurchaseControl['entrega']['status']
    dataPrevisao: TPurchaseControl['entrega']['dataPrevisao']
    dataEfetivacao: TPurchaseControl['entrega']['dataEfetivacao']
  }
}
export type TPurchaseControlKanbanSimplifiedDTO = TPurchaseControlKanbanSimplified & { _id: string }
export const PurchaseControlKanbanSimplifiedProjection = {
  status: 1,
  titulo: 1,
  etiquetas: 1,
  'liberacao.data': 1,
  'fornecedor.nome': 1,
  'transporte.transportadora.nome': 1,
  'entrega.status': 1,
  'entrega.dataPrevisao': 1,
  'entrega.dataEfetivacao': 1,
  autor: 1,
  dataInsercao: 1,
  dataEfetivacao: 1,
}

export const PurchaseControlsQueryFiltersSchema = z.object({
  title: z.string({
    required_error: 'Filtro de pesquisa por título não informado.',
    invalid_type_error: 'Tipo não válido para o filtro por pesquisa.',
  }),
  supplier: z.string({
    required_error: 'Filtro de pesquisa por fornecedor não informado.',
    invalid_type_error: 'Tipo não válido para o filtro por pesquisa.',
  }),
  carrier: z.string({
    required_error: 'Filtro de pesquisa por transportadora não informado.',
    invalid_type_error: 'Tipo não válido para o filtro por pesquisa.',
  }),
  period: z.object(
    {
      after: z
        .string({
          required_error: 'Parâmetros de período não fornecidos ou inválidos.',
          invalid_type_error: 'Parâmetros de período não fornecidos ou inválidos.',
        })
        .optional()
        .nullable(),
      before: z
        .string({
          required_error: 'Parâmetros de período não fornecidos ou inválidos.',
          invalid_type_error: 'Parâmetros de período não fornecidos ou inválidos.',
        })
        .optional()
        .nullable(),
      type: z
        .enum([
          'dataInsercao',
          'liberacao.data',
          'dataPedido',
          'faturamento.data',
          'entrega.dataPrevisao',
          'entrega.dataEfetivacao',
          'dataEfetivacao',
        ])
        .optional()
        .nullable(),
    },
    { required_error: 'Tipo da busca por período não informado.', invalid_type_error: 'Tipo não válido para o tipo da busca por período.' }
  ),
  tags: z.array(z.string({ invalid_type_error: 'Tipo não válido para a referência de etiqueta da compra.' }), {
    required_error: 'Lista de etiquetas para filtro não informada.',
    invalid_type_error: 'Tipo não válido para a lista de etiquetas para filtro.',
  }),
  pendingOrder: z.boolean({
    required_error: 'Flag de filtro para apenas pendências de pedido não informado.',
    invalid_type_error: 'Tipo não válido para a flag de filtro de apenas pendências de pedido.',
  }),
  pendingBilling: z.boolean({
    required_error: 'Flag de filtro para apenas pendências de faturamento não informado.',
    invalid_type_error: 'Tipo não válido para a flag de filtro de apenas pendências de faturamento.',
  }),
  pendingDelivery: z.boolean({
    required_error: 'Flag de filtro para apenas pendências de entrega não informado.',
    invalid_type_error: 'Tipo não válido para a flag de filtro de apenas pendências de entrega.',
  }),
})

export type TPurchaseControlsQueryFilters = z.infer<typeof PurchaseControlsQueryFiltersSchema>
