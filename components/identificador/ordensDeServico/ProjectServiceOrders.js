import React, { useState } from 'react'
import { useProjectServiceOrders } from '../../../utils/methods/query/service-orders'
import LoadingPage from '../../utils/LoadingPage'
import ProjectServiceOrderCard from './ProjectServiceOrderCard'
import ModalOrdemServico from '../../ModalOrdemServico'

function ProjectServiceOrders({ projectId }) {
  const [editServiceOrder, setEditServiceOrder] = useState({ id: null, isOpen: false })
  const { data: orders, isLoading, isSuccess, isError } = useProjectServiceOrders({ projectId, enabled: !!projectId })
  if (isError)
    return (
      <div className="flex h-[60px] items-center justify-center">
        <p className="text-center italic text-gray-500 ">Houve um erro ao buscar as ordens de serviço vinculadas a esse projeto...</p>
      </div>
    )
  if (isLoading)
    return (
      <div className="flex h-[60px] items-center justify-center">
        <LoadingPage />
      </div>
    )
  if (isSuccess && orders)
    return (
      <div className="my-2 flex w-full flex-col gap-2">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <ProjectServiceOrderCard
              key={index}
              order={order}
              projectId={projectId}
              handleClick={(id) => setEditServiceOrder({ id: id, isOpen: true })}
            />
          ))
        ) : (
          <div className="flex h-[60px] items-center justify-center">
            <p className="text-center italic text-gray-500 ">Não há ordens de serviço vinculadas a esse projeto...</p>
          </div>
        )}
        {editServiceOrder.id && editServiceOrder.isOpen ? (
          <ModalOrdemServico
            orderId={editServiceOrder.id}
            modalIsOpen={editServiceOrder.isOpen}
            closeModal={() => setEditServiceOrder({ id: null, isOpen: false })}
          />
        ) : null}
      </div>
    )
}

export default ProjectServiceOrders
