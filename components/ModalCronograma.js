import React, { useEffect, useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import { equipesTecnicas } from '../utils/constants'
import axios from 'axios'
import Link from 'next/link'
const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  minWidth: '30%',
  height: '60%',
  borderRadius: '10px',
  padding: '10px',
  zIndex: 1000,
}
const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,.7)',
  zIndex: 1000,
}
const statusStyles = {
  'EM ANDAMENTO': {
    textColor: 'text-[#15599a]',
    borderColor: 'border-[#15599a]',
  },
  'AGUARDANDO VENDEDOR': {
    textColor: 'text-orange-400',
    borderColor: 'border-orange-400',
  },
  REALIZADO: {
    textColor: 'text-green-400',
    borderColor: 'border-green-400',
  },
  PENDENTE: {
    textColor: 'text-red-400',
    borderColor: 'border-red-400',
  },
}
function ModalCronograma({ setModalIsOpen, info }) {
  const [equipe, setEquipe] = useState(info.equipe)
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })
  console.log(info)
  function handleEquipeChange(value) {
    setEquipe(value)
    axios
      .post(`/api/projects/update/${info.id}`, {
        [`ordensDeServico.${info.index}.equipe`]: value,
      })
      .then((res) => setMsg({ text: 'Alterações feitas', color: 'text-green-500' }))
      .catch((res) => setMsg({ text: 'Ocorreu um erro.', color: 'text-red-500' }))
  }
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex h-full flex-col">
            <div className="border-primary/20 flex items-center justify-between border-b px-2 pb-2 text-lg">
              <h1 className="font-bold text-[#15599a]">
                {info.nomeDoContrato} ({info.qtde})
              </h1>
              {msg.text && <p className={`text-xs ${msg.color}`}>{msg.text}</p>}
              <button>
                <VscChromeClose
                  onClick={() => {
                    setModalIsOpen(false)
                  }}
                  style={{ color: 'red' }}
                />
              </button>
            </div>
            <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto py-2">
              <div className="mt-4 grid grid-cols-1 grid-rows-2 md:grid-rows-1 lg:grid-cols-2">
                <p className="text-center text-xs font-bold text-[#15599a]">CATEGORIA</p>
                <p className="text-primary/80 text-center text-xs">{info.categoria}</p>
              </div>
              <div className="grid grid-cols-1 grid-rows-2 md:grid-rows-1 lg:grid-cols-2">
                <p className="text-center text-xs font-bold text-[#15599a]">SERVIÇO EXECUTADO</p>
                <p className="text-primary/80 text-center text-xs">{info.servicoExecutado}</p>
              </div>
              <div className="mt-4 grid grid-cols-1 grid-rows-2 md:grid-rows-1 lg:grid-cols-2">
                <p className="text-center text-xs font-bold text-[#15599a]">CIDADE</p>
                <p className="text-primary/80 text-center text-xs">{info.cidade}</p>
              </div>
              <div className="mt-4 grid grid-cols-1 grid-rows-2 md:grid-rows-1 lg:grid-cols-2">
                <p className="text-center text-xs font-bold text-[#15599a]">BAIRRO</p>
                <p className="text-primary/80 text-center text-xs">{info.bairro}</p>
              </div>
              <div className="mt-4 grid grid-cols-1 grid-rows-2 md:grid-rows-1 lg:grid-cols-2">
                <p className="text-center text-xs font-bold text-[#15599a]">LOGRAOURO</p>
                <p className="text-primary/80 text-center text-xs">{info.logradouro}</p>
              </div>
              <div className="mt-4 grid grid-cols-1 grid-rows-2 md:grid-rows-1 lg:grid-cols-2">
                <p className="text-center text-xs font-bold text-[#15599a]">Nº</p>
                <p className="text-primary/80 text-center text-xs">{info.numeroResidencia}</p>
              </div>
              <div className="mt-4 grid grid-cols-1 grid-rows-2 md:grid-rows-1 lg:grid-cols-2">
                <p className="text-center text-xs font-bold text-[#15599a]">EQUIPE RESPONSÁVEL</p>
                <select value={equipe} onChange={(e) => handleEquipeChange(e.target.value)} className="text-primary/80 text-xs outline-hidden">
                  {equipesTecnicas.map((equipe) => (
                    <option key={equipe.value} value={equipe.value}>
                      {equipe.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4 grid grid-cols-1 grid-rows-2 md:grid-rows-1 lg:grid-cols-2">
                <p className="text-center text-xs font-bold text-[#15599a]">NºMÓDULOS</p>
                <p className="text-primary/80 text-center text-xs">{info.qtdeModulos}</p>
              </div>
              <div className="mt-4 grid grid-cols-1 grid-rows-2 md:grid-rows-1 lg:grid-cols-2">
                <p className="text-center text-xs font-bold text-[#15599a]">TOPOLOGIA</p>
                <p className="text-primary/80 text-center text-xs">{info.topologia}</p>
              </div>
              <div className="mt-4 flex flex-col items-center justify-center gap-2">
                <p className="text-center text-xs font-bold text-[#15599a]">ORDEM DE SERVIÇO</p>
                <Link href={`/ordens-de-servico/pdf/${info.id}?index=${info.index}`}>
                  <div className="w-fit cursor-pointer rounded bg-[#fead61] p-2 font-bold">VER OS</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalCronograma
