import { boolean, doublePrecision, index, integer, pgEnum, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { clients } from "./clients";
import { users } from "./users";
import { relations, sql } from "drizzle-orm";
import { fileReferences } from "./file-references";
import { activities } from "./activities";
import { serviceOrders } from "./service-orders";
import { homologations } from "./homologations";
import { purchases } from "./purchases";
import { geographicSegmentEnum, propertyUseSegmentEnum } from "./enums";
import { sales } from "./sales";
import { allocators, physicalAssets } from "./assets";
import { services } from "./services";
import { technicalAnalysis } from "./technical-analysis";

export const projects = pgTable(
	"projects",
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
		vendaId: varchar("venda_id", { length: 255 })
			.references(() => sales.id)
			.notNull(),
		analiseTecnicaId: varchar("analise_tecnica_id", { length: 255 }),
		indexador: integer("indexador").notNull(),
		nome: varchar("nome", { length: 255 }).notNull(),
		// observacoes === lista checked
		// responsáveis === lista checked
		contatosPrimarioNome: varchar("contatos_primario_nome", {
			length: 255,
		}).notNull(),
		contatosPrimarioTelefone: varchar("contatos_primario_telefone", {
			length: 255,
		}).notNull(),
		contatosSecundarioNome: varchar("contatos_secundario_nome", {
			length: 255,
		}),
		contatosSecundarioTelefone: varchar("contatos_secundario_telefone", {
			length: 255,
		}),
		contatosEmail: varchar("contatos_email", { length: 255 }).notNull(),
		contatosObservacoes: text("contatos_observacoes").notNull(),
		// acessos === lista checked
		localizacaoCep: varchar("localizacao_cep", { length: 255 }),
		localizacaoUf: varchar("localizacao_uf", { length: 255 }),
		localizacaoCidade: varchar("localizacao_cidade", { length: 255 }),
		localizacaoBairro: varchar("localizacao_bairro", { length: 255 }),
		localizacaoLogradouro: varchar("localizacao_logradouro", { length: 255 }),
		localizacaoNumero: varchar("localizacao_numero", { length: 255 }),
		localizacaoComplemento: varchar("localizacao_complemento", { length: 255 }),
		localizacaoLatitude: varchar("localizacao_latitude", { length: 255 }),
		localizacaoLongitude: varchar("localizacao_longitude", { length: 255 }),
		segmentoGeografico: geographicSegmentEnum("segmento_geografico"),
		segmentoUsoImovel: propertyUseSegmentEnum("segmento_uso_imovel"),
		// produtos vendidos === lista
		// servicos vendidos === lista
		dataInicio: timestamp("data_inicio"),
		dataPrevisaoConclusao: timestamp("data_previsao_conclusao"),
		dataConclusao: timestamp("data_conclusao"),
		dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
		autorId: varchar("autor_id", { length: 255 })
			.references(() => users.id)
			.notNull(),
	},
	(table) => ({
		nomeSearchIndex: index("projeto_nome_search_index").using("gin", sql`to_tsvector('portuguese', ${table.nome})`),
		indexerIndex: index("projeto_indexer_index").on(table.indexador),
	}),
);
export const projectRelations = relations(projects, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [projects.parceiroId],
		references: [partners.id],
	}),
	cliente: one(clients, {
		fields: [projects.clienteId],
		references: [clients.id],
	}),
	venda: one(sales, {
		fields: [projects.vendaId],
		references: [sales.id],
	}),
	analiseTecnica: one(technicalAnalysis, {
		fields: [projects.analiseTecnicaId],
		references: [technicalAnalysis.id],
	}),
	autor: one(users, {
		fields: [projects.autorId],
		references: [users.id],
	}),
	alocadores: many(allocators),
	observacoes: many(projectObservations),
	responsaveis: many(projectResponsibles),
	acessos: many(projectAccesses),
	servicos: many(projectServices),
	produtos: many(projectProducts),
	arquivos: many(fileReferences),
	atividades: many(activities),
	ordensServico: many(serviceOrders),
	compras: many(purchases),
	homologacoes: many(homologations),
}));

export type TProject = typeof projects.$inferSelect;
export type TNewProject = typeof projects.$inferInsert;

/**
 *
 * PROJECT OBSERVATIONS
 *
 */
export const projectObservationsSubject = pgEnum("projeto_observacoes_assunto", ["SERVIÇOS", "PRODUTOS", "NEGOCIAÇÃO", "SUPRIMENTAÇÃO", "EXECUÇÃO"]);
export const projectObservations = pgTable("project_observations", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	projetoId: varchar("projeto_id", { length: 255 })
		.references(() => projects.id, { onDelete: "cascade" })
		.notNull(),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	assunto: projectObservationsSubject("projeto_observacoes_assunto").notNull(),
	descricao: text("projeto_observacoes_descricao").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
});
export const projectObservationsRelations = relations(projectObservations, ({ one }) => ({
	parceiro: one(partners, {
		fields: [projectObservations.parceiroId],
		references: [partners.id],
	}),
	projeto: one(projects, {
		fields: [projectObservations.projetoId],
		references: [projects.id],
	}),
	autor: one(users, {
		fields: [projectObservations.autorId],
		references: [users.id],
	}),
}));
export type TProjectObservation = typeof projectObservations.$inferSelect;
export type TNewProjectObservation = typeof projectObservations.$inferInsert;
/**
 *
 * PROJECT RESPONSIBLES
 *
 */
export const projectResponsibles = pgTable("project_responsibles", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	projetoId: varchar("projeto_id", { length: 255 })
		.references(() => projects.id, { onDelete: "cascade" })
		.notNull(),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	usuarioId: varchar("usuario_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
	papel: varchar("papel", { length: 255 }).notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const projectResponsiblesRelations = relations(projectResponsibles, ({ one }) => ({
	parceiro: one(partners, {
		fields: [projectResponsibles.parceiroId],
		references: [partners.id],
	}),
	projeto: one(projects, {
		fields: [projectResponsibles.projetoId],
		references: [projects.id],
	}),
	usuario: one(users, {
		fields: [projectResponsibles.usuarioId],
		references: [users.id],
	}),
}));
export type TProjectResponsible = typeof projectResponsibles.$inferSelect;
export type TNewProjectResponsible = typeof projectResponsibles.$inferInsert;
/**
 *
 * PROJECT  ACESSES
 *
 */
export const projectAccesses = pgTable("project_accesses", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	projetoId: varchar("projeto_id", { length: 255 })
		.references(() => projects.id, { onDelete: "cascade" })
		.notNull(),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	identificador: varchar("identificador", { length: 255 }).notNull(),
	login: varchar("login", { length: 255 }).notNull(),
	senha: varchar("senha", { length: 255 }).notNull(),
	link: text("link").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const projectAccessesRelations = relations(projectAccesses, ({ one }) => ({
	parceiro: one(partners, {
		fields: [projectAccesses.parceiroId],
		references: [partners.id],
	}),
	projeto: one(projects, {
		fields: [projectAccesses.projetoId],
		references: [projects.id],
	}),
}));
export type TProjectAccess = typeof projectAccesses.$inferSelect;
export type TNewProjectAccess = typeof projectAccesses.$inferInsert;
/**
 *
 * PROJECT  SERVICES
 *
 */
export const projectServices = pgTable("project_services", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	projetoId: varchar("projeto_id", { length: 255 })
		.references(() => projects.id, { onDelete: "cascade" })
		.notNull(),
	servicoId: varchar("servico_id", { length: 255 })
		.references(() => services.id)
		.notNull(),
	quantidade: doublePrecision("quantidade").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const projectServicesRelations = relations(projectServices, ({ one }) => ({
	parceiro: one(partners, {
		fields: [projectServices.parceiroId],
		references: [partners.id],
	}),
	projeto: one(projects, {
		fields: [projectServices.projetoId],
		references: [projects.id],
	}),
	servico: one(services, {
		fields: [projectServices.servicoId],
		references: [services.id],
	}),
}));
export type TProjectService = typeof projectServices.$inferSelect;
export type TNewProjectService = typeof projectServices.$inferInsert;
/**
 *
 * PROJECT  PRODUCTS
 *
 */

export const projectProducts = pgTable("project_products", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	projetoId: varchar("projeto_id", { length: 255 })
		.references(() => projects.id, { onDelete: "cascade" })
		.notNull(),
	produtoId: varchar("produto_id", { length: 255 })
		.references(() => physicalAssets.id)
		.notNull(),
	quantidade: doublePrecision("quantidade").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const projectProductsRelations = relations(projectProducts, ({ one }) => ({
	parceiro: one(partners, {
		fields: [projectProducts.parceiroId],
		references: [partners.id],
	}),
	projeto: one(projects, {
		fields: [projectProducts.projetoId],
		references: [projects.id],
	}),
	produto: one(physicalAssets, {
		fields: [projectProducts.produtoId],
		references: [physicalAssets.id],
	}),
}));
export type TProjectProduct = typeof projectProducts.$inferSelect;
export type TNewProjectProduct = typeof projectProducts.$inferInsert;
