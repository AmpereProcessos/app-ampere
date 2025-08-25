import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from '@/components/providers/SessionProvider'
import type { TAuthSession } from '@/lib/authentication/types'
import { AnimatePresence, motion } from 'framer-motion'

import TextInput from '@/components/inputs/Text'
import DateInput from '@/components/inputs/Date'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'

import ModalNewFormulary from '../../../components/identificador/almoxarifado/formulario/NewForm'
import ModalEditFormulary from '../../../components/identificador/almoxarifado/formulario/EditForm'

import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '../../../components/utils/LoadingPage'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

import { useWarehouseForms } from '@/utils/methods/query/warehouse-forms'
import { formatDate } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { useQueryClient } from '@tanstack/react-query'
import FormularyCard from '@/components/identificador/almoxarifado/formulario/FormularyCard'
import { getPeriodDateParamsByReferenceDate } from '@/utils/methods/dates'

type TDateParam = {
  after: string
  before: string
}

type TEditModal = {
  isOpen: boolean
  id: string | null
}

const currentDate = new Date()

const { start, end } = getPeriodDateParamsByReferenceDate({ reference: currentDate, type: 'year' })
function Formularios() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { session, status } = useSession({ required: true })

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  const [dateParam, setDateParam] = useState<TDateParam>({ after: start.toISOString(), before: end.toISOString() })

  const { data: forms, isLoading, isError, isSuccess, filters, setFilters } = useWarehouseForms({ after: dateParam.after, before: dateParam.before })

  const [newFormModalIsOpen, setNewFormModalIsOpen] = useState(false)
  const [modalForm, setModalForm] = useState<TEditModal>({ isOpen: false, id: null })
  if (status !== 'authenticated') return <LoadingPage />

  return (
    <div className="grow p-6">
      <div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">
              FORMULÁRIOS DE SAÍDA <strong className="text-[#fead41]">({forms?.length || '...'})</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-x-2">
              <div className="mt-2 w-full lg:mt-0 lg:w-[250px]">
                <DateInput
                  width={'100%'}
                  label={'DEPOIS DE'}
                  showLabel={false}
                  value={dateParam.after ? formatDate(dateParam.after) : undefined}
                  handleChange={(value) => setDateParam((prev) => ({ ...prev, after: formatDateInputChange(value) as string }))}
                />
              </div>
              <h1 className="font-bold">ATÉ</h1>
              <div className="w-full lg:w-[250px]">
                <DateInput
                  width={'100%'}
                  label={'ANTES DE'}
                  showLabel={false}
                  value={dateParam.before ? formatDate(dateParam.before) : undefined}
                  handleChange={(value) => setDateParam((prev) => ({ ...prev, before: formatDateInputChange(value) as string }))}
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
        </div>
        <AnimatePresence>
          {dropdownMenuVisible ? (
            <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
              <div className="flex flex-col flex-wrap items-end justify-center gap-2 lg:flex-row">
                <TextInput
                  label={'NOME DO FORMULÁRIO...'}
                  value={filters.search}
                  placeholder={'Preencha aqui o nome do formulário...'}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                />

                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={'100%'}
                    label={'TIPO DE SERVIÇO'}
                    selected={filters.services}
                    options={[
                      { id: 1, label: 'PADRÃO', value: 'PADRÃO' },
                      { id: 2, label: 'ESTRUTURA', value: 'ESTRUTURA' },
                      { id: 3, label: 'MONTAGEM', value: 'MONTAGEM' },
                      { id: 4, label: 'MANUTENÇÃO CORRETIVA', value: 'MANUTENÇÃO CORRETIVA' },
                      { id: 5, label: 'MANUTENÇÃO PREVENTIVA', value: 'MANUTENÇÃO PREVENTIVA' },
                    ]}
                    selectedItemLabel={'SEM FILTRO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        services: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        services: [],
                      }))
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, done: !prev.done }))}
                  className={`rounded-md border border-blue-600 ${
                    filters.done ? 'bg-blue-600 text-white' : 'bg-transparent text-blue-600'
                  } h-[49px] px-4 py-1 text-sm font-bold text-white`}
                >
                  FINALIZADOS
                </button>
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, notDone: !prev.notDone }))}
                  className={`rounded-md border border-orange-600 ${
                    filters.notDone ? 'bg-orange-600 text-white' : 'bg-transparent text-orange-600'
                  } h-[49px] px-4 py-1 text-sm font-bold text-white`}
                >
                  EM ABERTO
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      {isLoading ? <LoadingPage /> : null}
      {isError ? <ErrorComponent msg={'Erro ao buscar formulários.'} /> : null}
      {isSuccess ? (
        <div className="mt-4 flex grow flex-wrap justify-around gap-3">
          {forms.length > 0 ? (
            forms.map((form) => <FormularyCard key={form._id} formulary={form} openModal={(id) => setModalForm({ isOpen: true, id: id })} />)
          ) : (
            <p className="text-primary/60 w-full text-center font-medium italic">Nenhum formulário encontrado para o parâmetros de filtro.</p>
          )}
        </div>
      ) : null}

      {modalForm.isOpen && modalForm.id ? (
        <ModalEditFormulary
          session={session}
          formularyId={modalForm.id}
          invalidateQuery={async () => {
            await queryClient.cancelQueries({ queryKey: ['warehouse-forms', dateParam.after, dateParam.before] })
            await queryClient.invalidateQueries({ queryKey: ['warehouse-forms', dateParam.after, dateParam.before] })
          }}
          closeModal={() => setModalForm({ isOpen: false, id: null })}
        />
      ) : null}
      {newFormModalIsOpen && (
        <ModalNewFormulary
          session={session}
          invalidateQuery={async () => {
            await queryClient.cancelQueries({ queryKey: ['warehouse-forms', dateParam.after, dateParam.before] })
            await queryClient.invalidateQueries({ queryKey: ['warehouse-forms', dateParam.after, dateParam.before] })
          }}
          closeModal={() => setNewFormModalIsOpen(false)}
        />
      )}
      <button
        type="button"
        onClick={() => setNewFormModalIsOpen(true)}
        className="fixed bottom-10 left-150 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]"
      >
        <p className="text-sm font-bold uppercase">Novo Formulário</p>
      </button>
    </div>
  )
}

export default Formularios
