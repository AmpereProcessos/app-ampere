import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import SelectInput from './SelectInput'

import { TProjectDTO } from '@/utils/schemas/projects'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { updateProject } from '@/utils/methods/mutation/clients'
import ModalDB from './ModalDB'

import { formatDateAsLocale } from '@/utils/methods/formatting'
import CheckboxInput from './inputs/Checkbox'

import { TbTruckDelivery } from 'react-icons/tb'
import { BsCalendarFill, BsCheckAll, BsUnlockFill } from 'react-icons/bs'
import { FaExpandArrowsAlt, FaSignature, FaSolarPanel, FaStore } from 'react-icons/fa'
import { MdOutlineCheckBox } from 'react-icons/md'
import ProjectActivityCard from './identificador/atividades/ProjectActivityCard'
import { getDifferenceBetweenDates } from '@/utils/methods/dates'
import Link from 'next/link'
import dayjs from 'dayjs'
import { Session } from 'next-auth'

type PosVendaCardProps = {
  session: Session
  projectId: string
  project: TProjectDTO
  mode: 'CARD' | 'SIMPLIFIED'
}
function PosVendaCard({ session, projectId, project, mode }: PosVendaCardProps) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfo] = useState(project)

  const [activitiesMenuIsOpen, setActivitiesMenuIsOpen] = useState<boolean>(false)
  const [modalProjectIsOpen, setModalProjectIsOpen] = useState<boolean>(false)

  function getDateDiff(date1: Date, date2: Date) {
    //@ts-ignore
    const diffInMs = date1 - date2
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    return diffInDays
  }
  function getBarColor(lastContact: string | undefined | null) {
    if (!lastContact) return 'bg-red-500'
    const sinceLastContact = dayjs().diff(lastContact, 'day')
    if (sinceLastContact >= 7) return 'bg-red-500'
    else return 'bg-blue-500'
  }
  function renderDeliveryInfo({ expectedAt, deliveredAt }: { expectedAt?: string | null; deliveredAt?: string | null }) {
    if (!!deliveredAt)
      return (
        <h1 className="text-center text-[0.65rem] leading-none tracking-tight text-gray-500 lg:text-xs">
          ENTREGUE EM: <strong className="text-cyan-500">{formatDateAsLocale(deliveredAt)}</strong> (HÁ{' '}
          <strong className="text-cyan-500">{getDifferenceBetweenDates({ start: deliveredAt, end: new Date() })} DIAS</strong> )
        </h1>
      )
    if (expectedAt)
      return (
        <h1 className="text-center text-[0.65rem] leading-none tracking-tight text-gray-500 lg:text-xs">
          PREVISTO PARA: {formatDateAsLocale(expectedAt)} (EM{' '}
          <strong className="text-cyan-500">{getDifferenceBetweenDates({ start: expectedAt, end: new Date() })} DIAS</strong> )
        </h1>
      )
    return <h1 className="text-center text-[0.65rem] leading-none tracking-tight text-gray-500 lg:text-xs">ENTREGA INDEFINIDA</h1>
  }
  function renderAccessInfo({ approvedAt }: { approvedAt?: string | null }) {
    if (!!approvedAt)
      return (
        <h1 className="text-center text-[0.65rem] leading-none tracking-tight text-gray-500 lg:text-xs">
          PARECER APROVADO EM: <strong className="text-cyan-500">{formatDateAsLocale(approvedAt)}</strong> (HÁ{' '}
          <strong className="text-cyan-500">{getDifferenceBetweenDates({ start: approvedAt, end: new Date() })} DIAS</strong> )
        </h1>
      )
    return <h1 className="text-center text-[0.65rem] leading-none tracking-tight text-gray-500 lg:text-xs">PARECER NÃO APROVADO</h1>
  }
  const { mutate: handleUpdateProject, isPending } = useMutationWithFeedback({
    mutationKey: ['update-after-sales-project'],
    mutationFn: updateProject,
    affectedQueryKey: ['after-sales-projects'],
    queryClient: queryClient,
    callbackFn: () => console.log(),
  })
  const openActivitiesCount = project.atividades ? project.atividades.filter((a) => !a.dataConclusao).length : 0

  if (mode == 'CARD')
    return (
      <div className="font flex w-full gap-2 rounded-md border border-gray-300 shadow-sm">
        <div className={`h-full w-[7px] ${getBarColor(infoHolder.jornada.dataUltimoContato)} rounded-tl-md rounded-bl-md`}></div>
        <div className="flex w-full grow flex-col p-3">
          <div className="flex w-full flex-col items-start justify-between lg:flex-row lg:items-center">
            <h1 className="font-bold leading-none tracking-tight">
              <strong className="text-[#fead41]">#{project.qtde}</strong> {project.nomeDoContrato}
            </h1>
            <div className="mt-2 flex w-full items-center justify-center gap-2 lg:mt-0 lg:w-fit lg:justify-end">
              <div className="flex items-center gap-2 text-gray-500">
                <BsCalendarFill />
                <p className="text-xs font-medium">
                  {project.jornada.dataUltimoContato ? formatDateAsLocale(project.jornada.dataUltimoContato) : 'SEM CONTATO'}
                </p>
              </div>
              <button
                onClick={() => {
                  // @ts-ignore
                  handleUpdateProject({ id: projectId, changes: { 'jornada.dataUltimoContato': new Date().toISOString() } })
                  setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, dataUltimoContato: new Date().toISOString() } }))
                }}
                className="flex items-center gap-1 rounded bg-black py-2 px-4 text-xs font-medium text-white duration-300 ease-in-out hover:bg-gray-700"
              >
                <p>CONTATO RECENTE</p>
                <BsCheckAll size={18} />
              </button>
            </div>
          </div>
          <div className="flex w-full flex-col">
            <h1 className="mt-1 w-full text-start text-xs font-bold leading-none tracking-tight text-cyan-500">INFORMAÇÕES GERAIS</h1>
            <div className="mt-1 flex w-full flex-col flex-wrap items-center justify-between gap-2 md:flex-row">
              <div className="flex flex-col items-center rounded p-1 lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">TELEFONE</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.telefone}</h1>
              </div>
              <div className="flex flex-col items-center rounded p-1 lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">VENDEDOR</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.vendedor.nome}</h1>
              </div>
              <div className="flex flex-col items-center rounded p-1 lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">TIPO DE SERVIÇO</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.tipoDeServico}</h1>
              </div>
              <div className="flex flex-col items-center rounded p-1 lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">TIPO DE SERVIÇO</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.tipoDeServico}</h1>
              </div>
              {!!project.seguro?.aplicavel ? (
                <div className="flex flex-col items-center rounded bg-green-100 p-1 lg:items-start">
                  <h1 className="text-[0.6rem] leading-none tracking-tight text-green-500">POSSUI SEGURO ?</h1>
                  <h1 className="text-center text-[0.65rem] font-medium text-green-600 lg:text-sm">SIM</h1>
                </div>
              ) : null}

              <div className="flex flex-col items-center rounded p-1 lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">Nº DE MÓDULOS</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.sistema.qtdeModulos}</h1>
              </div>
              <div className="flex flex-col items-center rounded p-1 lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">STATUS DO PARECER</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.homologacao.status || 'NÃO DEFINIDO'}</h1>
              </div>
              <div className="flex flex-col items-center rounded p-1 lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">LIBERAÇÃO DA DOCUMENTAÇÃO</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">
                  {project.homologacao.documentacao.dataLiberacao
                    ? formatDateAsLocale(project.homologacao.documentacao.dataLiberacao)
                    : 'NÃO DEFINIDO'}
                </h1>
              </div>
              <div className="flex flex-col items-center rounded p-1 lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">ASSINATURA DA DOCUMENTAÇÃO</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">
                  {project.homologacao.documentacao.dataAssinatura
                    ? formatDateAsLocale(project.homologacao.documentacao.dataAssinatura)
                    : 'NÃO DEFINIDO'}
                </h1>
              </div>
              <div className="flex flex-col items-center rounded p-1 lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">STATUS DE SUPLEMENTAÇÃO</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.compra.status || 'NÃO DEFINIDO'}</h1>
              </div>
              <div className="flex flex-col items-center rounded p-1 lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">PREVISÃO DE ENTREGA</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">
                  {project.compra.previsaoEntrega ? formatDateAsLocale(project.compra.previsaoEntrega) : 'NÃO DEFINIDO'}
                </h1>
              </div>
              <div className="flex flex-col items-center rounded p-1 lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">PREVISÃO DE ENTREGA</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">
                  {project.compra.status ? formatDateAsLocale(project.compra.status) : 'NÃO DEFINIDO'}
                </h1>
              </div>
              <div className="flex flex-col items-center rounded p-1 lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">FORNECEDOR</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.compra.fornecedor || 'NÃO DEFINIDO'}</h1>
              </div>
              <div className="flex flex-col items-center rounded p-1 lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">DATA DE FATURAMENTO</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">
                  {project.faturamento?.dataFaturamento ? formatDateAsLocale(project.faturamento.dataFaturamento) : 'NÃO DEFINIDO'}
                </h1>
              </div>
            </div>
            <h1 className="mt-1 w-full text-start text-xs font-bold leading-none tracking-tight text-cyan-500">INFORMAÇÕES DA JORNADA</h1>
            <div className="flex w-full flex-wrap items-center justify-around">
              {project.possuiDeficiencia == 'SIM' ? (
                <>
                  <div className="flex flex-col items-center lg:items-start">
                    <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">PESSOA COM DEFICIÊNCIA</h1>
                    <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.qualDeficiencia}</h1>
                  </div>
                </>
              ) : null}
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">CONTATOS DA JORNADA</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.jornada.contatos || 'NÃO DEFINIDO'}</h1>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">CUIDADOS NA JORNADA</h1>
                <h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.jornada.cuidados || 'NÃO DEFINIDO'}</h1>
              </div>
            </div>
            <div className="mt-3 flex w-full flex-col items-center justify-around gap-3 border border-cyan-500 p-2">
              <div className="flex w-full items-center justify-between gap-2">
                <h1 className="text-start text-xs font-bold leading-none tracking-tight text-cyan-500">JORNADA DO CLIENTE</h1>
                <div className="flex items-center gap-1 rounded-full border border-blue-500 px-2 py-1 text-blue-500 duration-300 ease-in-out hover:bg-blue-500 hover:text-white">
                  <Link href={`/publico/jornada-do-cliente/${project._id}`}>
                    <div className="text-[0.65rem] font-bold">LINK DA JORNADA</div>
                  </Link>
                </div>
              </div>
              <div className="flex w-full flex-wrap justify-around gap-3">
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse={'BOAS VINDAS'}
                    labelTrue={'BOAS VINDAS'}
                    checked={!!infoHolder.jornada.boasVindas}
                    handleChange={(value) => {
                      // @ts-ignore
                      handleUpdateProject({ id: projectId, changes: { 'jornada.boasVindas': value } })
                      setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, boasVindas: value } }))
                    }}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse={'ASSINATURA DAS DOCUMENTAÇÕES'}
                    labelTrue={'ASSINATURA DAS DOCUMENTAÇÕES'}
                    checked={!!infoHolder.jornada.assDocumentacoes}
                    handleChange={(value) => {
                      // @ts-ignore
                      handleUpdateProject({ id: projectId, changes: { 'jornada.assDocumentacoes': value } })
                      setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, assDocumentacoes: value } }))
                    }}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse={'COMPRA DO KIT'}
                    labelTrue={'COMPRA DO KIT'}
                    checked={!!infoHolder.jornada.compraDoKit}
                    handleChange={(value) => {
                      // @ts-ignore
                      handleUpdateProject({ id: projectId, changes: { 'jornada.compraDoKit': value } })
                      setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, compraDoKit: value } }))
                    }}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse={'NF FATURADA'}
                    labelTrue={'NF FATURADA'}
                    checked={!!infoHolder.jornada.nfFaturada}
                    handleChange={(value) => {
                      // @ts-ignore
                      handleUpdateProject({ id: projectId, changes: { 'jornada.nfFaturada': value } })
                      setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, nfFaturada: value } }))
                    }}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse={'PREVISÃO DE ENTREGA'}
                    labelTrue={'PREVISÃO DE ENTREGA'}
                    checked={!!infoHolder.jornada.prevChegada}
                    handleChange={(value) => {
                      // @ts-ignore
                      handleUpdateProject({ id: projectId, changes: { 'jornada.prevChegada': value } })
                      setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, prevChegada: value } }))
                    }}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse={'RESPOSTA DA CONCESSIONÁRIA'}
                    labelTrue={'RESPOSTA DA CONCESSIONÁRIA'}
                    checked={!!infoHolder.jornada.respConcessionaria}
                    handleChange={(value) => {
                      // @ts-ignore
                      handleUpdateProject({ id: projectId, changes: { 'jornada.respConcessionaria': value } })
                      setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, respConcessionaria: value } }))
                    }}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse={'KIT ENTREGUE'}
                    labelTrue={'KIT ENTREGUE'}
                    checked={!!infoHolder.jornada.entregaDoKit}
                    handleChange={(value) => {
                      // @ts-ignore
                      handleUpdateProject({ id: projectId, changes: { 'jornada.entregaDoKit': value } })
                      setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, entregaDoKit: value } }))
                    }}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse={'INSTALAÇÃO AGENDADA'}
                    labelTrue={'INSTALAÇÃO AGENDADA'}
                    checked={!!infoHolder.jornada.instalacaoAgendada}
                    handleChange={(value) => {
                      // @ts-ignore
                      handleUpdateProject({ id: projectId, changes: { 'jornada.instalacaoAgendada': value } })
                      setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, instalacaoAgendada: value } }))
                    }}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse={'INSTALAÇÃO REALIZADA'}
                    labelTrue={'INSTALAÇÃO REALIZADA'}
                    checked={!!infoHolder.jornada.instalacaoRealizada}
                    handleChange={(value) => {
                      // @ts-ignore
                      handleUpdateProject({ id: projectId, changes: { 'jornada.instalacaoRealizada': value } })
                      setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, instalacaoRealizada: value } }))
                    }}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse={'VISTORIA DA CONCESSIONÁRIA'}
                    labelTrue={'VISTORIA DA CONCESSIONÁRIA'}
                    checked={!!infoHolder.jornada.vistoriaConcessionaria}
                    handleChange={(value) => {
                      // @ts-ignore
                      handleUpdateProject({ id: projectId, changes: { 'jornada.vistoriaConcessionaria': value } })
                      setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, vistoriaConcessionaria: value } }))
                    }}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse={'SISTEMA LIGADO'}
                    labelTrue={'SISTEMA LIGADO'}
                    checked={!!infoHolder.jornada.sistemaLigado}
                    handleChange={(value) => {
                      // @ts-ignore
                      handleUpdateProject({ id: projectId, changes: { 'jornada.sistemaLigado': value } })
                      setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, sistemaLigado: value } }))
                    }}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse={'ENTREGA TÉCNICA'}
                    labelTrue={'ENTREGA TÉCNICA'}
                    checked={!!infoHolder.jornada.entregaTecnica}
                    handleChange={(value) => {
                      // @ts-ignore
                      handleUpdateProject({ id: projectId, changes: { 'jornada.entregaTecnica': value } })
                      setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, entregaTecnica: value } }))
                    }}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse={'JORNADA CONCLUIDA'}
                    labelTrue={'JORNADA CONCLUIDA'}
                    checked={!!infoHolder.jornada.jornadaConcluida}
                    handleChange={(value) => {
                      // @ts-ignore
                      handleUpdateProject({
                        id: projectId,
                        changes: { 'jornada.jornadaConcluida': value, 'jornada.dataConclusao': new Date().toISOString() },
                      })
                      setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, jornadaConcluida: value, dataConclusao: new Date().toISOString() } }))
                    }}
                  />
                </div>
              </div>
            </div>
            <h1 className="mt-1 w-full text-start text-xs font-bold leading-none tracking-tight text-cyan-500">ANOTAÇÕES</h1>
            <textarea
              value={infoHolder.jornada.obsJornada || undefined}
              placeholder="Preencha aqui anotações da jornada do cliente..."
              onChange={(e) => setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, obsJornada: e.target.value } }))}
              className="mt-2 min-h-[50px] w-full resize-none rounded border border-gray-300 bg-gray-100 p-3 text-center text-sm text-gray-800 shadow-sm outline-none"
            />
            <div className="mt-1 flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalProjectIsOpen(true)}
                  className="flex items-center gap-1 rounded border border-[#fead41] py-1 px-4 text-xs font-medium text-[#fead41] duration-300 ease-in-out hover:bg-[#fead41] hover:text-white"
                >
                  <p>EXPANDIR</p>
                  <FaExpandArrowsAlt />
                </button>
                <div className="relative">
                  {openActivitiesCount > 0 ? (
                    <div className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-1">
                      <p className="text-xxs font-medium text-white">{openActivitiesCount}</p>
                    </div>
                  ) : null}
                  <button
                    onClick={() => setActivitiesMenuIsOpen((prev) => !prev)}
                    className={`${
                      openActivitiesCount > 0 ? 'border-red-500 text-red-500 hover:bg-red-500' : 'border-blue-500 text-blue-500 hover:bg-blue-500'
                    } flex items-center gap-1 rounded border py-1 px-4 text-xs font-medium duration-300 ease-in-out hover:text-white`}
                  >
                    <p>ATIVIDADES</p>
                    <MdOutlineCheckBox size={18} />
                  </button>
                </div>
              </div>
              <button
                disabled={isPending}
                onClick={() => {
                  // @ts-ignore
                  handleUpdateProject({ id: projectId, changes: { 'jornada.obsJornada': infoHolder.jornada.obsJornada } })
                }}
                className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
              >
                SALVAR ANOTAÇÕES
              </button>
            </div>
            {activitiesMenuIsOpen ? (
              project.atividades && project.atividades.length > 0 ? (
                <div className="mt-1 flex w-full flex-col gap-1">
                  {project.atividades.map((activity) => (
                    <ProjectActivityCard
                      key={activity._id}
                      activity={activity}
                      projectId={projectId}
                      mutateCallback={() => queryClient.invalidateQueries({ queryKey: ['after-sales-projects'] })}
                    />
                  ))}
                </div>
              ) : (
                <h1 className="w-full py-1 text-center text-sm italic text-gray-500">Nenhuma atividade cadastrada...</h1>
              )
            ) : null}
          </div>
        </div>
        {modalProjectIsOpen ? (
          <ModalDB session={session} projectId={projectId} closeModal={() => setModalProjectIsOpen(false)} modalIsOpen={modalProjectIsOpen} />
        ) : null}
      </div>
    )
  if (mode == 'SIMPLIFIED')
    return (
      <div className="font flex w-full gap-2 rounded-md border border-gray-300 shadow-sm">
        <div className={`h-full w-[7px] ${getBarColor(project.jornada.dataUltimoContato)} rounded-tl-md rounded-bl-md`}></div>
        <div className="flex w-full grow flex-col p-3">
          <div className="flex w-full items-center justify-between gap-2">
            <h1 className="font-bold leading-none tracking-tight">
              <strong className="text-[#fead41]">#{project.qtde}</strong> {project.nomeDoContrato}
            </h1>
            <div className="mt-2 flex items-center gap-3 lg:mt-0">
              {/* <div className="flex items-center gap-2 text-gray-500">
                <TbTruckDelivery />
                <p className="text-sm font-medium">
                  {project.compra.previsaoEntrega ? formatDateAsLocale(project.compra.previsaoEntrega) : 'SEM PREVISÃO'}
                </p>
              </div> */}
              <div className="flex items-center gap-2 text-gray-500">
                <BsCalendarFill />
                <p className="text-sm font-medium">
                  {project.jornada.dataUltimoContato
                    ? `ÚLTIMO CONTATO EM: ${formatDateAsLocale(project.jornada.dataUltimoContato)}`
                    : 'SEM REGISTRO DE CONTATO'}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-2 flex w-full flex-wrap items-center justify-start gap-4">
            <div className="flex items-center gap-1">
              <FaSignature />
              <h1 className="text-center text-[0.65rem] leading-none tracking-tight text-gray-500 lg:text-xs">
                ASSINADO EM: <strong className="text-cyan-500">{formatDateAsLocale(project.contrato.dataAssinatura)}</strong> (HÁ{' '}
                <strong className="text-cyan-500">
                  {getDifferenceBetweenDates({ start: project.contrato.dataAssinatura, end: new Date() })} DIAS
                </strong>
                )
              </h1>
            </div>
            {project.compra.dataPedido ? (
              <div className="flex items-center gap-1">
                <FaStore />
                <h1 className="text-center text-[0.65rem] leading-none tracking-tight text-gray-500 lg:text-xs">
                  COMPRO COM: <strong className="text-cyan-500">{project.compra?.fornecedor}</strong>
                </h1>
              </div>
            ) : null}

            <div className="flex items-center gap-1">
              <TbTruckDelivery />
              {renderDeliveryInfo({ deliveredAt: project.compra.dataEntrega, expectedAt: project.compra.previsaoEntrega })}
              {/* <h1 className="text-center text-[0.65rem] leading-none tracking-tight text-gray-500 lg:text-xs">
                {project.compra.dataEntrega
                  ? `ENTREGUE EM: ${formatDateAsLocale(project.compra.dataEntrega)} (HÁ 
                ${getDifferenceBetweenDates({ start: project.compra.dataEntrega, end: new Date() })} DIAS)`
                  : `PREVISTO PARA: ${project.compra.previsaoEntrega ? formatDateAsLocale(project.compra.previsaoEntrega) : 'NÃO DEFINIDO'}`}
              </h1> */}
            </div>
            <div className="flex items-center gap-1">
              <BsUnlockFill />
              {renderAccessInfo({ approvedAt: project.homologacao.acesso.dataResposta })}
            </div>
            <div className="flex items-center gap-1">
              <FaSolarPanel />
              <h1 className="text-center text-[0.65rem] leading-none tracking-tight text-gray-500 lg:text-xs">
                <strong className="text-cyan-500">{project.sistema?.qtdeModulos} MÓDULOS</strong>
              </h1>
            </div>
          </div>
        </div>
      </div>
    )
}

export default PosVendaCard
