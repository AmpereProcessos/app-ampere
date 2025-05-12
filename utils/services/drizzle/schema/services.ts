import { doublePrecision, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { timeDurationUnitEnum } from "./enums";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const services = pgTable("services", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	titulo: text("titulo").notNull(),
	observacoes: text("observacoes"),
	garantiaMedida: timeDurationUnitEnum("garantia_medida").notNull(),
	garantiaValor: doublePrecision("garantia_valor").notNull(),
	valor: doublePrecision("valor"),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});

export const servicesRelations = relations(services, ({ one }) => ({
	parceiro: one(partners, {
		fields: [services.parceiroId],
		references: [partners.id],
	}),
	autor: one(users, {
		fields: [services.autorId],
		references: [users.id],
	}),
}));
