import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import Select from 'react-select'
import { useSession } from 'next-auth/react'
import { useQueryClient } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'

import { AiOutlineSearch } from 'react-icons/ai'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

import ModalComercial from '../../components/ModalComercial'
import TagTipoDeServico from '../../components/TagTipoDeServico'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import ComercialSkeleton from '../../components/skeletons/ComercialSkeleton'
import LoadingPage from '../../components/utils/LoadingPage'

import { useComercialProjects } from '../../utils/methods/query/comercial'
import { formatDate, formatDecimalPlaces, formatToMoney, statusLiberacao, tiposDeServico, vendedores } from '../../utils/constants'
import NumberInput from '../../components/inputs/Number'
import TextInput from '../../components/inputs/Text'
import DateInput from '../../components/inputs/Date'
import SelectInput from '../../components/inputs/Select'
import { allActiveSellers, allSellers, contractStatus, insiders, sellers, serviceTypes, supplementationStatus } from '../../utils/select-options'
import MultipleSelectInput from '../../components/inputs/MultipleSelect'
import { formatDateInputChange } from '../../utils/methods/shared'
import { VscDiffAdded } from 'react-icons/vsc'
import { FaSignature } from 'react-icons/fa'
import { MdAttachMoney, MdCreate, MdOutlineAttachMoney } from 'react-icons/md'
import { getContractValue } from '../../utils/methods/util/projects'

const statusStyles = {
  ASSINADO: {
    textColor: 'text-green-500',
  },
  'NÃO ASSINADO': {
    textColor: 'text-red-500',
  },
  SOLICITADO: {
    textColor: 'text-yellow-500',
  },
}
function getContractTagColor(status) {
  const equivalentColor = statusStyles[status]
  if (!equivalentColor) return 'text-black'
  return equivalentColor
}

function Comercial() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })

  const { data: projects, isSuccess: projectsSuccess, filters, setFilters } = useComercialProjects({ enabled: !!session?.user })
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const [modalProject, setModalProject] = useState({
    isOpen: false,
    projectId: null,
  })

  function getStats({ info }) {
    if (!info)
      return {
        projetos: 0,
        potencia: 0,
        vendido: 0,
        confeccionar: 0,
        assinar: 0,
        vendidoAssinar: 0,
      }
    const projectsQty = info.length
    const totalPower = info.reduce((acc, current) => {
      const currentPower = current.sistema?.potPico || 0
      return acc + currentPower
    }, 0)
    const totalSold = info.reduce((acc, current) => {
      const projectValue = !isNaN(current.sistema?.valorProjeto) ? current.sistema.valorProjeto : 0
      const paValue = !isNaN(current.padrao?.valor) ? current.padrao?.valor : 0
      const structureValue = !isNaN(current.estruturaPersonalizada?.valor) ? current.estruturaPersonalizada.valor : 0

      return acc + projectValue + paValue + structureValue
    }, 0)
    const contractsToMake = info.reduce((acc, current) => {
      const contractRequested = !!current.contrato.dataSolicitacao
      const contractNotReady = !current.contrato.dataLiberacao
      const notSigned = !current.contrato.dataAssinatura
      if (contractRequested && contractNotReady && notSigned) return acc + 1
      return acc
    }, 0)
    const contractsToSign = info.reduce((acc, current) => {
      const contractReady = !!current.contrato.dataLiberacao
      const notSigned = !current.contrato.dataAssinatura
      if (contractReady && notSigned) return acc + 1
      return acc
    }, 0)
    const soldToSign = info.reduce((acc, current) => {
      const contractReady = !!current.contrato.dataLiberacao
      const notSigned = !current.contrato.dataAssinatura
      const projectValue = !isNaN(current.sistema?.valorProjeto) ? current.sistema.valorProjeto : 0
      const paValue = !isNaN(current.padrao?.valor) ? current.padrao?.valor : 0
      const structureValue = !isNaN(current.estruturaPersonalizada?.valor) ? current.estruturaPersonalizada.valor : 0

      if (contractReady && notSigned) return acc + projectValue + paValue + structureValue
      return acc
    }, 0)
    return {
      projetos: projectsQty,
      potencia: formatDecimalPlaces(totalPower, 2),
      vendido: formatToMoney(totalSold),
      confeccionar: contractsToMake,
      assinar: contractsToSign,
      vendidoAssinar: formatToMoney(soldToSign),
    }
  }

  function getDateDiff(date1, date2) {
    const diffInMs = new Date(date1) - new Date(date2)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    return Number(diffInDays).toFixed(0)
  }
  function handleOpenModal(id) {
    console.log('ID ESCOLHIDO', id)
    setModalProject({ projectId: id, isOpen: true })
  }
  useEffect(() => {
    if (session) {
      const userRoutes = session.user.accessibleRoutes
      if (!userRoutes.includes('PPS')) return router.push('/')
    }
  }, [session])
  if (status != 'authenticated') return <LoadingPage />
  if (projectsSuccess && projects) {
    return (
      <div className="grow p-6">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <p className="text-center text-2xl font-black uppercase text-[#15599a]">Projetos no estágio comercial</p>
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
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">PROJETOS NO ESTÁGIO</h1>
                <VscDiffAdded />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).projetos}</div>
                <p className="text-xs text-gray-500">{getStats({ info: projects }).potencia} kWp</p>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">FATURAMENTO</h1>
                <MdAttachMoney />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).vendido} </div>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">EM CONFECÇÃO</h1>
                <MdCreate />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).confeccionar}</div>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">PARA ASSINAR</h1>
                <FaSignature />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).assinar}</div>
                <p className="text-xs text-gray-500">{getStats({ info: projects }).vendidoAssinar} para assinar</p>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {dropdownMenuVisible ? (
              <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
                <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                  <TextInput
                    label={'CÓDIGO CRM'}
                    value={filters.identifier}
                    placeholder={'Digite o código CRM do projeto...'}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, identifier: value }))}
                  />
                  <TextInput
                    label={'NOME DO CONTRATO'}
                    value={filters.search}
                    placeholder={'Digite o nome do contrato...'}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                  />

                  <div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
                    <div className="flex items-center justify-center gap-x-2">
                      <div className="w-full lg:w-[250px]">
                        <DateInput
                          width={'100%'}
                          label={'DEPOIS DE'}
                          value={filters.date.after ? formatDate(filters.date.after) : undefined}
                          handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, after: formatDateInputChange(value) } }))}
                        />
                      </div>
                      <div className="w-full lg:w-[250px]">
                        <DateInput
                          width={'100%'}
                          label={'ANTES DE'}
                          value={filters.date.before ? formatDate(filters.date.before) : undefined}
                          handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, before: formatDateInputChange(value) } }))}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <SelectInput
                        width={'100%'}
                        label={'CAMPO DE FILTRO'}
                        value={filters.date.field1 && filters.date.field2 ? `${filters.date.field1}.${filters.date.field2}` : null}
                        options={[
                          {
                            id: 1,
                            label: 'DATA DA LIBERAÇÃO',
                            value: 'contrato.dataLiberacao',
                          },
                          {
                            id: 2,
                            label: 'DATA ASS.CONTRATO',
                            value: 'contrato.dataAssinatura',
                          },
                          {
                            id: 3,
                            label: 'DATA PAG.KIT',
                            value: 'compra.dataPagamento',
                          },
                        ]}
                        selectedItemLabel={'SEM FILTRO'}
                        handleChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            date: {
                              ...prev.date,
                              field1: value != null ? value.split('.')[0] : null,
                              field2: value != null ? value.split('.')[1] : null,
                            },
                          }))
                        }
                        onReset={() =>
                          setFilters((prev) => ({
                            ...prev,
                            date: {
                              after: null,
                              before: null,
                              field1: null,
                              field2: null,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
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
                </div>
                <div className="flex flex-col items-center justify-center gap-2 lg:flex-row">
                  <div className="w-full lg:w-[250px]">
                    <MultipleSelectInput
                      width={'100%'}
                      label={'STATUS DO CONTRATO'}
                      selected={filters.contractStatus}
                      options={contractStatus}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          contractStatus: value,
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          contractStatus: [],
                        }))
                      }
                    />
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <MultipleSelectInput
                      width={'100%'}
                      label={'VENDEDOR'}
                      selected={filters.sellerName}
                      options={allActiveSellers}
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
                  <div className="w-full lg:w-[250px]">
                    <MultipleSelectInput
                      width={'100%'}
                      label={'INSIDER'}
                      selected={filters.insiderName}
                      options={insiders}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          insiderName: value,
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          insiderName: [],
                        }))
                      }
                    />
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <MultipleSelectInput
                      width={'100%'}
                      label={'STATUS DE SUPLEMENTAÇÃO'}
                      selected={filters.supplyStatus}
                      options={supplementationStatus}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          supplyStatus: value,
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          supplyStatus: [],
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-x-2">
                  <Link href="/comercial/analise">
                    <a className="rounded border border-[#fead61] p-1 font-medium text-[#fead61]">ANALÍTICO</a>
                  </Link>
                  {/* <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterProjects} /> */}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="mt-4 flex flex-wrap justify-around gap-3">
          {projects.map((project, index) => (
            <motion.div
              onClick={() => {
                handleOpenModal(project._id)
              }}
              initial={{ opacity: 0, translateX: -50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ duration: 0.3, delay: 0.01 * index }}
              key={project._id}
              className="w-full cursor-pointer border  border-gray-200 hover:bg-blue-100 md:w-[350px] lg:w-[450px]"
            >
              <TagTipoDeServico tipoDeServico={project.tipoDeServico} />
              <div className="flex flex-col p-2 pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-700">{project.nomeDoContrato}</p>
                  <p className="text-xs font-bold text-[#15599a]">#{project.qtde}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">CONTRATO</span>
                    <p className={`text-xs font-medium ${getContractTagColor(project.contrato.status)}`}>
                      {project.contrato?.status && project.contrato?.status}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">VENDEDOR</span>
                    <p className="text-xs font-medium tracking-tight text-[#15599a]">{project.vendedor && project.vendedor.nome}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">FORMA DE PAGAMENTO</span>
                    <p className="text-xs font-medium tracking-tight">{project.pagamento?.forma && project.pagamento.forma}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">VALOR TOTAL</span>
                    <p className="text-xs font-medium tracking-tight text-green-500">
                      {formatToMoney(
                        getContractValue({
                          projectValue: project.sistema.valorProjeto,
                          paValue: project.padrao.valor,
                          structureValue: project.estruturaPersonalizada.valor,
                        })
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">STATUS DO PARECER</span>
                    <p className="text-xs font-medium tracking-tight text-green-500">
                      {project.parecer.dataParecerDeAcesso ? 'LIBERADO' : 'NÃO LIBERADO'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">STATUS DA COMPRA</span>
                    <p className="text-xs font-medium tracking-tight">
                      {project.compra.liberacao ? project.compra.status || 'NÃO DEFINIDO' : 'NÃO LIBERADA'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {session.user?.regional == undefined && (
          <Link href={'/comercial/formulariosSolicitacao'}>
            <a className="left-150 fixed bottom-10 ml-36 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
              <p className="text-sm font-bold uppercase">Formulários</p>
            </a>
          </Link>
        )}
        {modalProject.isOpen && modalProject.projectId ? (
          <ModalComercial
            projectId={modalProject.projectId}
            modalIsOpen={modalProject.isOpen}
            closeModal={() => setModalProject({ isOpen: false, projectId: null })}
          />
        ) : null}
      </div>
    )
  } else return <ComercialSkeleton />
}

export default Comercial
