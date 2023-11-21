import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import toast from 'react-hot-toast'

import { VscChromeClose } from 'react-icons/vsc'

import { BsCalendarCheckFill, BsCalendarFill } from 'react-icons/bs'
import { MdEngineering } from 'react-icons/md'
import { IoMdAlert } from 'react-icons/io'

import FavoredModalBlock from './identificador/ordensDeServico/FavoredModalBlock'
import ObservationModalBlock from './identificador/ordensDeServico/ObservationModalBlock'
import EquipmentModalBlock from './identificador/ordensDeServico/EquipmentModalBlock'
import DetailsModalBlock from './identificador/ordensDeServico/DetailsModalBlock'
import FinishOrderBlock from './identificador/ordensDeServico/FinishOrderBlock'
import ExecutionDiary from './identificador/ordensDeServico/execucao/ExecutionDiary'

import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import LoadingPage from './utils/LoadingPage'
import Avatar from './utils/Avatar'

import { getErrorMessage } from '../utils/methods/handlers'
import { getObjectDifference } from '../utils/methods/util/service-order'
import { useServiceOrderById } from '../utils/methods/query/serviceOrders'
import { updateServiceOrder } from '../utils/methods/mutation/serviceOrders'

import { equipesTecnicas, serviceOrdersCategories } from '../utils/constants'

import Select from './inputs/Select'
import TextInput from './inputs/Text'

function ModalOrdemServico({ orderId, closeModal, modalIsOpen }) {
  const queryClient = useQueryClient()
  const { data: order, isSuccess, isError } = useServiceOrderById({ id: orderId, enabled: !!orderId })

  const [infoHolder, setInfoHolder] = useState(order)
  async function handleOrderUpdate() {
    const loadingToastId = toast.loading('Processando...')
    const changesObject = getObjectDifference(order, infoHolder)
    console.log('CHANGES', changesObject)
    try {
      const msg = await updateServiceOrder({
        info: changesObject,
        invalidateKey: ['service-order', orderId],
        orderId: orderId,
        queryClient: queryClient,
      })
      toast.dismiss(loadingToastId)
      toast.success(msg)
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      toast.error(msg)
    }
  }
  console.log(infoHolder)
  useEffect(() => {
    setInfoHolder(order)
  }, [order])
  return (
    <AnimatedModalWrapper modalIsOpen={modalIsOpen} width={'90%'} height={'87%'}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2 flex-col lg:flex-row">
            <h1 className="text-[#15599a] pl-6 text-xs lg:text-base font-bold">{order?.favorecido?.nome || '...'}</h1>
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
          <>
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
              ) : (
                <FinishOrderBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
              )}
              <div className="w-full p-2 rounded-md bg-gray-800 flex items-center gap-2 justify-center">
                <h1 className="text-white font-bold">EXECUÇÃO</h1>
              </div>
              <div className="flex w-full items-center gap-2 flex-col lg:flex-row mt-2">
                <div className="w-full lg:w-[25%]">
                  <Select
                    label={'CATEGORIA'}
                    value={infoHolder.categoria}
                    options={serviceOrdersCategories}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, categoria: value }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-[25%]">
                  <TextInput
                    label={'DESCRIÇÃO DO SERVIÇO'}
                    placeholder={'Preencha a descrição do serviço a ser executado...'}
                    value={infoHolder.descricao}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, descricao: value }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-[25%]">
                  <Select
                    label={'TIPO DE RESPONSÁVEL'}
                    value={infoHolder.responsavel.tipo}
                    options={[
                      { id: 1, label: 'INTERNO', value: 'INTERNO' },
                      { id: 2, label: 'EXTERNO', value: 'EXTERNO' },
                    ]}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsavel: { ...prev.responsavel, tipo: value } }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-[25%]">
                  {infoHolder.responsavel.tipo == 'EXTERNO' ? (
                    <TextInput
                      label={'NOME DO RESPONSÁVEL'}
                      placeholder={'Preencha o nome do responsável pela execução...'}
                      value={infoHolder.responsavel.nome}
                      handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsavel: { ...prev.responsavel, nome: value } }))}
                      width={'100%'}
                    />
                  ) : (
                    <Select
                      label={'NOME DE RESPONSÁVEL'}
                      value={infoHolder.responsavel.nome}
                      options={equipesTecnicas.map((team, index) => ({ ...team, id: index + 1 }))}
                      selectedItemLabel={'NÃO DEFINIDO'}
                      handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsavel: { ...prev.responsavel, nome: value } }))}
                      width={'100%'}
                    />
                  )}
                </div>
              </div>
              <div className="w-full flex items-center justify-center mt-1">
                <div className="w-full lg:w-1/2">
                  <Select
                    label={'URGÊNCIA'}
                    value={infoHolder.urgencia}
                    options={[
                      { id: 1, label: 'POUCO URGENTE', value: 'POUCO URGENTE' },
                      { id: 2, label: 'URGENTE', value: 'URGENTE' },
                      { id: 3, label: 'EMERGÊNCIA', value: 'EMERGÊNCIA' },
                    ]}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, urgencia: value }))}
                    width={'100%'}
                  />
                </div>
              </div>
              <FavoredModalBlock order={order} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
              <ObservationModalBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
              <EquipmentModalBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
              <DetailsModalBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
              <ExecutionDiary
                orderId={orderId}
                entryDatetime={order.periodo?.inicio}
                exitDatetime={order.periodo?.fim}
                history={order.periodo.historico}
              />
            </div>
            <div className="py-1 w-full flex items-center justify-end border-t border-gray-200 px-4 mt-2">
              <button
                onClick={() => handleOrderUpdate()}
                className="text-[#15599a] font-bold py-1 hover:text-[#15599a] hover:scale-105 duration-300 ease-in-out"
              >
                SALVAR
              </button>
            </div>
          </>
        ) : (
          <LoadingPage />
        )}
      </div>
    </AnimatedModalWrapper>
  )
}

export default ModalOrdemServico
