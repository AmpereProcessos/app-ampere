import ServiceOrdersFilterMenu from '@/components/identificador/ordensDeServico/FilterMenu'
import ServiceOrderCard from '@/components/identificador/ordensDeServico/ServiceOrderCard'
import ServiceOrdersPagination from '@/components/identificador/ordensDeServico/ServiceOrdersPagination'
import ModalOrdemServico from '@/components/ModalOrdemServico'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { useServiceOrdersByPersonalizedFilters } from '@/utils/methods/query/service-orders'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

function MainServiceOrdersPage() {
  const { data: session, status } = useSession({ required: true })
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)

  const { data, isLoading, isError, isSuccess, updateFilters } = useServiceOrdersByPersonalizedFilters({ page })
  const [editModal, setEditModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })
  const serviceOrders = data?.serviceOrders
  const serviceOrdersMatched = data?.serviceOrdersMatched
  const totalPages = data?.totalPages

  if (status != 'authenticated') return <LoadingPage />

  return (
    <div className="grow p-6">
      <div className="flex w-full flex-col gap-2 border-b border-gray-200 p-1">
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
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
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-black uppercase text-[#15599a]">BANCO DE ORDENS DE SERVIÇO</h1>
            </div>
          </div>
        </div>
        {filterMenuIsOpen ? (
          <ServiceOrdersFilterMenu updateFilters={updateFilters} queryLoading={isLoading} resetSelectedPage={() => setPage(1)} />
        ) : null}
      </div>
      <ServiceOrdersPagination
        activePage={page}
        selectPage={(page) => setPage(page)}
        queryLoading={isLoading}
        totalPages={totalPages || 0}
        serviceOrdersMatched={serviceOrdersMatched}
        serviceOrdersShowing={serviceOrders?.length}
      />
      <div className="mt-4 flex flex-wrap justify-between gap-2 py-2">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar ordens de serviço.'} /> : null}
        {isSuccess && serviceOrders ? (
          serviceOrders.length > 0 ? (
            serviceOrders.map((serviceOrder) => (
              <ServiceOrderCard key={serviceOrder._id} serviceOrder={serviceOrder} handleClick={(id) => setEditModal({ id: id, isOpen: true })} />
            ))
          ) : (
            <p className="w-full py-2 text-center font-medium text-gray-500">Nenhuma ordem de serviço encontrada.</p>
          )
        ) : null}
      </div>
      {editModal.id && editModal.isOpen ? (
        <ModalOrdemServico orderId={editModal.id} modalIsOpen={editModal.isOpen} closeModal={() => setEditModal({ id: null, isOpen: false })} />
      ) : null}
      <Link href={'/ordemDeServico/designacoes'}>
        <div className="left-150 fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
          <p className="text-sm font-bold uppercase">DESIGNAÇÃO DE OSS</p>
        </div>
      </Link>
    </div>
  )
}

export default MainServiceOrdersPage
