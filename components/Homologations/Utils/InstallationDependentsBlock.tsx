import NumberInput from '@/components/inputs/Number'
import TextInput from '@/components/inputs/Text'
import { formatDecimalPlaces } from '@/utils/constants'
import { THomologation } from '@/utils/schemas/partial/homologation'
import { TProjectDTOWithHomologation } from '@/utils/schemas/projects'
import React, { useState } from 'react'
import { MdAdd } from 'react-icons/md'
import { VscChromeClose } from 'react-icons/vsc'

type InstallationDependentsBlockProps = {
  infoHolder: TProjectDTOWithHomologation
  setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}
function InstallationDependentsBlock({ infoHolder, setInfoHolder, changes, setChanges }: InstallationDependentsBlockProps) {
  const [newDependentMenuIsOpen, setNewDependentMenuIsOpen] = useState<boolean>(false)
  const [newDependentHolder, setNewDependentHolder] = useState<THomologation['instalacao']['dependentes'][number]>({
    numeroInstalacao: '',
    recebimentoPercentual: 100,
  })

  function addDependent(info: THomologation['instalacao']['dependentes'][number]) {
    const dependents = [...infoHolder.homologacao.instalacao.dependentes]

    dependents.push(info)

    setInfoHolder((prev) => ({
      ...prev,
      homologacao: { ...prev.homologacao, instalacao: { ...prev.homologacao.instalacao, dependentes: dependents } },
    }))
    setChanges((prev) => ({ ...prev, 'homologacao.instalacao.dependentes': dependents }))
  }

  function removeDependent(index: number) {
    const dependents = [...infoHolder.homologacao.instalacao.dependentes]

    dependents.splice(index, 1)

    setInfoHolder((prev) => ({
      ...prev,
      homologacao: { ...prev.homologacao, instalacao: { ...prev.homologacao.instalacao, dependentes: dependents } },
    }))
    setChanges((prev) => ({ ...prev, 'homologacao.instalacao.dependentes': dependents }))
  }
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between gap-2">
        <h1 className="font-sans text-start  font-bold text-[#353432]">DEPENDENTES</h1>
        {newDependentMenuIsOpen ? (
          <button
            onClick={() => setNewDependentMenuIsOpen(false)}
            className="flex items-center gap-1 rounded-lg border border-red-500 bg-red-50 px-2 py-1 text-[0.6rem] text-red-500 duration-300 ease-in-out hover:border-red-700 hover:text-red-700"
          >
            <VscChromeClose />
            <p className="font-medium">FECHAR MENU</p>
          </button>
        ) : (
          <button
            onClick={() => setNewDependentMenuIsOpen(true)}
            className="flex items-center gap-1 rounded-lg border border-cyan-500 bg-cyan-50 px-2 py-1 text-[0.6rem] text-cyan-500 duration-300 ease-in-out hover:border-cyan-700 hover:text-cyan-700"
          >
            <MdAdd />
            <p className="font-medium">NOVO DEPENDENTE</p>
          </button>
        )}
      </div>
      {newDependentMenuIsOpen ? (
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-col gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <TextInput
                label="Nº DA INSTALAÇÃO"
                labelClassName="text-xs tracking-tight"
                placeholder="Preencha aqui o número da instalação dependente..."
                value={newDependentHolder.numeroInstalacao}
                handleChange={(value) => setNewDependentHolder((prev) => ({ ...prev, numeroInstalacao: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <NumberInput
                label="PERCENTUAL DE RECEBIMENTO"
                labelClassName="text-xs tracking-tight"
                placeholder="Preencha aqui o recebimento percentual da instalação dependente..."
                value={newDependentHolder.recebimentoPercentual}
                handleChange={(value) => setNewDependentHolder((prev) => ({ ...prev, recebimentoPercentual: value }))}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-end">
            <button
              className="rounded bg-black p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out hover:bg-gray-700"
              onClick={() => addDependent(newDependentHolder)}
            >
              ADICIONAR DEPENDENTE
            </button>
          </div>
        </div>
      ) : null}
      <div className="flex w-full flex-wrap items-center justify-start gap-3">
        {infoHolder.homologacao.instalacao.dependentes.map((dependent, index) => (
          <div key={index} className="group flex items-center gap-2 rounded border border-gray-500 p-2 shadow-sm">
            <h1 className="text-xs font-medium text-gray-500">INSTALAÇÃO Nº {dependent.numeroInstalacao}</h1>
            <h1 className="rounded-lg bg-black px-2 py-1 text-[0.65rem] font-bold text-white">
              {formatDecimalPlaces(dependent.recebimentoPercentual)} %
            </h1>
            <button
              onClick={() => removeDependent(index)}
              type="button"
              className="flex items-center justify-center  rounded-lg p-1 opacity-0 duration-300 ease-linear group-hover:opacity-100 hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InstallationDependentsBlock
