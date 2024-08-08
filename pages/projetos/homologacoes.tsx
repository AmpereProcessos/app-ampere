import ControlHomologation from '@/components/identificador/crm-homologacoes/ControlHomologation'
import NewHomologation from '@/components/identificador/crm-homologacoes/NewHomologation'
import FilterMenu from '@/components/identificador/crm-homologacoes/Utils/FilterMenu'
import HomologationCard from '@/components/identificador/crm-homologacoes/Utils/HomologationCard'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { useHomologations } from '@/utils/methods/query/crm/homologations'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

function HomologationsControlPage() {
  const { data: session, status } = useSession({ required: true })
  const { data: homologations, isLoading, isError, isSuccess, filters, setFilters } = useHomologations()
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)
  const [newHomologationModalIsOpen, setNewHomologationModalIsOpen] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })

  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
      <div className="flex flex-col items-center border-b border-[#000] pb-2">
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
              <h1 className="text-xl font-black leading-none tracking-tight md:text-2xl">CONTROLE DE HOMOLOGAÇÕES</h1>
              <p className="text-sm leading-none tracking-tight text-gray-500">
                {homologations?.length
                  ? homologations.length > 0
                    ? `${homologations.length} homologações contabilizadas`
                    : `${homologations.length} homologação contabilizada`
                  : '...'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setNewHomologationModalIsOpen(true)}
            className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
          >
            CRIAR HOMOLOGAÇÃO
          </button>
        </div>
        {filterMenuIsOpen ? <FilterMenu filters={filters} setFilters={setFilters} /> : null}
      </div>
      <div className="flex flex-wrap justify-between gap-2 py-2">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg="Erro ao buscar homologações." /> : null}
        {isSuccess ? (
          homologations.length > 0 ? (
            homologations.map((homologation) => (
              <HomologationCard
                key={homologation._id}
                homologation={homologation}
                handleClick={(id) => setEditModal({ id: id, isOpen: true })}
                userHasEditPermission={true}
              />
            ))
          ) : (
            <p className="flex w-full grow items-center justify-center py-2 text-center font-medium italic tracking-tight text-gray-500">
              Não foram encontradas homologações...
            </p>
          )
        ) : null}
      </div>
      {newHomologationModalIsOpen ? (
        <NewHomologation session={session} affectedQueryKey={['homologations']} closeModal={() => setNewHomologationModalIsOpen(false)} />
      ) : null}
      {editModal.isOpen && editModal.id ? (
        <ControlHomologation session={session} homologationId={editModal.id} closeModal={() => setEditModal({ id: null, isOpen: false })} />
      ) : null}
    </div>
  )
}

export default HomologationsControlPage
