import { getUpdateLogFormatted } from '@/utils/project-fields-labelling'
import { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'
import React from 'react'
import UpdateLogCard from '../UpdateLogCard'

const RelatedFields = [
  'nomeDoContrato',
  'nomeDoProjeto',
  'codigoSVB',
  'cpf_cnpj',
  'tipoDeServico',
  'regional',
  'telefone',
  'email',
  'cep',
  'uf',
  'cidade',
  'bairro',
  'logradouro',
  'numeroResidencia',
  'canalVenda',
  'segmento',
  'vendedor.nome',
  'insider',
  'possuiaGD',
  'linkDrive',
  'idVisitaTecnica',
  'idProjetoCRM',
  'idPropostaCRM',
  'oem.aplicavel',
  'oem.duracao',
  'oem.qtdeManutencoes',
  'obsComercial',
  'idSolicitacaoContrato',
]
function getRelatedLogs(logs: TProjectUpdateLogDTO[]) {
  return logs.filter((log) => Object.keys(log.alteracoes).some((a) => RelatedFields.includes(a)))
}
type ClientUpdateLogsProps = {
  logs: TProjectUpdateLogDTO[]
}
function Client({ logs }: ClientUpdateLogsProps) {
  const relatedLogs = getRelatedLogs(logs)
  return (
    <div className="flex w-full flex-col gap-1">
      {relatedLogs.length > 0 ? (
        relatedLogs.map((log) => <UpdateLogCard key={log._id} log={log} relatedFields={RelatedFields} />)
      ) : (
        <p className="flex w-full grow items-center justify-center py-2 text-center font-medium italic tracking-tight text-gray-500">
          Sem registros de atualização relacionados ao dados do cliente.
        </p>
      )}
    </div>
  )
}

export default Client
