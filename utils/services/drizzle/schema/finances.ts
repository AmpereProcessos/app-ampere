import { type AnyPgColumn, doublePrecision, foreignKey, pgEnum, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { projects } from "./projects";
import { users } from "./users";
import { financialTransactionTypeEnum } from "./enums";
import { relations } from "drizzle-orm";

export const accountsCharts = pgTable(
	"accounts_charts",
	{
		id: varchar("id", { length: 255 })
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		parceiroId: varchar("parceiro_id", { length: 255 }),
		nome: varchar("nome", { length: 255 }).notNull(),
		idContaPai: varchar("id_conta_pai", { length: 255 }).references((): AnyPgColumn => accountsCharts.id),
		dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
	},
	(accountChart) => ({
		autoReferencia: foreignKey({ columns: [accountChart.idContaPai], foreignColumns: [accountChart.id] }),
	}),
);
export const accountsChartsRelations = relations(accountsCharts, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [accountsCharts.parceiroId],
		references: [partners.id],
	}),
	contaPai: one(accountsCharts, {
		fields: [accountsCharts.idContaPai],
		references: [accountsCharts.id],
		relationName: "conta-pai",
	}),
	subContas: many(accountsCharts, {
		relationName: "conta-pai",
	}),
	lancamentosContabeisDebito: many(accountingEntries),
	lancamentosContabeisCredito: many(accountingEntries),
}));
export type TAccountChart = typeof accountsCharts.$inferSelect;
export type TNewAccountChart = typeof accountsCharts.$inferInsert;

export const accountingEntries = pgTable("accounting_entries", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	projetoId: varchar("projeto_id", { length: 255 }).references(() => projects.id),
	titulo: text("titulo").notNull(),
	anotacoes: text("anotacoes").notNull(),
	idContaDebito: varchar("id_conta_debito", { length: 255 })
		.references(() => accountsCharts.id)
		.notNull(),
	idContaCredito: varchar("id_conta_credito", { length: 255 })
		.references(() => accountsCharts.id)
		.notNull(),
	valor: doublePrecision("total").notNull(),
	dataCompetencia: timestamp("data_competencia").notNull(),
	autorId: varchar("autor_id", { length: 255 }).references(() => users.id),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const accountingEntriesRelations = relations(accountingEntries, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [accountingEntries.parceiroId],
		references: [partners.id],
	}),
	projeto: one(projects, {
		fields: [accountingEntries.projetoId],
		references: [projects.id],
	}),
	autor: one(users, {
		fields: [accountingEntries.autorId],
		references: [users.id],
	}),
	contaDebito: one(accountsCharts, {
		fields: [accountingEntries.idContaDebito],
		references: [accountsCharts.id],
		relationName: "conta-debito",
	}),
	transacoesFinanceiras: many(financialTransactions),
	contaCredito: one(accountsCharts, {
		fields: [accountingEntries.idContaCredito],
		references: [accountsCharts.id],
		relationName: "conta-credito",
	}),
	composicao: many(accountingEntryCompositionItems),
}));
export type TAccountingEntry = typeof accountingEntries.$inferSelect;
export type TNewAccountingEntry = typeof accountingEntries.$inferInsert;

export const accountingEntryCompositionItems = pgTable("accounting_entry_composition_items", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	lancamentoContabilId: varchar("lancamento_contabil_id", { length: 255 })
		.references(() => accountingEntries.id, { onDelete: "cascade" })
		.notNull(),
	descricao: varchar("descricao", { length: 255 }).notNull(),
	unidade: varchar("unidade", { length: 25 }).notNull(),
	valor: doublePrecision("valor").notNull(),
	qtde: doublePrecision("qtde").notNull(),
});
export const accountingEntryCompositionItemsRelations = relations(accountingEntryCompositionItems, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [accountingEntryCompositionItems.parceiroId],
		references: [partners.id],
	}),
	lancamentoContabil: one(accountingEntries, {
		fields: [accountingEntryCompositionItems.lancamentoContabilId],
		references: [accountingEntries.id],
	}),
}));
export type TAccountingEntryCompositionItem = typeof accountingEntryCompositionItems.$inferSelect;
export type TNewAccountingEntryCompositionItem = typeof accountingEntryCompositionItems.$inferInsert;

export const financialTransactions = pgTable("financial_transactions", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	lancamentoContabilId: varchar("lancamento_contabil_id", { length: 255 })
		.references(() => accountingEntries.id, { onDelete: "cascade" })
		.notNull(),
	projetoId: varchar("projeto_id", { length: 255 }).references(() => projects.id),
	titulo: text("titulo").notNull(),
	tipo: financialTransactionTypeEnum("movimentacao_financeira_tipo").notNull(),
	valor: doublePrecision("valor").notNull(),
	metodo: varchar("metodo", { length: 255 }).notNull(),
	dataPrevisao: timestamp("data_previsao").notNull(),
	dataEfetivacao: timestamp("data_efetivacao"),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const financialTransactionsRelations = relations(financialTransactions, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [financialTransactions.parceiroId],
		references: [partners.id],
	}),
	lancamentoContabil: one(accountingEntries, {
		fields: [financialTransactions.lancamentoContabilId],
		references: [accountingEntries.id],
	}),
	projeto: one(projects, {
		fields: [financialTransactions.projetoId],
		references: [projects.id],
	}),
	autor: one(users, {
		fields: [financialTransactions.autorId],
		references: [users.id],
	}),
}));
export type TFinancialTransaction = typeof financialTransactions.$inferSelect;
export type TNewFinancialTransaction = typeof financialTransactions.$inferInsert;
