import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { BsDownload } from 'react-icons/bs'

import ComissionCard from '../../components/identificador/comissoes/ComissionCard'
import ErrorComponent from '../../components/utils/ErrorComponent'
import LoadingPage from '../../components/utils/LoadingPage'

import TextInput from '../../components/inputs/Text'
import DateInput from '../../components/inputs/Date'
import MultipleSelectInput from '../../components/inputs/MultipleSelect'

import { formatDateInputChange, getFirstDayOfMonth, getLastDayOfMonth } from '../../utils/methods/shared'
import { formatDate, formatDecimalPlaces, formatToMoney } from '../../utils/constants'
import { allSellers, serviceTypes } from '../../utils/select-options'
import { useComissionData } from '../../utils/methods/query/comissions'
import { updateAppProjectsComission } from '../../utils/methods/mutation/comission'
import { MdAttachMoney } from 'react-icons/md'
import { FaPercentage } from 'react-icons/fa'
import { BiStats } from 'react-icons/bi'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { useQueryClient } from '@tanstack/react-query'

const currentDate = new Date()

function ComissaoPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })
  const isManager = !!session?.user.permissoes.financeiro.editar
  const isADM = !!session?.user.permissoes.administrativo.visualizar

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const [dateFilter, setDateFilter] = useState({
    after: getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()).toISOString(),
    before: getLastDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()).toISOString(),
  })
  const {
    data: projects,
    isSuccess,
    isLoading,
    isError,
    filters,
    setFilters,
  } = useComissionData({ after: dateFilter.after, before: dateFilter.before })

  function getStats({ info }) {
    if (!info)
      return {
        totalVendido: 0,
        potenciaVendida: 0,
        comissaoTotal: 0,
        comissaoProjeto: 0,
        comissaoPadrao: 0,
        comissaoTimeVendas: 0,
        comissaoTimeSDR: 0,
      }
    const sold = info.reduce((acc, current) => {
      const contractValue = current.valorContrato
      return acc + contractValue
    }, 0)
    const power = info.reduce((acc, current) => {
      const peakPower = current.potenciaPico
      return acc + peakPower
    }, 0)
    const comissionByTeams = info.reduce(
      (acc, current) => {
        const contractValue = current.valorContrato
        const sellerComissionPercentage = current.comissoes.vendedor || 0
        const insiderComissionPercentage = current.comissoes.insider || 0
        acc.seller += contractValue * sellerComissionPercentage
        acc.insider += contractValue * insiderComissionPercentage
        return acc
      },
      { seller: 0, insider: 0 }
    )
    const comissionByItem = info.reduce(
      (acc, current) => {
        const contractValue = current.valorContrato
        const projectValue = current.valorProjeto || 0
        const energyPaValue = current.valorPadrao || 0
        const sellerComissionPercentage = current.comissoes.vendedor || 0
        const insiderComissionPercentage = current.comissoes.insider || 0
        const totalComissionPercentage = (sellerComissionPercentage + insiderComissionPercentage) / 100
        acc.total += contractValue * totalComissionPercentage
        acc.project += projectValue * totalComissionPercentage
        acc.energyPa += energyPaValue * totalComissionPercentage
        return acc
      },
      { total: 0, project: 0, energyPa: 0 }
    )
    return {
      totalVendido: sold,
      potenciaVendida: power,
      comissaoTotal: comissionByItem.total,
      comissaoProjeto: comissionByItem.project,
      comissaoPadrao: comissionByItem.energyPa,
      comissaoTimeVendas: comissionByTeams.seller,
      comissaoTimeSDR: comissionByTeams.insider,
    }
  }
  function exportData() {
    if (!projects) return toast.error('Opps, parece que os dados não estão disponíveis para exportação.')
    const formattedJSON = projects.map((project) => {
      return {
        ID: project.id,
        NOME: project.nome,
        'TIPO DO SERVIÇO': project.tipoServico,
        'IDENTIFICADOR APP': project.identificador,
        'IDENTIFICADOR CRM': project.identificadorCRM,
        CIDADE: project.cidade,
        VENDEDOR: project.vendedor,
        INSIDER: project.insider,
        'DATA DE ASSINATURA': project.dataAssinatura ? dayjs(project.dataAssinatura).add(3, 'hour').format('DD/MM/YYYY') : null,
        'DATA RECEBIMENTO PARCIAL': project.dataRecebimentoParcial ? dayjs(project.dataRecebimentoParcial).add(3, 'hour').format('DD/MM/YYYY') : null,
        'POTÊNCIA PICO': project.potenciaPico,
        'VALOR DO PROJETO': project.valorProjeto || 0,
        'VALOR DO PADRÃO': project.valorPadrao || 0,
        'VALOR TOTAL': project.valorContrato || 0,
        'COMISSÃO DEFINIDA': project.comissoes.efetivado ? 'SIM' : 'NÃO',
        'COMISSÃO PAGA': project.comissoes.pagamentoRealizado ? 'SIM' : 'NÃO',
        'COMISSÃO - VENDEDOR': formatDecimalPlaces((project.comissoes.vendedor || 0) * 100),
        'COMISSÃO INSIDER': formatDecimalPlaces((project.comissoes.insider || 0) * 100),
      }
    })
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(formattedJSON))}`
    const link = document.createElement('a')
    link.href = jsonString
    link.download = 'data.json'

    link.click()
  }
  async function handleRegisterPayments(info) {
    if (!info) return
    const bulkwriteAppUpdate = info.map((project) => {
      const projectId = project.id
      const crmProjectId = project.idProjetoCRM
      const sellerCommission = project.comissoes?.vendedor
      const insiderCommission = project.comissoes.insider
      return {
        crmProjectId: crmProjectId,
        appProjectId: projectId,
        sellerCommission: sellerCommission,
        insiderCommission: insiderCommission,
      }
    })
    try {
      await updateAppProjectsComission({ projects: bulkwriteAppUpdate })
      await queryClient.invalidateQueries({ queryKey: ['comissions'] })
      return toast.success('Pagamentos registrados com sucesso !')
    } catch (error) {
      return toast.error('Erro ao registrar pagamentos.')
    }
  }
  useEffect(() => {
    if (session) {
      if (!isManager && !isADM) router.push('/')
    }
  }, [session])

  if (status == 'loading') return <LoadingPage />

  if (status != 'authenticated') return <LoadingPage />

  return (
    <div className="flex grow flex-col p-6">
      <div className="flex flex-col items-center border-b border-gray-200 px-1 py-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">COMISSÃO DE PROJETOS</p>
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
          <div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">TOTAL VENDIDO</h1>
              <MdAttachMoney />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{formatToMoney(getStats({ info: projects }).totalVendido)}</div>
              <p className="text-xs text-gray-500">{formatDecimalPlaces(getStats({ info: projects }).potenciaVendida)} kWp</p>
            </div>
          </div>
          <div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">COMISSÃO TOTAL</h1>
              <FaPercentage />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{formatToMoney(getStats({ info: projects }).comissaoTotal)}</div>
              <p className="text-xs text-gray-500">{formatToMoney(getStats({ info: projects }).comissaoTimeVendas)} para o time de vendas</p>
              <p className="text-xs text-gray-500">{formatToMoney(getStats({ info: projects }).comissaoTimeSDR)} para o time de SDR</p>
            </div>
          </div>
          <div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">COMISSÃO POR ITEM</h1>
              <FaPercentage />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-gray-500">{formatToMoney(getStats({ info: projects }).comissaoProjeto)} em projeto UFV</div>
              <p className="text-gray-500">{formatToMoney(getStats({ info: projects }).comissaoPadrao)} em padrão</p>
            </div>
          </div>
          <div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">ANÁLISE</h1>
              <BiStats />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">
                {formatDecimalPlaces((getStats({ info: projects }).comissaoTotal * 100) / getStats({ info: projects }).totalVendido)}%
              </div>
              <p className="text-sm text-gray-500">
                {formatDecimalPlaces(getStats({ info: projects }).totalVendido / getStats({ info: projects }).potenciaVendida)} R$/kWp
              </p>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {dropdownMenuVisible ? (
            <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                <TextInput
                  label={'NOME DO CONTRATO'}
                  value={filters.search}
                  placeholder={'Digite o nome do contrato...'}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                />
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={'100%'}
                    label={'TIPO DE SERVIÇO'}
                    selected={filters.serviceType}
                    options={serviceTypes}
                    selectedItemLabel={'SEM FILTRO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        serviceType: value,
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        serviceType: [],
                      }))
                    }
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={'100%'}
                    label={'VENDEDOR'}
                    selected={filters.sellerName}
                    options={allSellers}
                    selectedItemLabel={'SEM FILTRO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        sellerName: value,
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
                <div className="flex items-center justify-center gap-x-2">
                  <div className="w-full lg:w-[250px]">
                    <DateInput
                      width={'100%'}
                      label={'DEPOIS DE'}
                      value={dateFilter.after ? formatDate(dateFilter.after) : undefined}
                      handleChange={(value) => setDateFilter((prev) => ({ ...prev, after: formatDateInputChange(value) }))}
                    />
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <DateInput
                      width={'100%'}
                      label={'ANTES DE'}
                      value={dateFilter.before ? formatDate(dateFilter.before) : undefined}
                      handleChange={(value) => setDateFilter((prev) => ({ ...prev, before: formatDateInputChange(value) }))}
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center justify-end">
                <div
                  onClick={exportData}
                  className="flex cursor-pointer items-center rounded-lg  p-2 font-bold text-[#15599a] transition duration-300 ease-in-out hover:scale-105"
                >
                  <p className="mr-2 text-sm">BAIXAR DADOS</p>
                  <BsDownload />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      {isLoading ? <LoadingPage /> : null}
      {isError ? <ErrorComponent msg={'Erro ao carregar informações da análise. Tente novamente.'} /> : null}
      {isSuccess && projects ? (
        projects.length > 0 ? (
          <div className="flex w-full flex-col gap-2 py-2">
            <div className="flex w-full items-center justify-center">
              <button
                disabled={isLoading}
                onClick={() => handleRegisterPayments(projects)}
                className="rounded border border-green-500 px-2 py-1 font-medium text-green-500 duration-300 ease-in-out disabled:bg-gray-500 disabled:text-white enabled:hover:bg-green-500 enabled:hover:text-white"
              >
                REGISTRAR PAGAMENTOS
              </button>
            </div>

            {projects.map((project) => (
              <ComissionCard key={project.id} project={project} userIsManager={isManager} />
            ))}
          </div>
        ) : (
          <div className="flex grow items-center justify-center">
            <h1 className="text-lg italic text-gray-500">Nenhuma informação encontrada para o período de análise</h1>
          </div>
        )
      ) : null}
      {/* {view == 'GERAL' && <ComissaoGeralView projects={filteredProjects} setProjects={setFilteredProjects} />}
      {view == 'PDF' && <ComissaoPDFView projects={filteredProjects} totalComission={getTotalComission()} />}
      {view == 'PDF INSIDE' && <ComissaoPDFViewInside projects={filteredProjects} totalComission={getTotalComission()} />} */}
    </div>
  )
}

export default ComissaoPage
