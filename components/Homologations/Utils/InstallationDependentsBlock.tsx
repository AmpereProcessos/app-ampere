import NumberInput from '@/components/inputs/Number'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { formatDecimalPlaces, GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { THomologation } from '@/utils/schemas/partial/homologation'
import { TProjectDTOWithHomologation } from '@/utils/schemas/projects'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { BsCode } from 'react-icons/bs'
import { FaPercentage } from 'react-icons/fa'
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md'
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

  function updateDependent({ item, index }: { item: THomologation['instalacao']['dependentes'][number]; index: number }) {
    const dependents = [...infoHolder.homologacao.instalacao.dependentes]
    dependents[index] = item
    setInfoHolder((prev) => ({
      ...prev,
      homologacao: { ...prev.homologacao, instalacao: { ...prev.homologacao.instalacao, dependentes: dependents } },
    }))
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
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <h1 className="font-sans text-start  font-bold text-[#353432]">DEPENDENTES/RECEBEDORAS</h1>
        {infoHolder.homologacao.instalacao.dependentes.length > 0 ? (
          <div className="flex items-center gap-1">
            <h1 className="rounded-lg bg-green-500 px-2 py-1 text-[0.65rem] font-bold text-white">POSSUI DISTRIBUIÇÕES</h1>
            <h1 className="rounded-lg bg-gray-800 px-2 py-1 text-[0.65rem] font-bold text-white">
              {infoHolder.homologacao.instalacao.dependentes.length}{' '}
              {infoHolder.homologacao.instalacao.dependentes.length > 1 ? 'RECEBEDORAS' : 'RECEBEDORA'}
            </h1>
          </div>
        ) : (
          <h1 className="rounded-lg bg-red-500 px-2 py-1 text-[0.65rem] font-bold text-white">NÃO POSSUI DISTRIBUIÇÕES</h1>
        )}
      </div>
      {infoHolder.homologacao.instalacao.dependentes.length > 0 ? (
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full flex-col items-center rounded border-0 border-gray-800 lg:border">
            <div className="hidden w-full items-center gap-2 rounded rounded-bl-[0] rounded-br-[0] bg-gray-500 p-1 lg:flex">
              <h1 className="w-[20%] text-center text-sm font-bold text-white">INDEX</h1>
              <h1 className="w-[40%] text-center text-sm font-bold text-white">NÚMERO DA INSTALAÇÃO</h1>
              <h1 className="w-[40%] text-center text-sm font-bold text-white">PORCENTAGEM DE RECEBIMENTO</h1>
            </div>
            {infoHolder.homologacao.instalacao.dependentes.map((dependent, index) => (
              <DependenteTableItem
                key={index}
                index={index}
                dependent={dependent}
                handleRemove={() => removeDependent(index)}
                handleUpdate={(item) => updateDependent({ item, index })}
              />
              // <div key={index} className="group flex w-full flex-col items-center rounded border border-gray-800 shadow-sm">
              //   <h1 className="w-full bg-gray-800 p-1 text-center text-[0.65rem] font-bold text-white">RECEBEDORA {index + 1}</h1>
              //   <div className="flex w-full flex-col p-2">
              //     <div className="flex w-full items-start justify-between gap-4 p-2">
              //       <div className="flex flex-col items-center gap-1 lg:items-start">
              //         <div className="flex items-center gap-1">
              //           <BsCode size={12} />
              //           <p className="text-[0.65rem] font-medium text-gray-500">INSTALAÇÃO</p>
              //         </div>
              //         <p className="text-[0.6rem] font-medium leading-none tracking-tight">{dependent.numeroInstalacao}</p>
              //       </div>
              //       <div className="flex flex-col items-center gap-1 lg:items-end">
              //         <div className="flex items-center gap-1">
              //           <FaPercentage size={12} />
              //           <p className="text-[0.65rem] font-medium text-gray-500">PORCENTAGEM</p>
              //         </div>
              //         <p className="text-[0.6rem] font-medium leading-none tracking-tight">{dependent.recebimentoPercentual}%</p>
              //       </div>
              //     </div>
              //     <div className="flex w-full items-center justify-end">
              //       <button
              //         onClick={() => removeDependent(index)}
              //         className="houver:bg-red-500 rounded bg-red-600 px-2 py-0.5 text-[0.6rem] font-medium text-white duration-300 ease-in-out"
              //       >
              //         REMOVER
              //       </button>
              //     </div>
              //   </div>

              //   {/* <h1 className="text-xs font-medium text-gray-500">INSTALAÇÃO Nº {dependent.numeroInstalacao}</h1>
              //   <h1 className="rounded-lg bg-black px-2 py-1 text-[0.65rem] font-bold text-white">
              //     {formatDecimalPlaces(dependent.recebimentoPercentual)} %
              //   </h1>
              //   <button
              //     onClick={() => removeDependent(index)}
              //     type="button"
              //     className="flex items-center justify-center  rounded-lg p-1 opacity-0 duration-300 ease-linear group-hover:opacity-100 hover:scale-105 hover:bg-red-200"
              //   >
              //     <VscChromeClose style={{ color: 'red' }} />
              //   </button> */}
              // </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="w-full text-center text-sm font-medium text-gray-500">Não há recebedoras definidas para essa geradora.</p>
      )}
      <div className="flex w-full items-center justify-end">
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
    </div>
  )
}

export default InstallationDependentsBlock

type DependenteTableItemProps = {
  index: number
  dependent: THomologation['instalacao']['dependentes'][number]
  handleRemove: () => void
  handleUpdate: (item: THomologation['instalacao']['dependentes'][number]) => void
}
function DependenteTableItem({ index, dependent, handleRemove, handleUpdate }: DependenteTableItemProps) {
  const [editMenuIsOpen, setEditMenuIsOpen] = useState<boolean>(false)
  const [dependentHolder, setDependentHolder] = useState<THomologation['instalacao']['dependentes'][number]>(dependent)
  return (
    <>
      <AnimatePresence>
        <div className="hidden w-full flex-col gap-1 lg:flex">
          <div className="flex w-full items-center gap-2 p-1">
            <div className="flex w-[20%] items-center gap-1">
              <h1 className="text-xs tracking-tight">RECEBEDORA {index + 1}</h1>
              <button
                onClick={() => setEditMenuIsOpen((prev) => !prev)}
                className="flex items-center justify-center rounded border border-orange-500 bg-orange-50 p-1 text-orange-500 duration-300 ease-in-out hover:border-orange-700 hover:text-orange-700"
              >
                <MdEdit size={10} />
              </button>
              <button
                onClick={() => handleRemove()}
                className="flex items-center justify-center rounded border border-red-500 bg-red-50 p-1 text-red-500 duration-300 ease-in-out hover:border-red-700 hover:text-red-700"
              >
                <MdDelete size={10} />
              </button>
            </div>
            <h1 className="w-[45%] text-center text-xs tracking-tight">{dependent.numeroInstalacao}</h1>
            <h1 className="w-[45%] text-center text-xs tracking-tight">{dependent.recebimentoPercentual}%</h1>
          </div>
        </div>
        <div className="group flex w-full flex-col items-center rounded border border-gray-800 shadow-sm lg:hidden">
          <h1 className="w-full bg-gray-800 p-1 text-center text-[0.65rem] font-bold text-white">RECEBEDORA {index + 1}</h1>
          <div className="flex w-full flex-col p-2">
            <div className="flex w-full items-start justify-between gap-4 p-2">
              <div className="flex flex-col items-center gap-1 lg:items-start">
                <div className="flex items-center gap-1">
                  <BsCode size={12} />
                  <p className="text-[0.65rem] font-medium text-gray-500">INSTALAÇÃO</p>
                </div>
                <p className="text-[0.6rem] font-medium leading-none tracking-tight">{dependent.numeroInstalacao}</p>
              </div>
              <div className="flex flex-col items-center gap-1 lg:items-end">
                <div className="flex items-center gap-1">
                  <FaPercentage size={12} />
                  <p className="text-[0.65rem] font-medium text-gray-500">PORCENTAGEM</p>
                </div>
                <p className="text-[0.6rem] font-medium leading-none tracking-tight">{dependent.recebimentoPercentual}%</p>
              </div>
            </div>
            <div className="flex w-full items-center justify-end gap-2">
              <button
                onClick={() => setEditMenuIsOpen((prev) => !prev)}
                className="houver:bg-red-500 rounded bg-blue-600 px-2 py-0.5 text-[0.6rem] font-medium text-white duration-300 ease-in-out"
              >
                EDITAR
              </button>
              <button
                onClick={() => handleRemove()}
                className="houver:bg-red-500 rounded bg-red-600 px-2 py-0.5 text-[0.6rem] font-medium text-white duration-300 ease-in-out"
              >
                REMOVER
              </button>
            </div>
          </div>
        </div>
        {editMenuIsOpen ? (
          <motion.div
            variants={GeneralVisibleHiddenExitMotionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex w-full flex-col gap-1 p-3"
          >
            <div className="flex w-full flex-col gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <TextInput
                  label="Nº DA INSTALAÇÃO"
                  labelClassName="text-xs tracking-tight"
                  placeholder="Preencha aqui o número da instalação dependente..."
                  value={dependentHolder.numeroInstalacao}
                  handleChange={(value) => setDependentHolder((prev) => ({ ...prev, numeroInstalacao: value }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <NumberInput
                  label="PERCENTUAL DE RECEBIMENTO"
                  labelClassName="text-xs tracking-tight"
                  placeholder="Preencha aqui o recebimento percentual da instalação dependente..."
                  value={dependentHolder.recebimentoPercentual}
                  handleChange={(value) => setDependentHolder((prev) => ({ ...prev, recebimentoPercentual: value }))}
                  width="100%"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setEditMenuIsOpen(false)
                }}
                className="rounded bg-red-800 p-1 px-4 text-[0.6rem] font-medium text-white duration-300 ease-in-out hover:bg-red-700"
              >
                FECHAR
              </button>
              <button
                onClick={() => {
                  handleUpdate(dependentHolder)
                  setEditMenuIsOpen(false)
                }}
                className="rounded bg-blue-800 p-1 px-4 text-[0.6rem] font-medium text-white duration-300 ease-in-out hover:bg-blue-700"
              >
                ATUALIZAR ITEM
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
