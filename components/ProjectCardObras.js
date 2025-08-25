import React from 'react'

function ProjectCardObras({ info }) {
  return (
    <div className="mt-2 flex h-full w-full flex-col justify-around gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-2">
      <div className="grid grid-cols-2">
        <p className="text-md text-center font-bold text-[#15599a]">NOME DO CONTRATO</p>
        <p className="text-md text-primary/80 text-center">{info.nomeDoContrato}</p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center font-bold text-[#15599a]">CIDADE</p>
        <p className="text-md text-primary/80 text-center">{info.cidade ? info.cidade : '-'}</p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center font-bold text-[#15599a]">ENTRADA NA OBRA</p>
        <p className="text-md text-primary/80 text-center">
          {info.obra.entrada != undefined && info.obra.entrada != '-' ? new Date(info.obra.entrada).toLocaleDateString() : '-'}
        </p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center font-bold text-[#15599a]">LAUDO</p>
        <p className="text-md text-primary/80 text-center">{info.obra.laudo ? info.obra.laudo : '-'}</p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center font-bold text-[#15599a]">AUMENTO DE CARGA</p>
        <p className="text-md text-primary/80 text-center">{info.projeto.aumentoDeCarga ? info.projeto.aumentoDeCarga : '-'}</p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center font-bold text-[#15599a]">POSSUI ESTRUTURA PERSONALIZADA</p>
        <p className="text-md text-primary/80 text-center">{info.estruturaPersonalizada.aplicavel ? info.estruturaPersonalizada.aplicavel : '-'}</p>
      </div>
      {info.projeto.aumentoDeCarga == 'SIM' && (
        <>
          <div className="grid grid-cols-2">
            <p className="text-md text-center font-bold text-[#15599a]">PAGAMENTO DO PADRÃO</p>
            <p className="text-md text-center font-bold text-[#fead61]">{info.padrao.respPagamento ? info.padrao.respPagamento : '-'}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="text-md text-center font-bold text-[#15599a]">RESP.INSTALAÇÃO DO PADRÃO</p>
            <p className="text-md text-center font-bold text-[#fead61]">{info.padrao.respInstalacao ? info.padrao.respInstalacao : '-'}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default ProjectCardObras
