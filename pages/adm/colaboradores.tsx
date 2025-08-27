import { useSession } from '@/components/providers/SessionProvider'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

import NewEmployee from '@/components/identificador/colaboradores/NewEmployee'

import EditEmployee from '@/components/identificador/colaboradores/EditEmployee'
import EmployeeCard from '@/components/identificador/colaboradores/EmployeeCard'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'

import CheckboxInput from '@/components/inputs/Checkbox'
import TextInput from '@/components/inputs/Text'
import type { TAuthSession } from '@/lib/authentication/types'
import { useEmployees } from '@/utils/methods/query/users'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
type TEditModal = {
  isOpen: boolean
  id: string | null
}

function Employees() {
  const { session, status } = useSession()

  if (status === 'loading') return <LoadingPage />
  if (status !== 'authenticated') return <LoadingPage />
  return <EmployeesContent session={session} />
}

type EmployeesContentProps = {
  session: TAuthSession
}
function EmployeesContent({ session }: EmployeesContentProps) {
  const [activeOnly, setActiveOnly] = useState<boolean>(true)
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  const { data: employees, isLoading, isSuccess, isError, filters, setFilters } = useEmployees({ active: activeOnly })

  const [newEmployeeModalIsOpen, setNewEmployeeModalIsOpen] = useState<boolean>(false)
  const [editEmployeeModal, setEditEmployeeModal] = useState<TEditModal>({
    isOpen: false,
    id: null,
  })

  return (
    <div className="grow p-6">
      <div className="flex h-full grow flex-col">
        <div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <p className="text-center text-2xl font-black text-[#15599a] uppercase">CONTROLE DE COLABORADORES</p>
              <div className="flex items-center gap-2">
                <p className="text-primary/60 text-sm tracking-tight">{employees?.length || '...'} colaboradores contabilizados</p>
                <CheckboxInput
                  labelFalse="COLABORADORES ATIVOS"
                  labelTrue="COLABORADORES ATIVOS"
                  checked={activeOnly}
                  handleChange={(value) => setActiveOnly(value)}
                />
              </div>
            </div>
            {dropdownMenuVisible ? (
              <div className="text-primary/80 cursor-pointer hover:text-blue-400">
                <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
              </div>
            ) : (
              <div className="text-primary/80 cursor-pointer hover:text-blue-400">
                <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
              </div>
            )}
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Link href={'/adm/propriedades'}>
                <div className="enabled:hover:bg-primary/80 rounded bg-blue-900 px-4 py-1 text-sm font-medium whitespace-nowrap text-white shadow-sm enabled:hover:text-white disabled:bg-blue-500 disabled:text-white">
                  PROPRIEDADES
                </div>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setNewEmployeeModalIsOpen(true)}
              className="disabled:bg-primary/60 enabled:hover:bg-primary/80 h-9 rounded bg-gray-900 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm enabled:hover:text-white disabled:text-white"
            >
              NOVO COLABORADOR
            </button>
          </div>
          <AnimatePresence>
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
          </AnimatePresence>
        </div>
        <div className="flex w-full flex-wrap items-start justify-around gap-2 py-2">
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorComponent msg="Erro ao buscar usuários" /> : null}
          {isSuccess &&
            employees.map((employee, index: number) => (
              <EmployeeCard key={employee._id?.toString()} employee={employee} openModal={(id) => setEditEmployeeModal({ isOpen: true, id: id })} />
            ))}
        </div>
        {newEmployeeModalIsOpen ? <NewEmployee closeModal={() => setNewEmployeeModalIsOpen(false)} session={session} /> : null}
        {editEmployeeModal.isOpen && editEmployeeModal.id ? (
          <EditEmployee userId={editEmployeeModal.id} closeModal={() => setEditEmployeeModal({ isOpen: false, id: null })} session={session} />
        ) : null}
      </div>
    </div>
  )
}

export default Employees
