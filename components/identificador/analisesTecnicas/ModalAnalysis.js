import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useQueryClient } from 'react-query'

import { FaSave, FaSolarPanel, FaUser } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import { BsCalendarCheckFill, BsCalendarFill, BsCode } from 'react-icons/bs'

import SelectInputWithImages from '../../inputs/SelectWithImages'
import SelectInput from '../../inputs/Select'

import { useTechnicalAnalysisById } from '../../../utils/methods/query/techAnalysis'
import {
  engineeringAnalysts,
  technicalAnalysisSolicitationTypes,
  technicalAnalysisPendencyCategories,
  technicalAnalysisStatus,
  technicalAnalysisReportTypes,
} from '../../../utils/select-options'
import LoadingPage from '../../utils/LoadingPage'
import ErrorComponent from '../../utils/ErrorComponent'
import { formatNameAsInitials } from '../../../utils/methods/formatting'
import { useKey } from '../../../utils/hooks'
import { useMutationWithFeedback } from '../../../utils/methods/mutation/general-hook'
import { updateTechnicalAnalysis } from '../../../utils/methods/mutation/technicalAnalysis'

import LocationBlock from './blocos/LocationBlock'
import EquipmentBlock from './blocos/EquipmentBlock'
import EnergyPABlock from './blocos/EnergyPABlock'
import TransformerBlock from './blocos/TransformerBlock'
import ExecutionBlock from './blocos/ExecutionBlock'
import DetailsBlock from './blocos/DetailsBlock'
import SupplyBlock from './blocos/SupplyBlock'
import DescriptiveBlock from './blocos/DescriptiveBlock'
import AdditionalServicesBlock from './blocos/AdditionalServicesBlock'
import PendencyBlock from './blocos/PendencyBlock'
import AdditionalCostsBlock from './blocos/AdditionalCostsBlock'
import StructureBlock from './blocos/StructureBlock'
import ModuleOrientationBlock from './blocos/ModuleOrientationBlock'
import FilesBlock from './blocos/FilesBlock'
import DrawBlock from './blocos/DrawBlock'
import ConclusionBlock from './blocos/ConclusionBlock'

import Avatar from '../../utils/Avatar'
import { TbWaveSine } from 'react-icons/tb'

function ModalAnalysis({ analysisId, modalIsOpen, closeModal }) {
  useKey('Escape', () => closeModal())
  const queryClient = useQueryClient()
  const { data: analysis, isSuccess, isLoading, isError } = useTechnicalAnalysisById({ enabled: !!analysisId, id: analysisId })
  const { mutate, isLoading: updateLoading } = useMutationWithFeedback({
    mutationKey: ['update-technical-analysis', analysisId],
    mutationFn: updateTechnicalAnalysis,
    affectedQueryKey: ['technical-analysis-by-id', analysisId],
    queryClient: queryClient,
  })
  const [infoHolder, setInfoHolder] = useState()
  const [changes, setChanges] = useState({})

  function reopenAnalysis() {
    setInfoHolder((prev) => ({ ...prev, status: 'PENDENTE', dataEfetivacao: null }))
    setChanges((prev) => ({ ...prev, status: 'PENDENTE', dataEfetivacao: null }))
    mutate({ id: analysisId, changes: { status: 'PENDENTE', dataEfetivacao: null } })
  }
  function concludeVisita() {
    setInfoHolder((prev) => ({ ...prev, status: 'CONCLUIDO', dataEfetivacao: new Date().toISOString() }))
    setChanges((prev) => ({ ...prev, status: 'CONCLUIDO', dataEfetivacao: new Date().toISOString() }))
    mutate({ id: analysisId, changes: { status: 'CONCLUIDO', dataEfetivacao: new Date().toISOString() } })
  }
  useEffect(() => {
    setInfoHolder(analysis)
  }, [analysis])
  return (
    <>
      <div id="defaultModal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
        <div className="fixed left-[50%] top-[50%] z-[100] h-[93%] w-[93%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px]">
          <div className="flex h-full flex-col">
            <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
              <div className="flex flex-col">
                <h1 className="pl-6 font-bold text-[#15599a]">{analysis ? analysis.nome : 'CARREGANDO...'}</h1>
                <p className="text-xs italic text-gray-500">#{analysis?._id}</p>
              </div>
              <div className="flex items-center gap-x-2">
                {/* {msg.text && <p className={`hidden lg:block text-sm italic ${msg.color}`}>{msg.text}</p>} */}
                <button
                  disabled={updateLoading}
                  onClick={() => mutate({ id: analysisId, changes: changes })}
                  className="flex cursor-pointer items-center gap-x-2 rounded bg-[#15599a] p-2 text-sm font-bold text-white transition duration-300 ease-in-out disabled:bg-gray-300 disabled:text-white enabled:hover:scale-105 enabled:hover:bg-blue-500"
                >
                  <p className="mr-2 text-sm">Salvar alterações</p>
                  <FaSave />
                </button>
                <button
                  onClick={() => closeModal()}
                  type="button"
                  className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
                >
                  <VscChromeClose style={{ color: 'red' }} />
                </button>
              </div>
              {/* <p className={`block lg:hidden text-sm italic ${msg.color}`}>{msg.text}</p> */}
            </div>
            {isLoading ? <LoadingPage /> : null}
            {isError ? <ErrorComponent msg={'Erro ao carregar informações da análise. Tente novamente.'} /> : null}
            {isSuccess && infoHolder ? (
              <div className="flex grow py-2 px-2 flex-col gap-y-2 overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                <div className="flex items-center justify-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Avatar fallback={'U'} height={25} width={25} url={infoHolder?.requerente?.avatar_url} />
                    <p className="font-medium text-gray-500 text-xs">{infoHolder?.requerente?.nomeCRM || 'Autor não identificado'}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <BsCalendarFill />
                    <p className="text-xs font-medium">{dayjs(infoHolder?.dataInsercao).format('DD/MM/YYYY HH:mm')}</p>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-2 lg:flex-row justify-center">
                  <div className="w-full lg:w-[350px]">
                    <SelectInputWithImages
                      label={'ANALISTA RESPONSÁVEL'}
                      value={infoHolder.analista?.id}
                      options={engineeringAnalysts.map((analyst) => ({
                        id: analyst.id,
                        label: analyst.apelido,
                        value: analyst,
                        url: analyst.avatar_url,
                        fallback: formatNameAsInitials(analyst.nome),
                      }))}
                      handleChange={(value) => {
                        setInfoHolder((prev) => ({ ...prev, analista: value }))
                        setChanges((prev) => ({ ...prev, analista: value }))
                      }}
                      selectedItemLabel="NÃO DEFINIDO"
                      onReset={() => {
                        setInfoHolder((prev) => ({ ...prev, analista: null }))
                        setChanges((prev) => ({ ...prev, analista: null }))
                      }}
                    />
                  </div>
                  <div className="w-full lg:w-[350px]">
                    <SelectInput
                      label="TIPO DE SOLICITAÇÃO"
                      options={technicalAnalysisSolicitationTypes}
                      value={infoHolder.tipoSolicitacao}
                      handleChange={(value) => {
                        setInfoHolder((prev) => ({ ...prev, tipoSolicitacao: value }))
                        setChanges((prev) => ({ ...prev, tipoSolicitacao: value }))
                      }}
                      onReset={() => {
                        setInfoHolder((prev) => ({ ...prev, tipoSolicitacao: 'SIMPLES' }))
                        setChanges((prev) => ({ ...prev, tipoSolicitacao: 'SIMPLES' }))
                      }}
                      selectedItemLabel="NÃO DEFINIDO"
                    />
                  </div>
                  <div className="w-full lg:w-[350px]">
                    <SelectInput
                      label="COMPLEXIDADE DO LAUDO"
                      options={[
                        { id: 1, label: 'SIMPLES', value: 'SIMPLES' },
                        { id: 2, label: 'INTERMEDIÁRIO', value: 'INTERMEDIÁRIO' },
                        { id: 3, label: 'COMPLEXO', value: 'COMPLEXO' },
                      ]}
                      value={infoHolder.complexidade}
                      handleChange={(value) => {
                        setInfoHolder((prev) => ({ ...prev, complexidade: value }))
                        setChanges((prev) => ({ ...prev, complexidade: value }))
                      }}
                      onReset={() => {
                        setInfoHolder((prev) => ({ ...prev, complexidade: 'SIMPLES' }))
                        setChanges((prev) => ({ ...prev, complexidade: 'SIMPLES' }))
                      }}
                      selectedItemLabel="NÃO DEFINIDO"
                    />
                  </div>
                </div>
                {analysis.dataEfetivacao ? (
                  <div className="flex w-full flex-col items-center gap-2">
                    <div className={`flex items-center gap-2 text-green-500`}>
                      <BsCalendarCheckFill />
                      <p className="text-xs font-medium">{dayjs(analysis.dataEfetivacao).format('DD/MM/YYYY HH:mm')}</p>
                    </div>
                    <button
                      onClick={reopenAnalysis}
                      className="rounded border border-gray-500 p-1 font-bold text-gray-500 duration-300 ease-in-out hover:bg-gray-500 hover:text-white"
                    >
                      REABRIR ANÁLISE
                    </button>
                  </div>
                ) : (
                  <div className="flex w-full flex-col items-center gap-2">
                    {infoHolder.status != 'CONCLUIDO' ? (
                      <SelectInput
                        label={'STATUS DA ANÁLISE'}
                        selectedItemLabel={'NÃO DEFINIDO'}
                        options={technicalAnalysisStatus.filter((s) => s.value != 'CONCLUIDO')}
                        value={infoHolder.status}
                        handleChange={(value) => {
                          setInfoHolder((prev) => ({ ...prev, status: value }))
                          setChanges((prev) => ({ ...prev, status: value }))
                        }}
                        onReset={() => {
                          setInfoHolder((prev) => ({ ...prev, status: 'PENDENTE' }))
                          setChanges((prev) => ({ ...prev, status: 'PENDENTE' }))
                        }}
                      />
                    ) : null}

                    <button
                      onClick={concludeVisita}
                      className="rounded border border-green-500 p-1 font-bold text-green-500 duration-300 ease-in-out hover:bg-green-500 hover:text-white"
                    >
                      FINALIZAR ANÁLISE
                    </button>
                  </div>
                )}
                <textarea
                  placeholder="SEM ANOTAÇÕES PREENCHIDAS..."
                  value={infoHolder.anotacoes || ''}
                  onChange={(e) => {
                    setInfoHolder((prev) => ({
                      ...prev,
                      anotacoes: e.target.value,
                    }))
                    setChanges((prev) => ({ ...prev, anotacoes: e.target.value }))
                  }}
                  className="min-h-[80px] w-full resize-none rounded-bl-sm rounded-br-sm bg-gray-100 p-3 text-center text-xs font-medium text-gray-600 outline-none"
                />
                <div className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2">
                  <h1 className="font-bold text-white">PROJETO</h1>
                </div>
                {analysis.projeto ? (
                  <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
                    <div className="flex items-center gap-2">
                      <BsCode size={'20px'} color="rgb(31,41,55)" />
                      {analysis.projeto.id ? (
                        <Link href={`https://crm.ampereenergias.com.br/projeto/id/${analysis.projeto.id}`}>
                          <a className="font-raleway cursor-pointer text-sm font-medium duration-300 ease-in-out hover:text-cyan-300">
                            #{analysis.projeto.identificador || 'N/A'}
                          </a>
                        </Link>
                      ) : (
                        <p className="font-raleway cursor-pointer text-sm font-medium duration-300 ease-in-out hover:text-blue-300">
                          #{analysis.projeto.identificador || 'N/A'}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUser size={'20px'} color="rgb(31,41,55)" />
                      <p className="font-raleway text-sm font-medium">{analysis.projeto.nome || 'N/A'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="w-full py-2 text-center text-sm italic text-gray-500">Sem informações do projeto...</p>
                )}
                {analysis.aumento ? (
                  <>
                    <div className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2">
                      <h1 className="font-bold text-white">PROJETO ANTERIOR</h1>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
                      <div className="flex items-center gap-2">
                        <BsCode size={'20px'} color="rgb(31,41,55)" />
                        {analysis.aumento.id ? (
                          <a className="font-raleway cursor-pointer text-sm font-medium duration-300 ease-in-out hover:text-cyan-300">
                            #{analysis.aumento.id || 'N/A'}
                          </a>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUser size={'20px'} color="rgb(31,41,55)" />
                        <p className="font-raleway text-sm font-medium">{analysis.aumento.nome || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex w-full flex-col items-center justify-center gap-2 md:flex-row lg:gap-4">
                      <div className="flex items-center gap-2">
                        <FaSolarPanel size={'20px'} color="rgb(31,41,55)" />
                        <p className="font-raleway text-sm font-medium">
                          {analysis.aumento.equipamentos.modulos.qtde}x {analysis.aumento.equipamentos.modulos.modelo || 'N/A'}{' '}
                          {analysis.aumento.equipamentos.modulos.potencia}W
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TbWaveSine size={'20px'} color="rgb(31,41,55)" />
                        <p className="font-raleway text-sm font-medium">
                          {analysis.aumento.equipamentos?.inversor.qtde}x {analysis.aumento.equipamentos?.inversor.modelo || 'N/A'}{' '}
                          {analysis.aumento.equipamentos?.inversor.potencia}W
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="w-full py-2 text-center text-sm italic text-gray-500">Sem informações do projeto...</p>
                )}
                <div className="w-full flex flex-col">
                  <h1 className="w-full p-1 bg-gray-500 text-white font-bold text-center rounded-tr-sm rounded-tl-sm">COMENTÁRIOS DO REQUERENTE</h1>
                  <textarea
                    placeholder="SEM COMENTÁRIOS PREENCHIDOS..."
                    value={infoHolder.comentarios || ''}
                    readOnly={true}
                    onChange={(e) => {
                      setInfoHolder((prev) => ({
                        ...prev,
                        execucao: prev.execucao ? { ...prev.execucao, observacoes: e.target.value } : { observacoes: e.target.value, itens: [] },
                      }))
                      setChanges((prev) => ({ ...prev, 'execucao.observacoes': e.target.value }))
                    }}
                    className="min-h-[80px] w-full resize-none rounded-bl-sm rounded-br-sm bg-gray-100 p-3 text-center text-xs font-medium text-gray-600 outline-none"
                  />
                </div>
                <PendencyBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
                <LocationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
                <EquipmentBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
                <DetailsBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
                <FilesBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
                <StructureBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
                <EnergyPABlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
                <TransformerBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
                <SupplyBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
                <ExecutionBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
                <ModuleOrientationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
                <DescriptiveBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
                <AdditionalServicesBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
                <AdditionalCostsBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
                <DrawBlock
                  infoHolder={infoHolder}
                  setInfoHolder={setInfoHolder}
                  changes={changes}
                  setChanges={setChanges}
                  updateAnalysis={(change) => mutate({ id: analysisId, changes: change })}
                />
                <ConclusionBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />{' '}
                <div className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2 mt-4">
                  <h1 className="font-bold text-white">TIPOS DE LAUDO</h1>
                </div>
                <div className="w-full flex items-center gap-2 justify-center flex-wrap px-4">
                  {technicalAnalysisReportTypes.map((type) => (
                    <Link key={type.id} href={`/projetos/laudo/pdf/${analysisId}?tipo=${type.value}`}>
                      <a className="py-1 px-2 rounded border border-black font-bold text-center w-fit shadow-sm hover:bg-black hover:text-white">
                        {type.value}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalAnalysis
