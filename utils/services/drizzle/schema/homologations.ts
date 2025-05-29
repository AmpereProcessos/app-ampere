import { doublePrecision, pgEnum, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { projects } from "./projects";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { fileReferences } from "./file-references";
import { activities } from "./activities";
import { physicalAssets } from "./assets";

export const homologationStatusEnum = pgEnum("homologacao_status", [
	"PENDENTE",
	"ELABORANDO DOCUMENTAÇÕES",
	"AGUARDANDO ASSINATURA",
	"AGUARDANDO FATURAMENTO",
	"AGUARDANDO PENDÊNCIAS",
	"AGUARDANDO RESPOSTA",
	"CONCLUÍDA",
	"CANCELADO",
	"SUSPENSO",
]);
export const homologationInstallationGroupEnum = pgEnum("homologacao_instalacao_grupo", ["A1", "A2", "A3", "A4", "AS", "B1", "B2", "B3", "B4"]);

export const homologations = pgTable("homologations", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	projetoId: varchar("projeto_id", { length: 255 }).references(() => projects.id),
	status: homologationStatusEnum("homologacao_status").notNull(),
	potencia: doublePrecision("potencia"),
	observacoes: text("observacoes"),
	instalacaoDistribuidora: varchar("instalacao_distribuidora", { length: 255 }),
	instalacaoTitularNome: varchar("instalacao_titular_nome", { length: 255 }).notNull(),
	instalacaoTitularIdentificador: varchar("instalacao_titular_identificador", { length: 255 }).notNull(),
	instalacaoTitularContato: varchar("instalacao_titular_contato", { length: 255 }).notNull(),
	instalacaoTitularEmail: varchar("instalacao_titular_email", { length: 255 }).notNull(),
	// equipamentos arr
	//   instalacaoLocalizacaoCep: varchar("instalacao_localizacao_cep", { length: 255 }),
	//   instalacaoLocalizacaoUf: varchar("instalacao_localizacao_uf", { length: 255 }),
	//   instalacaoLocalizacaoCidade: varchar("instalacao_localizacao_cidade", { length: 255 }),
	//   instalacaoLocalizacaoBairro: varchar("instalacao_localizacao_bairro", { length: 255 }),
	//   instalacaoLocalizacaoLogradouro: varchar("instalacao_localizacao_logradouro", { length: 255 }),
	//   instalacaoLocalizacaoNumero: varchar("instalacao_localizacao_numero", { length: 255 }),
	//   instalacaoLocalizacaoComplemento: varchar("instalacao_localizacao_complemento", { length: 255 }),
	//   instalacaoLocalizacaoLatitude: varchar("instalacao_localizacao_latitude", { length: 255 }),
	//   instalacaoLocalizacaoLongitude: varchar("instalacao_localizacao_longitude", { length: 255 }),
	instalacaoNumeroInstalacao: varchar("instalacao_numero_instalacao", { length: 255 }),
	instalacaoNumeroCliente: varchar("instalacao_numero_cliente", { length: 255 }),
	instalacaoGrupo: homologationInstallationGroupEnum("homologacao_instalacao_grupo"),
	documentacaoFormaAssinatura: varchar("contrato_forma_assinatura", { length: 255 }),
	documentacaoDataInicioElaboracao: timestamp("documentacao_data_inicio_elaboracao"),
	documentacaoDataConclusaoElaboracao: timestamp("documentacao_data_conclusao_elaboracao"),
	documentacaoDataLiberacao: timestamp("documentacao_data_liberacao"),
	documentacaoDataAssinatura: timestamp("documentacao_data_assinatura"),
	acessoCodigo: varchar("acesso_codigo", { length: 255 }),
	acessoDataSolicitacao: timestamp("acesso_data_solicitacao"),
	acessoDataResposta: timestamp("acesso_data_resposta"),
	// atualizacoes arr
	vistoriaDataSolicitacao: timestamp("vistoria_data_solicitacao"),
	vistoriaDataEfetivacao: timestamp("vistoria_data_efetivacao"),
	dataEfetivacao: timestamp("data_efetivacao"),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
});

export const homologationRelations = relations(homologations, ({ one, many }) => ({
	parceiro: one(partners, {
		fields: [homologations.parceiroId],
		references: [partners.id],
	}),
	projeto: one(projects, {
		fields: [homologations.projetoId],
		references: [projects.id],
	}),
	equipamentos: many(homologationEquipments),
	atualizacoes: many(homologationUpdates),
	arquivos: many(fileReferences),
	atividades: many(activities),
	autor: one(users, {
		fields: [homologations.autorId],
		references: [users.id],
	}),
}));

export type THomologation = typeof homologations.$inferSelect;
export type TNewHomologation = typeof homologations.$inferInsert;

/**
 *
 * HOMOLOGATION  EQUIPMENTS
 *
 */
export const homologationEquipmentCategoryEnum = pgEnum("homologacao_equipamento_categoria", ["MÓDULO", "INVERSOR"]);
export const homologationEquipments = pgTable("homologation_equipments", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	homologacaoId: varchar("homologacao_id", { length: 255 })
		.references(() => homologations.id, { onDelete: "cascade" })
		.notNull(),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	produtoId: varchar("produto_id", { length: 255 })
		.references(() => physicalAssets.id)
		.notNull(),
	quantidade: doublePrecision("quantidade").notNull(),
	dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
});
export const homologationEquipmentsRelations = relations(homologationEquipments, ({ one }) => ({
	parceiro: one(partners, {
		fields: [homologationEquipments.parceiroId],
		references: [partners.id],
	}),
	homologacao: one(homologations, {
		fields: [homologationEquipments.homologacaoId],
		references: [homologations.id],
	}),
	produto: one(physicalAssets, {
		fields: [homologationEquipments.produtoId],
		references: [physicalAssets.id],
	}),
}));
export type THomologationEquipment = typeof homologationEquipments.$inferSelect;
export type TNewHomologationEquipment = typeof homologationEquipments.$inferInsert;

/**
 *
 * HOMOLOGATION  UPDATES
 *
 */
export const homologationUpdates = pgTable("homologation_updates", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	homologacaoId: varchar("homologacao_id", { length: 255 })
		.references(() => homologations.id, { onDelete: "cascade" })
		.notNull(),
	parceiroId: varchar("parceiro_id", { length: 255 })
		.references(() => partners.id)
		.notNull(),
	descricao: text("descricao").notNull(),
	autorId: varchar("autor_id", { length: 255 })
		.references(() => users.id)
		.notNull(),
	data: timestamp("data").defaultNow().notNull(),
});
export const homologationUpdatesRelations = relations(homologationUpdates, ({ one }) => ({
	parceiro: one(partners, {
		fields: [homologationUpdates.parceiroId],
		references: [partners.id],
	}),
	homologacao: one(homologations, {
		fields: [homologationUpdates.homologacaoId],
		references: [homologations.id],
	}),
	autor: one(users, {
		fields: [homologationUpdates.autorId],
		references: [users.id],
	}),
}));
export type THomologationUpdate = typeof homologationUpdates.$inferSelect;
export type TNewHomologationUpdate = typeof homologationUpdates.$inferInsert;
