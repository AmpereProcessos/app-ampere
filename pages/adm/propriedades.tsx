import NewProperty from '@/components/identificador/propriedades/NewProperty'
import TextInput from '@/components/inputs/Text'
import LoadingPage from '@/components/utils/LoadingPage'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

function Properties() {
  const { data: session, status } = useSession({ required: true })
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState<boolean>(false)
  const [newPropertyModalIsOpen, setNewPropertyModalIsOpen] = useState<boolean>(false)
  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="grow p-6">
      <div className="flex h-full grow flex-col">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <p className="text-center text-2xl font-black uppercase text-[#15599a]">CONTROLE DE COLABORADORES</p>
              {/* <p className="text-sm tracking-tight text-gray-500">{employees?.length || '...'} colaboradores contabilizados</p> */}
            </div>
            {dropdownMenuVisible ? (
              <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
              </div>
            ) : (
              <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
              </div>
            )}
          </div>
          <div className="mt-2 flex w-full items-center justify-end gap-2">
            <button
              onClick={() => setNewPropertyModalIsOpen(true)}
              className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
            >
              CADASTRAR PROPRIEDADE
            </button>
          </div>
          {/* <AnimatePresence>
            {dropdownMenuVisible ? (
              <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
                <div className="flex flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
                  <TextInput
                    label={'NOME'}
                    value={filters.search}
                    placeholder={'Digite o nome do colaborador...'}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence> */}
        </div>
      </div>
      {newPropertyModalIsOpen ? <NewProperty session={session} closeModal={() => setNewPropertyModalIsOpen(false)} /> : null}
    </div>
  )
}

export default Properties
