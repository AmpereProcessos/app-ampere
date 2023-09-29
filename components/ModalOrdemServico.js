import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import { FaCity, FaSave, FaSolarPanel, FaUser } from 'react-icons/fa'

import { useServiceOrderById } from '../utils/methods/query/serviceOrders'
import LoadingPage from './utils/LoadingPage'
import Avatar from './utils/Avatar'
import { BsArrowDownUp, BsCalendarCheckFill, BsCalendarFill, BsFillGearFill, BsHouse, BsSuitDiamondFill } from 'react-icons/bs'
import { AiFillPhone } from 'react-icons/ai'
import {
  MdElectricMeter,
  MdEngineering,
  MdLocationPin,
  MdOutlineSettingsInputComponent,
  MdOutlineWifiPassword,
  MdOutput,
  MdRoofing,
} from 'react-icons/md'
import { PiWaveSineBold } from 'react-icons/pi'
import { IoMdAlert, IoMdResize, IoMdWater } from 'react-icons/io'
import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import { TbTopologyFullHierarchy } from 'react-icons/tb'
import FavoredModalBlock from './identificador/ordensDeServico/FavoredModalBlock'
import ObservationModalBlock from './identificador/ordensDeServico/ObservationModalBlock'
import EquipmentModalBlock from './identificador/ordensDeServico/EquipmentModalBlock'
import DetailsModalBlock from './identificador/ordensDeServico/DetailsModalBlock'
import { updateServiceOrder } from '../utils/methods/mutation/serviceOrders'
import { useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/methods/handlers'
import { getObjectDifference } from '../utils/methods/util/service-order'
import FinishOrderBlock from './identificador/ordensDeServico/FinishOrderBlock'

function ModalOrdemServico({ orderId, closeModal, modalIsOpen }) {
  const queryClient = useQueryClient()
  const { data: order, isSuccess, isError } = useServiceOrderById({ id: orderId, enabled: !!orderId })

  const [infoHolder, setInfoHolder] = useState(order)
  async function handleOrderUpdate() {
    const loadingToastId = toast.loading('Processando...')
    const changesObject = getObjectDifference(order, infoHolder)
    console.log(changesObject)
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
              <FavoredModalBlock order={order} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
              <ObservationModalBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
              <EquipmentModalBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
              <DetailsModalBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
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
