import { pgEnum, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { projects } from "./projects";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { fileReferences } from "./file-references";
import { purchases } from "./purchases";
import { homologations } from "./homologations";
import { sales } from "./sales";
import { technicalAnalysis } from "./technical-analysis";

export const activityStatusEnum = pgEnum("atividade_status", ["PENDENTE", "EM ANDAMENTO", "CONCLUÍDO"]);

export const activities = pgTable("activities", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	vendaId: varchar("venda_id", { length: 255 }).references(() => sales.id),
	projetoId: varchar("projeto_id", { length: 255 }).references(() => projects.id),
	compraId: varchar("compra_id", { length: 255 }).references(() => purchases.id),
	homologacaoId: varchar("homologacao_id", { length: 255 }).references(() => homologations.id),
	analiseTecnicaId: varchar("analise_tecnica_id", { length: 255 }).references(() => technicalAnalysis.id),
	status: activityStatusEnum("atividade_status").default("PENDENTE").notNull(),
	titulo: varchar("titulo", { length: 255 }).notNull(),
	descricao: text("descricao").notNull(),
	dataVencimento: timestamp("data_vencimento"),
	dataInicio: timestamp("data_inicio"),
	dataConclusao: timestamp("data_conclusao"),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
});
export const activityRelations = relations(activities, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [activities.parceiroId],
		references: [partners.id],
	}),
	venda: one(sales, {
		fields: [activities.vendaId],
		references: [sales.id],
	}),
	projeto: one(projects, {
		fields: [activities.projetoId],
		references: [projects.id],
	}),
	compra: one(purchases, {
		fields: [activities.compraId],
		references: [purchases.id],
	}),
	homologacao: one(homologations, {
		fields: [activities.homologacaoId],
		references: [homologations.id],
	}),
	analiseTecnica: one(technicalAnalysis, {
		fields: [activities.analiseTecnicaId],
		references: [technicalAnalysis.id],
	}),
	autor: one(users, {
		fields: [activities.autorId],
		references: [users.id],
	}),
	responsaveis: many(activityResponsibles),
	arquivos: many(fileReferences),
}));

export type TActivity = typeof activities.$inferSelect;
export type TNewActivity = typeof activities.$inferInsert;

export const activityResponsibles = pgTable("activity_responsibles", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	atividadeId: varchar("atividade_id", { length: 255 })
		.references(() => activities.id, { onDelete: "cascade" })
		.notNull(),
	usuarioId: varchar("usuario_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const activityResponsibleRelations = relations(activityResponsibles, ({ one }) => ({
	parceiro: one(partners, {
		fields: [activityResponsibles.parceiroId],
		references: [partners.id],
	}),
	atividade: one(activities, {
		fields: [activityResponsibles.atividadeId],
		references: [activities.id],
	}),
	usuario: one(users, {
		fields: [activityResponsibles.usuarioId],
		references: [users.id],
	}),
}));
export type TActivityResponsible = typeof activityResponsibles.$inferSelect;
export type TNewActivityResponsible = typeof activityResponsibles.$inferInsert;
