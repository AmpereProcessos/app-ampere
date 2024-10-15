import TextInput from '@/components/inputs/Text'
import { formatToPhone } from '@/utils/methods/formatting'
import { TPurchaseControl } from '@/utils/schemas/purchases'
import { Session } from 'next-auth'
import React, { useState } from 'react'

type PurchaseControlTransportationInformationBlockProps = {
  infoHolder: TPurchaseControl
  setInfoHolder: React.Dispatch<React.SetStateAction<TPurchaseControl>>
}
function PurchaseControlTransportationInformationBlock({ infoHolder, setInfoHolder }: PurchaseControlTransportationInformationBlockProps) {
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">INFORMAÇÕES DO TRANSPORTE</h1>
      <div className="flex w-full grow flex-col gap-2">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <TextInput
              label="NOME DA TRANSPORTADORA"
              placeholder="Preencha o nome da transportadora..."
              value={infoHolder.transporte.transportadora.nome || ''}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  transporte: { ...prev.transporte, transportadora: { ...prev.transporte.transportadora, nome: value } },
                }))
              }
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label="CONTATO DA TRANSPORTADORA"
              placeholder="Preencha o telefone de contato da transportadora..."
              value={infoHolder.transporte.transportadora.contato || ''}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  transporte: { ...prev.transporte, transportadora: { ...prev.transporte.transportadora, contato: formatToPhone(value) } },
                }))
              }
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label="LINK DE RASTREIO (SE HOUVER)"
              placeholder="Preencha, se houver, o link de rastreio..."
              value={infoHolder.transporte.linkRastreio || ''}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, transporte: { ...prev.transporte, linkRastreio: value } }))}
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseControlTransportationInformationBlock
