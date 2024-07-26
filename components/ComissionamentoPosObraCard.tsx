import axios from 'axios'
import dayjs from 'dayjs'
import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import SelectInput from './inputs/Select'
import TextInput from './inputs/Text'
import SaveButton from './utils/Buttons/SaveButton'
import { ImAttachment } from 'react-icons/im'
import { FaSave, FaUser } from 'react-icons/fa'
import InfoArquivosBlock from './blocosInfoProjeto/InfoArquivosBlock'
import AnexoArquivo from './AnexoArquivo'
import { VscChromeClose } from 'react-icons/vsc'
import FileLinkBlock from './utils/FileLinkBlock'
import { BsCalendar } from 'react-icons/bs'
import { formatDateAsLocale } from '../utils/methods/formatting'
import CheckboxWithDate from './inputs/CheckboxWithDate'
import DateInput from './inputs/Date'
import CheckboxInput from './inputs/Checkbox'
import { formatDateInputChange } from '../utils/methods/shared'
import { MdAttachFile } from 'react-icons/md'
import { formatDate } from '../utils/constants'
import { TProjectDTO } from '@/utils/schemas/projects'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { updateProject } from '@/utils/methods/mutation/clients'
import { useQueryClient } from 'react-query'
function getStatusTag(meterChange: string | null) {
  const diff = dayjs().diff(meterChange, 'day')
  if (diff > 3) {
    return (
      <div className="flex min-w-fit items-center gap-2 rounded-full bg-red-600 px-2 py-1 ">
        <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">EM ATRASO</h1>
      </div>
    )
  } else {
    return (
      <div className="flex min-w-fit items-center gap-2 rounded-full bg-blue-600 px-2 py-1 ">
        <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">PENDENTE</h1>
      </div>
    )
  }
}

type ComissionamentoPosObraCardProps = {
  index: number
  project: TProjectDTO
}
function ComissionamentoPosObraCard({ project, index }: ComissionamentoPosObraCardProps) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState(project)
  const [changes, setChanges] = useState({})
  const [showFileBlock, setShowFileBlock] = useState(false)

  function renderLinks({ links, category }: { links: TProjectDTO['links']['chamadosSuporte']; category: string }) {
    if (!links) return null
    return (
      <div className="mt-4 flex w-full flex-wrap justify-around gap-3 px-2">
        {links.map((link, index) => (
          <div key={`${link.title} - ${index}`} className="w-full lg:w-[400px]">
            <FileLinkBlock obj={link} deleteFile={(link: any) => {}} showDeleteMenu={false} />
          </div>
        ))}
      </div>
    )
  }

  const { mutate: handleUpdateProject, isLoading } = useMutationWithFeedback({
    mutationKey: ['edit-execution-commissioning-projects', project._id],
    mutationFn: updateProject,
    queryClient: queryClient,
    affectedQueryKey: ['execution-commissioning-projects'],
    callbackFn: () => setChanges({}),
  })
  return (
    <motion.div
      initial={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.01 * index }}
      className={`flex w-full flex-col rounded border border-gray-500 p-3`}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <h1 className="text-xs font-black leading-none tracking-tight lg:text-sm">{project.nomeDoContrato}</h1>
        {getStatusTag(project.homologacao.vistoria.dataEfetivacao || null)}
      </div>
      <div className="flex w-full flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <BsCalendar size={12} />
          <p className="text-[0.6rem] font-medium leading-none tracking-tight">TROCA DO MEDIDOR:</p>
          <p className="text-[0.6rem] font-black leading-none tracking-tight">
            {formatDateAsLocale(project.homologacao.vistoria.dataEfetivacao) || 'NÃO DEFINIDO'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <BsCalendar size={12} />
          <p className="text-[0.6rem] font-medium leading-none tracking-tight">SAÍDA DE OBRA:</p>
          <p className="text-[0.6rem] font-black leading-none tracking-tight">{formatDateAsLocale(project.obra.saida) || 'NÃO DEFINIDO'}</p>
        </div>
        <div className="flex items-center gap-1">
          <FaUser size={12} />
          <p className="text-[0.6rem] font-medium leading-none tracking-tight">EQUIPE RESPONSÁVEL:</p>
          <p className="text-[0.6rem] font-black leading-none tracking-tight">{project.obra.equipeResp}</p>
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        <div className="w-fit">
          <CheckboxWithDate
            labelFalse="USINA LIGADA"
            labelTrue="USINA LIGADA"
            date={infoHolder.conferencias.usinaLigada.data || null}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'conferencias.usinaLigada.data': value,
                'conferencias.usinaLigada.status': value ? 'REALIZADO' : 'NÃO REALIZADO',
              }))
              setInfoHolder((prev) => ({
                ...prev,
                conferencias: {
                  ...prev.conferencias,
                  usinaLigada: {
                    data: value,
                    status: value ? 'REALIZADO' : 'NÃO REALIZADO',
                  },
                },
              }))
            }}
          />
        </div>
        <div className="w-fit">
          <CheckboxWithDate
            labelFalse="ENERGIA INJETADA"
            labelTrue="ENERGIA INJETADA"
            date={infoHolder.conferencias.energiaInjetada.data || null}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'conferencias.energiaInjetada.data': value,
                'conferencias.energiaInjetada.status': value ? 'REALIZADO' : 'NÃO REALIZADO',
              }))
              setInfoHolder((prev) => ({
                ...prev,
                conferencias: {
                  ...prev.conferencias,
                  energiaInjetada: {
                    data: value,
                    status: value ? 'REALIZADO' : 'NÃO REALIZADO',
                  },
                },
              }))
            }}
          />
        </div>
        <div className="w-fit">
          <CheckboxWithDate
            labelFalse="MONITORAMENTO FEITO"
            labelTrue="MONITORAMENTO FEITO"
            date={infoHolder.conferencias.monitoramentoFeito.data || null}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'conferencias.monitoramentoFeito.data': value,
                'conferencias.monitoramentoFeito.status': value ? 'REALIZADO' : 'NÃO REALIZADO',
              }))
              setInfoHolder((prev) => ({
                ...prev,
                conferencias: {
                  ...prev.conferencias,
                  monitoramentoFeito: {
                    data: value,
                    status: value ? 'REALIZADO' : 'NÃO REALIZADO',
                  },
                },
              }))
            }}
          />
        </div>
      </div>
      <div className="flex w-full items-center gap-2 lg:flex-row">
        <div className="w-1/4 lg:w-full">
          <SelectInput
            label={'DIAGNÓSTICO'}
            value={infoHolder.oem?.diagnostico}
            options={[
              { id: 1, label: 'MICRO/INVERSOR DESCONFIGURADO', value: 'MICRO/INVERSOR DESCONFIGURADO' },
              { id: 2, label: 'CLIENTE SEM INTERNET', value: 'CLIENTE SEM INTERNET' },
              { id: 3, label: 'TEMPO DE O&M VENCIDO', value: 'TEMPO DE O&M VENCIDO' },
              { id: 4, label: 'EQUIPAMENTOS PARA GARANTIA', value: 'EQUIPAMENTOS PARA GARANTIA' },
              { id: 5, label: 'ROTEADOR INCOMPATÍVEL', value: 'ROTEADOR INCOMPATÍVEL' },
              { id: 6, label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            ]}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, 'oem.diagnostico': value }))
              setInfoHolder((prev) => ({ ...prev, oem: { ...(prev.oem || {}), diagnostico: value } }))
            }}
            onReset={() => {
              setInfoHolder((prev) => ({ ...prev, oem: { ...(prev.oem || {}), diagnostico: null } }))
              setChanges((prev) => ({ ...prev, 'oem.diagnostico': null }))
            }}
            selectedItemLabel="NÃO DEFINIDO"
            width="100%"
          />
        </div>
        <div className="w-1/4 lg:w-full">
          <DateInput
            label="DATA DE CONFIGURAÇÃO DO APP"
            value={formatDate(infoHolder.app.data)}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'app.data': formatDateInputChange(value),
              }))
              setInfoHolder((prev) => ({
                ...prev,
                app: {
                  ...prev.app,
                  data: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-1/4 lg:w-full">
          <TextInput
            label={'LOGIN DO APP'}
            placeholder={'Preencha aqui o login do app do cliente.'}
            value={infoHolder.app.login || ''}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'app.login': value,
              }))
              setInfoHolder((prev) => ({
                ...prev,
                app: {
                  ...prev.app,
                  login: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-1/4 lg:w-full">
          <TextInput
            label={'SENHA DO APP'}
            placeholder={'Preencha aqui a senha do app do cliente.'}
            value={infoHolder.app.senha?.toString() || ''}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'app.senha': value,
              }))
              setInfoHolder((prev) => ({
                ...prev,
                app: {
                  ...prev.app,
                  senha: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        {showFileBlock ? (
          <button>
            <button
              onClick={() => setShowFileBlock(false)}
              className="flex items-center gap-1 rounded-lg border border-red-500 bg-red-50 px-2 py-1 text-xs text-red-500 duration-300 ease-in-out hover:border-red-700 hover:text-red-700"
            >
              <VscChromeClose />
              <p className="font-medium">FECHAR MENU</p>
            </button>
          </button>
        ) : (
          <button
            onClick={() => setShowFileBlock(true)}
            className="flex items-center gap-1 rounded-lg border border-cyan-500 bg-cyan-50 px-2 py-1 text-xs text-cyan-500 duration-300 ease-in-out hover:border-cyan-700 hover:text-cyan-700"
          >
            <MdAttachFile />
            <p className="font-medium">ARQUIVOS</p>
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-fit">
            <CheckboxWithDate
              labelFalse="ENTREGA TÉCNICA FEITA"
              labelTrue="ENTREGA TÉCNICA FEITA"
              date={infoHolder.jornada.dataEntregaTecnicaRemota || null}
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  'jornada.entregaTecnica': !!value,
                  'jornada.dataEntregaTecnicaRemota': value,
                }))
                setInfoHolder((prev) => ({
                  ...prev,
                  jornada: {
                    ...prev.jornada,
                    entregaTecnica: !!value,
                    dataEntregaTecnicaRemota: value,
                  },
                }))
              }}
            />
          </div>
          <button
            disabled={isLoading}
            onClick={() => {
              // @ts-ignore
              handleUpdateProject({ id: project._id, changes: changes })
            }}
            className="h-9 whitespace-nowrap rounded bg-blue-800 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-blue-800 enabled:hover:text-white"
          >
            ATUALIZAR PROJETO
          </button>
        </div>
      </div>
      {showFileBlock ? (
        <div className="flex w-full flex-col items-center gap-2">
          <div className="w-full self-center lg:w-1/2">
            <AnexoArquivo
              id={project._id}
              client={`${project.nomeDoContrato}-${project.codigoSVB}`}
              categories={[
                { label: 'OBRAS', value: 'links.obras' },
                { label: 'MANUTENÇÃO CORRETIVA', value: 'links.manutencaoCorretiva' },
              ]}
              multiple={true}
            />
          </div>
          {project.links && (
            <div className="mt-4 grid w-full grid-cols-1 gap-2">
              {Object.entries(project.links).map(([category, links]) => (
                <div key={index} className="flex w-full flex-col">
                  <h1 className="w-full rounded-tl-md rounded-tr-md bg-cyan-700 p-1 text-center font-bold text-white">{category.toUpperCase()}</h1>
                  {renderLinks({ links: links, category: category })}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </motion.div>
  )
}

export default ComissionamentoPosObraCard
