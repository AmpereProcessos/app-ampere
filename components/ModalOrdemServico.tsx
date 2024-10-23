import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
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
import { useServiceOrderById } from '../utils/methods/query/service-orders'
import { deleteServiceOrder, updateServiceOrder } from '../utils/methods/mutation/serviceOrders'

import { equipesTecnicas, serviceOrdersCategories } from '../utils/constants'

import Select from './inputs/Select'
import TextInput from './inputs/Text'
import NotificationCreationBlock from './NotificationCreationBlock'
import { formatDateAsLocale } from '../utils/methods/formatting'
import { TServiceOrderDTO } from '@/utils/schemas/service-order'
import { useSession } from 'next-auth/react'

type ModalOrdemServicoProps = {
  orderId: string
  closeModal: () => void
  modalIsOpen: boolean
}
function ModalOrdemServico({ orderId, closeModal, modalIsOpen }: ModalOrdemServicoProps) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const { data: order, isSuccess, isError } = useServiceOrderById({ id: orderId })

  const [infoHolder, setInfoHolder] = useState<TServiceOrderDTO>({
    _id: 'id-holder',
    categoria: 'MONTAGEM',
    favorecido: {
      nome: '',
      contato: '',
    },
    projeto: {
      id: '', // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
      nome: '', // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
      identificador: 1, // identificador QTDE do projeto no banco de projetos
      tipo: '', // tipo do projeto
    },
    descricao: '', // servico executado
    localizacao: {
      cep: '',
      uf: '',
      cidade: '',
      bairro: '',
      endereco: '',
      numeroOuIdentificador: '',
    },
    responsavel: {
      nome: '',
      tipo: 'EXTERNO',
    },
    // configurar: false,
    urgencia: 'POUCO URGENTE',
    periodo: {
      inicio: null,
      fim: null,
      historico: [],
    },
    pagamento: {
      recebedor: null,
      valor: null,
    },
    cobranca: {
      pagador: null,
      valor: null,
    },
    autor: {
      id: '',
      nome: '',
      avatar_url: null,
    },
    equipamentos: {
      modulos: {
        modelo: '',
        qtde: 0,
        potencia: 0,
      },
      inversor: {
        modelo: '',
        qtde: 0,
        potencia: 0,
      },
      disponivel: [],
      retirada: [],
    },
    detalhes: {
      pontoAgua: '',
      senhaWifi: '',
      configuracaoMonitoramento: false,
      possuiTrafo: false,
      tipoEstrutura: '',
      tipoTelha: undefined,
      tipoPadrao: '',
      tipoSaidaPadrao: 'N/A',
      amperagemPadrao: '',
      responsabilidadePadrao: 'NÃO SE APLICA',
      topologia: '',
    },
    observacoes: [],
    anotacoes: '',
    dataInsercao: new Date().toISOString(),
  })
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
      toast.success(msg || 'Ordem atualizada com sucesso !')
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      toast.error(msg)
    }
  }
  async function handleOrderDelete(id: string) {
    const loadingToastId = toast.loading('Processando...')
    try {
      const msg = await deleteServiceOrder({ id })
      toast.dismiss(loadingToastId)
      toast.success(msg || 'Ordem excluída com sucesso !')
      return closeModal()
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
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <h1 className="pl-6 text-xs font-bold text-[#15599a] lg:text-base">{order?.favorecido?.nome || '...'}</h1>
            <p className="text-center text-xs text-gray-500">#{order?._id || '...'}</p>
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
            <div className="overscroll-y flex flex-col overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 lg:px-0">
              <div className="flex w-full items-center justify-center">
                <h1 className="rounded border border-[#15599a] p-1 text-sm font-black text-[#15599a]">{order.categoria}</h1>
              </div>
              <h1 className="mt-2 w-full text-center font-black">{order.descricao}</h1>
              <div className="mt-2 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar fallback={'U'} height={25} width={25} url={order?.autor?.avatar_url} />
                  <p className="text-xs font-medium text-gray-500">{order?.autor?.nome || 'Autor não identificado'}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <BsCalendarFill />
                  <p className="text-xs font-medium">{formatDateAsLocale(order?.dataInsercao, true)}</p>
                </div>
              </div>
              <div className="mt-2 flex w-full items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  <MdEngineering />
                  <p className="text-xs font-medium uppercase text-gray-500">{order?.responsavel?.nome || 'RESPONSÁVEL NÃO DEFINIDO'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <IoMdAlert />
                  <p className="text-xs font-medium uppercase text-gray-500">{order?.urgencia}</p>
                </div>
              </div>
              {order?.dataEfetivacao ? (
                <div className="mt-4 flex w-full items-center justify-center gap-2 text-green-500">
                  <BsCalendarCheckFill />
                  <p className="text-xs font-medium">{formatDateAsLocale(order.dataEfetivacao)}</p>
                </div>
              ) : (
                <FinishOrderBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
              )}
              <NotificationCreationBlock nomeDoProjeto={infoHolder.projeto.nome} codProjeto={infoHolder.projeto.identificador} />
              <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2">
                <h1 className="font-bold text-white">EXECUÇÃO</h1>
              </div>
              <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
                <div className="w-full lg:w-[25%]">
                  <Select
                    label={'CATEGORIA'}
                    value={infoHolder.categoria}
                    options={serviceOrdersCategories}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, categoria: value }))}
                    onReset={() => setInfoHolder((prev) => ({ ...prev, categoria: 'OUTROS' }))}
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
                    onReset={() => setInfoHolder((prev) => ({ ...prev, responsavel: { ...prev.responsavel, tipo: 'EXTERNO' } }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-[25%]">
                  {infoHolder.responsavel.tipo == 'EXTERNO' ? (
                    <TextInput
                      label={'NOME DO RESPONSÁVEL'}
                      placeholder={'Preencha o nome do responsável pela execução...'}
                      value={infoHolder.responsavel.nome || ''}
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
                      onReset={() => setInfoHolder((prev) => ({ ...prev, responsavel: { ...prev.responsavel, nome: '' } }))}
                      width={'100%'}
                    />
                  )}
                </div>
              </div>
              <div className="mt-1 flex w-full items-center justify-center">
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
                    onReset={() => setInfoHolder((prev) => ({ ...prev, urgencia: 'NÃO DEFINIDO' }))}
                    width={'100%'}
                  />
                </div>
              </div>
              <FavoredModalBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
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
            <div className="mt-2 flex w-full items-center justify-between border-t border-gray-200 py-1 px-4">
              {session?.user.permissoes.ordensDeServico.editar ? (
                <button
                  onClick={() => handleOrderDelete(orderId)}
                  className="py-1 font-bold text-red-500 duration-300 ease-in-out hover:scale-105 hover:text-red-700"
                >
                  EXCLUIR
                </button>
              ) : (
                <></>
              )}

              <button
                onClick={() => handleOrderUpdate()}
                className="py-1 font-bold text-[#15599a] duration-300 ease-in-out hover:scale-105 hover:text-[#15599a]"
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
