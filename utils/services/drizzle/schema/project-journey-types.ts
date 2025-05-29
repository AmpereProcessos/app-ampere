import { doublePrecision, integer, pgEnum, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { pgTable } from './common'
import { partners } from './partners'
import { users } from './users'
import { relations } from 'drizzle-orm'
import { timeDurationUnitEnum } from './enums'

export const projectJourneyTypes = pgTable('project_journey_types', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  parceiroId: varchar('parceiro_id', { length: 255 })
    .references(() => partners.id)
    .notNull(),
  titulo: text('titulo').notNull(),
  descricao: text('descricao').notNull(),
  autorId: varchar('autor_id', { length: 255 })
    .references(() => users.id)
    .notNull(),
  dataInsercao: timestamp('data_insercao').defaultNow().notNull(),
})
export const projectJourneyTypesRelations = relations(projectJourneyTypes, ({ one, many }) => ({
  parceiro: one(partners, {
    fields: [projectJourneyTypes.parceiroId],
    references: [partners.id],
  }),
  autor: one(users, {
    fields: [projectJourneyTypes.autorId],
    references: [users.id],
  }),
  etapas: many(projectJourneyTypeSteps),
}))

export const projectJourneyTypeSteps = pgTable('project_journey_type_steps', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  index: integer('index').notNull(),
  parceiroId: varchar('parceiro_id', { length: 255 })
    .references(() => partners.id)
    .notNull(),
  tipoJornadaProjetoId: varchar('tipo_jornada_projeto_id', { length: 255 })
    .references(() => projectJourneyTypes.id)
    .notNull(),
  titulo: text('titulo').notNull(),
  descricao: text('descricao').notNull(),
  prazoUnidade: timeDurationUnitEnum('project_journey_type_deadline_unit'),
  prazoValor: doublePrecision('prazo_valor'),
  canvasPosicaoX: doublePrecision('canvas_posicao_x').notNull(),
  canvasPosicaoY: doublePrecision('canvas_posicao_y').notNull(),
  // aplicable for when creating the final project journey

  // dataLiberacao: timestamp('data_liberacao'),
  // dataVencimento: timestamp('data_vencimento'),
  // dataConclusao: timestamp('data_conclusao'),
  // dataInsercao: timestamp('data_insercao').defaultNow().notNull(),
})
export const projectJourneyTypeStepsRelations = relations(projectJourneyTypeSteps, ({ one, many }) => ({
  parceiro: one(partners, {
    fields: [projectJourneyTypeSteps.parceiroId],
    references: [partners.id],
  }),
  tipoJornada: one(projectJourneyTypes, {
    fields: [projectJourneyTypeSteps.tipoJornadaProjetoId],
    references: [projectJourneyTypes.id],
  }),
  dependentes: many(projectJourneyTypeStepDependencyReferences, {
    relationName: 'etapaDependencia', // all projectJourneyTypeStepDependencyReferences where this step is  referenced as etapaDependencia
  }),
  dependencias: many(projectJourneyTypeStepDependencyReferences, {
    relationName: 'etapaDependente', // all projectJourneyTypeStepDependencyReferences where this step is  referenced as etapaDependente
  }),
}))
export type TProjectJourneyTypeStep = typeof projectJourneyTypeSteps.$inferSelect
export type TNewProjectJourneyTypeStep = typeof projectJourneyTypeSteps.$inferInsert

export const projectJourneyTypeStepDependencyReferences = pgTable('project_journey_type_step_dependencies', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  parceiroId: varchar('parceiro_id', { length: 255 })
    .references(() => partners.id)
    .notNull(),
  jornadaProjetoEtapaDependenteId: varchar('jornada_projeto_etapa_dependente_id', { length: 255 })
    .references(() => projectJourneyTypeSteps.id)
    .notNull(),
  jornadaProjetoEtapaDependenciaId: varchar('jornada_projeto_etapa_dependencia_id', { length: 255 })
    .references(() => projectJourneyTypeSteps.id)
    .notNull(),
})
export const projectJourneyTypeStepDependencyReferencesRelations = relations(projectJourneyTypeStepDependencyReferences, ({ one }) => ({
  etapaDependente: one(projectJourneyTypeSteps, {
    fields: [projectJourneyTypeStepDependencyReferences.jornadaProjetoEtapaDependenteId],
    references: [projectJourneyTypeSteps.id],
    relationName: 'etapaDependente',
  }),
  etapaDependencia: one(projectJourneyTypeSteps, {
    fields: [projectJourneyTypeStepDependencyReferences.jornadaProjetoEtapaDependenciaId],
    references: [projectJourneyTypeSteps.id],
    relationName: 'etapaDependencia',
  }),
}))
