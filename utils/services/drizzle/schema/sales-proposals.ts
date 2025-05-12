import { boolean, doublePrecision, index, integer, jsonb, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { text, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { users } from "./users";
import { clients } from "./clients";
import { relations, sql } from "drizzle-orm";
import { fileReferences } from "./file-references";
import { salesProposalPremissesTypes } from "./enums";
import { sales } from "./sales";
import { kanbanBoardItemConnections } from "./kanban-boards";
import { kits } from "./kits";
import { services } from "./services";
import { physicalAssets } from "./assets";
import { technicalAnalysis } from "./technical-analysis";

export const salesProposals = pgTable(
	"sales_proposals",
	{
		id: varchar("id", { length: 255 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		parceiroId: varchar("parceiro_id", { length: 255 })
			.references(() => partners.id)
			.notNull(),
		clienteId: varchar("cliente_id", { length: 255 })
			.references(() => clients.id)
			.notNull(),
		identificador: integer("identificador").notNull(),
		favoritada: boolean("favoritada").notNull().default(false),
		titulo: varchar("titulo", { length: 255 }).notNull(),
		anotacoes: text("anotacoes"),
		valor: doublePrecision("valor").notNull(),
		autorId: varchar("autor_id", { length: 255 })
			.references(() => users.id)
			.notNull(),
		dataExpiracao: timestamp("data_expiracao"),
		dataGanho: timestamp("data_ganho"),
		perdaData: timestamp("perda_data"),
		perdaMotivo: text("perda_motivo"),
		interacaoData: timestamp("interacao_data"),
		vendaId: varchar("venda_id", { length: 255 }),
		dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
	},
	(table) => ({
		tituloSearchIndex: index("proposta_venda_titulo_search_index").using("gin", sql`to_tsvector('portuguese', ${table.titulo})`),
		dataGanhoIndex: index("proposta_venda_data_ganho_idx").on(table.dataGanho),
		perdaDataIndex: index("proposta_venda_perda_data_idx").on(table.perdaData),
		dataInsercaoIndex: index("proposta_venda_data_insercao_idx").on(table.dataInsercao),
	}),
);
export const salesProposalsRelations = relations(salesProposals, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [salesProposals.parceiroId],
		references: [partners.id],
	}),
	cliente: one(clients, {
		fields: [salesProposals.clienteId],
		references: [clients.id],
	}),
	autor: one(users, {
		fields: [salesProposals.autorId],
		references: [users.id],
	}),
	venda: one(sales, {
		fields: [salesProposals.vendaId],
		references: [sales.id],
	}),
	analisesTecnicas: many(technicalAnalysis),
	conexoesKanban: many(kanbanBoardItemConnections),
	kits: many(salesProposalKits),
	produtos: many(salesProposalProducts),
	servicos: many(salesProposalServices),
	premissas: many(salesProposalPremisses),
	precificacao: many(salesProposalPricingItems),
	atualizacoes: many(salesProposalUpdates),
	arquivos: many(fileReferences),
}));
export type TSalesProposal = typeof salesProposals.$inferSelect;
export type TNewSalesProposal = typeof salesProposals.$inferInsert;

export const salesProposalKits = pgTable("sales_proposal_kits", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	propostaVendaId: varchar("proposta_venda_id", { length: 255 })
		.references(() => salesProposals.id, { onDelete: "cascade" })
		.notNull(),
	kitId: varchar("kit_id", { length: 255 })
		.references(() => kits.id)
		.notNull(),
});
export const salesProposalKitsRelations = relations(salesProposalKits, ({ one }) => ({
	parceiro: one(partners, {
		fields: [salesProposalKits.parceiroId],
		references: [partners.id],
	}),
	propostaVenda: one(salesProposals, {
		fields: [salesProposalKits.propostaVendaId],
		references: [salesProposals.id],
	}),
	kit: one(kits, {
		fields: [salesProposalKits.kitId],
		references: [kits.id],
	}),
}));
export type TSalesProposalKit = typeof salesProposalKits.$inferSelect;
export type TNewSalesProposalKit = typeof salesProposalKits.$inferInsert;

export const salesProposalProducts = pgTable("sales_proposal_products", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	propostaVendaId: varchar("proposta_venda_id", { length: 255 })
		.references(() => salesProposals.id, { onDelete: "cascade" })
		.notNull(),
	produtoId: varchar("produto_id", { length: 255 })
		.references(() => physicalAssets.id)
		.notNull(),
	quantidade: doublePrecision("quantidade").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const salesProposalProductsRelations = relations(salesProposalProducts, ({ one }) => ({
	parceiro: one(partners, {
		fields: [salesProposalProducts.parceiroId],
		references: [partners.id],
	}),
	propostaVenda: one(salesProposals, {
		fields: [salesProposalProducts.propostaVendaId],
		references: [salesProposals.id],
	}),
	produto: one(physicalAssets, {
		fields: [salesProposalProducts.produtoId],
		references: [physicalAssets.id],
	}),
}));
export type TSalesProposalProduct = typeof salesProposalProducts.$inferSelect;
export type TNewSalesProposalProduct = typeof salesProposalProducts.$inferInsert;

export const salesProposalServices = pgTable("sales_proposal_services", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	propostaVendaId: varchar("proposta_venda_id", { length: 255 })
		.references(() => salesProposals.id, { onDelete: "cascade" })
		.notNull(),
	servicoId: varchar("servico_id", { length: 255 })
		.references(() => services.id)
		.notNull(),
	quantidade: doublePrecision("quantidade").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const salesProposalServicesRelations = relations(salesProposalServices, ({ one }) => ({
	parceiro: one(partners, {
		fields: [salesProposalServices.parceiroId],
		references: [partners.id],
	}),
	propostaVenda: one(salesProposals, {
		fields: [salesProposalServices.propostaVendaId],
		references: [salesProposals.id],
	}),
	servico: one(services, {
		fields: [salesProposalServices.servicoId],
		references: [services.id],
	}),
}));
export type TSalesProposalService = typeof salesProposalServices.$inferSelect;
export type TNewSalesProposalService = typeof salesProposalServices.$inferInsert;

export const salesProposalUpdates = pgTable("sales_proposal_updates", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	propostaVendaId: varchar("proposta_venda_id", { length: 255 })
		.references(() => salesProposals.id, { onDelete: "cascade" })
		.notNull(),
	conteudo: text("conteudo").notNull(),
	data: timestamp("data").defaultNow().notNull(),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
});
export const salesProposalUpdatesRelations = relations(salesProposalUpdates, ({ one }) => ({
	parceiro: one(partners, {
		fields: [salesProposalUpdates.parceiroId],
		references: [partners.id],
	}),
	propostaVenda: one(salesProposals, {
		fields: [salesProposalUpdates.propostaVendaId],
		references: [salesProposals.id],
	}),
	autor: one(users, {
		fields: [salesProposalUpdates.autorId],
		references: [users.id],
	}),
}));
export type TSalesProposalUpdate = typeof salesProposalUpdates.$inferSelect;
export type TNewSalesProposalUpdate = typeof salesProposalUpdates.$inferInsert;

export const salesProposalPremissesDefinitions = pgTable("sales_proposal_premisses_definitions", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 }).references(() => partners.id),
	nome: varchar("nome", { length: 255 }).notNull(),
	identificador: varchar("identificador", { length: 255 }).notNull(),
	descricao: text("descricao").notNull(),
	tipo: salesProposalPremissesTypes("tipo").notNull(),
	configuracao: jsonb("configuracao").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const salesProposalPremissesDefinitionsRelations = relations(salesProposalPremissesDefinitions, ({ one }) => ({
	parceiro: one(partners, {
		fields: [salesProposalPremissesDefinitions.parceiroId],
		references: [partners.id],
	}),
}));
export type TSalesProposalPremissesDefinition = typeof salesProposalPremissesDefinitions.$inferSelect;
export type TNewSalesProposalPremissesDefinition = typeof salesProposalPremissesDefinitions.$inferInsert;

// TODO: implementar schema de premissas
export const salesProposalPremisses = pgTable("sales_proposal_premisses", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	propostaVendaId: varchar("proposta_venda_id", { length: 255 })
		.references(() => salesProposals.id, { onDelete: "cascade" })
		.notNull(),
	premissaDefinicaoId: varchar("premissa_definicao_id", { length: 255 })
		.references(() => salesProposalPremissesDefinitions.id)
		.notNull(),
	identificador: varchar("identificador", { length: 255 }).notNull(),
	valor: text("valor").notNull(),
});
export const salesProposalPremissesRelations = relations(salesProposalPremisses, ({ one }) => ({
	parceiro: one(partners, {
		fields: [salesProposalPremisses.parceiroId],
		references: [partners.id],
	}),
	premissaDefinicao: one(salesProposalPremissesDefinitions, {
		fields: [salesProposalPremisses.premissaDefinicaoId],
		references: [salesProposalPremissesDefinitions.id],
	}),
	propostaVenda: one(salesProposals, {
		fields: [salesProposalPremisses.propostaVendaId],
		references: [salesProposals.id],
	}),
}));
export type TSalesProposalPremisse = typeof salesProposalPremisses.$inferSelect;
export type TNewSalesProposalPremisse = typeof salesProposalPremisses.$inferInsert;

// TODO: implementar schema de precificação
export const salesProposalPricingItems = pgTable("sales_proposal_pricing_items", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	propostaVendaId: varchar("proposta_venda_id", { length: 255 })
		.references(() => salesProposals.id, { onDelete: "cascade" })
		.notNull(),
	nome: text("nome").notNull(),
	// Properties for calculation of sale value
	margemLucro: doublePrecision("margem_lucro").notNull(),
	margemLucroCalculada: doublePrecision("margem_lucro_calculada"),
	faturavel: boolean("faturavel").notNull(),
	// Properties regarding the cost (either calculated or not)
	custoFormula: text("custo_formula"),
	custoCalculado: doublePrecision("custo_calculado").notNull(),
	custoFinal: doublePrecision("custo_final").notNull(),
	// Properties regarding the actuon sale value
	valorCalculado: doublePrecision("valor_calculado").notNull(),
	valorFinal: doublePrecision("valor_final").notNull(),
	valorMaximo: doublePrecision("valor_maximo"),
	valorMinimo: doublePrecision("valor_minimo"),
	revisaoTecnicaHabilitada: boolean("revisao_tecnica_habilitada"),
});
export const salesProposalPricingItemsRelations = relations(salesProposalPricingItems, ({ one }) => ({
	parceiro: one(partners, {
		fields: [salesProposalPricingItems.parceiroId],
		references: [partners.id],
	}),
	propostaVenda: one(salesProposals, {
		fields: [salesProposalPricingItems.propostaVendaId],
		references: [salesProposals.id],
	}),
}));
export type TSalesProposalPricingItem = typeof salesProposalPricingItems.$inferSelect;
export type TNewSalesProposalPricingItem = typeof salesProposalPricingItems.$inferInsert;
