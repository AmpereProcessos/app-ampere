import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'

import TextInput from '@/components/inputs/Text'
import DateInput from '@/components/inputs/Date'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'

import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '../../components/utils/LoadingPage'
import FormAlmoxarifadoCard from '../../components/FormAlmoxarifadoCard'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

import { useWarehouseForms } from '@/utils/methods/query/warehouse-forms'
import { formatDate } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import ModalNewFormulary from '../../components/ModalNovoFormAlmoxarifado'
import ModalEditFormulary from '../../components/ModalFormAlmoxarifado'

import { useQueryClient } from 'react-query'
const currentDate = dayjs()
const beforeParam = currentDate.toISOString()
const afterParam = currentDate.subtract(3, 'month').toISOString()

function Formularios() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })
  const [dateParam, setDateParam] = useState<{ after: string; before: string }>({
    after: afterParam,
    before: beforeParam,
  })
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const { data: forms, isLoading, isError, isSuccess, filters, setFilters } = useWarehouseForms({ after: dateParam.after, before: dateParam.before })

  const [newFormModalIsOpen, setNewFormModalIsOpen] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalForm, setModalForm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  })

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
          {/* <div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">PROJETOS NO ESTÁGIO</h1>
                <VscDiffAdded />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).projetos}</div>
                <p className="text-xs text-gray-500">{getStats({ info: projects }).potencia} kWp</p>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">FATURAMENTO</h1>
                <MdAttachMoney />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).vendido} </div>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">EM CONFECÇÃO</h1>
                <MdCreate />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).confeccionar}</div>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">PARA ASSINAR</h1>
                <FaSignature />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).assinar}</div>
                <p className="text-xs text-gray-500">{getStats({ info: projects }).vendidoAssinar} para assinar</p>
              </div>
            </div>
          </div> */}
          <AnimatePresence>
            {dropdownMenuVisible ? (
              <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
                <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                  <TextInput
                    label={'NOME DO FORMULÁRIO...'}
                    value={filters.search}
                    placeholder={'Preencha aqui o nome do formulário...'}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, identifier: value }))}
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
              forms.map((form, index) => (
                <FormAlmoxarifadoCard key={form._id} form={form} openModal={(id) => setModalForm({ isOpen: true, id: id })} />
              ))
            ) : (
              <p>Nenhum formulário encontrado para o parâmetros de filtro.</p>
            )}
          </div>
        ) : null}

        {modalForm.isOpen && modalForm.id ? (
          <ModalEditFormulary
            session={session}
            formId={modalForm.id}
            invalidateQuery={async () => await queryClient.invalidateQueries({ queryKey: ['warehouse-forms', dateParam.after, dateParam.before] })}
            closeModal={() => setModalForm({ isOpen: false, id: null })}
          />
        ) : null}
        {newFormModalIsOpen && (
          <ModalNewFormulary
            session={session}
            invalidateQuery={async () => await queryClient.invalidateQueries({ queryKey: ['warehouse-forms', dateParam.after, dateParam.before] })}
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
