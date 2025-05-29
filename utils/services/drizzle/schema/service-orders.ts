import { boolean, doublePrecision, index, jsonb, pgEnum, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { projects } from "./projects";
import { users } from "./users";
import { relations, sql } from "drizzle-orm";
import { fileReferences } from "./file-references";
import { allocationReferences, allocationReferenceUsageRecords, allocators, assetsMovementFormularies, physicalAssets } from "./assets";
import { calendars } from "./calendars";
import { serviceOrderReportPeriodTypeEnum } from "./enums";
import type { TServiceOrderCategoryReportTypeConfig } from "@/lib/validators/service-orders";

export const serviceOrdersCategories = pgTable("service_order_categories", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 }).references(() => partners.id),
	nome: varchar("nome", { length: 255 }).notNull(),
	descricao: varchar("descricao", { length: 255 }),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const serviceOrdersCategoriesRelations = relations(serviceOrdersCategories, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [serviceOrdersCategories.parceiroId],
		references: [partners.id],
	}),
	tiposRelatorios: many(serviceOrderCategoryReportTypes),
}));
export const serviceOrderCategoryReportTypes = pgTable("service_order_category_report_types", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 }).references(() => partners.id),
	categoriaId: varchar("categoria_id", { length: 255 }).references(() => serviceOrdersCategories.id),
	nome: varchar("nome", { length: 255 }).notNull(),
	configuracao: jsonb("configuracao").$type<TServiceOrderCategoryReportTypeConfig>().notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});

export const serviceOrderCategoryReportTypesRelations = relations(serviceOrderCategoryReportTypes, ({ one }) => ({
	parceiro: one(partners, {
		fields: [serviceOrderCategoryReportTypes.parceiroId],
		references: [partners.id],
	}),
	categoria: one(serviceOrdersCategories, {
		fields: [serviceOrderCategoryReportTypes.categoriaId],
		references: [serviceOrdersCategories.id],
	}),
}));

export const urgencyEnum = pgEnum("urgencia", ["POUCO URGENTE", "URGENTE", "EMERGÊNCIA"]);

export const serviceOrders = pgTable(
	"service_orders",
	{
		id: varchar("id", { length: 255 })
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		parceiroId: varchar("parceiro_id", { length: 255 })
			.references(() => partners.id)
			.notNull(),
		projetoId: varchar("projeto_id", { length: 255 }).references(() => projects.id),
		categoriaId: varchar("categoria_id", { length: 100 })
			.references(() => serviceOrdersCategories.id)
			.notNull(),
		descricao: text("descricao").notNull(),
		anotacoes: text("anotacoes"),
		favorecidoNome: varchar("favorecido_nome", { length: 255 }).notNull(),
		favorecidoContato: varchar("favorecido_contato", { length: 255 }).notNull(),
		urgencia: urgencyEnum("urgencia"),
		localizacaoCep: varchar("localizacao_cep", { length: 255 }),
		localizacaoUf: varchar("localizacao_uf", { length: 255 }),
		localizacaoCidade: varchar("localizacao_cidade", { length: 255 }),
		localizacaoBairro: varchar("localizacao_bairro", { length: 255 }),
		localizacaoLogradouro: varchar("localizacao_logradouro", { length: 255 }),
		localizacaoNumero: varchar("localizacao_numero", { length: 255 }),
		localizacaoComplemento: varchar("localizacao_complemento", { length: 255 }),
		localizacaoLatitude: varchar("localizacao_latitude", { length: 255 }),
		localizacaoLongitude: varchar("localizacao_longitude", { length: 255 }),
		agendamentoInicio: timestamp("agendamento_inicio"),
		agendamentoFim: timestamp("agendamento_fim"),
		execucaoInicio: timestamp("execucao_inicio"),
		execucaoFim: timestamp("execucao_fim"),
		// allocator reference para os casos em que uma ordem de serviço requer utilizações de ativos
		alocadorReferenciaId: varchar("alocador_referencia_id", { length: 255 }).references(() => allocators.id),
		// calendar id para os casos em que uma ordem de serviço requer agendamento no Google Calendar
		calendarioId: varchar("calendario_id", { length: 255 }).references(() => calendars.id),
		relatorioTipoId: varchar("relatorio_tipo_id", { length: 255 }).references(() => serviceOrderCategoryReportTypes.id),
		permitirRelatoriosExternos: boolean("permitir_relatorios_externos").default(false),
		googleCalendarId: varchar("google_calendar_id", { length: 255 }),
		googleCalendarEventId: varchar("google_calendar_event_id", { length: 255 }),
		dataEfetivacao: timestamp("data_efetivacao"),
		dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
		autorId: varchar("autor_id", { length: 100 })
			.references(() => users.id)
			.notNull(),
	},
	(table) => [
		index("ordem_servico_descricao_search_index").using("gin", sql`to_tsvector('portuguese', ${table.descricao})`),
		index("ordem_servico_favorecido_search_index").using("gin", sql`to_tsvector('portuguese', ${table.favorecidoNome})`),
	],
);
export const serviceOrdersRelations = relations(serviceOrders, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [serviceOrders.parceiroId],
		references: [partners.id],
	}),
	projeto: one(projects, {
		fields: [serviceOrders.projetoId],
		references: [projects.id],
	}),
	alocadorReferencia: one(allocators, {
		fields: [serviceOrders.alocadorReferenciaId],
		references: [allocators.id],
	}),
	categoria: one(serviceOrdersCategories, {
		fields: [serviceOrders.categoriaId],
		references: [serviceOrdersCategories.id],
	}),
	calendario: one(calendars, {
		fields: [serviceOrders.calendarioId],
		references: [calendars.id],
	}),
	relatorioTipo: one(serviceOrderCategoryReportTypes, {
		fields: [serviceOrders.relatorioTipoId],
		references: [serviceOrderCategoryReportTypes.id],
	}),
	autor: one(users, {
		fields: [serviceOrders.autorId],
		references: [users.id],
	}),
	responsaveis: many(serviceOrderResponsibles),
	instrucoes: many(serviceOrderInstructions),
	arquivos: many(fileReferences, { relationName: "ordemServicoArquivos" }),
	arquivosAuxiliares: many(fileReferences, { relationName: "ordemServicoArquivosAuxiliares" }),
	formulariosMovimentacaoAtivos: many(assetsMovementFormularies),
	relatorios: many(serviceOrderReports),
	usoAtivos: many(allocationReferenceUsageRecords),
}));
export type TServiceOrder = typeof serviceOrders.$inferSelect;
export type TNewServiceOrder = typeof serviceOrders.$inferInsert;

export const serviceOrderResponsibles = pgTable("service_order_responsibles", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	ordemServicoId: varchar("ordem_servico_id", { length: 255 })
		.references(() => serviceOrders.id, { onDelete: "cascade" })
		.notNull(),
	usuarioId: varchar("usuario_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
});
export const serviceOrderResponsiblesRelations = relations(serviceOrderResponsibles, ({ one }) => ({
	parceiro: one(partners, {
		fields: [serviceOrderResponsibles.parceiroId],
		references: [partners.id],
	}),
	ordemServico: one(serviceOrders, {
		fields: [serviceOrderResponsibles.ordemServicoId],
		references: [serviceOrders.id],
	}),
	usuario: one(users, {
		fields: [serviceOrderResponsibles.usuarioId],
		references: [users.id],
	}),
}));
export type TServiceOrderResponsible = typeof serviceOrderResponsibles.$inferSelect;
export type TNewServiceOrderResponsible = typeof serviceOrderResponsibles.$inferInsert;

export const serviceOrderInstructions = pgTable("service_order_instructions", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	ordemServicoId: varchar("ordem_servico_id", { length: 255 })
		.references(() => serviceOrders.id, { onDelete: "cascade" })
		.notNull(),
	topico: text("topico").notNull(),
	descricao: text("descricao").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const serviceOrderInstructionsRelations = relations(serviceOrderInstructions, ({ one }) => ({
	parceiro: one(partners, {
		fields: [serviceOrderInstructions.parceiroId],
		references: [partners.id],
	}),
	ordemServico: one(serviceOrders, {
		fields: [serviceOrderInstructions.ordemServicoId],
		references: [serviceOrders.id],
	}),
}));
export type TServiceOrderInstruction = typeof serviceOrderInstructions.$inferSelect;
export type TNewServiceOrderInstruction = typeof serviceOrderInstructions.$inferInsert;

export const serviceOrderReports = pgTable("service_order_reports", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	ordemServicoId: varchar("ordem_servico_id", { length: 255 })
		.references(() => serviceOrders.id, { onDelete: "cascade" })
		.notNull(),
	periodoTipo: serviceOrderReportPeriodTypeEnum("periodo_tipo").notNull(),
	periodoInicio: timestamp("periodo_inicio").notNull(),
	periodoFim: timestamp("periodo_fim").notNull(),
	anotacoes: text("anotacoes"),
	autorId: varchar("autor_id", { length: 255 }).references(() => users.id),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const serviceOrderReportsRelations = relations(serviceOrderReports, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [serviceOrderReports.parceiroId],
		references: [partners.id],
	}),
	ordemServico: one(serviceOrders, {
		fields: [serviceOrderReports.ordemServicoId],
		references: [serviceOrders.id],
	}),
	autor: one(users, {
		fields: [serviceOrderReports.autorId],
		references: [users.id],
	}),
	atividades: many(serviceOrderReportActivities),
	arquivos: many(fileReferences, { relationName: "ordemServicoRelatorioArquivos" }),
	usoAtivos: many(allocationReferenceUsageRecords),
}));
export type TServiceOrderReport = typeof serviceOrderReports.$inferSelect;
export type TNewServiceOrderReport = typeof serviceOrderReports.$inferInsert;

export const serviceOrderReportActivities = pgTable("service_order_report_activities", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	ordemServicoId: varchar("ordem_servico_id", { length: 255 })
		.references(() => serviceOrders.id, { onDelete: "cascade" })
		.notNull(),
	ordemServicoRelatorioId: varchar("ordem_servico_relatorio_id", { length: 255 })
		.references(() => serviceOrderReports.id, { onDelete: "cascade" })
		.notNull(),
	descricao: text("descricao").notNull(),
	anotacoes: text("anotacoes"),
	periodoInicio: timestamp("periodo_inicio").notNull(),
	periodoFim: timestamp("periodo_fim").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const serviceOrderReportActivitiesRelations = relations(serviceOrderReportActivities, ({ one }) => ({
	parceiro: one(partners, {
		fields: [serviceOrderReportActivities.parceiroId],
		references: [partners.id],
	}),
	ordemServico: one(serviceOrders, {
		fields: [serviceOrderReportActivities.ordemServicoId],
		references: [serviceOrders.id],
	}),
	ordemServicoRelatorio: one(serviceOrderReports, {
		fields: [serviceOrderReportActivities.ordemServicoRelatorioId],
		references: [serviceOrderReports.id],
	}),
}));
export type TServiceOrderReportActivity = typeof serviceOrderReportActivities.$inferSelect;
export type TNewServiceOrderReportActivity = typeof serviceOrderReportActivities.$inferInsert;

export const serviceOrderReportAssetsUsage = pgTable("service_order_report_assets_usage", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	ordemServicoId: varchar("ordem_servico_id", { length: 255 })
		.references(() => serviceOrders.id, { onDelete: "cascade" })
		.notNull(),
	ordemServicoRelatorioId: varchar("ordem_servico_relatorio_id", { length: 255 })
		.references(() => serviceOrderReports.id, { onDelete: "cascade" })
		.notNull(),
	alocacaoReferenciaId: varchar("alocacao_referencia_id", { length: 255 })
		.references(() => allocationReferences.id)
		.notNull(),
	ativoFisicoId: varchar("ativo_fisico_id", { length: 255 })
		.references(() => physicalAssets.id)
		.notNull(),
	qtde: doublePrecision("qtde").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});

export const serviceOrderReportAssetsUsageRelations = relations(serviceOrderReportAssetsUsage, ({ one }) => ({
	parceiro: one(partners, {
		fields: [serviceOrderReportAssetsUsage.parceiroId],
		references: [partners.id],
	}),
	ordemServico: one(serviceOrders, {
		fields: [serviceOrderReportAssetsUsage.ordemServicoId],
		references: [serviceOrders.id],
	}),
	ordemServicoRelatorio: one(serviceOrderReports, {
		fields: [serviceOrderReportAssetsUsage.ordemServicoRelatorioId],
		references: [serviceOrderReports.id],
	}),
	alocacaoReferencia: one(allocationReferences, {
		fields: [serviceOrderReportAssetsUsage.alocacaoReferenciaId],
		references: [allocationReferences.id],
	}),
	ativoFisico: one(physicalAssets, {
		fields: [serviceOrderReportAssetsUsage.ativoFisicoId],
		references: [physicalAssets.id],
	}),
}));
export type TServiceOrderReportAssetsUsage = typeof serviceOrderReportAssetsUsage.$inferSelect;
export type TNewServiceOrderReportAssetsUsage = typeof serviceOrderReportAssetsUsage.$inferInsert;
