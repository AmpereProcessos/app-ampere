import React, { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import ModalOS from '../../components/ModalOS'
import LoadingPage from '../../components/utils/LoadingPage'

import { useServiceOrders, useServiceOrdersByResponsible } from '../../utils/methods/query/service-orders'
import Error from 'next/error'

import ResponsibleServiceOrderCard from '../../components/identificador/ordensDeServico/ResponsibleServiceOrderCard'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { Session } from 'next-auth'
import { getErrorMessage } from '@/utils/methods/handlers'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import Avatar from '@/components/utils/Avatar'
import { BsCalendar, BsCalendarPlus } from 'react-icons/bs'
import { BsCalendarCheck } from 'react-icons/bs'
import { Pencil, Tag, UserRound } from 'lucide-react'
import { FaLocationDot } from 'react-icons/fa6'
import { cn } from '@/lib/utils'
import { MdDashboard } from 'react-icons/md'
import { TServiceOrderSimplifiedDTO } from '@/utils/schemas/service-order'

function OSDaEquipe() {
  const { data: session, status } = useSession({ required: true })
  if (status != 'authenticated') return <LoadingComponent />
  if (!session?.user?.visualizacao.referencia) return <ErrorComponent msg="Você não tem permissão para acessar esta página." />
  return <AssignedServiceOrdersPage responsibleName={session?.user?.visualizacao.referencia} session={session} />
}

export default OSDaEquipe

type AssignedServiceOrdersPageProps = {
  responsibleName: string
  session: Session
}
function AssignedServiceOrdersPage({ responsibleName, session }: AssignedServiceOrdersPageProps) {
  const { data: orders, isLoading, isSuccess, isError, error } = useServiceOrdersByResponsible({ responsibleName })
  const [editModal, setEditModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null })
  return (
    <div className="flex grow flex-col bg-[#fff] p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <p className="text-center text-2xl font-black uppercase text-[#15599a]">ORDENS DE SERVIÇO DE {responsibleName}</p>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2"></div>

      {isSuccess ? (
        <div className="mt-4 flex flex-col justify-around gap-3">
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? (
            orders && orders.length > 0 ? (
              orders?.map((order, index) => (
                <ServiceOrderCard key={index} serviceOrder={order} handleClick={() => setEditModal({ isOpen: true, id: order._id })} />
              ))
            ) : (
              <div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhuma ordem de serviço encontrada.</div>
            )
          ) : null}
        </div>
      ) : null}
      {editModal.isOpen && editModal.id ? (
        <ModalOS
          session={session}
          orderId={editModal.id}
          closeModal={() => setEditModal({ isOpen: false, id: null })}
          modalIsOpen={editModal.isOpen}
          queryKey={['service-orders', null, null]}
        />
      ) : null}
    </div>
  )
}

type ServiceOrderCardProps = {
  serviceOrder: TServiceOrderSimplifiedDTO
  handleClick: (id: string) => void
}
function ServiceOrderCard({ serviceOrder, handleClick }: ServiceOrderCardProps) {
  function getStatusTag(serviceOrder: TServiceOrderSimplifiedDTO) {
    if (serviceOrder.status === 'PENDENTE')
      return <div className="rounded-full bg-red-600 px-2 py-0.5 text-[0.5rem] font-medium text-white">PENDENTE</div>
    if (serviceOrder.status === 'EM PLANEJAMENTO')
      return <div className="rounded-full bg-blue-800 px-2 py-0.5 text-[0.5rem] font-medium text-white">EM PLANEJAMENTO</div>
    if (serviceOrder.status === 'AGENDADA')
      return <div className="rounded-full bg-yellow-600 px-2 py-0.5 text-[0.5rem] font-medium text-white">AGENDADA</div>
    if (serviceOrder.status === 'EM EXECUÇÃO')
      return <div className="rounded-full bg-blue-600 px-2 py-0.5 text-[0.5rem] font-medium text-white">EM EXECUÇÃO</div>
    if (serviceOrder.status === 'CONCLUÍDA PARCIAL')
      return <div className="rounded-full bg-purple-600 px-2 py-0.5 text-[0.5rem] font-medium text-white">CONCLUÍDA PARCIAL</div>
    if (serviceOrder.status === 'CONCLUÍDA')
      return <h1 className="min-w-fit rounded-lg bg-green-500 px-2 py-0.5 text-[0.5rem] text-white">CONCLUÍDA</h1>
    if (serviceOrder.status === 'CANCELADA')
      return <h1 className="min-w-fit rounded-lg bg-gray-500 px-2 py-0.5 text-[0.5rem] text-white">CANCELADA</h1>

    return <h1 className="min-w-fit rounded-lg bg-primary px-2 py-0.5 text-[0.5rem] text-white">NÃO DEFINIDO</h1>
  }
  return (
    <div className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold leading-none tracking-tight">{serviceOrder.descricao}</p>
          {getStatusTag(serviceOrder)}
        </div>
        <div className="flex items-center gap-1">
          <UserRound size={12} />
          <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{serviceOrder.responsavel.nome}</h1>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
          <div className="flex items-center gap-1">
            <MdDashboard size={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{serviceOrder.categoria}</h1>
          </div>
          <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">ETIQUETAS</h1>
          {serviceOrder.etiquetas && serviceOrder.etiquetas?.length > 0 ? (
            serviceOrder.etiquetas.map((tag, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid',
                  borderColor: tag.cores.primaria,
                  color: tag.cores.primaria,
                  backgroundColor: tag.cores.secundaria,
                }}
                className={cn('flex items-center gap-1 rounded px-2 py-0.5')}
              >
                <Tag width={10} height={10} />
                <h1 className="text-[0.5rem] font-bold tracking-tight">{tag.titulo}</h1>
              </div>
            ))
          ) : (
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">NÃO DEFINIDAS</h1>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
          <div className="flex items-center gap-1">
            <FaLocationDot width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">LOCALIZAÇÃO</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {serviceOrder.localizacao.cidade} ({serviceOrder.localizacao.uf})
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendar width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">AGENDAMENTO</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {serviceOrder.agendamento
                ? `${formatDateAsLocale(serviceOrder.agendamento.inicio, true)} - ${
                    serviceOrder.agendamento.fim ? formatDateAsLocale(serviceOrder.agendamento.fim, true) : 'N/A'
                  }`
                : 'N/A'}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarCheck width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">EXECUÇÃO</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {serviceOrder.periodo.inicio
                ? `${formatDateAsLocale(serviceOrder.periodo.inicio, true)} - ${
                    serviceOrder.periodo.fim ? formatDateAsLocale(serviceOrder.periodo.fim, true) : 'N/A'
                  }`
                : 'N/A'}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(serviceOrder.dataInsercao, true)}</p>
          </div>
          {serviceOrder.dataEfetivacao ? (
            <div className="flex items-center gap-1">
              <BsCalendarCheck color="#22c55e" />
              <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(serviceOrder.dataEfetivacao, true)}</p>
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <Avatar
              url={serviceOrder.autor?.avatar_url || undefined}
              width={20}
              height={20}
              fallback={formatNameAsInitials(serviceOrder.autor?.nome || '')}
            />
            <p className="text-[0.65rem] font-medium text-primary/80">{serviceOrder.autor?.nome || ''}</p>
          </div>
        </div>
        <button
          onClick={() => handleClick(serviceOrder._id)}
          className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary"
        >
          <Pencil width={10} height={10} />
          <p>EDITAR</p>
        </button>
      </div>
    </div>
  )
}
