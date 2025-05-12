import { integer, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "./common";
import { partners } from "./partners";
import { relations } from "drizzle-orm";

export const subscriptionStatusEnum = pgEnum("subscription_status", ["incomplete", "incomplete_expired", "trialing", "active", "past_due", "canceled", "unpaid", "paused"]);
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  status: subscriptionStatusEnum("subscription_status"),
  parceiroId: varchar("parceiro_id", { length: 255 }).references(() => partners.id),
  assinaturaStripeId: varchar("assinatura_stripe_id", { length: 255 }).notNull(),
  clienteStripeId: varchar("cliente_stripe_id", { length: 255 }).notNull(),
  clienteStripeEmail: varchar("cliente_stripe_email", { length: 255 }).notNull(),
  produtoStripeId: varchar("produto_stripe_id", { length: 255 }).notNull(),
  precoUnitario: integer("preco_unitario"),
  quantidade: integer("quantidade").default(1).notNull(),
  periodoInicio: timestamp("periodo_inicio").notNull(),
  periodoFim: timestamp("periodo_fim").notNull(),
  dataInicio: timestamp("data_inicio").notNull(),
});

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  partner: one(partners, {
    fields: [subscriptions.parceiroId],
    references: [partners.id],
  }),
}));

export type TNewSubscription = typeof subscriptions.$inferInsert;
export type TSubscription = typeof subscriptions.$inferSelect;
