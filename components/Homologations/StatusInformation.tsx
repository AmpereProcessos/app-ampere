import React from 'react'

import { TProjectDTOWithHomologation } from '@/utils/schemas/projects'
import SelectInput from '../inputs/Select'
import { HomologationControlStatus } from '@/utils/select-options'
import NumberInput from '../inputs/Number'

type StatusInformationProps = {
  infoHolder: TProjectDTOWithHomologation
  setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}

function StatusInformation({ infoHolder, setInfoHolder, changes, setChanges }: StatusInformationProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="bg-primary/80 w-full rounded p-1 text-center font-bold text-white">CONTROLE</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <SelectInput
            label="STATUS"
            options={HomologationControlStatus}
            value={infoHolder.homologacao.status}
            handleChange={(value) => {
              setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, status: value } }))
              setChanges((prev) => ({ ...prev, 'homologacao.status': value }))
            }}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() => {
              setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, status: 'PENDENTE' } }))
              setChanges((prev) => ({ ...prev, 'homologacao.status': 'PENDENTE' }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <NumberInput
            label="POTÊNCIA PARA HOMOLOGAÇÃO"
            placeholder="Preencha aqui a potência a ser homologada..."
            value={infoHolder.homologacao.potencia || null}
            handleChange={(value) => {
              setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, potencia: value } }))
              setChanges((prev) => ({ ...prev, 'homologacao.potencia': value }))
            }}
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default StatusInformation
