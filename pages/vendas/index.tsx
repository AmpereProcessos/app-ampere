import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ModalVendas from '../../components/ModalVendas'
import axios from 'axios'
import Link from 'next/link'
import { AiOutlineSearch } from 'react-icons/ai'
import Select from 'react-select'
import { cidadesAtendidas } from '../../utils/constants'

import AllCities from './../../utils/jsons/cidades.json'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'
import { useSellerSales } from '@/utils/methods/query/clients'
import ErrorComponent from '@/components/utils/ErrorComponent'
import TagTipoDeServico from '@/components/TagTipoDeServico'
import { AnimatePresence, motion } from 'framer-motion'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import TextInput from '@/components/inputs/Text'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import { accessGrantingStatus, executionStatus, inspectionStatus } from '@/utils/select-options'
import MultipleSelectInputVirtualized from '@/components/inputs/MultipleSelectInputVirtualized'
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
function Vendas() {
  const router = useRouter()
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  const { data: session, status } = useSession({ required: true })
  const { data: projects, isLoading, isError, isSuccess, filters, setFilters } = useSellerSales()
  if (status != 'authenticated') return <LoadingPage />

  return (
    <div className="grow p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-start">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">PROJETOS VENDIDOS</p>
            <p className="text-sm font-medium tracking-tight text-gray-500">{projects ? projects.length : '...'} projetos encontrados</p>
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
                    label={'STATUS DE ENTREGA'}
                    selected={filters.deliveryStatus}
                    options={[
                      { id: 1, label: 'AGUARDANDO COMPRA', value: 'AGUARDANDO COMPRA' },
                      { id: 2, label: 'EM ROTA', value: 'EM ROTA' },
                      { id: 3, label: 'ENTREGUE', value: 'ENTREGUE' },
                      { id: 4, label: 'CANCELADO', value: 'CANCELADO' },
                      { id: 5, label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                    ]}
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
                    options={accessGrantingStatus}
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
                    options={executionStatus}
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

                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInputVirtualized
                    width={'100%'}
                    label={'CIDADE'}
                    selected={filters.city}
                    options={AllCities.map((city, index) => ({ id: index + 1, label: city, value: city }))}
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
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex flex-wrap justify-around gap-3">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar projetos.'} /> : null}
        {isSuccess
          ? projects.map((project, index) => (
              <motion.div
                initial={{ opacity: 0, translateX: -50 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ duration: 0.3, delay: 0.01 * index }}
                key={project._id}
                className="w-full cursor-pointer border  border-gray-200 md:w-[350px] lg:w-[450px]"
              >
                <TagTipoDeServico tipoDeServico={project.tipoDeServico} />
                <div className="flex flex-col p-2 pb-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-700">{project.nomeDoContrato}</p>
                    <p className="text-xs font-bold text-[#15599a]">#{project.qtde}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">CIDADE</span>
                      <p className={`text-xs font-medium `}>{project.cidade}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">TELEFONE</span>
                      <p className="text-xs font-medium">{project.telefone}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">CONTRATO</span>
                      <p className={`text-xs font-medium `}>{project.contrato?.status && project.contrato?.status}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">PAGAMENTO</span>
                      <p className="text-xs font-medium">{project.pagamento.status || 'NÃO DEFINIDO'}</p>
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
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">STATUS DA OBRA</span>
                      <p className="text-xs font-medium tracking-tight">{project.obra.statusDaObra || 'NÃO DEFINIDO'}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">STATUS DA VISTORIA</span>
                      <p className="text-xs font-medium tracking-tight">{project.vistoria.status || 'NÃO DEFINIDO'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          : null}
      </div>
    </div>
  )
}

export default Vendas
