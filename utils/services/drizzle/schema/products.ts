import { doublePrecision, index, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { productCategoryEnum, timeDurationUnitEnum } from "./enums";
import { partners } from "./partners";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const products = pgTable(
	"products",
	{
		id: varchar("id", { length: 255 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		parceiroId: varchar("parceiro_id", { length: 255 }).references(() => partners.id),
		categoria: productCategoryEnum("produto_categoria").notNull(),
		fabricante: varchar("fabricante", { length: 255 }).notNull(),
		modelo: varchar("modelo", { length: 255 }).notNull(),
		garantiaMedida: timeDurationUnitEnum("garantia_medida").notNull(),
		garantiaValor: doublePrecision("garantia_valor").notNull(),
		potencia: doublePrecision("potencia"),
		valor: doublePrecision("valor"),
		autorId: varchar("autor_id", { length: 255 })
			.references(() => users.id)
			.notNull(),
		dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
	},
	(table) => ({
		produtoCategoriaIndex: index("produto_categoria_idx").on(table.categoria),
	}),
);
export const productsRelations = relations(products, ({ one }) => ({
	parceiro: one(partners, {
		fields: [products.parceiroId],
		references: [partners.id],
	}),
	autor: one(users, {
		fields: [products.autorId],
		references: [users.id],
	}),
}));
