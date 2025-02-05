import { getUpdateLogFormatted } from '@/utils/project-fields-labelling'
import { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'
import React from 'react'
import UpdateLogCard from '../UpdateLogCard'

const RelatedFields = [
  'estruturaPersonalizada.tipo',
  'estruturaPersonalizada.aplicavel',
  'estruturaPersonalizada.status',
  'estruturaPersonalizada.respPagamento',
  'estruturaPersonalizada.valor',
  'estruturaPersonalizada.statusEntrega',
  'estruturaPersonalizada.dataEntrega',
]

function getRelatedLogs(logs: TProjectUpdateLogDTO[]) {
  return logs.filter((log) => Object.keys(log.alteracoes).some((a) => RelatedFields.includes(a)))
}
type StructureUpdateLogsProps = {
  logs: TProjectUpdateLogDTO[]
}
function Structure({ logs }: StructureUpdateLogsProps) {
  const relatedLogs = getRelatedLogs(logs)
  return (
    <div className="flex w-full flex-col gap-1">
      {relatedLogs.length > 0 ? (
        relatedLogs.map((log) => <UpdateLogCard key={log._id} log={log} relatedFields={RelatedFields} />)
      ) : (
        <p className="flex w-full grow items-center justify-center py-2 text-center font-medium italic tracking-tight text-gray-500">
          Sem registros de atualização relacionados a estrutura de instalação.
        </p>
      )}
    </div>
  )
}

export default Structure
