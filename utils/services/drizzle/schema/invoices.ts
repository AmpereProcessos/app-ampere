import { integer, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";

export const invoicesStatusEnum = pgEnum("invoices_status", ["succeeded", "failed"]);
export const invoices = pgTable("invoices", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  status: invoicesStatusEnum("invoices_status"),
  parceiroId: varchar("parceiro_id", { length: 255 }).references(() => partners.id),
  faturaStripeId: varchar("fatura_stripe_id", { length: 255 }).notNull(),
  assinaturaStripeId: varchar("assinatura_stripe_id", { length: 255 }).notNull(),
  clienteStripeId: varchar("cliente_stripe_id", { length: 255 }).notNull(),
  clienteStripeEmail: varchar("cliente_stripe_email", { length: 255 }).notNull(),
  valorPago: integer("valor_pago"),
  valorDevido: integer("valor_devido"),
  moeda: varchar("moeda", { length: 255 }).notNull(),
  periodoInicio: timestamp("periodo_inicio").notNull(),
  periodoFim: timestamp("periodo_fim").notNull(),
  dataCriacao: timestamp("data_criacao").notNull(),
  dataPagamento: timestamp("data_pagamento"),
});

export type TNewInvoice = typeof invoices.$inferInsert;
export type TInvoice = typeof invoices.$inferSelect;
