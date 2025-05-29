import { index, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { users } from "./users";
import { relations, sql } from "drizzle-orm";
import { projects } from "./projects";
import { fileReferences } from "./file-references";

export const legalSegment = pgEnum("segmento_juridico", ["PESSOA FÍSICA", "PESSOA JURÍDICA"]);

export const clients = pgTable(
	"clients",
	{
		id: varchar("id", { length: 255 })
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		parceiroId: varchar("parceiro_id", { length: 255 })
			.references(() => partners.id)
			.notNull(),
		nome: varchar("nome", { length: 255 }).notNull(),
		cpfCnpj: varchar("cpf_cnpj", { length: 255 }).notNull(),
		segmentoJuridico: legalSegment("segmento_juridico").notNull(),
		email: varchar("email", { length: 255 }).notNull(),
		telefonePrimario: varchar("telefone_primario", { length: 255 }).notNull(),
		telefoneSecundario: varchar("telefone_secundario", { length: 255 }),
		localizacaoCep: varchar("localizacao_cep", { length: 255 }),
		localizacaoUf: varchar("localizacao_uf", { length: 255 }),
		localizacaoCidade: varchar("localizacao_cidade", { length: 255 }),
		localizacaoBairro: varchar("localizacao_bairro", { length: 255 }),
		localizacaoLogradouro: varchar("localizacao_logradouro", { length: 255 }),
		localizacaoNumero: varchar("localizacao_numero", { length: 255 }),
		localizacaoComplemento: varchar("localizacao_complemento", { length: 255 }),
		localizacaoLatitude: varchar("localizacao_latitude", { length: 50 }),
		localizacaoLongitude: varchar("localizacao_longitude", { length: 50 }),
		dataNascimento: timestamp("dataNascimento"),
		profissao: varchar("profissao", { length: 50 }),
		ondeTrabalha: varchar("onde_trabalha", { length: 50 }),
		estadoCivil: varchar("estado_civil", { length: 50 }),
		deficiencia: varchar("deficiencia", { length: 50 }),
		canalAquisicao: varchar("canal_aquisicao", { length: 50 }),
		dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
		autorId: varchar("autor_id", { length: 255 })
			.references(() => users.id)
			.notNull(),
	},
	(table) => ({
		nomeSearchIndex: index("cliente_nome_search_index").using("gin", sql`to_tsvector('portuguese', ${table.nome})`),
		cpfCnpjIndex: index("cliente_cpf_cnpj_index").on(table.cpfCnpj),
		telefonePrimarioIndex: index("cliente_telefone_primario_index").on(table.telefonePrimario),
	}),
);
export const clientRelations = relations(clients, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [clients.parceiroId],
		references: [partners.id],
	}),
	autor: one(users, {
		fields: [clients.autorId],
		references: [users.id],
	}),
	projetos: many(projects),
	arquivos: many(fileReferences),
}));

export type TClient = typeof clients.$inferSelect;
export type TNewClient = typeof clients.$inferInsert;
