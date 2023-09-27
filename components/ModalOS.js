import axios from 'axios'
import dayjs from 'dayjs'
import React, { useState, useEffect } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import { BiSolidError } from 'react-icons/bi'
import ConferenciaManPreventivaOS from './ConferenciaManPreventivaOS'
import ConferenciaMontagemOS from './ConferenciaMontagemOS'
import ConferenciaOutrasCategorias from './ConferenciaOutrasCategorias'
import ConferenciaPadraoOS from './ConferenciaPadraoOS'
import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import { useServiceOrderById } from '../utils/methods/query/serviceOrders'
import LoadingPage from './utils/LoadingPage'
import { MdCategory, MdEngineering, MdLocationPin, MdOutlineWifiPassword } from 'react-icons/md'
import { IoMdAlert, IoMdResize, IoMdWater } from 'react-icons/io'
import { FaCity, FaSolarPanel, FaUser } from 'react-icons/fa'
import { AiFillPhone } from 'react-icons/ai'
import { BsCalendarCheckFill, BsCalendarFill, BsFillGearFill, BsHouse, BsSuitDiamondFill } from 'react-icons/bs'
import { PiWaveSineBold } from 'react-icons/pi'
import { TbTopologyFullHierarchy } from 'react-icons/tb'
const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  width: '93%',
  height: '98%',
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
function ModalOS({ orderId, modalIsOpen, closeModal, queryKey }) {
  const { data: order, isSuccess, isError, isLoading } = useServiceOrderById({ id: orderId, enabled: !!orderId })
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })
  // async function saveChanges(changes) {
  //   try {
  //     let { data, statusCode } = await axios.post(`/api/projects/update/${info.id}`, changes)
  //     setMsg({ text: 'Ordem de serviço finalizada.', color: 'text-green-500' })
  //     getOSs()
  //     return { success: true }
  //   } catch (error) {
  //     setMsg({
  //       text: 'Erro ao finalizar baixa na OS. Por favor, tente novamente.',
  //       color: 'text-red-500',
  //     })
  //     return { success: false }
  //   }
  // }
  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen}>
        <div className="flex flex-col w-full h-full overflow-y-auto overscroll-y-auto">
          <div className="flex flex-row items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <div className="flex flex-col">
              <h1 className="text-[#15599a] p-0 lg:pl-6 text-center font-bold">FINALIZAÇÃO DE ORDEM DE SERVIÇO</h1>
              <h1 className="text-xxs p-0 lg:pl-6 text-start font-bold text-gray-500">#{order?._id || '...'}</h1>
            </div>

            <button>
              <VscChromeClose onClick={() => closeModal(false)} style={{ color: 'red' }} />
            </button>
          </div>
          {isLoading ? <LoadingPage /> : null}
          {isError ? (
            <div className="grow flex items-center justify-center flex-col">
              <BiSolidError color="rgb(239,68,68)" />
              <p className="text-center text-gray-500 italic">Erro ao buscar informações da Ordem de Serviço...</p>
            </div>
          ) : null}
          {isSuccess ? (
            <div className="flex w-full flex-col overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 border-r border-gray-300 p-3">
              <div className="flex items-center gap-2 justify-center">
                <MdCategory />
                <p className="font-medium text-blue-500 text-lg uppercase">{order?.categoria}</p>
              </div>
              <div className="flex items-center justify-center gap-2 w-full mt-2">
                <div className="flex items-center gap-2">
                  <MdEngineering />
                  <p className="font-medium text-gray-500 text-lg uppercase">{order?.responsavel?.nome || 'RESPONSÁVEL NÃO DEFINIDO'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <IoMdAlert />
                  <p className="font-medium text-gray-500 text-lg uppercase">{order?.urgencia}</p>
                </div>
              </div>

              <div className={`flex w-full justify-center mt-2 items-center gap-2 ${order.dataEfetivacao ? 'text-green-500' : 'text-gray-500'}`}>
                {order.dataEfetivacao ? <BsCalendarCheckFill /> : <BsCalendarFill />}
                <p className="text-xs font-medium">{dayjs(order?.dataEfetivacao).format('DD/MM/YYYY HH:mm')}</p>
              </div>
              <h1 className="w-full p-2 rounded-md text-center text-white font-bold bg-gray-800 mt-4">FAVORECIDO</h1>
              <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center mt-2">
                <div className="flex gap-2 items-center text-gray-800">
                  <FaUser size={'20px'} color="rgb(31,41,55)" />
                  <p className="font-raleway font-medium text-sm">{order?.favorecido?.nome || 'N/A'}</p>
                </div>
              </div>
              <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center mt-2">
                <div className="flex gap-2 items-center">
                  <FaCity size={'20px'} color="rgb(31,41,55)" />
                  <p className="font-raleway font-medium text-sm">
                    {order?.localizacao ? `${order?.localizacao.cidade} - ${order?.localizacao.uf} ` : 'N/A'}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <MdLocationPin size={'20px'} color="rgb(31,41,55)" />
                  <p className="font-raleway font-medium text-sm">
                    {order?.localizacao
                      ? `${order?.localizacao.endereco}, Nº ${order?.localizacao.numeroOuIdentificador}, ${order?.localizacao.bairro} - ${order?.localizacao.cep}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <h1 className="w-full p-2 rounded-tr-md rounded-tl-md text-center text-white font-bold bg-gray-800 mt-4">OBSERVAÇÕES</h1>
              <div className="w-full min-h-[80px] rounded-bl-sm rounded-br-sm flex items-center justify-center p-3 bg-gray-200 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <p className="text-xs text-gray-600 font-medium">{order.observacoes || 'SEM OBSERVAÇÕES'}</p>
              </div>
              <h1 className="w-full p-2 rounded-md text-center text-white font-bold bg-gray-800 mt-4">EQUIPAMENTOS</h1>
              <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center mt-2">
                <div className="flex gap-2 items-center">
                  <FaSolarPanel size={'20px'} color="rgb(31,41,55)" />
                  <p className="font-raleway font-medium text-sm">
                    {order.equipamentos.modulos.qtde}x {order.equipamentos.modulos.modelo || 'N/A'} {order.equipamentos.modulos.potencia}W
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <PiWaveSineBold size={'20px'} color="rgb(31,41,55)" />
                  <p className="font-raleway font-medium text-sm">
                    ({order.detalhes.topologia || 'N/A'}) - {order.equipamentos?.inversor.qtde}x {order.equipamentos?.inversor.modelo || 'N/A'}{' '}
                    {order.equipamentos?.inversor.potencia}W
                  </p>
                </div>
              </div>
              <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-start mt-2">
                {order.equipamentos?.disponivel ? (
                  <div className="flex flex-col gap-1 border border-cyan-500 p-3 rounded-lg w-full lg:w-fit">
                    <h1 className="tracking-tight text-center font-medium">DISPONÍVEIS</h1>
                    {order.equipamentos.disponivel.map((equip, index) => (
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
                {order.equipamentos?.retirada ? (
                  <div className="flex flex-col gap-1  border border-cyan-500 p-3 rounded-lg w-full lg:w-fit">
                    <h1 className="tracking-tight text-center font-medium">RETIRADA</h1>
                    {order.equipamentos.retirada.map((equip, index) => (
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
              <div className="flex w-full justify-center gap-2 lg:gap-4 flex-row items-center mt-2 flex-wrap">
                <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <IoMdWater />
                    <p className="font-medium text-gray-500 text-xs uppercase">PONTO DE ÁGUA</p>
                  </div>
                  <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{order.detalhes.pontoAgua || 'N/A'}</h1>
                </div>
                <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <MdOutlineWifiPassword />
                    <p className="font-medium text-gray-500 text-xs uppercase">SENHA DO WI-FI</p>
                  </div>
                  <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{order.detalhes.senhaWifi || 'N/A'}</h1>
                </div>
                <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <BsFillGearFill />
                    <p className="font-medium text-gray-500 text-xs uppercase">CONFIGURAR MONITORAMENTO</p>
                  </div>
                  <h1 className="font-medium text-gray-500 text-xs uppercase text-center">
                    {order.detalhes.configuracaoMonitoramento ? 'SIM' : 'N/A'}
                  </h1>
                </div>
                <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <IoMdResize />
                    <p className="font-medium text-gray-500 text-xs uppercase">POSSUI TRAFO</p>
                  </div>
                  <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{order.detalhes.possuiTrafo ? 'SIM' : 'N/A'}</h1>
                </div>
                <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <BsHouse />
                    <p className="font-medium text-gray-500 text-xs uppercase">TIPO ESTRUTURA</p>
                  </div>
                  <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{order.detalhes.tipoEstrutura || 'N/A'}</h1>
                </div>
                <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <TbTopologyFullHierarchy />
                    <p className="font-medium text-gray-500 text-xs uppercase">TOPOLOGIA</p>
                  </div>
                  <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{order.detalhes.topologia || 'N/A'}</h1>
                </div>
              </div>
              <div className="w-full h-[5px] bg-black my-2"></div>
              {order.categoria == 'PADRÃO' && <ConferenciaPadraoOS order={order} closeModal={closeModal} queryKey={queryKey} />}
              {order.categoria == 'MANUTENÇÃO PREVENTIVA' && <ConferenciaManPreventivaOS order={order} closeModal={closeModal} queryKey={queryKey} />}
              {order.categoria == 'MONTAGEM' && <ConferenciaMontagemOS order={order} closeModal={closeModal} queryKey={queryKey} />}
              {/* {!['MONTAGEM', 'MANUTENÇÃO PREVENTIVA', 'PADRÃO'].includes(order.categoria) ? (
                <ConferenciaOutrasCategorias saveChanges={saveChanges} index={info.index} />
              ) : null} */}
            </div>
          ) : null}
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalOS
