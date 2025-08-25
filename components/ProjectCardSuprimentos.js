import React from 'react'

function ProjectCardSuprimentos({ info }) {
  return (
    <div className="mt-2 flex h-full w-full flex-col justify-around gap-y-1 overflow-y-auto overscroll-y-auto px-2 py-2">
      <div className="grid grid-cols-2">
        <p className="text-md text-center font-bold text-[#15599a]">NOME DO CONTRATO</p>
        <p className="text-md text-primary/80 text-center">{info.nomeDoContrato}</p>
      </div>
      <div className="grid grid-cols-2 px-2">
        <p className="text-md text-center font-bold text-[#15599a]">DATA DO PEDIDO</p>
        <p className="text-md text-primary/80 text-center">
          {info.compra.dataPedido != undefined && info.compra.dataPedido != '-' ? new Date(info.compra.dataPedido).toLocaleDateString() : '-'}
        </p>
      </div>
      <div className="grid grid-cols-2 px-2">
        <p className="text-md text-center font-bold text-[#15599a]">STATUS DO PAGAMENTO</p>
        <p className="text-md text-primary/80 text-center">{info.pagamento.status ? info.pagamento.status : '-'}</p>
      </div>
      <div className="grid grid-cols-2 px-2">
        <p className="text-md text-center font-bold text-[#15599a]">STATUS DA ENTREGA</p>
        <p className="text-md text-primary/80 text-center">{info.compra.statusEntrega ? info.compra.statusEntrega : '-'}</p>
      </div>
      <div className="flex h-fit flex-col px-2">
        <p className="text-md text-center font-bold text-[#15599a]">TRANSPORTADORA</p>
        <p className="text-md text-center font-bold break-words text-[#fead61]">{info.compra.rastreio ? info.compra.rastreio : '-'}</p>
      </div>
    </div>
  )
}

export default ProjectCardSuprimentos
