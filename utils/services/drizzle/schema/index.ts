export * from "./common";
export * from "./partners";
export * from "./subscriptions";
export * from "./invoices";
export * from "./users";
export * from "./auth";
export * from "./onboarding";
export * from "./clients";
export * from "./projects";
export * from "./file-references";
export * from "./activities";
export * from "./purchases";
export * from "./homologations";
export * from "./service-orders";
export * from "./sales-proposals";
export * from "./sales";
export * from "./finances";
export * from "./certifications";
export * from "./assets";
export * from "./calendars";
export * from "./user-groups";
export * from "./enums";
export * from "./project-journey-types";
export * from "./pricing-methods";
export * from "./technical-analysis";
export * from "./products";
export * from "./services";
export * from "./kits";
export * from "./kanban-boards";
export * from "./distances";
// import { relations, sql } from "drizzle-orm";
// import { pgTableCreator, serial, boolean, index, text, timestamp, varchar, integer, pgEnum } from "drizzle-orm/pg-core";
// import { DATABASE_PREFIX as prefix } from "@/lib/constants";

// export const pgTable = pgTableCreator((name) => `${prefix}_${name}`);

// export const partner = pgTable("partners", {
//   id: varchar("id", { length: 255 })
//     .notNull()
//     .primaryKey()
//     .$defaultFn(() => crypto.randomUUID()),
//   ativo: boolean("ativo").default(true).notNull(),
//   nome: varchar("nome", { length: 255 }).notNull(),
//   cpfCnpj: varchar("cpf_cnpj", { length: 255 }).notNull(),
//   email: varchar("email", { length: 255 }),
//   logo_url: varchar("logo_url", { length: 255 }),
//   clienteStripeId: varchar("cliente_stripe_id", { length: 255 }),
//   localizacaoCep: varchar("localizacao_cep", { length: 255 }),
//   localizacaoUf: varchar("localizacao_uf", { length: 255 }),
//   localizacaoCidade: varchar("localizacao_cidade", { length: 255 }),
//   localizacaoBairro: varchar("localizacao_bairro", { length: 255 }),
//   localizacaoLogradouro: varchar("localizacao_logradouro", { length: 255 }),
//   localizacaoNumero: varchar("localizacao_numero", { length: 255 }),
//   localizacaoComplemento: varchar("localizacao_complemento", { length: 255 }),
//   localizacaoLatitude: varchar("localizacao_latitude", { length: 255 }),
//   localizacaoLongitude: varchar("localizacao_longitude", { length: 255 }),
//   dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
//   dataAtualizacao: timestamp("data_atualizacao", { mode: "date" }).$onUpdate(() => new Date()),
// });
// export const partnerRelations = relations(partner, ({ many }) => ({
//   users: many(users),
// }));
// export type TNewPartner = typeof partner.$inferInsert;
// export type TPartner = typeof partner.$inferSelect;

// export const subscriptionStatusEnum = pgEnum("subscription_status", ["incomplete", "incomplete_expired", "trialing", "active", "past_due", "canceled", "unpaid", "paused"]);
// export const subscriptions = pgTable("subscription", {
//   id: varchar("id", { length: 255 })
//     .notNull()
//     .primaryKey()
//     .$defaultFn(() => crypto.randomUUID()),
//   status: subscriptionStatusEnum("subscription_status"),
//   parceiroId: varchar("parceiro_id", { length: 255 }).references(() => partner.id),
//   assinaturaStripeId: varchar("id_assinatura_stripe", { length: 255 }).notNull(),
//   clienteStripeId: varchar("cliente_stripe_id", { length: 255 }).notNull(),
//   clienteStripeEmail: varchar("cliente_stripe_email", { length: 255 }).notNull(),
//   produtoStripeId: varchar("produto_stripe_id", { length: 255 }).notNull(),
//   precoUnitario: integer("preco_unitario"),
//   quantidade: integer("quantidade").default(1),
//   periodoInicio: timestamp("periodo_inicio").notNull(),
//   periodoFim: timestamp("periodo_fim").notNull(),
//   dataInsercao: timestamp("data_insercao").notNull(),
// });

// export const users = pgTable(
//   "users",
//   {
//     id: varchar("id", { length: 21 }).primaryKey(),
//     nome: varchar("nome", { length: 255 }).notNull(),
//     parceiroId: varchar("parceiro_id", { length: 255 }).references(() => partner.id),
//     email: varchar("email", { length: 255 }).unique().notNull(),
//     emailVerificado: boolean("email_verificado").default(false).notNull(),
//     senha: varchar("senha", { length: 255 }),
//     discordId: varchar("discord_id", { length: 255 }).unique(),
//     googleId: varchar("google_id", { length: 255 }).unique(),
//     googleRefreshToken: varchar("google_refresh_token", { length: 255 }),
//     avatar: varchar("avatar", { length: 255 }),
//     dataInsercao: timestamp("data_insercao").defaultNow().notNull(),
//     dataAtualizacao: timestamp("data_atualizacao", { mode: "date" }).$onUpdate(() => new Date()),
//   },
//   (t) => ({
//     emailIdx: index("user_email_idx").on(t.email),
//     discordIdx: index("user_discord_idx").on(t.discordId),
//     googleIdx: index("user_google_idx").on(t.googleId),
//   }),
// );
// export const usersRelations = relations(users, ({ one }) => ({
//   parceiro: one(partner),
// }));

// export type User = typeof users.$inferSelect;
// export type TNewUser = typeof users.$inferInsert;

// export const sessions = pgTable(
//   "sessions",
//   {
//     id: varchar("id", { length: 255 }).primaryKey(),
//     userId: varchar("user_id", { length: 21 }).notNull(),
//     expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
//   },
//   (t) => ({
//     userIdx: index("session_user_idx").on(t.userId),
//   }),
// );

// export const emailVerificationCodes = pgTable(
//   "email_verification_codes",
//   {
//     id: serial("id").primaryKey(),
//     userId: varchar("user_id", { length: 21 }).unique().notNull(),
//     email: varchar("email", { length: 255 }).notNull(),
//     code: varchar("code", { length: 8 }).notNull(),
//     expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
//   },
//   (t) => ({
//     userIdx: index("verification_code_user_idx").on(t.userId),
//     emailIdx: index("verification_code_email_idx").on(t.email),
//   }),
// );

// export const passwordResetTokens = pgTable(
//   "password_reset_tokens",
//   {
//     id: varchar("id", { length: 40 }).primaryKey(),
//     userId: varchar("user_id", { length: 21 }).notNull(),
//     expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
//   },
//   (t) => ({
//     userIdx: index("password_token_user_idx").on(t.userId),
//   }),
// );

// export const posts = pgTable(
//   "posts",
//   {
//     id: varchar("id", { length: 15 }).primaryKey(),
//     userId: varchar("user_id", { length: 255 }).notNull(),
//     title: varchar("title", { length: 255 }).notNull(),
//     excerpt: varchar("excerpt", { length: 255 }).notNull(),
//     content: text("content").notNull(),
//     status: varchar("status", { length: 10, enum: ["draft", "published"] })
//       .default("draft")
//       .notNull(),
//     tags: varchar("tags", { length: 255 }),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
//   },
//   (t) => ({
//     userIdx: index("post_user_idx").on(t.userId),
//     createdAtIdx: index("post_created_at_idx").on(t.createdAt),
//   }),
// );

// export const postRelations = relations(posts, ({ one }) => ({
//   user: one(users, {
//     fields: [posts.userId],
//     references: [users.id],
//   }),
// }));

// export const onboardingSetup = pgTable("onboarding_setup", {
//   id: varchar("id", { length: 255 })
//     .notNull()
//     .primaryKey()
//     .$defaultFn(() => crypto.randomUUID()),
//   usuarioNome: varchar("usuario_nome", { length: 255 }).notNull(),
//   usuarioEmail: varchar("usuario_email", { length: 255 }).unique().notNull(),
//   usuarioTelefone: varchar("usuario_telefone", { length: 255 }).notNull(),
//   usuarioAvatar: varchar("usuario_avatar", { length: 255 }),
//   usuarioGoogleId: varchar("usuario_google_id", { length: 255 }).unique(),
//   usuarioGoogleRefreshToken: varchar("usuario_google_refresh_token", { length: 255 }),
//   parceiroNome: varchar("parceiro_nome", { length: 255 }).notNull(),
//   parceiroCpfCnpj: varchar("parceiro_cpf_cnpj", { length: 255 }).notNull(),
//   parceiroEmail: varchar("parceiro_email", { length: 255 }).notNull(),
//   parceiroCep: varchar("parceiro_cep", { length: 255 }).notNull(),
//   parceiroUf: varchar("parceiro_uf", { length: 255 }).notNull(),
//   parceiroCidade: varchar("parceiro_cidade", { length: 255 }).notNull(),
//   parceiroBairro: varchar("parceiro_bairro", { length: 255 }).notNull(),
//   parceiroLogradouro: varchar("parceiro_logradouro", { length: 255 }).notNull(),
//   parceiroNumero: varchar("parceiro_numero", { length: 255 }).notNull(),
//   parceiroClienteStripeId: varchar("parceiro_cliente_stripe_id", { length: 255 }),
//   numeroUsuarios: integer("numero_usuarios").notNull(),
//   estagioInformacoesUsuario: timestamp("estagio_informacoes_usuario"),
//   estagioInformacoesEmpresa: timestamp("estagio_informacoes_empresa"),
//   estagioInformacoesAssinatura: timestamp("estagio_informacoes_assinatura"),
//   dataConclusao: timestamp("data_conclusao"),
// });

// export type TOnboardingSetup = typeof onboardingSetup.$inferSelect;
// export type TNewOnboardingSetup = typeof onboardingSetup.$inferInsert;

// export type Post = typeof posts.$inferSelect;
// export type NewPost = typeof posts.$inferInsert;
