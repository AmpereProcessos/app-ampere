import { boolean, integer, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { projects } from "./projects";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { partners } from "./partners";
import { pgTable } from "./common";
import { activities } from "./activities";
import { homologations } from "./homologations";
import { purchases } from "./purchases";
import { sales } from "./sales";
import { physicalAssets } from "./assets";
import { serviceOrderReports, serviceOrders } from "./service-orders";
import { salesProposals } from "./sales-proposals";
import { technicalAnalysis } from "./technical-analysis";

export const fileReferences = pgTable("file_references", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	usuarioId: varchar("usuario_id", { length: 255 }).references(() => users.id, { onDelete: "set null" }),
	clienteId: varchar("cliente_id", { length: 255 }).references(() => clients.id, { onDelete: "set null" }),
	propostaVendaId: varchar("proposta_venda_id", { length: 255 }).references(() => salesProposals.id, { onDelete: "set null" }),
	vendaId: varchar("venda_id", { length: 255 }).references(() => sales.id, { onDelete: "set null" }),
	projetoId: varchar("projeto_id", { length: 255 }).references(() => projects.id, { onDelete: "set null" }),
	compraId: varchar("compra_id", { length: 255 }).references(() => purchases.id, { onDelete: "set null" }),
	homologacaoId: varchar("homologacao_id", { length: 255 }).references(() => homologations.id, { onDelete: "set null" }),
	atividadeId: varchar("atividade_id", { length: 255 }).references(() => activities.id, { onDelete: "set null" }),
	ativoFisicoId: varchar("ativo_fisico_id", { length: 255 }).references(() => physicalAssets.id, { onDelete: "set null" }),
	ordemServicoId: varchar("ordem_servico_id", { length: 255 }).references(() => serviceOrders.id, { onDelete: "set null" }),
	ordemServicoAuxiliaresId: varchar("ordem_servico_auxiliares_id", { length: 255 }).references(() => serviceOrders.id, { onDelete: "set null" }),
	ordemServicoRelatorioId: varchar("ordem_servico_relatorio_id", { length: 255 }).references(() => serviceOrderReports.id, { onDelete: "set null" }),
	analiseTecnicaId: varchar("analise_tecnica_id", { length: 255 }).references(() => technicalAnalysis.id, { onDelete: "set null" }),
	titulo: varchar("titulo", { length: 255 }).notNull(),
	formato: varchar("formato", { length: 255 }).notNull(),
	url: varchar("url", { length: 255 }).notNull(),
	tamanho: integer("tamanho").notNull(),
	publico: boolean("publico").notNull().default(false),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
});
export const fileReferencesRelations = relations(fileReferences, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [fileReferences.parceiroId],
		references: [partners.id],
	}),
	cliente: one(clients, {
		fields: [fileReferences.clienteId],
		references: [clients.id],
	}),
	propostaVenda: one(salesProposals, {
		fields: [fileReferences.propostaVendaId],
		references: [salesProposals.id],
	}),
	venda: one(sales, {
		fields: [fileReferences.vendaId],
		references: [sales.id],
	}),
	projeto: one(projects, {
		fields: [fileReferences.projetoId],
		references: [projects.id],
	}),
	compra: one(purchases, {
		fields: [fileReferences.compraId],
		references: [purchases.id],
	}),
	homologacao: one(homologations, {
		fields: [fileReferences.homologacaoId],
		references: [homologations.id],
	}),
	ativoFisico: one(physicalAssets, {
		fields: [fileReferences.ativoFisicoId],
		references: [physicalAssets.id],
	}),
	ordemServico: one(serviceOrders, {
		fields: [fileReferences.ordemServicoId],
		references: [serviceOrders.id],
		relationName: "ordemServicoArquivos",
	}),
	ordemServicoAuxiliares: one(serviceOrders, {
		fields: [fileReferences.ordemServicoAuxiliaresId],
		references: [serviceOrders.id],
		relationName: "ordemServicoArquivosAuxiliares",
	}),
	ordemServicoRelatorio: one(serviceOrderReports, {
		fields: [fileReferences.ordemServicoRelatorioId],
		references: [serviceOrderReports.id],
		relationName: "ordemServicoRelatorioArquivos",
	}),
	analiseTecnica: one(technicalAnalysis, {
		fields: [fileReferences.analiseTecnicaId],
		references: [technicalAnalysis.id],
	}),
	atividade: one(activities, {
		fields: [fileReferences.projetoId],
		references: [activities.id],
	}),
	autor: one(users, {
		fields: [fileReferences.autorId],
		references: [users.id],
		relationName: "autorArquivo",
	}),
	usuario: one(users, {
		fields: [fileReferences.usuarioId],
		references: [users.id],
		relationName: "usuarioArquivo",
	}),
	categorias: many(fileReferenceCategoryReferences),
}));

export type TFileReference = typeof fileReferences.$inferSelect;
export type TNewFileReference = typeof fileReferences.$inferInsert;

export const fileReferenceCategoryReferences = pgTable("file_reference_category_reference", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	referenciaArquivoId: varchar("referencia_arquivo_id", { length: 255 })
		.references(() => fileReferences.id, { onDelete: "cascade" })
		.notNull(),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	referenciaArquivoCategoriaId: varchar("referencia_arquivo_categoria_id", { length: 255 })
		.references(() => fileReferenceCategories.id)
		.notNull(),
});
export const fileReferenceCategoryReferencesRelations = relations(fileReferenceCategoryReferences, ({ one, many }) => ({
	referenciaArquivo: one(fileReferences, {
		fields: [fileReferenceCategoryReferences.referenciaArquivoId],
		references: [fileReferences.id],
	}),
	parceiro: one(partners, {
		fields: [fileReferenceCategoryReferences.parceiroId],
		references: [partners.id],
	}),
	categoria: one(fileReferenceCategories, {
		fields: [fileReferenceCategoryReferences.referenciaArquivoCategoriaId],
		references: [fileReferenceCategories.id],
	}),
}));

export type TFileReferenceCategoryReference = typeof fileReferenceCategoryReferences.$inferSelect;
export type TNewFileReferenceCategoryReference = typeof fileReferenceCategoryReferences.$inferInsert;

export const fileReferenceCategories = pgTable("file_reference_categories", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 }).references(() => partners.id),
	titulo: varchar("titulo", { length: 50 }).notNull(),
	coresPrimaria: varchar("cores_primaria", { length: 15 }).notNull(),
	coresSecundaria: varchar("cores_secundaria", { length: 15 }).notNull(),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const fileReferenceCategoriesRelations = relations(fileReferenceCategories, ({ one, many }) => ({
	referenciasCategorias: many(fileReferenceCategoryReferences),
}));
