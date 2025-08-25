import { getUpdateLogFormatted } from '@/utils/project-fields-labelling'
import { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'
import React from 'react'
import UpdateLogCard from '../UpdateLogCard'

const RelatedFields = [
  'sistema.valorProjeto',
  'sistema.potPico',
  'sistema.topologia',
  'sistema.inversor',
  'sistema.qtdeModulos',
  'sistema.potModulos',
  'sistema.tipoControlador',
  'sistema.marcaControlador',
  'sistema.qtdeControlador',
  'sistema.correnteControlador',
  'sistema.marcaBomba',
  'sistema.qtdeBomba',
  'sistema.potBomba',
  'sistema.marcaBateria',
  'sistema.qtdeBateria',
  'sistema.tipoBateria',
  'sistema.capacidadeBateria',
  'projeto.iniciar',
]

function getRelatedLogs(logs: TProjectUpdateLogDTO[]) {
  return logs.filter((log) => Object.keys(log.alteracoes).some((a) => RelatedFields.includes(a)))
}
type SystemUpdateLogsProps = {
  logs: TProjectUpdateLogDTO[]
}
function System({ logs }: SystemUpdateLogsProps) {
  const relatedLogs = getRelatedLogs(logs)
  return (
    <div className="flex w-full flex-col gap-1">
      {relatedLogs.length > 0 ? (
        relatedLogs.map((log) => <UpdateLogCard key={log._id} log={log} relatedFields={RelatedFields} />)
      ) : (
        <p className="text-primary/60 flex w-full grow items-center justify-center py-2 text-center font-medium tracking-tight italic">
          Sem registros de atualização relacionados a dados do sistema.
        </p>
      )}
    </div>
  )
}

export default System
