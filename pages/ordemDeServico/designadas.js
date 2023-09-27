import React, { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import ModalOS from '../../components/ModalOS'
import LoadingPage from '../../components/utils/LoadingPage'
import { AppContext } from '../../context/AppContext'
import { useServiceOrders } from '../../utils/methods/query/serviceOrders'
import Error from 'next/error'

import ResponsibleServiceOrderCard from '../../components/identificador/ordensDeServico/ResponsibleServiceOrderCard'

function OSDaEquipe() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })
  const {
    data: orders,
    isLoading,
    isSuccess,
    isError,
  } = useServiceOrders({
    after: null,
    before: null,
    status: 'EM ABERTO',
    simplified: false,
    enabled: !!session?.user?.equipe,
    responsibleName: session?.user?.equipe,
  })
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    orderId: null,
  })
  if (status == 'loading') return <LoadingPage />
  if (status != 'authenticated') return <Error />

  return (
    <div className="flex flex-col p-6 grow bg-[#fff]">
      <div className="flex items-center pb-2 border-b border-gray-200">
        <h1 className="text-[#15599a] font-bold text-xl">ORDENS DE SERVIÇO EM ABERTO</h1>
      </div>
      {isLoading ? <LoadingPage /> : null}
      {isError ? (
        <div className="w-full grow flex flex-col items-center justify-center">
          <p className="text-center text-xs text-gray-500 italic">Houve um erro ao buscar ordens de serviço.</p>
        </div>
      ) : null}
      {isSuccess ? (
        <div className="flex flex-wrap mt-4 gap-3 justify-around">
          {orders
            ? orders?.map((order, index) => (
                <ResponsibleServiceOrderCard key={index} order={order} handleOpenModal={() => setModalInfo({ isOpen: true, orderId: order._id })} />
              ))
            : null}
        </div>
      ) : null}
      {modalInfo.isOpen && modalInfo.orderId ? (
        <ModalOS
          orderId={modalInfo.orderId}
          closeModal={() => setModalInfo({ isOpen: false, orderId: null })}
          modalIsOpen={modalInfo.isOpen}
          queryKey={['service-orders', null, null]}
        />
      ) : null}
    </div>
  )
}

export default OSDaEquipe
