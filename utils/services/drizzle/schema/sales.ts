import { boolean, doublePrecision, index, pgEnum, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { clients } from "./clients";
import { users } from "./users";
import { relations, sql } from "drizzle-orm";
import { projects } from "./projects";
import { contractStatusEnum, geographicSegmentEnum, productCategoryEnum, propertyUseSegmentEnum } from "./enums";
import { fileReferences } from "./file-references";
import { activities } from "./activities";
import { salesProposals } from "./sales-proposals";
import { services } from "./services";
import { physicalAssets } from "./assets";
import { technicalAnalysis } from "./technical-analysis";

export const sales = pgTable(
	"sales",
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
		propostaVendaId: varchar("proposta_venda_id", { length: 255 }),
		analiseTecnicaId: varchar("analise_tecnica_id", { length: 255 }),
		nome: varchar("nome", { length: 255 }).notNull(),
		observacoes: text("observacoes").notNull(),
		segmentoGeografico: geographicSegmentEnum("segmento_geografico"),
		segmentoUsoImovel: propertyUseSegmentEnum("segmento_uso_imovel"),
		contratoStatus: contractStatusEnum("contrato_status"),
		contratoDataSolicitacao: timestamp("contrato_data_solicitacao"),
		contratoDataLiberacao: timestamp("contrato_data_liberacao"),
		contratoDataAssinatura: timestamp("contrato_data_assinatura"),
		contratoDataRescisao: timestamp("contrato_data_rescisao"),
		contratoFormaAssinatura: varchar("contrato_forma_assinatura", { length: 255 }),
		pagamentoPagadorNome: varchar("pagamento_pagador_nome", { length: 255 }),
		pagamentoPagadorTelefone: varchar("pagamento_pagador_telefone", { length: 255 }),
		pagamentoPagadorEmail: varchar("pagamento_pagador_email", { length: 255 }),
		pagamentoPagadorCpfCnpj: varchar("pagamento_pagador_cpf_cnpj", { length: 255 }),
		// [TODO] criar controle de formas de pagamento
		pagamentoMetodoDescricao: text("pagamento_metodo_descricao"),
		// [TODO] criar controle de credores
		pagamentoCreditoAplicavel: boolean("pagamento_credito_aplicavel"),
		pagamentoCreditoCredor: varchar("pagamento_credito_credor", { length: 255 }),
		pagamentoCreditoContatoNome: varchar("pagamento_credito_contato_nome", { length: 255 }),
		pagamentoCreditoContatoTelefone: varchar("pagamento_credito_contato_telefone", { length: 255 }),
		pagamentoCreditoObservacoes: text("pagamento_credito_observacoes"),
		pagamentoObservacoes: text("pagamento_observacoes"),
		// [TODO] avaliar outras informações relevantes sobre o faturamento geral de um projeto
		faturamentoObservacoes: text("faturamento_observacoes"),
		valor: doublePrecision("valor").notNull(),
		dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
		autorId: varchar("autor_id", { length: 255 })
			.references(() => users.id)
			.notNull(),
	},
	(table) => ({
		nomeSearchIndex: index("venda_nome_search_index").using("gin", sql`to_tsvector('portuguese', ${table.nome})`),
	}),
);
export const salesRelations = relations(sales, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [sales.parceiroId],
		references: [partners.id],
	}),
	cliente: one(clients, {
		fields: [sales.clienteId],
		references: [clients.id],
	}),
	autor: one(users, {
		fields: [sales.autorId],
		references: [users.id],
	}),
	propostaVenda: one(salesProposals, {
		fields: [sales.propostaVendaId],
		references: [salesProposals.id],
	}),
	analiseTecnica: one(technicalAnalysis, {
		fields: [sales.analiseTecnicaId],
		references: [technicalAnalysis.id],
	}),
	projetos: many(projects),
	responsaveis: many(saleResponsibles),
	produtos: many(saleProducts),
	servicos: many(saleServices),
	arquivos: many(fileReferences),
	atividades: many(activities),
}));
export type TSale = typeof sales.$inferSelect;
export type TNewSale = typeof sales.$inferInsert;

export const saleResponsibles = pgTable("sale_responsibles", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	vendaId: varchar("venda_id", { length: 255 })
		.references(() => sales.id, { onDelete: "cascade" })
		.notNull(),
	usuarioId: varchar("usuario_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
	papel: varchar("papel", { length: 255 }).notNull(),
});

export const saleResponsiblesRelations = relations(saleResponsibles, ({ one }) => ({
	parceiro: one(partners, {
		fields: [saleResponsibles.parceiroId],
		references: [partners.id],
	}),
	venda: one(sales, {
		fields: [saleResponsibles.vendaId],
		references: [sales.id],
	}),
	usuario: one(users, {
		fields: [saleResponsibles.usuarioId],
		references: [users.id],
	}),
}));

/**
 *
 * SALE  SERVICES
 *
 */
export const saleServices = pgTable("sale_services", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	vendaId: varchar("venda_id", { length: 255 })
		.references(() => sales.id, { onDelete: "cascade" })
		.notNull(),
	servicoId: varchar("servico_id", { length: 255 })
		.references(() => services.id)
		.notNull(),
	quantidade: doublePrecision("quantidade").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const saleServicesRelations = relations(saleServices, ({ one }) => ({
	parceiro: one(partners, {
		fields: [saleServices.parceiroId],
		references: [partners.id],
	}),
	venda: one(sales, {
		fields: [saleServices.vendaId],
		references: [sales.id],
	}),
	servico: one(services, {
		fields: [saleServices.servicoId],
		references: [services.id],
	}),
}));
export type TSaleService = typeof saleServices.$inferSelect;
export type TNewSaleService = typeof saleServices.$inferInsert;
/**
 *
 * SALE  PRODUCTS
 *
 */
export const saleProducts = pgTable("sale_products", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	vendaId: varchar("venda_id", { length: 255 })
		.references(() => sales.id, { onDelete: "cascade" })
		.notNull(),
	produtoId: varchar("produto_id", { length: 255 })
		.references(() => physicalAssets.id)
		.notNull(),
	quantidade: doublePrecision("quantidade").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const saleProductsRelations = relations(saleProducts, ({ one }) => ({
	parceiro: one(partners, {
		fields: [saleProducts.parceiroId],
		references: [partners.id],
	}),
	venda: one(sales, {
		fields: [saleProducts.vendaId],
		references: [sales.id],
	}),
	produto: one(physicalAssets, {
		fields: [saleProducts.produtoId],
		references: [physicalAssets.id],
	}),
}));
export type TSaleProduct = typeof saleProducts.$inferSelect;
export type TNewSaleProduct = typeof saleProducts.$inferInsert;
