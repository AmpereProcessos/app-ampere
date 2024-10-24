import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'

import { VscChromeClose } from 'react-icons/vsc'
import { BiSolidError } from 'react-icons/bi'
import { IoMdAlert, IoMdResize, IoMdWater } from 'react-icons/io'
import { FaCity, FaSolarPanel, FaUser } from 'react-icons/fa'
import { BsCalendarCheckFill, BsCalendarFill, BsFillGearFill, BsHouse, BsSuitDiamondFill } from 'react-icons/bs'
import { PiWaveSineBold } from 'react-icons/pi'
import { TbTopologyFullHierarchy } from 'react-icons/tb'
import { MdCategory, MdDelete, MdEngineering, MdLocationPin, MdOutlineWifiPassword } from 'react-icons/md'

import ConferenciaManPreventivaOS from './ConferenciaManPreventivaOS'
import ConferenciaMontagemOS from './ConferenciaMontagemOS'
import ConferenciaOutrasCategorias from './ConferenciaOutrasCategorias'
import ConferenciaPadraoOS from './ConferenciaPadraoOS'

import ExecutionDiary from './identificador/ordensDeServico/execucao/ExecutionDiary'

import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import { useServiceOrderById } from '../utils/methods/query/service-orders'
import LoadingPage from './utils/LoadingPage'

function ModalOS({ session, orderId, modalIsOpen, closeModal, queryKey }) {
  const { data: order, isSuccess, isError, isLoading } = useServiceOrderById({ id: orderId, enabled: !!orderId })
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
        <div className="flex h-full w-full flex-col overflow-y-auto overscroll-y-auto">
          <div className="flex flex-row items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg">
            <div className="flex flex-col">
              <h1 className="p-0 text-center font-bold text-[#15599a] lg:pl-6">FINALIZAÇÃO DE ORDEM DE SERVIÇO</h1>
              <h1 className="p-0 text-start text-xxs font-bold text-gray-500 lg:pl-6">#{order?._id || '...'}</h1>
            </div>

            <button>
              <VscChromeClose onClick={() => closeModal(false)} style={{ color: 'red' }} />
            </button>
          </div>
          {isLoading ? <LoadingPage /> : null}
          {isError ? (
            <div className="flex grow flex-col items-center justify-center">
              <BiSolidError color="rgb(239,68,68)" />
              <p className="text-center italic text-gray-500">Erro ao buscar informações da Ordem de Serviço...</p>
            </div>
          ) : null}
          {isSuccess ? (
            <div className="overscroll-y flex w-full flex-col overflow-y-auto border-r border-gray-300 p-3 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              <h1 className="text-center text-lg font-black tracking-tight">{order.descricao}</h1>
              <div className="flex items-center justify-center gap-2">
                <MdCategory />
                <p className="text-xs font-medium uppercase">{order?.categoria}</p>
              </div>
              <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
                <div className="flex items-center gap-2">
                  <MdEngineering />
                  <p className="text-xs font-medium uppercase text-gray-500 lg:text-lg">{order?.responsavel?.nome || 'RESPONSÁVEL NÃO DEFINIDO'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <IoMdAlert />
                  <p className="text-xs font-medium uppercase text-gray-500 lg:text-lg">{order?.urgencia}</p>
                </div>
              </div>

              <div className={`mt-2 flex w-full items-center justify-center gap-2 ${order.dataEfetivacao ? 'text-green-500' : 'text-gray-500'}`}>
                {order.dataEfetivacao ? <BsCalendarCheckFill /> : <BsCalendarFill />}
                <p className="text-xs font-medium">{dayjs(order?.dataEfetivacao).format('DD/MM/YYYY HH:mm')}</p>
              </div>
              <h1 className="mt-4 w-full rounded-md bg-gray-800 p-2 text-center font-bold text-white">FAVORECIDO</h1>
              <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 md:flex-row lg:gap-4">
                <div className="flex items-center gap-2 text-gray-800">
                  <FaUser size={'20px'} color="rgb(31,41,55)" />
                  <p className="font-raleway text-sm font-medium">{order?.favorecido?.nome || 'N/A'}</p>
                </div>
              </div>
              <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 md:flex-row lg:gap-4">
                <div className="flex items-center gap-2">
                  <FaCity size={'20px'} color="rgb(31,41,55)" />
                  <p className="font-raleway text-sm font-medium">
                    {order?.localizacao ? `${order?.localizacao.cidade} - ${order?.localizacao.uf} ` : 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MdLocationPin size={'20px'} color="rgb(31,41,55)" />
                  <p className="font-raleway text-sm font-medium">
                    {order?.localizacao
                      ? `${order?.localizacao.endereco}, Nº ${order?.localizacao.numeroOuIdentificador}, ${order?.localizacao.bairro} - ${order?.localizacao.cep}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <h1 className="mt-4 w-full rounded-tr-md rounded-tl-md bg-gray-800 p-2 text-center font-bold text-white">OBSERVAÇÕES</h1>
              <div className="mt-2 flex w-full flex-col gap-2 px-2">
                {order.observacoes.length > 0 ? (
                  order.observacoes.map((obs, index) => (
                    <div key={index} className="flex w-full flex-col rounded-md border border-gray-500">
                      <div className="flex min-h-[25px] w-full flex-col items-start justify-between gap-1 lg:flex-row">
                        <div className="flex w-full items-center justify-center rounded-br-md rounded-tl-md bg-cyan-700 lg:w-[40%]">
                          <p className="w-full text-center text-xs font-medium text-white">{obs.topico}</p>
                        </div>
                      </div>
                      <h1 className="w-full p-2 text-center text-xs font-medium tracking-tight text-gray-500">{obs.descricao}</h1>
                    </div>
                  ))
                ) : (
                  <p className="w-full text-center text-sm font-medium tracking-tight text-gray-500">Nenhuma observação adicionada ao projeto.</p>
                )}
              </div>
              <h1 className="mt-4 w-full rounded-md bg-gray-800 p-2 text-center font-bold text-white">EQUIPAMENTOS</h1>
              <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 md:flex-row lg:gap-4">
                <div className="flex items-center gap-2">
                  <FaSolarPanel size={'20px'} color="rgb(31,41,55)" />
                  <p className="font-raleway text-sm font-medium">
                    {order.equipamentos.modulos.qtde}x {order.equipamentos.modulos.modelo || 'N/A'} {order.equipamentos.modulos.potencia}W
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PiWaveSineBold size={'20px'} color="rgb(31,41,55)" />
                  <p className="font-raleway text-sm font-medium">
                    ({order.detalhes.topologia || 'N/A'}) - {order.equipamentos?.inversor.qtde}x {order.equipamentos?.inversor.modelo || 'N/A'}{' '}
                    {order.equipamentos?.inversor.potencia}W
                  </p>
                </div>
              </div>
              <div className="mt-2 flex w-full flex-col items-start justify-center gap-2 md:flex-row lg:gap-4">
                {order.equipamentos?.disponivel ? (
                  <div className="flex w-full flex-col gap-1 rounded-lg border border-cyan-500 p-3 lg:w-fit">
                    <h1 className="text-center font-medium tracking-tight">DISPONÍVEIS</h1>
                    {order.equipamentos.disponivel.map((equip, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <BsSuitDiamondFill />
                        <p className="text-xs tracking-tight text-gray-500">
                          {equip.qtde ? `${equip.qtde}x ` : ''}
                          {equip.descricao}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {order.equipamentos?.retirada ? (
                  <div className="flex w-full flex-col  gap-1 rounded-lg border border-cyan-500 p-3 lg:w-fit">
                    <h1 className="text-center font-medium tracking-tight">RETIRADA</h1>
                    {order.equipamentos.retirada.map((equip, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <BsSuitDiamondFill />
                        <p className="text-xs tracking-tight text-gray-500">
                          {equip.qtde ? `${equip.qtde}x ` : ''}
                          {equip.descricao}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <h1 className="mt-4 w-full rounded-md bg-gray-800 p-2 text-center font-bold text-white">DETALHES</h1>
              <div className="mt-2 flex w-full flex-row flex-wrap items-center justify-center gap-2 lg:gap-4">
                <div className="flex flex-col rounded-md border border-gray-500 p-3">
                  <div className="flex items-center gap-2">
                    <IoMdWater />
                    <p className="text-xs font-medium uppercase text-gray-500">PONTO DE ÁGUA</p>
                  </div>
                  <h1 className="text-center text-xs font-medium uppercase text-gray-500">{order.detalhes.pontoAgua || 'N/A'}</h1>
                </div>
                <div className="flex flex-col rounded-md border border-gray-500 p-3">
                  <div className="flex items-center gap-2">
                    <MdOutlineWifiPassword />
                    <p className="text-xs font-medium uppercase text-gray-500">SENHA DO WI-FI</p>
                  </div>
                  <h1 className="text-center text-xs font-medium uppercase text-gray-500">{order.detalhes.senhaWifi || 'N/A'}</h1>
                </div>
                <div className="flex flex-col rounded-md border border-gray-500 p-3">
                  <div className="flex items-center gap-2">
                    <BsFillGearFill />
                    <p className="text-xs font-medium uppercase text-gray-500">CONFIGURAR MONITORAMENTO</p>
                  </div>
                  <h1 className="text-center text-xs font-medium uppercase text-gray-500">
                    {order.detalhes.configuracaoMonitoramento ? 'SIM' : 'N/A'}
                  </h1>
                </div>
                <div className="flex flex-col rounded-md border border-gray-500 p-3">
                  <div className="flex items-center gap-2">
                    <IoMdResize />
                    <p className="text-xs font-medium uppercase text-gray-500">POSSUI TRAFO</p>
                  </div>
                  <h1 className="text-center text-xs font-medium uppercase text-gray-500">{order.detalhes.possuiTrafo ? 'SIM' : 'N/A'}</h1>
                </div>
                <div className="flex flex-col rounded-md border border-gray-500 p-3">
                  <div className="flex items-center gap-2">
                    <BsHouse />
                    <p className="text-xs font-medium uppercase text-gray-500">TIPO ESTRUTURA</p>
                  </div>
                  <h1 className="text-center text-xs font-medium uppercase text-gray-500">{order.detalhes.tipoEstrutura || 'N/A'}</h1>
                </div>
                <div className="flex flex-col rounded-md border border-gray-500 p-3">
                  <div className="flex items-center gap-2">
                    <TbTopologyFullHierarchy />
                    <p className="text-xs font-medium uppercase text-gray-500">TOPOLOGIA</p>
                  </div>
                  <h1 className="text-center text-xs font-medium uppercase text-gray-500">{order.detalhes.topologia || 'N/A'}</h1>
                </div>
              </div>
              <ExecutionDiary
                orderId={orderId}
                entryDatetime={order.periodo?.inicio}
                exitDatetime={order.periodo?.fim}
                history={order.periodo.historico}
              />
              <div className="my-2 h-[5px] w-full bg-black"></div>
              {order.categoria == 'PADRÃO' && <ConferenciaPadraoOS session={session} order={order} closeModal={closeModal} queryKey={queryKey} />}
              {order.categoria == 'MANUTENÇÃO PREVENTIVA' && (
                <ConferenciaManPreventivaOS session={session} order={order} closeModal={closeModal} queryKey={queryKey} />
              )}
              {order.categoria == 'MONTAGEM' && <ConferenciaMontagemOS session={session} order={order} closeModal={closeModal} queryKey={queryKey} />}
              {!['MONTAGEM', 'MANUTENÇÃO PREVENTIVA', 'PADRÃO'].includes(order.categoria) ? (
                <ConferenciaOutrasCategorias session={session} order={order} closeModal={closeModal} queryKey={queryKey} />
              ) : null}
            </div>
          ) : null}
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalOS
