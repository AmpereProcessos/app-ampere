import CheckboxInput from '@/components/inputs/Checkbox'
import NumberInput from '@/components/inputs/Number'
import SelectInput from '@/components/inputs/Select'
import { TContractRequestDTO } from '@/utils/schemas/contract-requests'
import React from 'react'

type InsuranceInformationBlockProps = {
  infoHolder: TContractRequestDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TContractRequestDTO>>
  userHasEditPermission: boolean
}
function InsuranceInformationBlock({ infoHolder, setInfoHolder, userHasEditPermission }: InsuranceInformationBlockProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES SOBRE SERVIÇOS DE SEGURO</h1>
      <div className="flex items-center justify-center">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="POSSUI SEGURO"
            labelTrue="POSSUI SEGURO"
            checked={infoHolder.clienteSegurado == 'SIM'}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, clienteSegurado: value ? 'SIM' : 'NÃO' }))}
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <NumberInput
            label="VALOR DO SEGURO (SE ADICIONAL)"
            placeholder="Preencha o valor do seguro, se adicional de projeto..."
            value={infoHolder.valorSeguro || null}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, valorSeguro: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <SelectInput
            label={'TEMPO SEGURADO'}
            value={infoHolder.tempoSegurado}
            editable={userHasEditPermission}
            selectedItemLabel="NÃO DEFINIDO"
            options={[
              { id: 1, label: '1 ANO', value: '1 ANO' },
              { id: 2, label: 'NÃO SE APLICA', value: 'NÃO SE APLICA' },
            ]}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tempoSegurado: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, tempoSegurado: 'NÃO SE APLICA' }))}
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default InsuranceInformationBlock
