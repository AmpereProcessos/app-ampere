import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'

import { BsPatchCheckFill } from 'react-icons/bs'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { AiOutlineSearch } from 'react-icons/ai'

import ModalFormSolicitacao from '../../components/ModalFormSolicitacao'
import TagTipoDeServico from '../../components/TagTipoDeServico'
import LoadingPage from '../../components/utils/LoadingPage'
import FilterButton from '../../components/utils/Buttons/FilterButton'

import { useContractRequests } from '@/utils/methods/query/contract-requests'

import { tiposDeServico, vendedores } from '../../utils/constants'
import TextInput from '@/components/inputs/Text'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import { allSellers, serviceTypes } from '@/utils/select-options'
import ErrorComponent from '@/components/utils/ErrorComponent'
import RequestCard from '@/components/identificador/solicitacoesContrato/RequestCard'
import ContractRequestControlModal from '@/components/identificador/solicitacoesContrato/ControlModal'
function FormulariosSolicitacao() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
  })

  const { data: requests, isLoading, isError, isSuccess, filters, setFilters } = useContractRequests()
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState<boolean>(false)

  const [editModal, setEditModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })

  useEffect(() => {
    if (session) {
      const userRoutes = session?.user.permissoes.rotas || []
      if (!userRoutes.includes('PPS') && !userRoutes.includes('ADM')) router.push('/')
    }
  }, [session])
  if (status != 'authenticated') return <LoadingPage />

  return (
    <div className="flex grow flex-col p-6">
      <div className="flex w-full flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">
              SOLICITAÇÕES DE CONTRATO <strong className="text-[#fead41]">({requests?.length || '...'})</strong>
            </p>
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
        <AnimatePresence>
          {dropdownMenuVisible ? (
            <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                <TextInput
                  label={'NOME DO CONTRATO'}
                  value={filters.search}
                  placeholder={'Digite o nome do contrato...'}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                />
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={'100%'}
                    label={'VENDEDOR'}
                    selected={filters.seller}
                    options={allSellers}
                    selectedItemLabel={'SEM FILTRO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        seller: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        seller: [],
                      }))
                    }
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={'100%'}
                    label={'TIPO DE SERVIÇO'}
                    selected={filters.serviceType}
                    options={serviceTypes}
                    selectedItemLabel={'SEM FILTRO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        serviceType: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        serviceType: [],
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, pendingApproval: !prev.pendingApproval }))}
                  className={`rounded-md border border-orange-400 ${
                    filters.pendingApproval ? 'bg-orange-400 text-white' : 'bg-transparent text-orange-400'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  APROVAÇÃO PENDENTE
                </button>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, pendingApproval: !prev.pendingApproval }))}
                  className={`rounded-md border border-orange-400 ${
                    filters.pendingApproval ? 'bg-orange-400 text-white' : 'bg-transparent text-orange-400'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  CONFECÇÃO PENDENTE
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex w-full grow flex-col flex-wrap items-start justify-between gap-4 lg:flex-row">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar requisições de contrato.'} /> : null}
        {isSuccess && requests ? (
          requests.length > 0 ? (
            requests.map((request) => <RequestCard key={request._id} request={request} openModal={(id) => setEditModal({ id: id, isOpen: true })} />)
          ) : (
            <p className="w-full text-center italic text-gray-500">Nenhuma solicitação de contrato encontrada...</p>
          )
        ) : null}
      </div>
      {editModal.isOpen && editModal.id ? (
        <ContractRequestControlModal session={session} requestId={editModal.id} closeModal={() => setEditModal({ id: null, isOpen: false })} />
      ) : null}

      {/* {editModal.id && editModal.isOpen ? (
        <ModalFormSolicitacao
          editor={session?.user.permissoes.rotas?.includes('PPS') ? true : false}
          financeiroEditor={session?.user.permissoes.rotas?.includes('ADM') ? true : false}
          solicitacaoId={editModal.id}
          closeModal={() => setEditModal({ id: null, isOpen: false })}
          getFormularios={() => {}}
        />
      ) : null} */}
    </div>
  )
}

export default FormulariosSolicitacao
