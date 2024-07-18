import CheckboxInput from '@/components/inputs/Checkbox'
import NumberInput from '@/components/inputs/Number'
import TextInput from '@/components/inputs/Text'
import { formatDecimalPlaces } from '@/utils/constants'
import { TContractRequestDTO } from '@/utils/schemas/contract-requests'
import React, { useState } from 'react'
import { MdDelete } from 'react-icons/md'

type ElectricalInstallationDependentsInformationBlockProps = {
  infoHolder: TContractRequestDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TContractRequestDTO>>
  userHasEditPermission: boolean
}
function ElectricalInstallationDependentsInformationBlock({
  infoHolder,
  setInfoHolder,
  userHasEditPermission,
}: ElectricalInstallationDependentsInformationBlockProps) {
  const [distributionHolder, setDistributionHolder] = useState<TContractRequestDTO['distribuicoes'][number]>({
    numInstalacao: '',
    excedente: 0,
  })

  function addDistribution(info: TContractRequestDTO['distribuicoes'][number]) {
    const distributions = [...(infoHolder.distribuicoes || [])]
    distributions.push(info)
    setInfoHolder((prev) => ({ ...prev, distribuicoes: distributions }))
  }
  function removeDistribution(index: number) {
    const distributions = [...(infoHolder.distribuicoes || [])]
    distributions.splice(index, 1)
    setInfoHolder((prev) => ({ ...prev, distribuicoes: distributions }))
  }
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES SOBRE DISTRIBUIÇÕES DE CRÉDITO</h1>
      <div className="flex items-center justify-center">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="POSSUI DISTRIBUIÇÕES DE CRÉDITO"
            labelTrue="POSSUI DISTRIBUIÇÕES DE CRÉDITO"
            checked={infoHolder.possuiDistribuicao == 'SIM'}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, possuiDistribuicao: value ? 'SIM' : 'NÃO' }))}
          />
        </div>
      </div>
      {infoHolder.possuiDistribuicao == 'SIM' ? (
        <>
          <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <TextInput
                label="NÚMERO DA INSTALAÇÃO"
                placeholder="Preencha o número da instalação.."
                value={distributionHolder.numInstalacao}
                handleChange={(value) => setDistributionHolder((prev) => ({ ...prev, numInstalacao: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <NumberInput
                label="PORCENTAGEM DO EXCEDENTE P/ ENVIO"
                placeholder="Preencha a porcentagem de envio.."
                value={distributionHolder.excedente || null}
                handleChange={(value) => setDistributionHolder((prev) => ({ ...prev, excedente: value }))}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-end">
            <button
              onClick={() => addDistribution(distributionHolder)}
              className="rounded bg-black px-2 py-1 font-bold text-white ease-out hover:bg-gray-900"
            >
              ADICIONAR
            </button>
          </div>
          <div className="flex w-full items-start justify-around gap-4">
            {infoHolder.distribuicoes.map((dist, index) => (
              <div className="flex min-w-[250px] flex-col items-center gap-2 rounded-lg border border-gray-500 px-6 py-2">
                <div className="flex w-full items-center justify-between gap-2">
                  <p className="text-xs tracking-tight text-gray-500">{dist.numInstalacao}</p>
                  <h1 className="bg-black px-2 py-1 text-[0.6rem] font-bold text-white">{formatDecimalPlaces(dist.excedente || 0)}%</h1>
                </div>
                <div className="flex w-full items-center justify-end">
                  <button className="text-red-500" onClick={() => removeDistribution(index)}>
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default ElectricalInstallationDependentsInformationBlock
