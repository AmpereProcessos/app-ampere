import React from 'react'
import { TProjectDTOWithHomologation } from '@/utils/schemas/projects'
import SelectInput from '../inputs/Select'
import { ElectricalInstallationGroups, EnergyDistributorsOptions } from '@/utils/select-options'
import TextInput from '../inputs/Text'

type InstallationInformationProps = {
  infoHolder: TProjectDTOWithHomologation
  setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}
function InstallationInformation({ infoHolder, setInfoHolder, changes, setChanges }: InstallationInformationProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES DA INSTALAÇÃO ELÉTRICA</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <SelectInput
            label="CONCESSIONÁRIA/DISTRIBUIDORA"
            value={infoHolder.homologacao.distribuidora}
            options={EnergyDistributorsOptions.map((d) => d)}
            handleChange={(value) => {
              setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, distribuidora: value } }))
              setChanges((prev) => ({ ...prev, 'homologacao.distribuidora': value }))
            }}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() => {
              setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, distribuidora: '' } }))
              setChanges((prev) => ({ ...prev, 'homologacao.distribuidora': '' }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label="NÚMERO DA INSTALAÇÃO ELÉTRICA"
            placeholder="Preencha o número da instalação elétrica..."
            value={infoHolder.homologacao.instalacao.numeroInstalacao}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, instalacao: { ...prev.homologacao.instalacao, numeroInstalacao: value } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.instalacao.numeroInstalacao': value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label="NÚMERO DO CLIENTE"
            placeholder="Preencha o número do cliente junto a concessionária..."
            value={infoHolder.homologacao.instalacao.numeroCliente}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, instalacao: { ...prev.homologacao.instalacao, numeroCliente: value } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.instalacao.numeroCliente': value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label="GRUPO DA INSTALAÇÃO"
            value={infoHolder.homologacao.instalacao.grupo}
            options={ElectricalInstallationGroups}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, instalacao: { ...prev.homologacao.instalacao, grupo: value } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.instalacao.grupo': value }))
            }}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, instalacao: { ...prev.homologacao.instalacao, grupo: 'RESIDENCIAL' } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.instalacao.grupo': 'RESIDENCIAL' }))
            }}
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default InstallationInformation
