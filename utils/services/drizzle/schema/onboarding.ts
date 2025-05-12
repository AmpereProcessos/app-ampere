import { integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";

export const onboardingSetup = pgTable("onboarding_setup", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  usuarioNome: varchar("usuario_nome", { length: 255 }).notNull(),
  usuarioEmail: varchar("usuario_email", { length: 255 }).unique().notNull(),
  usuarioTelefone: varchar("usuario_telefone", { length: 255 }).notNull(),
  usuarioAvatar: varchar("usuario_avatar", { length: 255 }),
  usuarioGoogleId: varchar("usuario_google_id", { length: 255 }).unique(),
  usuarioGoogleRefreshToken: varchar("usuario_google_refresh_token", { length: 255 }),
  parceiroNome: varchar("parceiro_nome", { length: 255 }).notNull(),
  parceiroCpfCnpj: varchar("parceiro_cpf_cnpj", { length: 255 }).notNull(),
  parceiroEmail: varchar("parceiro_email", { length: 255 }).notNull(),
  parceiroCep: varchar("parceiro_cep", { length: 255 }).notNull(),
  parceiroUf: varchar("parceiro_uf", { length: 255 }).notNull(),
  parceiroCidade: varchar("parceiro_cidade", { length: 255 }).notNull(),
  parceiroBairro: varchar("parceiro_bairro", { length: 255 }).notNull(),
  parceiroLogradouro: varchar("parceiro_logradouro", { length: 255 }).notNull(),
  parceiroNumero: varchar("parceiro_numero", { length: 255 }).notNull(),
  parceiroClienteStripeId: varchar("parceiro_cliente_stripe_id", { length: 255 }),
  numeroUsuarios: integer("numero_usuarios").notNull(),
  estagioInformacoesUsuario: timestamp("estagio_informacoes_usuario"),
  estagioInformacoesEmpresa: timestamp("estagio_informacoes_empresa"),
  estagioInformacoesAssinatura: timestamp("estagio_informacoes_assinatura"),
  dataConclusao: timestamp("data_conclusao"),
});

export type TOnboardingSetup = typeof onboardingSetup.$inferSelect;
export type TNewOnboardingSetup = typeof onboardingSetup.$inferInsert;
