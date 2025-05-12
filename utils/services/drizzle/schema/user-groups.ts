import { boolean, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { pgTable } from './common'
import { partners } from './partners'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { permissionEnum } from './enums'

export const userGroups = pgTable('user_groups', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  parceiroId: varchar('parceiro_id', { length: 255 }).references(() => partners.id),
  nome: varchar('nome', { length: 255 }).notNull(),
  descricao: text('descricao'),
  dataInsercao: timestamp('data_insercao').defaultNow().notNull(),
})
export const userGroupsRelations = relations(userGroups, ({ many }) => ({
  usuarios: many(users),
  permissoes: many(userGroupPermissions),
}))
export type TUserGroup = typeof userGroups.$inferSelect
export type TNewUserGroup = typeof userGroups.$inferInsert

export const userGroupPermissions = pgTable('user_group_permissions', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  parceiroId: varchar('parceiro_id', { length: 255 }).references(() => partners.id),
  grupoUsuariosId: varchar('grupo_usuarios_id', { length: 255 })
    .notNull()
    .references(() => userGroups.id, { onDelete: 'cascade' }),
  tagPermissao: permissionEnum('tag_permissao').notNull(),
  acesso: boolean('acesso').notNull(),
  escopo: text('escopo'),
})
export const userGroupPermissionsRelations = relations(userGroupPermissions, ({ one }) => ({
  grupoUsuarios: one(userGroups, {
    fields: [userGroupPermissions.grupoUsuariosId],
    references: [userGroups.id],
  }),
}))
export type TUserGroupPermission = typeof userGroupPermissions.$inferSelect
export type TNewUserGroupPermission = typeof userGroupPermissions.$inferInsert
