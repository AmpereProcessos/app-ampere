import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'

import TextInput from '@/components/inputs/Text'
import DateInput from '@/components/inputs/Date'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'

import ModalNewFormulary from '../../../components/identificador/almoxarifado/formulario/NewForm'
import ModalEditFormulary from '../../../components/identificador/almoxarifado/formulario/EditForm'

import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '../../../components/utils/LoadingPage'
import FormAlmoxarifadoCard from '../../../components/FormAlmoxarifadoCard'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

import { useNewWarehouseForms, useWarehouseForms } from '@/utils/methods/query/warehouse-forms'
import { formatDate } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { useQueryClient } from 'react-query'
import FormularyCard from '@/components/identificador/almoxarifado/formulario/FormularyCard'
import { getFirstDayOfMonth, getLastDayOfMonth } from '@/utils/methods/dates'

type TDateParam = {
  after: string
  before: string
}

type TEditModal = {
  isOpen: boolean
  id: string | null
}

const referenceDate = dayjs().subtract(6, 'month')
const referenceYear = referenceDate.get('year')
const referenceMonth = referenceDate.get('month')
const afterParam = getFirstDayOfMonth({ year: referenceYear, month: referenceMonth, resetHour: true })
const beforeParam = getLastDayOfMonth({ resetHour: true })

function Formularios() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session, status } = useSession({ required: true, onUnauthenticated: () => router.push('/auth/signin') })

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  const [dateParam, setDateParam] = useState<TDateParam>({ after: afterParam, before: beforeParam })

  const { data: forms, isLoading, isError, isSuccess, filters, setFilters } = useWarehouseForms({ after: dateParam.after, before: dateParam.before })

  const [newFormModalIsOpen, setNewFormModalIsOpen] = useState(false)
  const [modalForm, setModalForm] = useState<TEditModal>({ isOpen: false, id: null })
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="grow p-6">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <p className="text-center text-2xl font-black uppercase text-[#15599a]">
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
                    handleChange={(value) => setDateParam((prev) => ({ ...prev, after: formatDateInputChange(value) }))}
                  />
                </div>
                <h1 className="font-bold">ATÉ</h1>
                <div className="w-full lg:w-[250px]">
                  <DateInput
                    width={'100%'}
                    label={'ANTES DE'}
                    showLabel={false}
                    value={dateParam.before ? formatDate(dateParam.before) : undefined}
                    handleChange={(value) => setDateParam((prev) => ({ ...prev, before: formatDateInputChange(value) }))}
                  />
                </div>
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
                    onClick={() => setFilters((prev) => ({ ...prev, done: !prev.done }))}
                    className={`rounded-md border border-blue-600 ${
                      filters.done ? 'bg-blue-600 text-white' : 'bg-transparent text-blue-600'
                    }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                  >
                    FINALIZADOS
                  </button>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, notDone: !prev.notDone }))}
                    className={`rounded-md border border-orange-600 ${
                      filters.notDone ? 'bg-orange-600 text-white' : 'bg-transparent text-orange-600'
                    }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
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
              forms.map((form, index) => <FormularyCard key={form._id} formulary={form} openModal={(id) => setModalForm({ isOpen: true, id: id })} />)
            ) : (
              <p className="w-full text-center font-medium italic text-gray-500">Nenhum formulário encontrado para o parâmetros de filtro.</p>
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
        <div
          onClick={() => setNewFormModalIsOpen(true)}
          className="left-150 fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]"
        >
          <p className="text-sm font-bold uppercase">Novo Formulário</p>
        </div>
      </div>
    )
  }
}

export default Formularios
