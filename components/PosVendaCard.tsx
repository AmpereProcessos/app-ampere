import React, { useState } from 'react'
import SelectInput from './SelectInput'
import dayjs from 'dayjs'
import axios from 'axios'
import SaveButton from './utils/Buttons/SaveButton'
import { FaSave } from 'react-icons/fa'
import { AiFillInteraction } from 'react-icons/ai'
import { TProjectDTO } from '@/utils/schemas/projects'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { useQueryClient } from 'react-query'
import { updateProject } from '@/utils/methods/mutation/clients'
import { BsCalendarFill, BsCheckAll } from 'react-icons/bs'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import CheckboxInput from './inputs/Checkbox'
import { TbTruckDelivery } from 'react-icons/tb'

type PosVendaCardProps = {
  projectId: string
  project: TProjectDTO
  mode: 'CARD' | 'SIMPLIFIED'
}
function PosVendaCard({ projectId, project, mode }: PosVendaCardProps) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfo] = useState(project)

  function getDateDiff(date1: Date, date2: Date) {
    //@ts-ignore
    const diffInMs = date1 - date2
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    return diffInDays
  }
  function getBarColor(lastContact: string | undefined | null) {
    if (!lastContact) return 'bg-red-500'
    const sinceLastContact = getDateDiff(new Date(), new Date(lastContact))
    if (sinceLastContact > 7) return 'bg-red-500'
    else return 'bg-blue-500'
  }
  const { mutate: handleUpdateProject, isLoading } = useMutationWithFeedback({
    mutationKey: ['update-after-sales-project'],
    mutationFn: updateProject,
    affectedQueryKey: ['after-sales-projects'],
    queryClient: queryClient,
  })

  if (mode == 'CARD')
    return (
      <div className="flex font gap-2 w-full shadow-sm border border-gray-300 rounded-md">
        <div className={`h-full w-[7px] ${getBarColor(infoHolder.jornada.dataUltimoContato)} rounded-tl-md rounded-bl-md`}></div>
        <div className="flex flex-col w-full grow p-3">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full">
            <h1 className="font-bold tracking-tight leading-none">
              <strong className="text-[#fead41]">#{project.qtde}</strong> {project.nomeDoContrato}
            </h1>
            <div className="flex w-full lg:w-fit items-center justify-center lg:justify-end gap-2 mt-2 lg:mt-0">
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
                className="flex items-center gap-1 py-2 px-4 bg-black rounded text-xs text-white font-medium hover:bg-gray-700 duration-300 ease-in-out"
              >
                <p>CONTATO RECENTE</p>
                <BsCheckAll size={18} />
              </button>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <h1 className="mt-1 w-full text-start font-bold text-xs text-cyan-500 tracking-tight leading-none">INFORMAÇÕES GERAIS</h1>
            <div className="mt-1 w-full flex-col md:flex-row flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-[0.6rem] text-gray-500">TELEFONE</h1>
                <h1 className="text-[0.65rem] lg:text-sm font-medium text-center">{project.telefone}</h1>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-[0.6rem] text-gray-500">VENDEDOR</h1>
                <h1 className="text-[0.65rem] lg:text-sm font-medium text-center">{project.vendedor.nome}</h1>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-[0.6rem] text-gray-500">TIPO DE SERVIÇO</h1>
                <h1 className="text-[0.65rem] lg:text-sm font-medium text-center">{project.tipoDeServico}</h1>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-[0.6rem] text-gray-500">STATUS DO PARECER</h1>
                <h1 className="text-[0.65rem] lg:text-sm font-medium text-center">{project.parecer.statusDoParecerDeAcesso || 'NÃO DEFINIDO'}</h1>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-[0.6rem] text-gray-500">LIBERAÇÃO DA DOCUMENTAÇÃO</h1>
                <h1 className="text-[0.65rem] lg:text-sm font-medium text-center">
                  {project.projeto.dataLiberacaoDocumentacao ? formatDateAsLocale(project.projeto.dataLiberacaoDocumentacao) : 'NÃO DEFINIDO'}
                </h1>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-[0.6rem] text-gray-500">ASSINATURA DA DOCUMENTAÇÃO</h1>
                <h1 className="text-[0.65rem] lg:text-sm font-medium text-center">
                  {project.projeto.dataAssDocumentacao ? formatDateAsLocale(project.projeto.dataAssDocumentacao) : 'NÃO DEFINIDO'}
                </h1>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-[0.6rem] text-gray-500">STATUS DE SUPLEMENTAÇÃO</h1>
                <h1 className="text-[0.65rem] lg:text-sm font-medium text-center">{project.compra.status || 'NÃO DEFINIDO'}</h1>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-[0.6rem] text-gray-500">PREVISÃO DE ENTREGA</h1>
                <h1 className="text-[0.65rem] lg:text-sm font-medium text-center">
                  {project.compra.previsaoEntrega ? formatDateAsLocale(project.compra.previsaoEntrega) : 'NÃO DEFINIDO'}
                </h1>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-[0.6rem] text-gray-500">DATA DE FATURAMENTO</h1>
                <h1 className="text-[0.65rem] lg:text-sm font-medium text-center">
                  {project.faturamento?.dataFaturamento ? formatDateAsLocale(project.faturamento.dataFaturamento) : 'NÃO DEFINIDO'}
                </h1>
              </div>
            </div>
            <h1 className="mt-1 w-full text-start font-bold text-xs text-cyan-500 tracking-tight leading-none">INFORMAÇÕES DA JORNADA</h1>
            <div className="w-full flex items-center justify-around flex-wrap">
              {project.possuiDeficiencia == 'SIM' ? (
                <>
                  <div className="flex flex-col items-center lg:items-start">
                    <h1 className="text-[0.6rem] text-gray-500">PESSOA COM DEFICIÊNCIA</h1>
                    <h1 className="text-[0.65rem] lg:text-sm font-medium text-center">{project.qualDeficiencia}</h1>
                  </div>
                </>
              ) : null}
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-[0.6rem] text-gray-500">CONTATOS DA JORNADA</h1>
                <h1 className="text-[0.65rem] lg:text-sm font-medium text-center">{project.jornada.contatos || 'NÃO DEFINIDO'}</h1>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-[0.6rem] text-gray-500">CUIDADOS NA JORNADA</h1>
                <h1 className="text-[0.65rem] lg:text-sm font-medium text-center">{project.jornada.cuidados || 'NÃO DEFINIDO'}</h1>
              </div>
            </div>
            <div className="w-full flex items-center justify-around flex-wrap gap-3 mt-3 p-2 border border-cyan-500">
              <h1 className="w-full text-start font-bold text-xs text-cyan-500 tracking-tight leading-none">JORNADA DO CLIENTE</h1>
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
              <CheckboxInput
                labelFalse={'JORNADA CONCLUIDA'}
                labelTrue={'JORNADA CONCLUIDA'}
                checked={!!infoHolder.jornada.jornadaConcluida}
                handleChange={(value) => {
                  // @ts-ignore
                  handleUpdateProject({ id: projectId, changes: { 'jornada.jornadaConcluida': value } })
                  setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, jornadaConcluida: value } }))
                }}
              />
            </div>
            <h1 className="mt-1 w-full text-start font-bold text-xs text-cyan-500 tracking-tight leading-none">ANOTAÇÕES</h1>
            <textarea
              value={infoHolder.jornada.obsJornada || undefined}
              placeholder="Preencha aqui anotações da jornada do cliente..."
              onChange={(e) => setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, obsJornada: e.target.value } }))}
              className="min-h-[50px] p-3 w-full resize-none outline-none text-center text-sm text-gray-800 bg-gray-100 rounded border border-gray-300 shadow-sm mt-2"
            />
            <div className="w-full mt-1 flex items-center justify-end">
              <button
                disabled={isLoading}
                onClick={() => {
                  // @ts-ignore
                  handleUpdateProject({ id: projectId, changes: { 'jornada.obsJornada': infoHolder.jornada.obsJornada } })
                }}
                className="py-1 px-4 bg-black rounded text-xs disabled:bg-gray-500 text-white font-medium enabled:hover:bg-gray-700 duration-300 ease-in-out"
              >
                SALVAR ANOTAÇÕES
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  if (mode == 'SIMPLIFIED')
    return (
      <div className="flex font gap-2 w-full shadow-sm border border-gray-300 rounded-md">
        <div className={`h-full w-[7px] ${getBarColor(project.jornada.dataUltimoContato)} rounded-tl-md rounded-bl-md`}></div>
        <div className="flex flex-col items-start lg:flex-row lg:items-center justify-between w-full grow p-3">
          <h1 className="font-bold tracking-tight leading-none">
            <strong className="text-[#fead41]">#{project.qtde}</strong> {project.nomeDoContrato}
          </h1>
          <div className="flex items-center gap-3 mt-2 lg:mt-0">
            <div className="flex items-center gap-2 text-gray-500">
              <TbTruckDelivery />
              <p className="text-sm font-medium">
                {project.compra.previsaoEntrega ? formatDateAsLocale(project.compra.previsaoEntrega) : 'SEM PREVISÃO'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <BsCalendarFill />
              <p className="text-sm font-medium">
                {project.jornada.dataUltimoContato ? formatDateAsLocale(project.jornada.dataUltimoContato) : 'SEM CONTATO'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
}

export default PosVendaCard
