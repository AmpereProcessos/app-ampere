import { doublePrecision, pgEnum, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { pgTable } from './common'
import { partners } from './partners'
import { users } from './users'
import { relations } from 'drizzle-orm'
import { physicalAssets } from './assets'
import { timeDurationUnitEnum, certificationReferenceTypeEnum } from './enums'

export const certifications = pgTable('certifications', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  parceiroId: varchar('parceiro_id', { length: 255 })
    .references(() => partners.id)
    .notNull(),
  titulo: text('titulo').notNull(),
  descricao: text('descricao'),
  duracaoPrevistaMedida: timeDurationUnitEnum('duracao_prevista_unidade').notNull(),
  duracaoPrevistaValor: doublePrecision('duracao_prevista_valor').notNull(),
  fornecedorNome: varchar('fornecedor_nome', { length: 255 }),
  fornecedorContato: varchar('fornecedor_contato', { length: 255 }),
  autorId: varchar('autor_id', { length: 255 })
    .references(() => users.id)
    .notNull(),
  dataInsercao: timestamp('data_insercao').defaultNow().notNull(),
})
export const certificationsRelations = relations(certifications, ({ one, many }) => ({
  parceiro: one(partners, {
    fields: [certifications.parceiroId],
    references: [partners.id],
  }),
  autor: one(users, {
    fields: [certifications.autorId],
    references: [users.id],
  }),
  referenciasCertificacoes: many(certificationReferences),
}))

export const certificationReferences = pgTable('certification_references', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  parceiroId: varchar('parceiro_id', { length: 255 })
    .references(() => partners.id)
    .notNull(),
  certificacaoId: varchar('certificacao_id', { length: 255 })
    .references(() => certifications.id)
    .notNull(),
  tipo: certificationReferenceTypeEnum('tipo').notNull(),
  ativoFisicoId: varchar('ativo_fisico_id', { length: 255 }).references(() => physicalAssets.id),
  usuarioId: varchar('usuario_id', { length: 255 }).references(() => users.id),
  anotacoes: text('anotacoes'),
  dataInicio: timestamp('data_inicio').notNull(),
  dataFim: timestamp('data_fim').notNull(),
  autorId: varchar('autor_id', { length: 255 })
    .references(() => users.id)
    .notNull(),
  dataInsercao: timestamp('data_insercao').defaultNow().notNull(),
})
export const certificationReferencesRelations = relations(certificationReferences, ({ one, many }) => ({
  parceiro: one(partners, {
    fields: [certificationReferences.parceiroId],
    references: [partners.id],
  }),
  certificacao: one(certifications, {
    fields: [certificationReferences.certificacaoId],
    references: [certifications.id],
  }),
  ativoFisico: one(physicalAssets, {
    fields: [certificationReferences.ativoFisicoId],
    references: [physicalAssets.id],
  }),
  usuario: one(users, {
    fields: [certificationReferences.usuarioId],
    references: [users.id],
    relationName: 'certificacoes-usuarios',
  }),
  autor: one(users, {
    fields: [certificationReferences.autorId],
    references: [users.id],
    relationName: 'autor',
  }),
}))
