import { doublePrecision, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { users } from "./users";
import { services } from "./services";
import { relations } from "drizzle-orm";
import { pricingMethods } from "./pricing-methods";
import { physicalAssets } from "./assets";

export const kits = pgTable("kits", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	titulo: text("titulo").notNull(),
	preco: doublePrecision("preco").notNull(),
	metodologiaPrecificacaoId: varchar("metodologia_precificacao_id", {
		length: 255,
	})
		.references(() => pricingMethods.id)
		.notNull(),
	metadadosTiposEstruturasInstalacao: text("metadados_tipos_estruturas_instalacao"),
	metadadosPotenciaTotalModulos: doublePrecision("metadados_potencia_total_modulos"),
	metadadosPotenciaTotalInversores: doublePrecision("metadados_potencia_total_inversores"),
	metadadosTopologia: text("metadados_topologia"),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
	dataValidade: timestamp("data_validade"),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const kitsRelations = relations(kits, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [kits.parceiroId],
		references: [partners.id],
	}),
	autor: one(users, {
		fields: [kits.autorId],
		references: [users.id],
	}),
	metodologiaPrecificacao: one(pricingMethods, {
		fields: [kits.metodologiaPrecificacaoId],
		references: [pricingMethods.id],
	}),
	produtos: many(kitProducts),
	servicos: many(kitServices),
}));
export type TKit = typeof kits.$inferSelect;
export type TNewKit = typeof kits.$inferInsert;

export const kitProducts = pgTable("kit_products", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	kitId: varchar("kit_id", { length: 255 })
		.references(() => kits.id, { onDelete: "cascade" })
		.notNull(),
	produtoId: varchar("produto_id", { length: 255 })
		.references(() => physicalAssets.id)
		.notNull(),
	quantidade: doublePrecision("quantidade").notNull(),
});
export const kitProductsRelations = relations(kitProducts, ({ one }) => ({
	parceiro: one(partners, {
		fields: [kitProducts.parceiroId],
		references: [partners.id],
	}),
	kit: one(kits, {
		fields: [kitProducts.kitId],
		references: [kits.id],
	}),
	produto: one(physicalAssets, {
		fields: [kitProducts.produtoId],
		references: [physicalAssets.id],
	}),
}));
export type TKitProduct = typeof kitProducts.$inferSelect;
export type TNewKitProduct = typeof kitProducts.$inferInsert;

export const kitServices = pgTable("kit_services", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	kitId: varchar("kit_id", { length: 255 })
		.references(() => kits.id, { onDelete: "cascade" })
		.notNull(),
	servicoId: varchar("servico_id", { length: 255 })
		.references(() => services.id)
		.notNull(),
	quantidade: doublePrecision("quantidade").notNull(),
});
export const kitServicesRelations = relations(kitServices, ({ one }) => ({
	parceiro: one(partners, {
		fields: [kitServices.parceiroId],
		references: [partners.id],
	}),
	kit: one(kits, {
		fields: [kitServices.kitId],
		references: [kits.id],
	}),
	servico: one(services, {
		fields: [kitServices.servicoId],
		references: [services.id],
	}),
}));
export type TKitService = typeof kitServices.$inferSelect;
export type TNewKitService = typeof kitServices.$inferInsert;
