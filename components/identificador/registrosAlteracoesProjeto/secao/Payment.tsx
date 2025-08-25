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
        relatedLogs.map((log) => <UpdateLogCard key={log._id} log={log} relatedFields={RelatedFields} />)
      ) : (
        <p className="text-primary/60 flex w-full grow items-center justify-center py-2 text-center font-medium tracking-tight italic">
          Sem registros de atualização relacionados a pagamento.
        </p>
      )}
    </div>
  )
}

export default Payment
