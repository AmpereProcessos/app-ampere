import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import { FaCity, FaSave, FaSolarPanel, FaUser } from 'react-icons/fa'

import { useServiceOrderById } from '../utils/methods/query/serviceOrders'
import LoadingPage from './utils/LoadingPage'
import Avatar from './utils/Avatar'
import { BsCalendarCheckFill, BsCalendarFill, BsFillGearFill, BsHouse, BsSuitDiamondFill } from 'react-icons/bs'
import { AiFillPhone } from 'react-icons/ai'
import { MdEngineering, MdLocationPin, MdOutlineWifiPassword } from 'react-icons/md'
import { PiWaveSineBold } from 'react-icons/pi'
import { IoMdAlert, IoMdResize, IoMdWater } from 'react-icons/io'
import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import { TbTopologyFullHierarchy } from 'react-icons/tb'
import FavoredModalBlock from './identificador/ordensDeServico/FavoredModalBlock'
const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  minWidth: '40%',
  maxWidth: '97%',
  height: '87%',
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
function ModalOrdemServico({ orderId, closeModal, modalIsOpen }) {
  const { data: order, isSuccess, isError } = useServiceOrderById({ id: orderId, enabled: !!orderId })
  console.log(orderId)
  const [infoHolder, setInfoHolder] = useState(order)
  useEffect(() => {
    setInfoHolder(order)
  }, [order])
  return (
    <AnimatedModalWrapper modalIsOpen={modalIsOpen} width={'90%'} height={'87%'}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h1 className="text-[#15599a] pl-6  font-bold">{order?.favorecido?.nome || '...'}</h1>
            <p className="text-gray-500 text-center text-xs">#{order?._id || '...'}</p>
          </div>
          <button>
            <VscChromeClose
              onClick={() => {
                closeModal()
              }}
              style={{ color: 'red' }}
            />
          </button>
        </div>
        {isSuccess && infoHolder ? (
          <div className="flex flex-col px-2 py-2 lg:px-0 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="items-center w-full flex justify-center">
              <h1 className="p-1 rounded border border-[#15599a] text-[#15599a] text-sm font-black">{order.categoria}</h1>
            </div>
            <h1 className="w-full text-center font-black mt-2">{order.descricao}</h1>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Avatar fallback={'U'} height={25} width={25} url={order?.autor?.avatar_url} />
                <p className="font-medium text-gray-500 text-xs">{order?.autor?.nome || 'Autor não identificado'}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <BsCalendarFill />
                <p className="text-xs font-medium">{dayjs(order?.dataInsercao).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 w-full mt-2">
              <div className="flex items-center gap-2">
                <MdEngineering />
                <p className="font-medium text-gray-500 text-xs uppercase">{order?.responsavel?.nome || 'RESPONSÁVEL NÃO DEFINIDO'}</p>
              </div>
              <div className="flex items-center gap-2">
                <IoMdAlert />
                <p className="font-medium text-gray-500 text-xs uppercase">{order?.urgencia}</p>
              </div>
            </div>
            {order?.dataEfetivacao ? (
              <div className="flex w-full justify-center mt-4 items-center gap-2 text-green-500">
                <BsCalendarCheckFill />
                <p className="text-xs font-medium">{dayjs(order?.dataEfetivacao).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            ) : null}
            <FavoredModalBlock order={order} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
            <h1 className="w-full p-2 rounded-tr-md rounded-tl-md text-center text-white font-bold bg-gray-800 mt-4">OBSERVAÇÕES</h1>
            <div className="w-full min-h-[80px] rounded-bl-sm rounded-br-sm flex items-center justify-center p-3 bg-gray-200 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <p className="text-xs text-gray-600 font-medium">{infoHolder.observacoes || 'SEM OBSERVAÇÕES'}</p>
            </div>
            <h1 className="w-full p-2 rounded-md text-center text-white font-bold bg-gray-800 mt-4">EQUIPAMENTOS</h1>
            <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center mt-2">
              <div className="flex gap-2 items-center">
                <FaSolarPanel size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway font-medium text-sm">
                  {infoHolder.equipamentos.modulos.qtde}x {infoHolder.equipamentos.modulos.modelo || 'N/A'} {infoHolder.equipamentos.modulos.potencia}
                  W
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <PiWaveSineBold size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway font-medium text-sm">
                  ({infoHolder.detalhes.topologia || 'N/A'}) - {infoHolder.equipamentos?.inversor.qtde}x{' '}
                  {infoHolder.equipamentos?.inversor.modelo || 'N/A'} {infoHolder.equipamentos?.inversor.potencia}W
                </p>
              </div>
            </div>
            <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-start mt-2">
              {infoHolder.equipamentos?.disponivel ? (
                <div className="flex flex-col gap-1 border border-cyan-500 p-3 rounded-lg w-full lg:w-fit">
                  <h1 className="tracking-tight text-center font-medium">DISPONÍVEIS</h1>
                  {infoHolder.equipamentos.disponivel.map((equip, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <BsSuitDiamondFill />
                      <p className="text-xs text-gray-500 tracking-tight">
                        {equip.qtde ? `${equip.qtde}x ` : ''}
                        {equip.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
              {infoHolder.equipamentos?.retirada ? (
                <div className="flex flex-col gap-1  border border-cyan-500 p-3 rounded-lg w-full lg:w-fit">
                  <h1 className="tracking-tight text-center font-medium">RETIRADA</h1>
                  {infoHolder.equipamentos.retirada.map((equip, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <BsSuitDiamondFill />
                      <p className="text-xs text-gray-500 tracking-tight">
                        {equip.qtde ? `${equip.qtde}x ` : ''}
                        {equip.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <h1 className="w-full p-2 rounded-md text-center text-white font-bold bg-gray-800 mt-4">DETALHES</h1>
            <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center mt-2 flex-wrap">
              <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <IoMdWater />
                  <p className="font-medium text-gray-500 text-xs uppercase">PONTO DE ÁGUA</p>
                </div>
                <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{infoHolder.detalhes.pontoAgua || 'N/A'}</h1>
              </div>
              <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <MdOutlineWifiPassword />
                  <p className="font-medium text-gray-500 text-xs uppercase">SENHA DO WI-FI</p>
                </div>
                <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{infoHolder.detalhes.senhaWifi || 'N/A'}</h1>
              </div>
              <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <BsFillGearFill />
                  <p className="font-medium text-gray-500 text-xs uppercase">CONFIGURAR MONITORAMENTO</p>
                </div>
                <h1 className="font-medium text-gray-500 text-xs uppercase text-center">
                  {infoHolder.detalhes.configuracaoMonitoramento ? 'SIM' : 'N/A'}
                </h1>
              </div>
              <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <IoMdResize />
                  <p className="font-medium text-gray-500 text-xs uppercase">POSSUI TRAFO</p>
                </div>
                <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{infoHolder.detalhes.possuiTrafo ? 'SIM' : 'N/A'}</h1>
              </div>
              <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <BsHouse />
                  <p className="font-medium text-gray-500 text-xs uppercase">TIPO ESTRUTURA</p>
                </div>
                <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{infoHolder.detalhes.tipoEstrutura || 'N/A'}</h1>
              </div>
              <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <TbTopologyFullHierarchy />
                  <p className="font-medium text-gray-500 text-xs uppercase">TOPOLOGIA</p>
                </div>
                <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{infoHolder.detalhes.topologia || 'N/A'}</h1>
              </div>
            </div>
          </div>
        ) : (
          <LoadingPage />
        )}
      </div>
    </AnimatedModalWrapper>
  )
}

export default ModalOrdemServico
