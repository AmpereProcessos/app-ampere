import { getUpdateLogFormatted } from '@/utils/project-fields-labelling'
import { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'
import React from 'react'
import UpdateLogCard from '../UpdateLogCard'

const RelatedFields = ['dadosCemig.titularProjeto', 'dadosCemig.numeroInstalacao', 'dadosCemig.distCreditos', 'dadosCemig.qtdeDistCreditos']
function getRelatedLogs(logs: TProjectUpdateLogDTO[]) {
  return logs.filter((log) => Object.keys(log.alteracoes).some((a) => RelatedFields.includes(a)))
}
type ElectricalInstallationUpdateLogsProps = {
  logs: TProjectUpdateLogDTO[]
}
function ElectricalInstallation({ logs }: ElectricalInstallationUpdateLogsProps) {
  const relatedLogs = getRelatedLogs(logs)
  return (
    <div className="flex w-full flex-col gap-1">
      {relatedLogs.length > 0 ? (
        relatedLogs.map((log) => <UpdateLogCard key={log._id} log={log} relatedFields={RelatedFields} />)
      ) : (
        <p className="flex w-full grow items-center justify-center py-2 text-center font-medium italic tracking-tight text-gray-500">
          Sem registros de atualização relacionados a dados da instalação elétrica.
        </p>
      )}
    </div>
  )
}

export default ElectricalInstallation
