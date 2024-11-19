import DateInput from '@/components/inputs/Date'
import TextInput from '@/components/inputs/Text'
import { formatDate, formatToPhone } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TPurchaseControl } from '@/utils/schemas/purchases'
import React from 'react'

type PurchaseControlOrderInformationBlockProps = {
  infoHolder: TPurchaseControl
  setInfoHolder: React.Dispatch<React.SetStateAction<TPurchaseControl>>
}
function PurchaseControlOrderInformationBlock({ infoHolder, setInfoHolder }: PurchaseControlOrderInformationBlockProps) {
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">INFORMAÇÕES DO PEDIDO</h1>
      <div className="flex w-full grow flex-col gap-2">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <DateInput
              label="DATA DO PEDIDO"
              value={formatDate(infoHolder.dataPedido)}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, dataPedido: formatDateInputChange(value) as string }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label="NOME DO FORNECEDOR"
              placeholder="Preencha o nome do fornecedor..."
              value={infoHolder.fornecedor.nome || ''}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, fornecedor: { ...prev.fornecedor, nome: value } }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label="CONTATO DO FORNECEDOR"
              placeholder="Preencha o telefone de contato do fornecedor..."
              value={infoHolder.fornecedor.contato || ''}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, fornecedor: { ...prev.fornecedor, contato: formatToPhone(value) } }))}
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseControlOrderInformationBlock
