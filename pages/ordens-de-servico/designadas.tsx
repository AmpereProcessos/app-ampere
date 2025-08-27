import { useSession } from '@/components/providers/SessionProvider'
import React, { useContext, useEffect, useState } from 'react'
import ModalOS from '../../components/ModalOS'

import { useServiceOrdersByResponsible } from '../../utils/methods/query/service-orders'

import Avatar from '@/components/utils/Avatar'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import UnauthenticatedComponent from '@/components/utils/UnauthenticatedComponent'
import type { TAuthSession } from '@/lib/authentication/types'
import { cn } from '@/lib/utils'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import type { TServiceOrderSimplifiedDTO } from '@/utils/schemas/service-order'
import { Pencil, Tag, UserRound } from 'lucide-react'
import { BsCalendar, BsCalendarPlus } from 'react-icons/bs'
import { BsCalendarCheck } from 'react-icons/bs'
import { FaLocationDot } from 'react-icons/fa6'
import { MdDashboard } from 'react-icons/md'

function OSDaEquipe() {
  const { session, status } = useSession()
  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />
  if (!session?.user?.visualizacao.referencia) return <ErrorComponent msg="Você não tem permissão para acessar esta página." />
  return <AssignedServiceOrdersPage responsibleName={session?.user?.visualizacao.referencia} session={session} />
}

export default OSDaEquipe

type AssignedServiceOrdersPageProps = {
  responsibleName: string
  session: TAuthSession
}
function AssignedServiceOrdersPage({ responsibleName, session }: AssignedServiceOrdersPageProps) {
  const { data: orders, isLoading, isSuccess, isError, error } = useServiceOrdersByResponsible({ responsibleName })
  const [editModal, setEditModal] = useState<{
    isOpen: boolean
    id: string | null
  }>({ isOpen: false, id: null })
  return (
    <div className="bg-background flex grow flex-col p-6">
      <div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
        <p className="text-center text-2xl font-black text-[#15599a] uppercase">ORDENS DE SERVIÇO DE {responsibleName}</p>
      </div>

      {isSuccess ? (
        <div className="mt-4 flex flex-col justify-around gap-3">
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? (
            orders && orders.length > 0 ? (
              orders?.map((order, index) => (
                <ServiceOrderCard key={order._id} serviceOrder={order} handleClick={() => setEditModal({ isOpen: true, id: order._id })} />
              ))
            ) : (
              <div className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Nenhuma ordem de serviço encontrada.</div>
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
    if (serviceOrder.status === 'PENDENTE') return <div className="text-xxs rounded-full bg-red-600 px-2 py-0.5 font-medium text-white">PENDENTE</div>

    if (serviceOrder.status === 'AGUARDANDO PLANEJAMENTO')
      return <div className="text-xxs rounded-full bg-blue-800 px-2 py-0.5 font-medium text-white">EM PLANEJAMENTO</div>

    if (serviceOrder.status === 'AGUARDANDO AGENDAMENTO')
      return <div className="text-xxs rounded-full bg-yellow-600 px-2 py-0.5 font-medium text-white">AGENDADA</div>

    if (serviceOrder.status === 'EM EXECUÇÃO')
      return <div className="text-xxs rounded-full bg-blue-600 px-2 py-0.5 font-medium text-white">EM EXECUÇÃO</div>

    if (serviceOrder.status === 'CONCLUÍDA PARCIAL')
      return <div className="text-xxs rounded-full bg-purple-600 px-2 py-0.5 font-medium text-white">CONCLUÍDA PARCIAL</div>

    if (serviceOrder.status === 'CONCLUÍDA') return <h1 className="text-xxs min-w-fit rounded-lg bg-green-500 px-2 py-0.5 text-white">CONCLUÍDA</h1>

    if (serviceOrder.status === 'CANCELADA') return <h1 className="text-xxs bg-primary/60 min-w-fit rounded-lg px-2 py-0.5 text-white">CANCELADA</h1>

    return <h1 className="bg-primary text-xxs min-w-fit rounded-lg px-2 py-0.5 text-white">NÃO DEFINIDO</h1>
  }
  return (
    <div className="border-primary bg-background flex w-full flex-col gap-1 rounded border p-2 shadow-xs dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm leading-none font-bold tracking-tight">{serviceOrder.descricao}</p>
          {getStatusTag(serviceOrder)}
        </div>
        <div className="flex items-center gap-1">
          <UserRound size={12} />
          <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">{serviceOrder.responsavel.nome}</h1>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
          <div className="flex items-center gap-1">
            <MdDashboard size={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">{serviceOrder.categoria}</h1>
          </div>
          <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">ETIQUETAS</h1>
          {serviceOrder.etiquetas && serviceOrder.etiquetas?.length > 0 ? (
            serviceOrder.etiquetas.map((tag, index) => (
              <div
                key={tag._id}
                style={{
                  border: '1px solid',
                  borderColor: tag.cores.primaria,
                  color: tag.cores.primaria,
                  backgroundColor: tag.cores.secundaria,
                }}
                className={cn('flex items-center gap-1 rounded px-2 py-0.5')}
              >
                <Tag width={10} height={10} />
                <h1 className="text-xxs font-bold tracking-tight">{tag.titulo}</h1>
              </div>
            ))
          ) : (
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">NÃO DEFINIDAS</h1>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
          <div className="flex items-center gap-1">
            <FaLocationDot width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">LOCALIZAÇÃO</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {serviceOrder.localizacao.cidade} ({serviceOrder.localizacao.uf})
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendar width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">AGENDAMENTO</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {serviceOrder.agendamento
                ? `${formatDateAsLocale(serviceOrder.agendamento.inicio, true)} - ${serviceOrder.agendamento.fim ? formatDateAsLocale(serviceOrder.agendamento.fim, true) : 'N/A'}`
                : 'N/A'}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarCheck width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">EXECUÇÃO</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {serviceOrder.periodo.inicio
                ? `${formatDateAsLocale(serviceOrder.periodo.inicio, true)} - ${serviceOrder.periodo.fim ? formatDateAsLocale(serviceOrder.periodo.fim, true) : 'N/A'}`
                : 'N/A'}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(serviceOrder.dataInsercao, true)}</p>
          </div>
          {serviceOrder.dataEfetivacao ? (
            <div className="flex items-center gap-1">
              <BsCalendarCheck color="#22c55e" />
              <p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(serviceOrder.dataEfetivacao, true)}</p>
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <Avatar
              url={serviceOrder.autor?.avatar_url || undefined}
              width={20}
              height={20}
              fallback={formatNameAsInitials(serviceOrder.autor?.nome || '')}
            />

            <p className="text-primary/80 text-[0.65rem] font-medium">{serviceOrder.autor?.nome || ''}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleClick(serviceOrder._id)}
          className="bg-primary text-secondary flex items-center gap-1 rounded-lg px-2 py-1 text-[0.6rem]"
        >
          <Pencil width={10} height={10} />
          <p>EDITAR</p>
        </button>
      </div>
    </div>
  )
}
