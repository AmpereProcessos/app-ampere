import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'

import PosVendaCard from '../../components/PosVendaCard'
import LoadingPage from '../../components/utils/LoadingPage'

import { AiOutlineSearch } from 'react-icons/ai'
import { BiTime } from 'react-icons/bi'
import { GoCreditCard } from 'react-icons/go'
import { TbAlertTriangle, TbArrowsDownUp, TbTruckDelivery } from 'react-icons/tb'
import { MdOutlineFormatListBulleted } from 'react-icons/md'
import { FaListCheck } from 'react-icons/fa6'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { cidadesAtendidas, formatDate, vendedores } from '../../utils/constants'

import { useSession } from '@/components/providers/SessionProvider'
import { useAfterSalesProjects } from '@/utils/methods/query/aftersales'
import TextInput from '@/components/inputs/Text'
import DateInput from '@/components/inputs/Date'
import { formatDateInputChange } from '@/utils/methods/shared'
import SelectInput from '@/components/inputs/Select'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import {
  accessGrantingStatus,
  allSellers,
  contractStatus,
  deliveryStatus,
  ServiceOrderStatus,
  HomologationControlStatus,
  inspectionStatus,
  journeyPendings,
  PurchaseDeliveryStatus,
} from '@/utils/select-options'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { VscDiffAdded } from 'react-icons/vsc'
import type { TProjectDTO } from '@/utils/schemas/projects'
import ProjectServiceOrderCard from '@/components/identificador/ordensDeServico/ProjectServiceOrderCard'
import { FaSignature } from 'react-icons/fa'
import NumberInput from '@/components/inputs/Number'
import dayjs from 'dayjs'
import Link from 'next/link'

function Posvenda() {
  const router = useRouter()
  const { session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const { data: projects, isSuccess, isLoading, isError, filters, setFilters } = useAfterSalesProjects()

  const [mode, setMode] = useState<'CARD' | 'SIMPLIFIED'>('CARD')

  function getStats({ info }: { info: TProjectDTO[] | undefined }) {
    if (!info)
      return {
        projetos: 0,
        contatosPendentes: 0,
        paraConfeccionar: 0,
        paraAssinar: 0,
        entregaHoje: 0,
        entregaSemana: 0,
      }
    const projectsQty = info.length
    const pendingContacts = info.reduce((acc, current) => {
      const lastContact = current.jornada.dataUltimoContato
      // In case there's no contact
      if (!lastContact) return (acc += 1)
      // In case there's more than 7 days since contact
      const sinceLastContact = dayjs().diff(lastContact, 'day')
      if (sinceLastContact >= 7) return (acc += 1)
      return acc
    }, 0)
    const docsToElaborate = info.reduce((acc, current) => {
      const projectStarted = !!current.homologacao.dataLiberacao
      const missignDocElaboration = !current.homologacao.documentacao.dataLiberacao
      if (projectStarted && missignDocElaboration) return acc + 1
      return acc
    }, 0)
    const docsToSign = info.reduce((acc, current) => {
      const missingDocSigning = !!current.homologacao.documentacao.dataLiberacao && !current.homologacao.documentacao.dataAssinatura
      if (missingDocSigning) return acc + 1
      return acc
    }, 0)
    const deliveries = info.reduce(
      (acc, current) => {
        if (!current.compra.previsaoEntrega) return acc
        const deliveryPrevision = dayjs(current.compra.previsaoEntrega).add(3, 'hour')

        const isToday = dayjs().isSame(deliveryPrevision, 'day')
        const isThisWeek = dayjs().isSame(deliveryPrevision, 'week') && dayjs(deliveryPrevision).isAfter(new Date())

        if (isToday) acc.today += 1
        if (isThisWeek) acc.thisWeek += 1
        return acc
      },
      { today: 0, thisWeek: 0 }
    )
    return {
      projetos: projectsQty,
      contatosPendentes: pendingContacts,
      paraConfeccionar: docsToElaborate,
      paraAssinar: docsToSign,
      entregaHoje: deliveries.today,
      entregaSemana: deliveries.thisWeek,
    }
  }

  useEffect(() => {
    const validateAccess = async () => {
      if (session) {
        const userRoutes = session?.user.permissoes.rotas
        if (!userRoutes?.includes('Pós-Venda')) router.push('/')
      }
    }
    validateAccess()
  }, [session])
  if (status !== 'authenticated') return <LoadingPage />

  return (
    <div className="grow p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-300 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">PROJETOS EM JORNADA</p>
          </div>
          {dropdownMenuVisible ? (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
            </div>
          ) : (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
            </div>
          )}
        </div>
        <div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/5">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">PROJETOS NO ESTÁGIO</h1>
              <VscDiffAdded />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).projetos}</div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/5">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">DOCUMENTAÇÃO A CONFECCIONAR</h1>
              <FaListCheck />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).paraConfeccionar}</div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/5">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">DOCUMENTAÇÃO A ASSINAR</h1>
              <FaSignature />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).paraAssinar}</div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/5">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">ENTREGAS HOJE</h1>
              <TbTruckDelivery />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).entregaHoje}</div>
              <p className="text-xs text-gray-500">{getStats({ info: projects }).entregaSemana} essa semana</p>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/5">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">CONTATOS PENDENTES</h1>
              <TbAlertTriangle />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).contatosPendentes}</div>
            </div>
          </div>
        </div>
        <div className="my-2 flex w-full items-center justify-end gap-2">
          <Link href="/calls/chamadosPosVenda">
            <button type="button" className="rounded-md bg-gray-300 py-1 px-4 text-sm font-bold text-black">
              CHAMADOS
            </button>
          </Link>
          <Link href="/financeiro/receitas">
            <button type="button" className="rounded-md bg-green-400 py-1 px-4 text-sm font-bold text-white">
              RECEITAS
            </button>
          </Link>
          <Link href={'/obras/controle-padroes'}>
            <button type="button" className="rounded-md bg-[#15599a] py-1 px-4 text-sm font-bold text-white">
              CONTROLE DE PADRÕES
            </button>
          </Link>
        </div>

        <AnimatePresence>
          {dropdownMenuVisible ? (
            <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                <TextInput
                  label="NOME DO CONTRATO"
                  placeholder="Digite o nome do contrato..."
                  value={filters.search}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                />

                <NumberInput
                  label="NÚMERO DE MÓDULOS"
                  value={filters.moduleQty}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, moduleQty: value }))}
                  placeholder="Digite o número de módulos..."
                />

                <div className="w-full lg:w-[350px]">
                  <MultipleSelectInput
                    width={'100%'}
                    label={'PENDÊNCIAS DA JORNADA'}
                    selected={filters.journeyPendings}
                    options={journeyPendings}
                    selectedItemLabel={'SEM FILTRO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        journeyPendings: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        journeyPendings: [],
                      }))
                    }
                  />
                </div>
                <div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
                  <div className="flex items-center justify-center gap-x-2">
                    <div className="w-full lg:w-[250px]">
                      <DateInput
                        width={'100%'}
                        label={'DEPOIS DE'}
                        value={filters.date.after ? formatDate(filters.date.after) : undefined}
                        handleChange={(value) =>
                          setFilters((prev) => ({ ...prev, date: { ...prev.date, after: formatDateInputChange(value, 'string') as string } }))
                        }
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <DateInput
                        width={'100%'}
                        label={'ANTES DE'}
                        value={filters.date.before ? formatDate(filters.date.before) : undefined}
                        handleChange={(value) =>
                          setFilters((prev) => ({ ...prev, date: { ...prev.date, before: formatDateInputChange(value, 'string') as string } }))
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-[350px]">
                    <SelectInput
                      width={'100%'}
                      label={'CAMPO DE FILTRO'}
                      value={filters.date.field || null}
                      options={[
                        { id: 1, label: 'DATA ASS.CONTRATO', value: 'contrato.dataAssinatura' },
                        { id: 2, label: 'DATA DE PAGAMENTO', value: 'compra.dataPagamento' },
                        { id: 3, label: 'DATA LIB.DOCUMENTAÇÃO', value: 'homologacao.documentacao.dataLiberacao' },
                        { id: 4, label: 'DATA ASS.DOCUMENTAÇÃO', value: 'homologacao.documentacao.dataAssinatura' },
                        { id: 5, label: 'DATA DE SOLICITAÇÃO DO PARECER', value: 'homologacao.acesso.dataSolicitacao' },
                        { id: 6, label: 'DATA DE APROVAÇÃO DO PARECER', value: 'homologacao.acesso.dataResposta' },
                        { id: 7, label: 'PREV. ENTREGA', value: 'compra.previsaoEntrega' },
                        { id: 8, label: 'ENTRADA NA OBRA', value: 'obra.entrada' },
                        { id: 9, label: 'SAIDA DE OBRA', value: 'obra.saida' },
                        { id: 10, label: 'PEDIDO DA VISTORIA', value: 'homologacao.vistoria.dataSolicitacao' },
                        { id: 11, label: 'TROCA DO MEDIDOR', value: 'homologacao.vistoria.dataEfetivacao' },
                        { id: 12, label: 'NÃO DEFINIDO', value: null },
                      ]}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          date: {
                            ...prev.date,
                            field: value,
                          },
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          date: {
                            after: null,
                            before: null,
                            field: null,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                <div className={'flex flex-col gap-1'}>
                  <label htmlFor={'ordenation'} className={'font-sans font-bold  text-[#353432]'}>
                    ORDERNAR POR CONTATO
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, contactOrder: prev.contactOrder !== 'ASC' ? 'ASC' : null }))}
                      className={`rounded border  border-[#15599a] py-1 font-bold ${filters.contactOrder === 'ASC' ? 'bg-[#15599a] text-white' : 'bg-transparent text-[#15599a]'} px-3`}
                    >
                      CRESCENTE
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, contactOrder: prev.contactOrder !== 'DESC' ? 'DESC' : null }))}
                      className={`rounded border  border-[#15599a] py-1 font-bold ${filters.contactOrder === 'DESC' ? 'bg-[#15599a] text-white' : 'bg-transparent text-[#15599a]'} px-3`}
                    >
                      DECRESCENTE
                    </button>
                  </div>
                </div>
                <div className={'h flex flex-col gap-1'}>
                  <label htmlFor={'ordenation'} className={'font-sans font-bold  text-[#353432]'}>
                    MODO DE VISUALIZAÇÃO
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('CARD')}
                      className={`rounded border  border-[#15599a] py-1 font-bold ${mode === 'CARD' ? 'bg-[#15599a] text-white' : 'bg-transparent text-[#15599a]'} px-3`}
                    >
                      CARD
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('SIMPLIFIED')}
                      className={`rounded border  border-[#15599a] py-1 font-bold ${mode === 'SIMPLIFIED' ? 'bg-[#15599a] text-white' : 'bg-transparent text-[#15599a]'} px-3`}
                    >
                      SIMPLIFICADO
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={'100%'}
                    label={'CIDADE'}
                    selected={filters.city}
                    options={cidadesAtendidas.map((city, index) => ({ id: index + 1, label: city, value: city }))}
                    selectedItemLabel={'SEM FILTRO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        city: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        city: [],
                      }))
                    }
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={'100%'}
                    label={'VENDEDOR'}
                    selected={filters.sellerName}
                    options={allSellers.map((seller, index) => ({ id: index + 1, label: seller.label || '', value: seller.value || '' }))}
                    selectedItemLabel={'SEM FILTRO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        sellerName: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        sellerName: [],
                      }))
                    }
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={'100%'}
                    label={'STATUS DE ENTREGA'}
                    selected={filters.deliveryStatus}
                    options={PurchaseDeliveryStatus}
                    selectedItemLabel={'SEM FILTRO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        deliveryStatus: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        deliveryStatus: [],
                      }))
                    }
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={'100%'}
                    label={'STATUS DO PARECER'}
                    selected={filters.grantingStatus}
                    options={HomologationControlStatus}
                    selectedItemLabel={'SEM FILTRO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        grantingStatus: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        grantingStatus: [],
                      }))
                    }
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={'100%'}
                    label={'STATUS DA OBRA'}
                    selected={filters.executionStatus}
                    options={ServiceOrderStatus}
                    selectedItemLabel={'SEM FILTRO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        executionStatus: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        executionStatus: [],
                      }))
                    }
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={'100%'}
                    label={'STATUS DA VISTORIA'}
                    selected={filters.inspectionStatus}
                    options={inspectionStatus}
                    selectedItemLabel={'SEM FILTRO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        inspectionStatus: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        inspectionStatus: [],
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      necessaryDistribution: !filters.necessaryDistribution,
                    })
                  }
                  className={`${filters.necessaryDistribution ? 'bg-[#15599a]' : 'bg-blue-300'} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
                >
                  NECESSÁRIO DISTRIBUIÇÃO
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      missingSignature: !filters.missingSignature,
                    })
                  }
                  className={`${filters.missingSignature ? 'bg-[#15599a]' : 'bg-blue-300'} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
                >
                  FALTANDO ASSINATURA
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      pendingContact: !prev.pendingContact,
                    }))
                  }
                  className={`${filters.pendingContact ? 'bg-[#15599a]' : 'bg-blue-300'} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
                >
                  CONTATO PENDENTE
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex flex-wrap justify-around gap-3 overflow-y-auto overscroll-y-auto">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar projetos em jornada.'} /> : null}
        {isSuccess
          ? projects.map((project) => <PosVendaCard session={session} key={project._id} projectId={project._id} project={project} mode={mode} />)
          : null}
      </div>
    </div>
  )
}

export default Posvenda
