import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { TPurchaseControl } from '@/utils/schemas/purchases'
import { PurchaseControlStatus } from '@/utils/select-options'
import React from 'react'
import { BsCalendarCheck } from 'react-icons/bs'

type PurchaseControlGeneralInformationBlockProps = {
  infoHolder: TPurchaseControl
  setInfoHolder: React.Dispatch<React.SetStateAction<TPurchaseControl>>
}
function PurchaseControlGeneralInformationBlock({ infoHolder, setInfoHolder }: PurchaseControlGeneralInformationBlockProps) {
  function handleEffectivationUpdate(newValue: TPurchaseControl['status'], previousData: TPurchaseControl) {
    if (newValue == 'CONCLUÍDA') {
      if (previousData.status != 'CONCLUÍDA') return new Date().toISOString()
      return previousData.dataEfetivacao
    } else {
      if (previousData.status == 'CONCLUÍDA') return null
      return previousData.dataEfetivacao
    }
  }
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">INFORMAÇÕES GERAIS</h1>
      {infoHolder.dataEfetivacao ? (
        <div className="flex w-full items-center justify-center">
          <div className="flex flex-col items-center rounded-lg bg-green-500 px-4 py-1 text-white">
            <h1 className="text-[0.55rem] tracking-tight">CONCLUÍDA EM:</h1>
            <div className="flex items-center gap-1">
              <BsCalendarCheck />
              <h1 className="text-[0.65rem] font-bold">{formatDateAsLocale(infoHolder.dataEfetivacao, true)}</h1>
            </div>
          </div>
        </div>
      ) : null}
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <TextInput
              label="TÍTULO DA COMPRA"
              placeholder="Preencha o título da registro de compra..."
              value={infoHolder.titulo}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, titulo: value }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <SelectInput
              label="STATUS DA COMPRA"
              value={infoHolder.status}
              options={PurchaseControlStatus}
              handleChange={(value) =>
                setInfoHolder((prev) => ({ ...prev, status: value, dataEfetivacao: handleEffectivationUpdate(value, infoHolder) }))
              }
              onReset={() => setInfoHolder((prev) => ({ ...prev, status: 'AGUARDANDO LIBERAÇÃO', dataEfetivacao: null }))}
              selectedItemLabel="NÃO DEFINIDO"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseControlGeneralInformationBlock
