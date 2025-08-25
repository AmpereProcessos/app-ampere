import React from 'react'

function ProjectCardComercial({ info }) {
  return (
    <div className="mt-2 flex h-full w-full flex-col justify-around gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-2">
      <div className="grid grid-cols-2">
        <p className="text-md text-center font-bold text-[#15599a]">NOME DO CONTRATO</p>
        <p className="text-md text-primary/80 text-center">{info.nomeDoContrato}</p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center font-bold text-[#15599a]">STATUS DO CONTRATO</p>
        <p className="text-md text-primary/80 text-center">{info.contrato?.status ? info.contrato?.status : '-'}</p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center font-bold text-[#15599a]">STATUS DE LIBERAÇÃO DA COMPRA</p>
        <p className="text-md text-primary/80 text-center">{info.compra.statusLiberacao ? info.compra.statusLiberacao : '-'}</p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center font-bold text-[#15599a]">DATA MÁXIMA DE PAGAMENTO</p>
        <p className="text-md text-primary/80 text-center">
          {info.compra.dataMaxPagamento ? new Date(info.compra.dataMaxPagamento).toLocaleDateString('pt-br') : '-'}
        </p>
      </div>
    </div>
  )
}

export default ProjectCardComercial
