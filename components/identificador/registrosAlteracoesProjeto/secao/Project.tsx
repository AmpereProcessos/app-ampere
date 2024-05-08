import { getUpdateLogFormatted } from '@/utils/project-fields-labelling'
import { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'
import React from 'react'
import UpdateLogCard from '../UpdateLogCard'

const RelatedFields = [
  'projeto.iniciar',
  'projeto.realizarHomologacao', // boolean
  'projeto.projetista.nome',
  'projeto.diagramaUnifilar',
  'projeto.desenhoTelhado',
  'projeto.mapaDeMicro',
  'projeto.formaAssDocumentacao',
  'projeto.dataLiberacaoDocumentacao',
  'projeto.dataAssDocumentacao',
  'projeto.dataSolicitacaoAcesso',
  'parecer.dataParecerDeAcesso',
  'parecer.statusDoParecerDeAcesso',
  'parecer.qtdeDiasObraDeRede',
  'parecer.parecerReprovado',
  'parecer.qtdeReprovas',
  'parecer.motivoReprova',
  'parecer.pendencias',
  'vistoria.dataPedido',
  'vistoria.status',
  'vistoria.vistoriaReprovada',
  'vistoria.qtdeReprovas',
  'vistoria.motivoReprova',
  'vistoria.equipeDeCampoNecessaria',
  'medidor.data',
  'medidor.status',
  'projeto.projetoConcluido',
]
function getRelatedLogs(logs: TProjectUpdateLogDTO[]) {
  return logs.filter((log) => Object.keys(log.alteracoes).some((a) => RelatedFields.includes(a)))
}
type ProjectUpdateLogsProps = {
  logs: TProjectUpdateLogDTO[]
}
function Project({ logs }: ProjectUpdateLogsProps) {
  const relatedLogs = getRelatedLogs(logs)
  return (
    <div className="flex w-full flex-col gap-1">
      {relatedLogs.length > 0 ? (
        relatedLogs.map((log) => <UpdateLogCard key={log._id} log={log} relatedFields={RelatedFields} />)
      ) : (
        <p className="flex w-full grow items-center justify-center py-2 text-center font-medium italic tracking-tight text-gray-500">
          Sem registros de atualização relacionados a projeto.
        </p>
      )}
    </div>
  )
}

export default Project
