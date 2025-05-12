import { timestamp, text, varchar, pgEnum, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { users } from "./users";
import { pricingMethodItemResultConditionTypeEnum } from "./enums";
import { relations } from "drizzle-orm";

export const pricingMethods = pgTable("pricing_methods", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	nome: varchar("nome", { length: 255 }).notNull(),
	descricao: text("descricao"),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const pricingMethodRelations = relations(pricingMethods, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [pricingMethods.parceiroId],
		references: [partners.id],
	}),
	autor: one(users, {
		fields: [pricingMethods.autorId],
		references: [users.id],
	}),
	itens: many(pricingMethodItems),
}));
export type TPricingMethod = typeof pricingMethods.$inferSelect;
export type TNewPricingMethod = typeof pricingMethods.$inferInsert;

export const pricingMethodItems = pgTable("pricing_method_items", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	metodologiaPreficicacaoId: varchar("metodologia_preficicacao_id", { length: 255 }).references(() => pricingMethods.id, { onDelete: "cascade" }),
	nome: varchar("nome", { length: 255 }).notNull(),
});
export const pricingMethodItemRelations = relations(pricingMethodItems, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [pricingMethodItems.parceiroId],
		references: [partners.id],
	}),
	metodologiaPreficicacao: one(pricingMethods, {
		fields: [pricingMethodItems.metodologiaPreficicacaoId],
		references: [pricingMethods.id],
	}),
	resultados: many(pricingMethodItemResults),
}));
export type TPricingMethodItem = typeof pricingMethodItems.$inferSelect;
export type TNewPricingMethodItem = typeof pricingMethodItems.$inferInsert;

export const pricingMethodItemResults = pgTable("pricing_method_item_results", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	metodologiaPreficicacaoItemId: varchar("metodologia_preficicacao_item_id", { length: 255 }).references(() => pricingMethodItems.id, {
		onDelete: "cascade",
	}),
	formula: text("formula").notNull(),
	margemLucro: doublePrecision("margem_lucro").notNull(),
	faturavel: boolean("faturavel").notNull(),
	valorMinimo: doublePrecision("valor_minimo"),
	valorMaximo: doublePrecision("valor_maximo"),
	revisaoTecnicaHabilitada: boolean("revisao_tecnica_habilitada"),
	condicaoAplicavel: boolean("condicao_aplicavel").notNull(),
	condicaoTipo: pricingMethodItemResultConditionTypeEnum("condicao_tipo"),
	condicaoVariavel: varchar("condicao_variavel", { length: 255 }),
	condicaoIgual: varchar("condicao_igual", { length: 255 }),
	condicaoMaiorQue: doublePrecision("condicao_maior_que"),
	condicaoMenorQue: doublePrecision("condicao_menor_que"),
	condicaoIntervaloMinimo: doublePrecision("condicao_intervalo_minimo"),
	condicaoIntervaloMaximo: doublePrecision("condicao_intervalo_maximo"),
	condicaoIncluiLista: varchar("condicao_inclui_lista", { length: 255 }), // delimitered by (//)
});
export const pricingMethodItemResultRelations = relations(pricingMethodItemResults, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [pricingMethodItemResults.parceiroId],
		references: [partners.id],
	}),
	metodologiaPreficicacaoItem: one(pricingMethodItems, {
		fields: [pricingMethodItemResults.metodologiaPreficicacaoItemId],
		references: [pricingMethodItems.id],
	}),
}));
export type TPricingMethodItemResult = typeof pricingMethodItemResults.$inferSelect;
export type TNewPricingMethodItemResult = typeof pricingMethodItemResults.$inferInsert;
