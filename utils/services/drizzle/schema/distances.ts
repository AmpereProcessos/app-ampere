import { doublePrecision, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "./common";

export const distances = pgTable("distances", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	origem: text("origem").notNull(),
	destino: text("destino").notNull(),
	distancia: doublePrecision("distancia").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
