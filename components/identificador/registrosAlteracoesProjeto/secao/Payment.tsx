import { getUpdateLogFormatted } from '@/utils/project-fields-labelling'
import { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'
import React from 'react'
import UpdateLogCard from '../UpdateLogCard'

const RelatedFields = [
  'pagamento.forma',
  'pagamento.credor',
  'pagamento.pagador',
  'pagamento.contatoPagador',
  'pagamento.cobrancaFeita',
  'pagamento.dataRecebimento',
  'faturamento.empresaFaturamento',
  'faturamento.cnpjFaturamento',
  'faturamento.concluido',
]
function getRelatedLogs(logs: TProjectUpdateLogDTO[]) {
  return logs.filter((log) => Object.keys(log.alteracoes).some((a) => RelatedFields.includes(a)))
}
type PaymentUpdateLogsProps = {
  logs: TProjectUpdateLogDTO[]
}
function Payment({ logs }: PaymentUpdateLogsProps) {
  const relatedLogs = getRelatedLogs(logs)
  return (
    <div className="flex w-full flex-col gap-1">
      {relatedLogs.length > 0 ? (
        relatedLogs.map((log) => <UpdateLogCard key={log._id} log={log} />)
      ) : (
        <p className="flex w-full grow items-center justify-center py-2 text-center font-medium italic tracking-tight text-gray-500">Sem análises</p>
      )}
    </div>
  )
}

export default Payment
