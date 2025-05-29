import { doublePrecision, index, pgEnum, TableConfig, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { pgTable } from './common'
import { partners } from './partners'
import { projects } from './projects'
import { users } from './users'
import { KnownKeysOnly, Relations, relations, sql, Table, TableRelationsKeysOnly } from 'drizzle-orm'
import { activities } from './activities'
import { fileReferences } from './file-references'
import { purchaseDeliveryStatusEnum, purchaseStatusEnum } from './enums'
import { allocators, assetMovementRecords, assetsMovementFormularies, physicalAssets } from './assets'

export const purchaseTags = pgTable('purchase_tags', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  parceiroId: varchar('parceiro_id', { length: 255 })
    .references(() => partners.id)
    .notNull(),
  titulo: varchar('titulo', { length: 50 }).notNull(),
  coresPrimaria: varchar('cores_primaria', { length: 15 }).notNull(),
  coresSecundaria: varchar('cores_secundaria', { length: 15 }).notNull(),
  autorId: varchar('autor_id', { length: 255 })
    .references(() => users.id)
    .notNull(),
  dataInsercao: timestamp('data_insercao').defaultNow().notNull(),
})
export const purchaseTagsRelations = relations(purchaseTags, ({ one, many }) => ({
  referenciasTags: many(purchaseTagReferences),
}))

export const purchases = pgTable(
  'purchases',
  {
    id: varchar('id', { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    parceiroId: varchar('parceiro_id', { length: 255 })
      .references(() => partners.id)
      .notNull(),
    projetoId: varchar('projeto_id', { length: 255 }).references(() => projects.id),

    status: purchaseStatusEnum('compra_status').notNull(),
    titulo: varchar('titulo', { length: 255 }).notNull(),
    anotacoes: text('anotacoes').notNull(),
    // composicao arr
    total: doublePrecision('total').notNull(),
    totalPrevisto: doublePrecision('total_previsto'),
    liberacaoData: timestamp('liberacao_data'),
    liberacaoAutorId: varchar('liberacao_autor_id', { length: 255 }).references(() => users.id),
    pagamentoDataLiberacao: timestamp('pagamento_data_liberacao'),
    pagamentoDataEfetivacao: timestamp('pagamento_data_efetivacao'),
    pedidoData: timestamp('pedido_data'),
    pedidoFornecedorNome: varchar('pedido_fornecedor_nome', { length: 255 }),
    pedidoFornecedorContato: varchar('pedido_fornecedor_contato', { length: 255 }),
    transporteTransportadoraNome: varchar('transporte_transportadora_nome', { length: 255 }),
    transporteTransportadoraContato: varchar('transporte_transportadora_contato', { length: 255 }),
    transporteLinkRastreio: text('transporte_link_rastreio'),
    // estruturar dinamica de múltiplos faturamentos
    // faturamentoData: timestamp('faturamento_data'),
    // faturamentoCodigoNotaFiscal: text('faturamento_codigo_nota_fiscal'),
    // allocator reference para os casos em que uma compra realizará alocação de ativos físicos
    alocadorReferenciaId: varchar('alocador_referencia_id', { length: 255 }).references(() => allocators.id),
    entregaStatus: purchaseDeliveryStatusEnum('compra_entrega_status').notNull(),
    entregaLocalizacaoCep: varchar('entrega_localizacao_cep', { length: 255 }),
    entregaLocalizacaoUf: varchar('entrega_localizacao_uf', { length: 255 }),
    entregaLocalizacaoCidade: varchar('entrega_localizacao_cidade', { length: 255 }),
    entregaLocalizacaoBairro: varchar('entrega_localizacao_bairro', { length: 255 }),
    entregaLocalizacaoLogradouro: varchar('entrega_localizacao_logradouro', { length: 255 }),
    entregaLocalizacaoNumero: varchar('entrega_localizacao_numero', { length: 255 }),
    entregaLocalizacaoComplemento: varchar('entrega_localizacao_complemento', { length: 255 }),
    entregaLocalizacaoLatitude: varchar('entrega_localizacao_latitude', { length: 255 }),
    entregaLocalizacaoLongitude: varchar('entrega_localizacao_longitude', { length: 255 }),
    entregaDataPrevisao: timestamp('entrega_data_previsao'),
    entregaDataEfetivacao: timestamp('entrega_data_efetivacao'),
    dataInsercao: timestamp('data_insercao').defaultNow().notNull(),
    dataEfetivacao: timestamp('data_efetivacao'),
    autorId: varchar('autor_id', { length: 255 })
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    compraTituloSearchIndex: index('compra_titulo_search_index').using('gin', sql`to_tsvector('portuguese', ${table.titulo})`),
  })
)
export const purchasesRelations = relations(purchases, ({ one, many }) => ({
  parceiro: one(partners, {
    fields: [purchases.parceiroId],
    references: [partners.id],
  }),
  projeto: one(projects, {
    fields: [purchases.projetoId],
    references: [projects.id],
  }),
  liberacaoAutor: one(users, {
    fields: [purchases.liberacaoAutorId],
    references: [users.id],
    relationName: 'autorLiberacaoCompra',
  }),
  autor: one(users, {
    fields: [purchases.autorId],
    references: [users.id],
    relationName: 'autor',
  }),
  alocadorReferencia: one(allocators, {
    fields: [purchases.alocadorReferenciaId],
    references: [allocators.id],
  }),
  composicao: many(purchaseCompositionItems),
  atualizacoes: many(purchaseUpdates),
  arquivos: many(fileReferences),
  referenciasTags: many(purchaseTagReferences),
  atividades: many(activities),
}))

export type TPurchase = typeof purchases.$inferSelect
export type TNewPurchase = typeof purchases.$inferInsert

export const purchaseTagReferences = pgTable('purchase_tag_reference', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  parceiroId: varchar('parceiro_id', { length: 255 })
    .references(() => partners.id)
    .notNull(),
  compraId: varchar('compra_id', { length: 255 })
    .references(() => purchases.id, { onDelete: 'cascade' })
    .notNull(),
  compraTagId: varchar('compra_tag_id', { length: 255 })
    .references(() => purchaseTags.id, { onDelete: 'cascade' })
    .notNull(),
})
export const purchaseTagReferenceRelations = relations(purchaseTagReferences, ({ one, many }) => ({
  tag: one(purchaseTags, {
    fields: [purchaseTagReferences.compraTagId],
    references: [purchaseTags.id],
  }),
  compra: one(purchases, {
    fields: [purchaseTagReferences.compraId],
    references: [purchases.id],
  }),
}))

export const purchaseCompositionItemCategoryEnum = pgEnum('compra_item_composicao_categoria', ['MÓDULO', 'INVERSOR', 'INSUMO', 'ESTRUTURA', 'PADRÃO', 'OUTROS'])
export const purchaseCompositionItems = pgTable('purchase_composition_items', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  compraId: varchar('compra_id', { length: 255 })
    .references(() => purchases.id, { onDelete: 'cascade' })
    .notNull(),
  parceiroId: varchar('parceiro_id', { length: 255 })
    .references(() => partners.id)
    .notNull(),
  ativoFisicoId: varchar('ativo_fisico_id', { length: 255 })
    .notNull()
    .references(() => physicalAssets.id),
  registroMovimentacaoAtivoId: varchar('registro_movimentacao_ativo_id', { length: 255 }),
  descricao: varchar('descricao', { length: 255 }).notNull(),
  unidade: varchar('unidade', { length: 25 }).notNull(),
  valor: doublePrecision('valor').notNull(),
  qtde: doublePrecision('qtde').notNull(),
})

export const purchaseCompositionItemsRelations = relations(purchaseCompositionItems, ({ one, many }) => ({
  parceiro: one(partners, {
    fields: [purchaseCompositionItems.parceiroId],
    references: [partners.id],
  }),
  ativoFisico: one(physicalAssets, {
    fields: [purchaseCompositionItems.ativoFisicoId],
    references: [physicalAssets.id],
  }),
  registroMovimentacaoAtivo: one(assetMovementRecords, {
    fields: [purchaseCompositionItems.registroMovimentacaoAtivoId],
    references: [assetMovementRecords.id],
  }),
  compra: one(purchases, {
    fields: [purchaseCompositionItems.compraId],
    references: [purchases.id],
  }),
}))

export const purchaseUpdates = pgTable('purchase_updates', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  compraId: varchar('compra_id', { length: 255 })
    .references(() => purchases.id, { onDelete: 'cascade' })
    .notNull(),
  parceiroId: varchar('parceiro_id', { length: 255 })
    .references(() => partners.id)
    .notNull(),
  conteudo: text('conteudo').notNull(),
  data: timestamp('data').defaultNow().notNull(),
  autorId: varchar('autor_id', { length: 255 })
    .references(() => users.id)
    .notNull(),
})
export const purchaseUpdatesRelations = relations(purchaseUpdates, ({ one, many }) => ({
  parceiro: one(partners, {
    fields: [purchaseUpdates.parceiroId],
    references: [partners.id],
  }),
  compra: one(purchases, {
    fields: [purchaseUpdates.compraId],
    references: [purchases.id],
  }),
  autor: one(users, {
    fields: [purchaseUpdates.autorId],
    references: [users.id],
  }),
}))
