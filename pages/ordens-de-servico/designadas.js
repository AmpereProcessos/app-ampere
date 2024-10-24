import React, { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import ModalOS from '../../components/ModalOS'
import LoadingPage from '../../components/utils/LoadingPage'

import { useServiceOrders } from '../../utils/methods/query/service-orders'
import Error from 'next/error'

import ResponsibleServiceOrderCard from '../../components/identificador/ordensDeServico/ResponsibleServiceOrderCard'

function OSDaEquipe() {
  const { data: session, status } = useSession({ required: true })
  // const {
  //   data: orders,
  //   isLoading,
  //   isSuccess,
  //   isError,
  // } = useServiceOrders({
  //   after: null,
  //   before: null,
  //   status: 'EM ABERTO',
  //   simplified: false,
  //   enabled: !!session?.user?.visualizacao.referencia,
  //   responsibleName: session?.user?.visualizacao.referencia,
  // })
  // const [modalInfo, setModalInfo] = useState({
  //   isOpen: false,
  //   orderId: null,
  // })
  if (status == 'loading') return <LoadingPage />
  if (status != 'authenticated') return <Error />
  return <AssignedServiceOrdersPage session={session} />
  // return (
  //   <div className="flex grow flex-col bg-[#fff] p-6">
  //     <div className="flex items-center border-b border-gray-200 pb-2">
  //       <h1 className="text-xl font-bold text-[#15599a]">ORDENS DE SERVIÇO EM ABERTO</h1>
  //     </div>
  //     {isLoading ? <LoadingPage /> : null}
  //     {isError ? (
  //       <div className="flex w-full grow flex-col items-center justify-center">
  //         <p className="text-center text-xs italic text-gray-500">Houve um erro ao buscar ordens de serviço.</p>
  //       </div>
  //     ) : null}
  //     {isSuccess ? (
  //       <div className="mt-4 flex flex-wrap justify-around gap-3">
  //         {orders
  //           ? orders?.map((order, index) => (
  //               <ResponsibleServiceOrderCard key={index} order={order} handleOpenModal={() => setModalInfo({ isOpen: true, orderId: order._id })} />
  //             ))
  //           : null}
  //       </div>
  //     ) : null}
  //     {modalInfo.isOpen && modalInfo.orderId ? (
  //       <ModalOS
  //         orderId={modalInfo.orderId}
  //         closeModal={() => setModalInfo({ isOpen: false, orderId: null })}
  //         modalIsOpen={modalInfo.isOpen}
  //         queryKey={['service-orders', null, null]}
  //       />
  //     ) : null}
  //   </div>
  // )
}

export default OSDaEquipe

function AssignedServiceOrdersPage({ session }) {
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
    enabled: !!session?.user?.visualizacao.referencia,
    responsibleName: session?.user?.visualizacao.referencia,
  })
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    orderId: null,
  })
  return (
    <div className="flex grow flex-col bg-[#fff] p-6">
      <div className="flex items-center border-b border-gray-200 pb-2">
        <h1 className="text-xl font-bold text-[#15599a]">ORDENS DE SERVIÇO EM ABERTO</h1>
      </div>
      {isLoading ? <LoadingPage /> : null}
      {isError ? (
        <div className="flex w-full grow flex-col items-center justify-center">
          <p className="text-center text-xs italic text-gray-500">Houve um erro ao buscar ordens de serviço.</p>
        </div>
      ) : null}
      {isSuccess ? (
        <div className="mt-4 flex flex-wrap justify-around gap-3">
          {orders
            ? orders?.map((order, index) => (
                <ResponsibleServiceOrderCard key={index} order={order} handleOpenModal={() => setModalInfo({ isOpen: true, orderId: order._id })} />
              ))
            : null}
        </div>
      ) : null}
      {modalInfo.isOpen && modalInfo.orderId ? (
        <ModalOS
          session={session}
          orderId={modalInfo.orderId}
          closeModal={() => setModalInfo({ isOpen: false, orderId: null })}
          modalIsOpen={modalInfo.isOpen}
          queryKey={['service-orders', null, null]}
        />
      ) : null}
    </div>
  )
}
