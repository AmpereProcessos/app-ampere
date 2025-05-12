import { text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { pgTable } from './common'
import { partners } from './partners'
import { users } from './users'
import { relations } from 'drizzle-orm'
import { serviceOrders } from './service-orders'

export const calendars = pgTable('calendars', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  parceiroId: varchar('parceiro_id', { length: 255 })
    .references(() => partners.id)
    .notNull(),
  nome: text('nome').notNull(),
  descricao: text('descricao'),
  googleCalendarId: varchar('google_calendar_id', { length: 255 }).notNull(),
  googleRefreshToken: varchar('google_refresh_token', { length: 255 }).notNull(),
  autorId: varchar('autor_id', { length: 255 })
    .references(() => users.id)
    .notNull(),
  dataInsercao: timestamp('data_insercao').notNull().defaultNow(),
})

export const calendarsRelations = relations(calendars, ({ one, many }) => ({
  parceiro: one(partners, {
    fields: [calendars.parceiroId],
    references: [partners.id],
  }),
  autor: one(users, {
    fields: [calendars.autorId],
    references: [users.id],
  }),
  ordensServico: many(serviceOrders),
}))

export type TCalendar = typeof calendars.$inferSelect
export type TNewCalendar = typeof calendars.$inferInsert
