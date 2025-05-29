import { doublePrecision, index, pgEnum, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { users } from "./users";
import { relations, sql } from "drizzle-orm";
import { projects } from "./projects";
import { allocationReferenceTypeEnum, physicalAssetNatureEnum, productCategoryEnum, timeDurationUnitEnum } from "./enums";
import { certificationReferences } from "./certifications";
import { fileReferences } from "./file-references";
import { serviceOrderReportAssetsUsage, serviceOrderReports, serviceOrders } from "./service-orders";
import { purchaseCompositionItems, purchases } from "./purchases";

/**
 * REFERÊNCIAS DE CATEGORIA-ATIVO
 */
export const assetsCategories = pgTable("assets_categories", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 }).references(() => partners.id),
	nome: varchar("nome", { length: 255 }).notNull(),
	descricao: varchar("descricao", { length: 255 }),
	coresPrimaria: varchar("cores_primaria", { length: 15 }).notNull(),
	coresSecundaria: varchar("cores_secundaria", { length: 15 }).notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const assetsCategoriesRelations = relations(assetsCategories, ({ one, many }) => ({
	categorias: many(assetCategoryReferences),
}));
export type TAssetCategory = typeof assetsCategories.$inferSelect;
export type TNewAssetCategory = typeof assetsCategories.$inferInsert;
/**
 * REFERÊNCIAS DE CATEGORIA-ATIVO
 */
export const assetCategoryReferences = pgTable("asset_category_reference", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	ativoFisicoId: varchar("ativo_fisico_id", { length: 255 })
		.references(() => physicalAssets.id, { onDelete: "cascade" })
		.notNull(),
	ativoCategoriaId: varchar("ativo_categoria_id", { length: 255 })
		.references(() => assetsCategories.id, { onDelete: "cascade" })
		.notNull(),
});
export const assetCategoryReferenceRelations = relations(assetCategoryReferences, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [assetCategoryReferences.parceiroId],
		references: [partners.id],
	}),
	ativoFisico: one(physicalAssets, {
		fields: [assetCategoryReferences.ativoFisicoId],
		references: [physicalAssets.id],
	}),
	ativoCategoria: one(assetsCategories, {
		fields: [assetCategoryReferences.ativoCategoriaId],
		references: [assetsCategories.id],
	}),
}));
export type TAssetCategoryReference = typeof assetCategoryReferences.$inferSelect;
export type TNewAssetCategoryReference = typeof assetCategoryReferences.$inferInsert;

/**
 * ATIVOS FISÍCOS
 */
export const physicalAssets = pgTable(
	"physical_assets",
	{
		id: varchar("id", { length: 255 })
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		parceiroId: varchar("parceiro_id", { length: 255 }).references(() => partners.id),
		nome: text("nome").notNull(),
		natureza: physicalAssetNatureEnum("natureza").notNull(),
		unidade: varchar("unidade", { length: 25 }).notNull(),
		descricao: text("descricao"),
		// Optional fields that only make sense for individual assets
		numeroSerie: varchar("numero_serie", { length: 255 }),
		// Metadata fields that are not required for all assets
		metadadosCategoriaProduto: productCategoryEnum("metadados_categoria_produto"),
		metadadosFabricante: text("metadados_fabricante"),
		metadadosModelo: text("metadados_modelo"),
		metadadosGarantiaMedida: timeDurationUnitEnum("metadados_garantia_medida"),
		metadadosGarantiaValor: doublePrecision("metadados_garantia_valor"),
		metadadosPotencia: doublePrecision("metadados_potencia"),
		autorId: varchar("autor_id", { length: 255 })
			.references(() => users.id)
			.notNull(),
		dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
	},
	(table) => ({
		nomeSearchIndex: index("ativo_fisico_nome_index").using("gin", sql`to_tsvector('portuguese', ${table.nome})`),
		numeroSerieIndex: index("ativo_fisico_numero_serie_index").on(table.numeroSerie),
		potenciaIndex: index("ativo_fisico_potencia_index").on(table.metadadosPotencia),
	}),
);
export const physicalAssetsRelations = relations(physicalAssets, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [physicalAssets.parceiroId],
		references: [partners.id],
	}),
	autor: one(users, {
		fields: [physicalAssets.autorId],
		references: [users.id],
	}),
	categorias: many(assetCategoryReferences),
	alocacoes: many(allocationReferences),
	certificacoes: many(certificationReferences),
	arquivos: many(fileReferences),
}));
export type TPhysicalAsset = typeof physicalAssets.$inferSelect;
export type TNewPhysicalAsset = typeof physicalAssets.$inferInsert;

export const allocators = pgTable("physical_assets_allocators", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	projetoId: varchar("projeto_id", { length: 255 }).references(() => projects.id, { onDelete: "cascade" }),
	nome: varchar("nome", { length: 255 }).notNull(),
	descricao: text("descricao"),
	localizacaoCep: varchar("localizacao_cep", { length: 255 }),
	localizacaoUf: varchar("localizacao_uf", { length: 255 }),
	localizacaoCidade: varchar("localizacao_cidade", { length: 255 }),
	localizacaoBairro: varchar("localizacao_bairro", { length: 255 }),
	localizacaoLogradouro: varchar("localizacao_logradouro", { length: 255 }),
	localizacaoNumero: varchar("localizacao_numero", { length: 255 }),
	localizacaoComplemento: varchar("localizacao_complemento", { length: 255 }),
	localizacaoLatitude: varchar("localizacao_latitude", { length: 255 }),
	localizacaoLongitude: varchar("localizacao_longitude", { length: 255 }),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const allocatorsRelations = relations(allocators, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [allocators.parceiroId],
		references: [partners.id],
	}),
	projeto: one(projects, {
		fields: [allocators.projetoId],
		references: [projects.id],
	}),
	alocacoes: many(allocationReferences),
	autor: one(users, {
		fields: [allocators.autorId],
		references: [users.id],
	}),
}));
export type TAllocator = typeof allocators.$inferSelect;
export type TNewAllocator = typeof allocators.$inferInsert;

/**
 * REFERÊNCIAS DE ALOCAÇÃO
 */
export const allocationReferences = pgTable("physical_asset_allocation_references", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	alocadorId: varchar("alocador_id", { length: 255 })
		.references(() => allocators.id, { onDelete: "cascade" })
		.notNull(),
	ativoFisicoId: varchar("ativo_fisico_id", { length: 255 })
		.references(() => physicalAssets.id, { onDelete: "cascade" })
		.notNull(),
	qtdePrevista: doublePrecision("qtde_prevista").default(0).notNull(),
	qtde: doublePrecision("qtde").notNull(), // this must reflect the amount allocated in real-time for that specific allocation
	precoUnitario: doublePrecision("preco_unitario").notNull(),
	qtdeMaxima: doublePrecision("qtde_maxima"),
	qtdeMinima: doublePrecision("qtde_minima"),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const allocationReferencesRelations = relations(allocationReferences, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [allocationReferences.parceiroId],
		references: [partners.id],
	}),
	alocador: one(allocators, {
		fields: [allocationReferences.alocadorId],
		references: [allocators.id],
	}),
	ativoFisico: one(physicalAssets, {
		fields: [allocationReferences.ativoFisicoId],
		references: [physicalAssets.id],
	}),
	movimentacoesSaida: many(assetMovementRecords, { relationName: "movimentacao_origem" }),
	movimentacoesEntrada: many(assetMovementRecords, { relationName: "movimentacao_destino" }),
	registrosUso: many(allocationReferenceUsageRecords),
	alocacoesTemporarias: many(allocationReferenceTemporaryAllocationRecords, { relationName: "referenciaAlocacaoTemporaria" }),
	emprestimosTemporarios: many(allocationReferenceTemporaryAllocationRecords, { relationName: "referenciaAlocacaoEmprestimo" }),
	usoAtivosRelatorio: many(serviceOrderReportAssetsUsage),
	autor: one(users, {
		fields: [allocationReferences.autorId],
		references: [users.id],
	}),
}));
export type TAllocationReference = typeof allocationReferences.$inferSelect;
export type TNewAllocationReference = typeof allocationReferences.$inferInsert;

export const allocationReferenceUsageRecords = pgTable("allocation_reference_usage_records", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	ativoFisicoId: varchar("ativo_fisico_id", { length: 255 })
		.references(() => physicalAssets.id)
		.notNull(),
	referenciaAlocacaoId: varchar("referencia_alocacao_id", { length: 255 })
		.references(() => allocationReferences.id, { onDelete: "cascade" })
		.notNull(),
	ordemServicoId: varchar("ordem_servico_id", { length: 255 }).references(() => serviceOrders.id, { onDelete: "cascade" }),
	ordemServicoRelatorioId: varchar("ordem_servico_relatorio_id", { length: 255 }).references(() => serviceOrderReports.id, { onDelete: "cascade" }),
	qtde: doublePrecision("qtde").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const allocationReferenceUsageRecordsRelations = relations(allocationReferenceUsageRecords, ({ one }) => ({
	parceiro: one(partners, {
		fields: [allocationReferenceUsageRecords.parceiroId],
		references: [partners.id],
	}),
	ativoFisico: one(physicalAssets, {
		fields: [allocationReferenceUsageRecords.ativoFisicoId],
		references: [physicalAssets.id],
	}),
	referenciaAlocacao: one(allocationReferences, {
		fields: [allocationReferenceUsageRecords.referenciaAlocacaoId],
		references: [allocationReferences.id],
	}),
	ordemServico: one(serviceOrders, {
		fields: [allocationReferenceUsageRecords.ordemServicoId],
		references: [serviceOrders.id],
	}),
	ordemServicoRelatorio: one(serviceOrderReports, {
		fields: [allocationReferenceUsageRecords.ordemServicoRelatorioId],
		references: [serviceOrderReports.id],
	}),
}));
export type TAllocationReferenceUsageRecord = typeof allocationReferenceUsageRecords.$inferSelect;
export type TNewAllocationReferenceUsageRecord = typeof allocationReferenceUsageRecords.$inferInsert;

export const allocationReferenceTemporaryAllocationRecords = pgTable("allocation_reference_temporary_allocation_records", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	ativoFisicoId: varchar("ativo_fisico_id", { length: 255 })
		.references(() => physicalAssets.id)
		.notNull(),
	referenciaAlocacaoOrigemId: varchar("referencia_alocacao_origem_id", { length: 255 })
		.references(() => allocationReferences.id, { onDelete: "cascade" })
		.notNull(),
	referenciaAlocacaoId: varchar("referencia_alocacao_id", { length: 255 })
		.references(() => allocationReferences.id, { onDelete: "cascade" })
		.notNull(),
	qtde: doublePrecision("qtde").notNull(),
	dataInicio: timestamp("data_inicio").notNull(),
	dataFim: timestamp("data_fim"),
	dataEfetivacao: timestamp("data_efetivacao"),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const allocationReferenceTemporaryAllocationRecordsRelations = relations(allocationReferenceTemporaryAllocationRecords, ({ one }) => ({
	parceiro: one(partners, {
		fields: [allocationReferenceTemporaryAllocationRecords.parceiroId],
		references: [partners.id],
	}),
	ativoFisico: one(physicalAssets, {
		fields: [allocationReferenceTemporaryAllocationRecords.ativoFisicoId],
		references: [physicalAssets.id],
	}),
	referenciaAlocacao: one(allocationReferences, {
		fields: [allocationReferenceTemporaryAllocationRecords.referenciaAlocacaoId],
		references: [allocationReferences.id],
		relationName: "referenciaAlocacaoTemporaria",
	}),
	referenciaAlocacaoOrigem: one(allocationReferences, {
		fields: [allocationReferenceTemporaryAllocationRecords.referenciaAlocacaoOrigemId],
		references: [allocationReferences.id],
		relationName: "referenciaAlocacaoEmprestimo",
	}),
}));
export type TAllocationReferenceTemporaryAllocationRecord = typeof allocationReferenceTemporaryAllocationRecords.$inferSelect;
export type TNewAllocationReferenceTemporaryAllocationRecord = typeof allocationReferenceTemporaryAllocationRecords.$inferInsert;

export const assetsMovementFormularies = pgTable("physical_assets_movement_formularies", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	titulo: text("titulo").notNull(),
	anotacoes: text("anotacoes"),
	ordemServicoId: varchar("ordem_servico_id", { length: 255 }).references(() => serviceOrders.id),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
	dataEfetivacao: timestamp("data_efetivacao"),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const assetsMovementFormulariesRelations = relations(assetsMovementFormularies, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [assetsMovementFormularies.parceiroId],
		references: [partners.id],
	}),
	ordemServico: one(serviceOrders, {
		fields: [assetsMovementFormularies.ordemServicoId],
		references: [serviceOrders.id],
	}),
	autor: one(users, {
		fields: [assetsMovementFormularies.autorId],
		references: [users.id],
	}),
	movimentacoesAtivo: many(assetMovementRecords),
}));
export type TAssetMovementFormulary = typeof assetsMovementFormularies.$inferSelect;
export type TNewAssetMovementFormulary = typeof assetsMovementFormularies.$inferInsert;

export const assetMovementRecords = pgTable("physical_asset_movement_record", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	formularioMovimentacaoAtivosId: varchar("formulario_movimentacao_ativos_id", { length: 255 }).references(() => assetsMovementFormularies.id, {
		onDelete: "cascade",
	}),
	// PURCHASE RELATED FIELDS START
	compraId: varchar("compra_id", { length: 255 }).references(() => purchases.id),
	compraItemComposicaoId: varchar("compra_item_composicao_id", { length: 255 }).references(() => purchaseCompositionItems.id),
	// PURCHASE RELATED FIELDS END
	ativoFisicoId: varchar("ativo_fisico_id", { length: 255 })
		.references(() => physicalAssets.id)
		.notNull(),
	qtde: doublePrecision("qtde").notNull(),
	alocadorOrigemId: varchar("alocador_origem_id", { length: 255 }).references(() => allocators.id),
	referenciaAlocacaoOrigemId: varchar("referencia_alocacao_origem_id", { length: 255 }).references(() => allocationReferences.id),
	alocadorDestinoId: varchar("alocador_destino_id", { length: 255 })
		.references(() => allocators.id)
		.notNull(),
	referenciaAlocacaoDestinoId: varchar("referencia_alocacao_destino_id", { length: 255 }).references(() => allocationReferences.id),
	dataMovimentacao: timestamp("data_movimentacao"),
});
export const assetMovementRecordRelations = relations(assetMovementRecords, ({ one }) => ({
	parceiro: one(partners, {
		fields: [assetMovementRecords.parceiroId],
		references: [partners.id],
	}),
	formularioMovimentacaoAtivos: one(assetsMovementFormularies, {
		fields: [assetMovementRecords.formularioMovimentacaoAtivosId],
		references: [assetsMovementFormularies.id],
	}),
	ativoFisico: one(physicalAssets, {
		fields: [assetMovementRecords.ativoFisicoId],
		references: [physicalAssets.id],
	}),
	compra: one(purchases, {
		fields: [assetMovementRecords.compraId],
		references: [purchases.id],
	}),
	compraItemComposicao: one(purchaseCompositionItems, {
		fields: [assetMovementRecords.compraItemComposicaoId],
		references: [purchaseCompositionItems.id],
	}),
	alocadorOrigem: one(allocators, {
		fields: [assetMovementRecords.alocadorOrigemId],
		references: [allocators.id],
	}),
	refAlocacaoOrigem: one(allocationReferences, {
		fields: [assetMovementRecords.referenciaAlocacaoOrigemId],
		references: [allocationReferences.id],
		relationName: "movimentacao_origem", // shorter unique name
	}),
	alocadorDestino: one(allocators, {
		fields: [assetMovementRecords.alocadorDestinoId],
		references: [allocators.id],
	}),
	refAlocacaoDestino: one(allocationReferences, {
		fields: [assetMovementRecords.referenciaAlocacaoDestinoId],
		references: [allocationReferences.id],
		relationName: "movimentacao_destino", // shorter unique name
	}),
}));
export type TAssetMovementRecord = typeof assetMovementRecords.$inferSelect;
export type TNewAssetMovementRecord = typeof assetMovementRecords.$inferInsert;
