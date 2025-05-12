import { boolean, doublePrecision, index, integer, jsonb, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { projects } from "./projects";
import { clients } from "./clients";
import { salesProposalPricingItems, salesProposals } from "./sales-proposals";
import { users } from "./users";
import { relations, sql } from "drizzle-orm";
import { physicalAssets } from "./assets";
import { technicalAnalysisResultAvaliationsLabelEnum } from "./enums";
import { fileReferences } from "./file-references";
import { sales } from "./sales";
import type { TTechnicalAnalysisConditionMetadata, TTechnicalAnalysisMetadata } from "@/utils/schemas/igreen/technical-analysis";

export const technicalAnalysis = pgTable(
	"technical_analysis",
	{
		id: varchar("id", { length: 255 })
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		parceiroId: varchar("parceiro_id", { length: 255 })
			.references(() => partners.id)
			.notNull(),
		clienteId: varchar("cliente_id", { length: 255 })
			.references(() => clients.id)
			.notNull(),
		propostaVendaId: varchar("proposta_venda_id", { length: 255 }).references(() => salesProposals.id),
		vendaId: varchar("venda_id", { length: 255 }).references(() => sales.id),
		projetoId: varchar("projeto_id", { length: 255 }).references(() => projects.id),
		indexador: integer("indexador").notNull(),
		titulo: varchar("titulo", { length: 255 }).notNull(),
		anotacoes: text("anotacoes"),
		status: varchar("status", { length: 255 }).notNull(), // [TODO] crate a list of possible values
		localizacaoCep: varchar("localizacao_cep", { length: 255 }),
		localizacaoUf: varchar("localizacao_uf", { length: 255 }),
		localizacaoCidade: varchar("localizacao_cidade", { length: 255 }),
		localizacaoBairro: varchar("localizacao_bairro", { length: 255 }),
		localizacaoLogradouro: varchar("localizacao_logradouro", { length: 255 }),
		localizacaoNumero: varchar("localizacao_numero", { length: 255 }),
		localizacaoComplemento: varchar("localizacao_complemento", { length: 255 }),
		localizacaoLatitude: varchar("localizacao_latitude", { length: 255 }),
		localizacaoLongitude: varchar("localizacao_longitude", { length: 255 }),
		dataPrevisaoEfetivacao: timestamp("data_previsao_efetivacao"),
		dataEfetivacao: timestamp("data_efetivacao"),
		dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
		metadados: jsonb("metadados").$type<TTechnicalAnalysisMetadata>(),
		autorId: varchar("autor_id", { length: 100 })
			.references(() => users.id)
			.notNull(),
	},
	(table) => ({
		analiseTituloSearchIndex: index("analise_tecnica_titulo_search_index").using("gin", sql`to_tsvector('portuguese', ${table.titulo})`),
	}),
);
export type TTechnicalAnalysis = typeof technicalAnalysis.$inferSelect;
export type TNewTechnicalAnalysis = typeof technicalAnalysis.$inferInsert;
export const technicalAnalysisRelations = relations(technicalAnalysis, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [technicalAnalysis.parceiroId],
		references: [partners.id],
	}),
	cliente: one(clients, {
		fields: [technicalAnalysis.clienteId],
		references: [clients.id],
	}),
	propostaVenda: one(salesProposals, {
		fields: [technicalAnalysis.propostaVendaId],
		references: [salesProposals.id],
	}),
	venda: one(sales, {
		fields: [technicalAnalysis.vendaId],
		references: [sales.id],
	}),
	projeto: one(projects, {
		fields: [technicalAnalysis.projetoId],
		references: [projects.id],
	}),
	autor: one(users, {
		fields: [technicalAnalysis.autorId],
		references: [users.id],
	}),
	arquivos: many(fileReferences),
	referenciasExternas: many(technicalAnalysisExternalReferences),
	// atualizacoes: many(technicalAnalysisUpdates),
	analistas: many(technicalAnalysisAnalysts),
	condicoes: many(technicalAnalysisConditions),
	medidas: many(technicalAnalysisMeasurements),
	locais: many(technicalAnalysisLocations),
	resultadosCustos: many(technicalAnalysisResultCosts),
	resultadosRecursos: many(technicalAnalysisResultResources),
	resultadosConclusao: many(technicalAnalysisResultConclusions),
	resultadosAvaliacoes: many(technicalAnalysisResultAvaliations),
}));

export const technicalAnalysisExternalReferences = pgTable("technical_analysis_external_references", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	analiseTecnicaId: varchar("analise_tecnica_id", { length: 255 })
		.references(() => technicalAnalysis.id, { onDelete: "cascade" })
		.notNull(),
	titulo: varchar("titulo", { length: 255 }).notNull(),
	url: text("url").notNull(),
	autorId: varchar("autor_id", { length: 100 })
		.references(() => users.id)
		.notNull(),
});
export const technicalAnalysisExternalReferencesRelations = relations(technicalAnalysisExternalReferences, ({ one }) => ({
	parceiro: one(partners, {
		fields: [technicalAnalysisExternalReferences.parceiroId],
		references: [partners.id],
	}),
	analiseTecnica: one(technicalAnalysis, {
		fields: [technicalAnalysisExternalReferences.analiseTecnicaId],
		references: [technicalAnalysis.id],
	}),
	autor: one(users, {
		fields: [technicalAnalysisExternalReferences.autorId],
		references: [users.id],
	}),
}));
export type TTechnicalAnalysisExternalReference = typeof technicalAnalysisExternalReferences.$inferSelect;
export type TNewTechnicalAnalysisExternalReference = typeof technicalAnalysisExternalReferences.$inferInsert;

export const technicalAnalysisAnalysts = pgTable("technical_analysis_analysts", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	analiseTecnicaId: varchar("analise_tecnica_id", { length: 255 })
		.references(() => technicalAnalysis.id, { onDelete: "cascade" })
		.notNull(),
	usuarioId: varchar("usuario_id", { length: 255 })
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
});
export const technicalAnalysisAnalystsRelations = relations(technicalAnalysisAnalysts, ({ one }) => ({
	parceiro: one(partners, {
		fields: [technicalAnalysisAnalysts.parceiroId],
		references: [partners.id],
	}),
	analiseTecnica: one(technicalAnalysis, {
		fields: [technicalAnalysisAnalysts.analiseTecnicaId],
		references: [technicalAnalysis.id],
	}),
	usuario: one(users, {
		fields: [technicalAnalysisAnalysts.usuarioId],
		references: [users.id],
	}),
}));
export type TTechnicalAnalysisAnalyst = typeof technicalAnalysisAnalysts.$inferSelect;
export type TNewTechnicalAnalysisAnalyst = typeof technicalAnalysisAnalysts.$inferInsert;

export const technicalAnalysisConditions = pgTable("technical_analysis_conditions", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	analiseTecnicaId: varchar("analise_tecnica_id", { length: 255 })
		.references(() => technicalAnalysis.id, { onDelete: "cascade" })
		.notNull(),
	titulo: varchar("titulo", { length: 255 }).notNull(),
	observacoes: text("observacoes"),
	metadata: jsonb("metadata").$type<TTechnicalAnalysisConditionMetadata>().notNull(),
});
export const technicalAnalysisConditionsRelations = relations(technicalAnalysisConditions, ({ one }) => ({
	parceiro: one(partners, {
		fields: [technicalAnalysisConditions.parceiroId],
		references: [partners.id],
	}),
	analiseTecnica: one(technicalAnalysis, {
		fields: [technicalAnalysisConditions.analiseTecnicaId],
		references: [technicalAnalysis.id],
	}),
}));
export type TTechnicalAnalysisCondition = typeof technicalAnalysisConditions.$inferSelect;
export type TNewTechnicalAnalysisCondition = typeof technicalAnalysisConditions.$inferInsert;

export const technicalAnalysisMeasurements = pgTable("technical_analysis_measurements", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	analiseTecnicaId: varchar("analise_tecnica_id", { length: 255 })
		.references(() => technicalAnalysis.id, { onDelete: "cascade" })
		.notNull(),
	tipo: varchar("tipo", { length: 255 }).notNull(),
	titulo: varchar("titulo", { length: 255 }).notNull(),
	identificador: varchar("identificador", { length: 255 }).notNull(),
	valor: text("valor").notNull(),
	unidade: varchar("unidade", { length: 255 }).notNull(),
	observacoes: text("observacoes"),
});
export const technicalAnalysisMeasurementsRelations = relations(technicalAnalysisMeasurements, ({ one }) => ({
	parceiro: one(partners, {
		fields: [technicalAnalysisMeasurements.parceiroId],
		references: [partners.id],
	}),
	analiseTecnica: one(technicalAnalysis, {
		fields: [technicalAnalysisMeasurements.analiseTecnicaId],
		references: [technicalAnalysis.id],
	}),
}));
export type TTechnicalAnalysisMeasurement = typeof technicalAnalysisMeasurements.$inferSelect;
export type TNewTechnicalAnalysisMeasurement = typeof technicalAnalysisMeasurements.$inferInsert;

export const technicalAnalysisLocations = pgTable("technical_analysis_locations", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	analiseTecnicaId: varchar("analise_tecnica_id", { length: 255 })
		.references(() => technicalAnalysis.id, { onDelete: "cascade" })
		.notNull(),
	titulo: varchar("titulo", { length: 255 }).notNull(),
	identificador: varchar("identificador", { length: 255 }).notNull(),
	local: text("local").notNull(),
	coordenadasLatitude: text("coordenadas_latitude"),
	coordenadasLongitude: text("coordenadas_longitude"),
});
export const technicalAnalysisLocationsRelations = relations(technicalAnalysisLocations, ({ one }) => ({
	parceiro: one(partners, {
		fields: [technicalAnalysisLocations.parceiroId],
		references: [partners.id],
	}),
	analiseTecnica: one(technicalAnalysis, {
		fields: [technicalAnalysisLocations.analiseTecnicaId],
		references: [technicalAnalysis.id],
	}),
}));
export type TTechnicalAnalysisLocation = typeof technicalAnalysisLocations.$inferSelect;
export type TNewTechnicalAnalysisLocation = typeof technicalAnalysisLocations.$inferInsert;

export const technicalAnalysisResultCosts = pgTable("technical_analysis_result_costs", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	analiseTecnicaId: varchar("analise_tecnica_id", { length: 255 })
		.references(() => technicalAnalysis.id, { onDelete: "cascade" })
		.notNull(),
	propostaVendaItemPrecoId: varchar("proposta_venda_item_preco_id", { length: 255 }).references(() => salesProposalPricingItems.id, {
		onDelete: "set null",
	}),
	nome: varchar("nome", { length: 255 }).notNull(),
	custo: doublePrecision("custo").notNull(),
	observacoes: text("observacoes"),
});
export const technicalAnalysisResultCostsRelations = relations(technicalAnalysisResultCosts, ({ one }) => ({
	parceiro: one(partners, {
		fields: [technicalAnalysisResultCosts.parceiroId],
		references: [partners.id],
	}),
	analiseTecnica: one(technicalAnalysis, {
		fields: [technicalAnalysisResultCosts.analiseTecnicaId],
		references: [technicalAnalysis.id],
	}),
	propostaItemPreco: one(salesProposalPricingItems, {
		fields: [technicalAnalysisResultCosts.propostaVendaItemPrecoId],
		references: [salesProposalPricingItems.id],
	}),
}));
export type TTechnicalAnalysisResultCost = typeof technicalAnalysisResultCosts.$inferSelect;
export type TNewTechnicalAnalysisResultCost = typeof technicalAnalysisResultCosts.$inferInsert;

export const technicalAnalysisResultResources = pgTable("technical_analysis_result_resources", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	analiseTecnicaId: varchar("analise_tecnica_id", { length: 255 })
		.references(() => technicalAnalysis.id, { onDelete: "cascade" })
		.notNull(),
	ativoFisicoId: varchar("ativo_fisico_id", { length: 255 })
		.references(() => physicalAssets.id, { onDelete: "cascade" })
		.notNull(),
	quantidade: doublePrecision("quantidade").notNull(),
	observacoes: text("observacoes"),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const technicalAnalysisResultResourcesRelations = relations(technicalAnalysisResultResources, ({ one }) => ({
	parceiro: one(partners, {
		fields: [technicalAnalysisResultResources.parceiroId],
		references: [partners.id],
	}),
	analiseTecnica: one(technicalAnalysis, {
		fields: [technicalAnalysisResultResources.analiseTecnicaId],
		references: [technicalAnalysis.id],
	}),
	ativoFisico: one(physicalAssets, {
		fields: [technicalAnalysisResultResources.ativoFisicoId],
		references: [physicalAssets.id],
	}),
}));
export type TTechnicalAnalysisResultResource = typeof technicalAnalysisResultResources.$inferSelect;
export type TNewTechnicalAnalysisResultResource = typeof technicalAnalysisResultResources.$inferInsert;

export const technicalAnalysisResultConclusions = pgTable("technical_analysis_result_conclusion", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	analiseTecnicaId: varchar("analise_tecnica_id", { length: 255 })
		.references(() => technicalAnalysis.id, { onDelete: "cascade" })
		.notNull(),
	titulo: varchar("titulo", { length: 255 }).notNull(),
	conteudo: text("conteudo").notNull(),
	visibilidadeTecnica: boolean("visibilidade_tecnica").notNull(),
	visibilidadePublica: boolean("visibilidade_publica").notNull(),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
});
export const technicalAnalysisResultConclusionRelations = relations(technicalAnalysisResultConclusions, ({ one }) => ({
	parceiro: one(partners, {
		fields: [technicalAnalysisResultConclusions.parceiroId],
		references: [partners.id],
	}),
	analiseTecnica: one(technicalAnalysis, {
		fields: [technicalAnalysisResultConclusions.analiseTecnicaId],
		references: [technicalAnalysis.id],
	}),
	autor: one(users, {
		fields: [technicalAnalysisResultConclusions.autorId],
		references: [users.id],
	}),
}));
export type TTechnicalAnalysisResultConclusion = typeof technicalAnalysisResultConclusions.$inferSelect;
export type TNewTechnicalAnalysisResultConclusion = typeof technicalAnalysisResultConclusions.$inferInsert;

export const technicalAnalysisResultAvaliations = pgTable("technical_analysis_result_avaliations", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	analiseTecnicaId: varchar("analise_tecnica_id", { length: 255 })
		.references(() => technicalAnalysis.id, { onDelete: "cascade" })
		.notNull(),
	item: varchar("item", { length: 255 }).notNull(),
	valor: varchar("valor", { length: 255 }).notNull(),
	rotulo: technicalAnalysisResultAvaliationsLabelEnum("rotulo").notNull(),
});
export const technicalAnalysisResultAvaliationsRelations = relations(technicalAnalysisResultAvaliations, ({ one }) => ({
	parceiro: one(partners, {
		fields: [technicalAnalysisResultAvaliations.parceiroId],
		references: [partners.id],
	}),
	analiseTecnica: one(technicalAnalysis, {
		fields: [technicalAnalysisResultAvaliations.analiseTecnicaId],
		references: [technicalAnalysis.id],
	}),
}));
export type TTechnicalAnalysisResultAvaliation = typeof technicalAnalysisResultAvaliations.$inferSelect;
export type TNewTechnicalAnalysisResultAvaliation = typeof technicalAnalysisResultAvaliations.$inferInsert;
