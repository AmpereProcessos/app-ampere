import { text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { salesProposals } from "./sales-proposals";
import { sales } from "./sales";
import { projects } from "./projects";
import { purchases } from "./purchases";
import { homologations } from "./homologations";
import { serviceOrders } from "./service-orders";

export const kanbanBoards = pgTable("kanban_boards", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	nome: text("nome").notNull(),
	descricao: text("descricao"),
	aplicavelPropostasVenda: boolean("aplicavel_propostas_venda"),
	aplicavelVendas: boolean("aplicavel_vendas"),
	aplicavelProjetos: boolean("aplicavel_projetos"),
	aplicavelCompras: boolean("aplicavel_compras"),
	aplicavelHomologacoes: boolean("aplicavel_homologacoes"),
	aplicavelOrdensServico: boolean("aplicavel_ordens_servico"),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const kanbanBoardsRelations = relations(kanbanBoards, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [kanbanBoards.parceiroId],
		references: [partners.id],
	}),
	autor: one(users, {
		fields: [kanbanBoards.autorId],
		references: [users.id],
	}),
	estagios: many(kanbanBoardStages),
}));
export type TKanbanBoard = typeof kanbanBoards.$inferSelect;
export type TNewKanbanBoard = typeof kanbanBoards.$inferInsert;

export const kanbanBoardStages = pgTable("kanban_board_stages", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	quadroId: varchar("quadro_id", { length: 255 })
		.references(() => kanbanBoards.id)
		.notNull(),
	nome: text("nome").notNull(),
	ordem: integer("ordem").notNull(),
	estagioInicial: boolean("estagio_inicial").default(false).notNull(),
	estagioFinal: boolean("estagio_final").default(false).notNull(),
});
export const kanbanBoardStagesRelations = relations(kanbanBoardStages, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [kanbanBoardStages.parceiroId],
		references: [partners.id],
	}),
	quadro: one(kanbanBoards, {
		fields: [kanbanBoardStages.quadroId],
		references: [kanbanBoards.id],
	}),
}));

export const kanbanBoardItemConnections = pgTable("kanban_board_item_connections", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	quadroId: varchar("quadro_id", { length: 255 })
		.references(() => kanbanBoards.id)
		.notNull(),
	estagioId: varchar("estagio_id", { length: 255 })
		.references(() => kanbanBoardStages.id)
		.notNull(),
	propostaVendaId: varchar("proposta_venda_id", { length: 255 }).references(() => salesProposals.id, { onDelete: "cascade" }),
	vendaId: varchar("venda_id", { length: 255 }).references(() => sales.id),
	projetoId: varchar("projeto_id", { length: 255 }).references(() => projects.id),
	compraId: varchar("compra_id", { length: 255 }).references(() => purchases.id),
	homologacaoId: varchar("homologacao_id", { length: 255 }).references(() => homologations.id),
	ordemServicoId: varchar("ordem_servico_id", { length: 255 }).references(() => serviceOrders.id),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const kanbanBoardItemConnectionsRelations = relations(kanbanBoardItemConnections, ({ one }) => ({
	parceiro: one(partners, {
		fields: [kanbanBoardItemConnections.parceiroId],
		references: [partners.id],
	}),
	quadro: one(kanbanBoards, {
		fields: [kanbanBoardItemConnections.quadroId],
		references: [kanbanBoards.id],
	}),
	estagio: one(kanbanBoardStages, {
		fields: [kanbanBoardItemConnections.estagioId],
		references: [kanbanBoardStages.id],
	}),
	propostaVenda: one(salesProposals, {
		fields: [kanbanBoardItemConnections.propostaVendaId],
		references: [salesProposals.id],
	}),
	venda: one(sales, {
		fields: [kanbanBoardItemConnections.vendaId],
		references: [sales.id],
	}),
	projeto: one(projects, {
		fields: [kanbanBoardItemConnections.projetoId],
		references: [projects.id],
	}),
	compra: one(purchases, {
		fields: [kanbanBoardItemConnections.compraId],
		references: [purchases.id],
	}),
	homologacao: one(homologations, {
		fields: [kanbanBoardItemConnections.homologacaoId],
		references: [homologations.id],
	}),
	ordemServico: one(serviceOrders, {
		fields: [kanbanBoardItemConnections.ordemServicoId],
		references: [serviceOrders.id],
	}),
}));
