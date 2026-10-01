import type { Filter } from 'mongodb'
import type { TPersonalizedServiceOrderFilter, TServiceOrder, TServiceOrderProjectState } from '@/utils/schemas/service-order'

export const PROJECT_STATE_PAIRS = [
  ['paid', 'unpaid'], ['approved', 'not-approved'],
  ['delivered', 'not-delivered'], ['inspected', 'not-inspected'],
] as const satisfies readonly (readonly TServiceOrderProjectState[])[]

const milestoneFields = [
  'projeto.compraDataPagamento', 'projeto.homologacaoAcessoDataResposta',
  'projeto.compraEntregaDataEfetivacao', 'projeto.homologacaoVistoriaDataEfetivacao',
] as const

export function buildProjectStateQuery(filters: Pick<TPersonalizedServiceOrderFilter,
  'projectStates' | 'projectEquipmentDelivered' | 'projectEquipmentNotDelivered' | 'projectHomologationApproved'
>): Filter<TServiceOrder> {
  const states = new Set<TServiceOrderProjectState>(filters.projectStates)
  if (filters.projectEquipmentDelivered) states.add('delivered')
  if (filters.projectEquipmentNotDelivered) states.add('not-delivered')
  if (filters.projectHomologationApproved) states.add('approved')
  if (!states.size) return {}

  const clauses: Filter<TServiceOrder>[] = [
    // Missing milestones on an order without a project are not project states.
    { 'projeto.id': { $type: 'string', $ne: '' } },
  ]
  PROJECT_STATE_PAIRS.forEach(([positive, negative], index) => {
    if (states.has(positive)) clauses.push({ [milestoneFields[index]]: { $type: 'string', $nin: ['', null] } })
    if (states.has(negative)) clauses.push({ [milestoneFields[index]]: { $in: [null, ''] } })
  })
  return { $and: clauses }
}
