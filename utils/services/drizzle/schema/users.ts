import { boolean, index, pgEnum, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { pgTable } from './common'
import { relations } from 'drizzle-orm'
import { partners } from './partners'
import { certificationReferences } from './certifications'
import { permissionEnum } from './enums'
import { userGroups } from './user-groups'

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 21 }).primaryKey(),
    ativo: boolean('ativo').default(true).notNull(),
    nome: varchar('nome', { length: 255 }).notNull(),
    administrador: boolean('administrador').default(false),
    parceiroId: varchar('parceiro_id', { length: 255 })
      .references(() => partners.id)
      .notNull(),
    grupoUsuariosId: varchar('grupo_usuarios_id', { length: 255 }).references(() => userGroups.id),
    email: varchar('email', { length: 255 }).unique().notNull(),
    emailVerificado: boolean('email_verificado').default(false).notNull(),
    senha: varchar('senha', { length: 255 }),
    avatar: varchar('avatar', { length: 255 }),
    telefone: varchar('telefone', { length: 255 }),
    discordId: varchar('discord_id', { length: 255 }).unique(),
    googleId: varchar('google_id', { length: 255 }).unique(),
    googleRefreshToken: varchar('google_refresh_token', { length: 255 }),
    dataInsercao: timestamp('data_insercao').defaultNow().notNull(),
    dataAtualizacao: timestamp('data_atualizacao', { mode: 'date' }).$onUpdate(() => new Date()),
  },
  (t) => ({
    emailIdx: index('user_email_idx').on(t.email),
    discordIdx: index('user_discord_idx').on(t.discordId),
    googleIdx: index('user_google_idx').on(t.googleId),
  })
)
export const usersRelations = relations(users, ({ one, many }) => ({
  parceiro: one(partners, {
    fields: [users.parceiroId],
    references: [partners.id],
  }),
  grupoUsuarios: one(userGroups, {
    fields: [users.grupoUsuariosId],
    references: [userGroups.id],
  }),
  permissoes: many(userPermissions),
  certificacoes: many(certificationReferences, { relationName: 'certificacoes-usuarios' }),
}))

export type TUser = typeof users.$inferSelect
export type TNewUser = typeof users.$inferInsert

export const userPermissions = pgTable('user_permissions', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  usuarioId: varchar('usuario_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parceiroId: varchar('parceiro_id', { length: 255 })
    .notNull()
    .references(() => partners.id),
  tagPermissao: permissionEnum('tag_permissao').notNull(),
  acesso: boolean('acesso').notNull(),
  escopo: text('escopo'),
})
export const userPermissionsRelations = relations(userPermissions, ({ one }) => ({
  usuario: one(users, {
    fields: [userPermissions.usuarioId],
    references: [users.id],
  }),
}))

export type TNewUserPermission = typeof userPermissions.$inferInsert
export type TUserPermission = typeof userPermissions.$inferSelect

export const userInvites = pgTable('user_invites', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  parceiroId: varchar('parceiro_id', { length: 255 })
    .notNull()
    .references(() => partners.id),
  grupoUsuariosId: varchar('grupo_usuarios_id', { length: 255 })
    .notNull()
    .references(() => userGroups.id),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  autorId: varchar('autor_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  dataExpiracao: timestamp('data_expiracao'),
  dataEfetivacao: timestamp('data_efetivacao'),
  dataInsercao: timestamp('data_insercao').defaultNow().notNull(),
})
export const userInvitesRelations = relations(userInvites, ({ one }) => ({
  parceiro: one(partners, {
    fields: [userInvites.parceiroId],
    references: [partners.id],
  }),
  grupoUsuarios: one(userGroups, {
    fields: [userInvites.grupoUsuariosId],
    references: [userGroups.id],
  }),
  autor: one(users, {
    fields: [userInvites.autorId],
    references: [users.id],
  }),
}))
