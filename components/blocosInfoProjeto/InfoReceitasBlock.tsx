import { useProjectRevenues } from '@/utils/methods/query/revenues'
import React, { useState } from 'react'
import LoadingPage from '../utils/LoadingPage'
import ErrorComponent from '../utils/ErrorComponent'
import RevenueCard from '../identificador/receitas/RevenueCard'
import EditRevenue from '../identificador/receitas/EditRevenue'
import { Session } from 'next-auth'
import NewRevenueMenu from '../identificador/receitas/NewRevenueMenu'

type InfoReceitasBlockProps = {
  session: Session
  projectId: string
  projectName: string
  projectIdentificator: string
}
function InfoReceitasBlock({ session, projectId, projectName, projectIdentificator }: InfoReceitasBlockProps) {
  const { data: revenues, isLoading, isError, isSuccess } = useProjectRevenues({ projectId })

  const [newRevenueMenuIsOpen, setNewRevenueMenuIsOpen] = useState<boolean>(false)
  const [modalRevenue, setModalRevenue] = useState<{ isOpen: boolean; id: null | string }>({
    isOpen: false,
    id: null,
  })
  return (
    <div className="flex flex-col rounded-md border border-green-400 pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-green-400 py-2 text-center font-bold text-white">RECEITAS</span>
      <div className="flex w-full items-center justify-end px-2">
        {newRevenueMenuIsOpen ? (
          <button onClick={() => setNewRevenueMenuIsOpen(false)} className="rounded-md bg-[#ed174c] py-1 px-4 text-sm font-bold text-white">
            FECHAR
          </button>
        ) : (
          <button onClick={() => setNewRevenueMenuIsOpen(true)} className="rounded-md bg-green-400 py-1 px-4 text-sm font-bold text-white">
            NOVA RECEITA
          </button>
        )}
      </div>
      {newRevenueMenuIsOpen ? (
        <NewRevenueMenu session={session} projectId={projectId} projectName={projectName} projectIdentificator={projectIdentificator} />
      ) : null}
      <div className="mt-4 flex w-full flex-col flex-wrap items-start justify-center gap-4 px-2 lg:flex-row">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar receitas.'} /> : null}
        {isSuccess && revenues ? (
          revenues.length > 0 ? (
            revenues.map((revenue) => (
              <RevenueCard key={revenue._id} revenue={revenue} openModal={(id) => setModalRevenue({ isOpen: true, id: id })} />
            ))
          ) : (
            <p className="w-full text-center italic text-gray-500">Nenhuma receita encontrada...</p>
          )
        ) : null}
      </div>
      {modalRevenue.isOpen && modalRevenue.id ? (
        <EditRevenue session={session} revenueId={modalRevenue.id} closeModal={() => setModalRevenue({ isOpen: false, id: null })} />
      ) : null}
    </div>
  )
}

export default InfoReceitasBlock
