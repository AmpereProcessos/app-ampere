import { boolean, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { subscriptions } from "./subscriptions";

export const partners = pgTable("partners", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	ativo: boolean("ativo").default(true).notNull(),
	nome: varchar("nome", { length: 255 }).notNull(),
	apresentacaoTexto: text("apresentacao_texto"),
	cpfCnpj: varchar("cpf_cnpj", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }),
	telefone: varchar("telefone", { length: 255 }),
	logo_url: varchar("logo_url", { length: 255 }),
	clienteStripeId: varchar("cliente_stripe_id", { length: 255 }),
	localizacaoCep: varchar("localizacao_cep", { length: 255 }),
	localizacaoUf: varchar("localizacao_uf", { length: 255 }),
	localizacaoCidade: varchar("localizacao_cidade", { length: 255 }),
	localizacaoBairro: varchar("localizacao_bairro", { length: 255 }),
	localizacaoLogradouro: varchar("localizacao_logradouro", { length: 255 }),
	localizacaoNumero: varchar("localizacao_numero", { length: 255 }),
	localizacaoComplemento: varchar("localizacao_complemento", { length: 255 }),
	localizacaoLatitude: varchar("localizacao_latitude", { length: 255 }),
	localizacaoLongitude: varchar("localizacao_longitude", { length: 255 }),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
	dataAtualizacao: timestamp("data_atualizacao", { mode: "date" }).$onUpdate(() => new Date()),
});
export const partnerRelations = relations(partners, ({ one, many }) => ({
	usuarios: many(users),
	assinatura: one(subscriptions),
}));

export type TNewPartner = typeof partners.$inferInsert;
export type TPartner = typeof partners.$inferSelect;
