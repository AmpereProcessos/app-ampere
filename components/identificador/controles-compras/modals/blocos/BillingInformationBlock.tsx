import DateInput from '@/components/inputs/Date'
import TextInput from '@/components/inputs/Text'
import { formatDate } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TPurchaseControl } from '@/utils/schemas/purchases'
import React from 'react'

type PurchaseControlBillingInformationBlockProps = {
  infoHolder: TPurchaseControl
  setInfoHolder: React.Dispatch<React.SetStateAction<TPurchaseControl>>
}
function PurchaseControlBillingInformationBlock({ infoHolder, setInfoHolder }: PurchaseControlBillingInformationBlockProps) {
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">INFORMAÇÕES DO FATURAMENTO</h1>
      <div className="flex w-full grow flex-col gap-2">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <DateInput
              label="DATA DE FATURAMENTO"
              value={formatDate(infoHolder.faturamento.data)}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, faturamento: { data: formatDateInputChange(value) as string } }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <TextInput
              label="CÓDIGO DA NOTA FISCAL"
              placeholder="Preencha o código da nota fiscal..."
              value={infoHolder.faturamento.codigoNotaFiscal || ''}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, faturamento: { ...prev.faturamento, codigoNotaFiscal: value } }))}
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseControlBillingInformationBlock
