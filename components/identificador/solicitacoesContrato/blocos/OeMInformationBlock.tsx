import CheckboxInput from '@/components/inputs/Checkbox'
import NumberInput from '@/components/inputs/Number'
import SelectInput from '@/components/inputs/Select'
import { TContractRequestDTO } from '@/utils/schemas/contract-requests'
import React from 'react'

type OeMInformationBlockProps = {
  infoHolder: TContractRequestDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TContractRequestDTO>>
  userHasEditPermission: boolean
}
function OeMInformationBlock({ infoHolder, setInfoHolder, userHasEditPermission }: OeMInformationBlockProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES SOBRE SERVIÇOS DE O&M</h1>
      <div className="flex items-center justify-center">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="POSSUI O&M"
            labelTrue="POSSUI O&M"
            checked={infoHolder.possuiOeM == 'SIM'}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, possuiOeM: value ? 'SIM' : 'NÃO' }))}
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <NumberInput
            label="VALOR DO O&M (SE ADICIONAL)"
            placeholder="Preencha o valor do O&M, se adicional de projeto..."
            value={infoHolder.valorOeMOuSeguro || null}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, valorOeMOuSeguro: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <SelectInput
            label={'PLANO DE O&M'}
            value={infoHolder.planoOeM}
            editable={userHasEditPermission}
            selectedItemLabel="NÃO DEFINIDO"
            options={[
              { id: 1, label: 'MANUTENÇÃO SIMPLES', value: 'MANUTENÇÃO SIMPLES' },
              { id: 2, label: 'PLANO SOL', value: 'PLANO SOL' },
              { id: 3, label: 'PLANO SOL +', value: 'PLANO SOL +' },
              { id: 4, label: 'NÃO SE APLICA', value: 'NÃO SE APLICA' },
            ]}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, planoOeM: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, planoOeM: 'NÃO SE APLICA' }))}
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default OeMInformationBlock
