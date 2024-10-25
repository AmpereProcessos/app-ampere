import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'

import { BsPatchCheckFill } from 'react-icons/bs'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { AiOutlineSearch } from 'react-icons/ai'

import LoadingPage from '../../components/utils/LoadingPage'
import FilterButton from '../../components/utils/Buttons/FilterButton'

import { useContractRequests, useContractRequestsByFilters } from '@/utils/methods/query/contract-requests'

import { tiposDeServico, vendedores } from '../../utils/constants'
import TextInput from '@/components/inputs/Text'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import { allSellers, serviceTypes } from '@/utils/select-options'
import ErrorComponent from '@/components/utils/ErrorComponent'
import RequestCard from '@/components/identificador/solicitacoesContrato/RequestCard'
import ContractRequestControlModal from '@/components/identificador/solicitacoesContrato/ControlModal'
import { Button } from '@/components/ui/button'
import { ListFilter } from 'lucide-react'
import GeneralPaginationComponent from '@/components/utils/Pagination'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { getErrorMessage } from '@/utils/methods/handlers'
import ContractRequestsFilterMenu from '@/components/identificador/solicitacoesContrato/FiltersMenu'

function ContractRequestFormsPage() {
  const { data: session, status } = useSession({ required: true })
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)
  const [editContractRequestModal, setEditContractRequestModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })
  const { data: contractRequestsByFiltersResult, isLoading, isError, isSuccess, error, filters, updateFilters } = useContractRequestsByFilters()

  const contractRequests = contractRequestsByFiltersResult?.contractRequests
  const contractRequestsMatched = contractRequestsByFiltersResult?.contractRequestsMatched || 0
  const contractRequestsShowing = contractRequests?.length || 0
  const totalPages = contractRequestsByFiltersResult?.totalPages || 0

  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full flex-col items-center justify-between gap-2 gap-y-3 lg:flex-row ">
          <div className="flex flex-col items-center  gap-1 lg:flex-row">
            <div className="flex items-center gap-1">
              {filterMenuIsOpen ? (
                <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                  <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuIsOpen(false)} />
                </div>
              ) : (
                <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                  <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuIsOpen(true)} />
                </div>
              )}
              <p className="text-center text-2xl font-black uppercase text-[#15599a]">SOLICITAÇÕES DE CONTRATO</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button onClick={() => setFilterMenuIsOpen((prev) => !prev)} className="flex items-center gap-1">
              <ListFilter height={15} width={15} />
              <h1>FILTRAR</h1>
            </Button>
          </div>
        </div>
        {filterMenuIsOpen ? (
          <ContractRequestsFilterMenu
            filters={filters}
            updateFilters={updateFilters}
            queryLoading={isLoading}
            resetSelectedPage={() => updateFilters({ page: 1 })}
          />
        ) : null}
      </div>
      <GeneralPaginationComponent
        activePage={filters.page}
        queryLoading={isLoading}
        selectPage={(page) => updateFilters({ page })}
        totalPages={totalPages || 0}
        itemsMatchedText={
          contractRequestsMatched > 1 ? `${contractRequestsMatched} solicitações encontradas.` : `${contractRequestsMatched} solicitação encontrada.`
        }
        itemsShowingText={
          contractRequestsShowing > 1 ? `Mostrando ${contractRequestsShowing} solicitações.` : `Mostrando ${contractRequestsShowing} solicitação.`
        }
      />
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
        {isSuccess ? (
          contractRequests && contractRequests.length > 0 ? (
            contractRequests.map((request) => (
              <RequestCard key={request._id} request={request} openModal={(id) => setEditContractRequestModal({ id: id, isOpen: true })} />
            ))
          ) : (
            <div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhuma solicitação de contrato encontrada.</div>
          )
        ) : null}
      </div>
      {editContractRequestModal.id && editContractRequestModal.isOpen ? (
        <ContractRequestControlModal
          session={session}
          requestId={editContractRequestModal.id}
          closeModal={() => setEditContractRequestModal({ id: null, isOpen: false })}
        />
      ) : null}
    </div>
  )
}
export default ContractRequestFormsPage
