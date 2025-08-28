import SelectInputVirtualized from '@/components/inputs/SelectVirtualized'
import TextInput from '@/components/inputs/Text'

import { TSupportCall } from '@/utils/schemas/support-calls'
import { Check, CloudUpload, Code, LayoutGrid, LinkIcon, Loader, Paperclip, Plus, Tag, UsersRound, X } from 'lucide-react'
import { useState } from 'react'
import StatesAndCities from '@/utils/jsons/estados-cidades.json'
import SelectInput from '@/components/inputs/Select'
import TextareaInput from '@/components/inputs/TextareaInput'
import { FaSolarPanel, FaWrench } from 'react-icons/fa'
import DateInput from '@/components/inputs/Date'
import { formatDate, getFileTypeTitle, getTitleFileType, isFileImage, SlideMotionVariants, tiposChamadosSuporte } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { cn } from '@/lib/utils'

import { useUsers } from '@/utils/methods/query/users'
import SelectWithImages from '@/components/inputs/SelectWithImages'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { BsCalendarCheck } from 'react-icons/bs'
import { Button } from '@/components/ui/button'
import ProjectVinculationMenu from '../../projects/ProjectVinculationMenu'
import { FaCity } from 'react-icons/fa6'
import { useFileReferences } from '@/utils/methods/query/crm/file-references'
import { getErrorMessage } from '@/utils/methods/handlers'
import FileReferenceCard from '../../referencias-arquivos/FileReferenceCard'
import { TAttachmentHolder } from '@/utils/schemas/useful'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { uploadFile } from '@/utils/methods/firebase'
import { TAuthSession } from '@/lib/authentication/types'
import { TFileReference } from '@/utils/schemas/crm/file-reference.schema'
import { createManyFileReferences } from '@/utils/methods/mutation/crm/file-references'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'
import { MdDashboard } from 'react-icons/md'

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, value: c, label: c }))

type GeneralProps = {
  infoHolder: TSupportCall
  updateInfoHolder: (info: Partial<TSupportCall>) => void
}
export function General({ infoHolder, updateInfoHolder }: GeneralProps) {
  const [vinculationModalIsOpen, setVinculationModalIsOpen] = useState(false)
  const { data: users } = useUsers()
  function handleEffectivationUpdate(newValue: TSupportCall['statusChamado'], previousData: TSupportCall) {
    if (newValue === 'RESOLVIDO') {
      if (previousData.statusChamado !== 'RESOLVIDO') return new Date().toISOString()
      return previousData.fechamento
    }
    if (previousData.statusChamado === 'RESOLVIDO') return undefined
    return previousData.fechamento
  }
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="bg-primary/20 flex w-fit items-center gap-2 rounded px-2 py-1">
        <LayoutGrid size={15} />
        <h1 className="w-fit text-start text-xs font-medium tracking-tight">INFORMAÇÕES GERAIS</h1>
      </div>
      <div className="flex w-full flex-wrap items-center gap-2">
        <button
          onClick={() => updateInfoHolder({ statusChamado: 'ABERTO', fechamento: handleEffectivationUpdate('ABERTO', infoHolder) })}
          className={cn('flex items-center gap-1 rounded-md bg-orange-300 px-3 py-1.5 text-sm text-orange-800', {
            'opacity-100': infoHolder.statusChamado === 'ABERTO',
            'opacity-50': infoHolder.statusChamado !== 'ABERTO',
          })}
        >
          <X className="h-4 min-h-4 w-4 min-w-4" />
          ABERTO
        </button>
        <button
          onClick={() => updateInfoHolder({ statusChamado: 'EM ANDAMENTO', fechamento: handleEffectivationUpdate('EM ANDAMENTO', infoHolder) })}
          className={cn('flex items-center gap-1 rounded-md bg-blue-300 px-3 py-1.5 text-sm text-blue-800', {
            'opacity-100': infoHolder.statusChamado === 'EM ANDAMENTO',
            'opacity-50': infoHolder.statusChamado !== 'EM ANDAMENTO',
          })}
        >
          <Loader className="h-4 min-h-4 w-4 min-w-4" />
          EM ANDAMENTO
        </button>
        <button
          onClick={() => updateInfoHolder({ statusChamado: 'RESOLVIDO', fechamento: handleEffectivationUpdate('RESOLVIDO', infoHolder) })}
          className={cn('flex items-center gap-1 rounded-md bg-green-300 px-3 py-1.5 text-sm text-green-800', {
            'opacity-100': infoHolder.statusChamado === 'RESOLVIDO',
            'opacity-50': infoHolder.statusChamado !== 'RESOLVIDO',
          })}
        >
          <Check className="h-4 min-h-4 w-4 min-w-4" />
          RESOLVIDO
        </button>
      </div>
      {infoHolder.idPai ? (
        <div className="bg-card flex w-full flex-col items-center justify-center gap-3 p-3">
          <div className="bg-primary/20 flex items-center gap-1 rounded-md px-2 py-0.5">
            <Code className="h-3 min-h-3 w-3 min-w-3" />
            <h1 className="text-[0.55rem]">{infoHolder.idPai}</h1>
          </div>
          <h1 className="text-sm font-medium tracking-tight">{infoHolder.nomeCliente}</h1>
          <div className="flex w-full flex-wrap items-center justify-center gap-2">
            <div className="items-canter flex gap-1">
              <UsersRound className="h-3 min-h-3 w-3 min-w-3" />
              <p className="text-primary/60 text-xs">{infoHolder.equipeResp}</p>
            </div>
            <div className="items-canter flex gap-1">
              <FaCity className="h-3 min-h-3 w-3 min-w-3" />
              <p className="text-primary/60 text-xs">{infoHolder.cidade}</p>
            </div>
            <div className="items-canter flex gap-1">
              <Tag className="h-3 min-h-3 w-3 min-w-3" />
              <p className="text-primary/60 text-xs">{infoHolder.plano}</p>
            </div>
          </div>
        </div>
      ) : (
        <Button className="flex w-full items-center gap-1" variant="ghost" onClick={() => setVinculationModalIsOpen(true)}>
          <LinkIcon className="h-3 min-h-3 w-3 min-w-3" />
          <h1 className="text-xs font-medium tracking-tight">VINCULAR PROJETO</h1>
        </Button>
      )}
      {infoHolder.fechamento ? (
        <div className={`flex w-fit items-center gap-1 self-center rounded-md bg-green-200 px-1.5 py-0.5 text-[0.65rem] font-bold text-green-700`}>
          <BsCalendarCheck className="h-3 min-h-3 w-3 min-w-3" />
          {formatDateAsLocale(infoHolder.fechamento, true)}
        </div>
      ) : null}
      <SelectWithImages
        label="RESPONSÁVEL"
        value={infoHolder.responsavel}
        handleChange={(value) => {
          const selectedUser = users?.find((user) => user._id === value)
          if (selectedUser) {
            updateInfoHolder({
              responsavel: selectedUser._id,
              responsavelUsuario: {
                id: selectedUser._id,
                nome: selectedUser.nome,
                avatar_url: selectedUser.avatar_url,
              },
            })
          } else {
            updateInfoHolder({ responsavel: undefined, responsavelUsuario: undefined })
          }
        }}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateInfoHolder({ responsavel: undefined })}
        options={
          users?.map((user) => ({
            id: user._id,
            label: user.nome,
            value: user._id,
            url: user.avatar_url ?? undefined,
          })) || []
        }
        width="100%"
      />
      <SelectInput
        label="TIPO DE CHAMADO"
        options={tiposChamadosSuporte.map((tipo, index) => ({
          id: index + 1,
          label: tipo.tipo,
          value: tipo.tipo,
        }))}
        value={infoHolder.tipoChamado}
        handleChange={(value) => updateInfoHolder({ tipoChamado: value })}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateInfoHolder({ tipoChamado: undefined })}
        width="100%"
      />
      <TextareaInput
        label="DESCRIÇÃO DO PROBLEMA"
        value={infoHolder.descricaoProblema ?? ''}
        placeholder="Preencha aqui a descrição do problema..."
        handleChange={(value) => updateInfoHolder({ descricaoProblema: value })}
      />
      <SelectInputVirtualized
        label="CIDADE"
        options={AllCities}
        value={infoHolder.cidade}
        handleChange={(value) => updateInfoHolder({ cidade: value })}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateInfoHolder({ cidade: undefined })}
        width="100%"
      />
      <SelectInput
        label="DEMANDA"
        options={[
          {
            id: 1,
            label: 'INTERNA',
            value: 'INTERNA',
          },
          {
            id: 2,
            label: 'EXTERNA',
            value: 'EXTERNA',
          },
        ]}
        value={infoHolder.demanda}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateInfoHolder({ demanda: undefined })}
        handleChange={(value) => updateInfoHolder({ demanda: value })}
        width="100%"
      />
      <TextareaInput
        label="ANOTAÇÕES"
        value={infoHolder.anotacoes ?? ''}
        placeholder="Preencha aqui as anotações..."
        handleChange={(value) => updateInfoHolder({ anotacoes: value })}
      />
      {vinculationModalIsOpen ? (
        <ProjectVinculationMenu
          closeModal={() => setVinculationModalIsOpen(false)}
          handleSelect={(project) => {
            updateInfoHolder({
              nomeCliente: project.nomeDoContrato,
              idPai: project._id,
              plano: project.oem.plano || undefined,
              cidade: project.cidade,
              oemConcluido: project.oem.oemConcluido || undefined,
              equipeResp: project.obra.equipeResp || undefined,
            })
            setVinculationModalIsOpen(false)
          }}
        />
      ) : null}
    </div>
  )
}

export function PowerPlantInfo({
  infoHolder,
  updateInfoHolder,
}: {
  infoHolder: TSupportCall
  updateInfoHolder: (info: Partial<TSupportCall>) => void
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="bg-primary/20 flex w-fit items-center gap-2 rounded px-2 py-1">
        <FaSolarPanel size={15} />
        <h1 className="w-fit text-start text-xs font-medium tracking-tight">INFORMAÇÕES DA USINA</h1>
      </div>
      <TextInput
        label="NOME DA USINA"
        value={infoHolder.nomeUsina ?? ''}
        placeholder="Preencha aqui o nome da usina..."
        handleChange={(value) => updateInfoHolder({ nomeUsina: value })}
        width="100%"
      />
      <div className="flex w-full flex-col gap-1">
        <TextInput
          label="LINK DA USINA"
          value={infoHolder.linkMonitoramento ?? ''}
          placeholder="Preencha aqui o link da usina..."
          handleChange={(value) => updateInfoHolder({ linkMonitoramento: value })}
          width="100%"
        />
        {infoHolder.linkMonitoramento ? (
          <a href={infoHolder.linkMonitoramento} target="_blank" rel="noopener noreferrer" className="text-center text-cyan-500 hover:text-cyan-700">
            {infoHolder.linkMonitoramento}
          </a>
        ) : null}
      </div>
    </div>
  )
}

export function WarrantyInfo({
  infoHolder,
  updateInfoHolder,
}: {
  infoHolder: TSupportCall
  updateInfoHolder: (info: Partial<TSupportCall>) => void
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="bg-primary/20 flex w-fit items-center gap-2 rounded px-2 py-1">
        <FaWrench size={15} />
        <h1 className="w-fit text-start text-xs font-medium tracking-tight">INFORMAÇÕES DA GARANTIA</h1>
      </div>
      <SelectInputVirtualized
        label="EQUIPAMENTO DE GARANTIA"
        options={[
          {
            id: 1,
            label: 'PLACA',
            value: 'PLACA',
          },
          {
            id: 2,
            label: 'INVERSOR/MICRO',
            value: 'INVERSOR/MICRO',
          },
          {
            id: 3,
            label: 'COMUNICADOR',
            value: 'COMUNICADOR',
          },
        ]}
        value={infoHolder.equipamento}
        handleChange={(value) => updateInfoHolder({ equipamento: value })}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateInfoHolder({ equipamento: undefined })}
        width="100%"
      />
      <SelectInput
        label="STATUS DA GARANTIA"
        options={[
          {
            id: 1,
            label: 'IDENTIFICAÇÃO E TESTES',
            value: 'IDENTIFICAÇÃO E TESTES',
          },
          {
            id: 2,
            label: 'EM PROCESSO DE APROVAÇÃO',
            value: 'EM PROCESSO DE APROVAÇÃO',
          },
          {
            id: 3,
            label: 'APROVADO',
            value: 'APROVADO',
          },
          {
            id: 4,
            label: 'EQUIPAMENTO EM ROTA',
            value: 'EQUIPAMENTO EM ROTA',
          },
          {
            id: 5,
            label: 'ENTREGUE',
            value: 'ENTREGUE',
          },
          {
            id: 6,
            label: 'INSTALADO',
            value: 'INSTALADO',
          },
          {
            id: 7,
            label: 'NÃO DEFINIDO',
            value: 'NÃO DEFINIDO',
          },
        ]}
        value={infoHolder.statusGarantia}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateInfoHolder({ statusGarantia: undefined })}
        handleChange={(value) => updateInfoHolder({ statusGarantia: value })}
        width="100%"
      />
      <DateInput
        label="ÚLTIMA ATUALIZAÇÃO DO CLIENTE"
        value={formatDate(infoHolder.ultAtualizacaoCliente)}
        handleChange={(value) => updateInfoHolder({ ultAtualizacaoCliente: formatDateInputChange(value, 'string') as string })}
        width="100%"
      />
    </div>
  )
}

export type TSupportCallAttachmentHolderItem = {
  title: string
  projectId?: string
  callId?: string
  attachments: TAttachmentHolder[]
}

type TAttachmensProps = {
  session: TAuthSession
  callId?: string
  projectId?: string
  attachments: TSupportCallAttachmentHolderItem[]
  initializeNewAttachmentItem: () => void
  updateAttachmentItem: (index: number, item: Partial<TSupportCallAttachmentHolderItem>) => void
  clearAttachmentItems: () => void
}
export function Attachments({
  session,
  callId,
  projectId,
  attachments,
  initializeNewAttachmentItem,
  updateAttachmentItem,
  clearAttachmentItems,
}: TAttachmensProps) {
  const queryClient = useQueryClient()
  const [newAttachmentMenuIsOpen, setNewAttachmentMenuIsOpen] = useState(false)
  const [showProjectFiles, setShowProjectFiles] = useState<boolean>(false)
  const {
    data: fileReferences,
    isLoading,
    isError,
    isSuccess,
    error,
    queryKey,
  } = useFileReferences({ callId, projectId: showProjectFiles ? projectId : undefined })

  async function handleAttachments({ attachments }: { attachments: TSupportCallAttachmentHolderItem[] }) {
    const uploads = attachments.flatMap((item) =>
      item.attachments.map((a, aIdx, aArr) => ({
        title: aArr.length > 0 ? `${item.title} (${aIdx + 1})` : item.title,
        callId: item.callId,
        projectId: item.projectId,
        file: a.file,
      }))
    )
    const uploadPromises = uploads.map(async (uploadItem) => {
      const {
        url,
        format: formato,
        size: tamanho,
      } = await uploadFile({ file: uploadItem.file as File, fileName: uploadItem.title, vinculationId: undefined, prefix: 'chamado-suporte' })

      const fileReference: TFileReference = {
        titulo: uploadItem.title,
        formato: formato,
        url: url,
        autor: {
          id: session.user.id,
          nome: session.user.nome,
          avatar_url: session.user.avatar_url,
        },
        idProjeto: uploadItem.projectId,
        idChamado: uploadItem.callId,
        dataInsercao: new Date().toISOString(),
      }
      return fileReference
    })
    const fileReferences = await Promise.all(uploadPromises)
    return await createManyFileReferences({ info: fileReferences })
  }

  const { mutate: handleAttachmentsMutation, isPending: handleAttachmentsMutationIsPending } = useMutation({
    mutationKey: ['create-support-call-many-file-references'],
    mutationFn: handleAttachments,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey })
    },
    onSuccess: () => {
      clearAttachmentItems()
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey })
    },
  })
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="bg-primary/20 flex w-fit items-center gap-2 rounded px-2 py-1">
        <Paperclip size={15} />
        <h1 className="w-fit text-start text-xs font-medium tracking-tight">ANEXOS</h1>
      </div>
      <div className="flex w-full items-center justify-end">
        <button
          type="button"
          onClick={() => setNewAttachmentMenuIsOpen((prev) => !prev)}
          className={cn('flex items-center gap-1 rounded-lg px-2 py-1 duration-300 ease-in-out', {
            'bg-primary/20 text-primary hover:bg-red-300': newAttachmentMenuIsOpen,
            'text-primary-foreground bg-green-300 hover:bg-green-400': !newAttachmentMenuIsOpen,
          })}
        >
          <Paperclip className="h-3 min-h-3 w-3 min-w-3" />
          <h1 className="text-xs font-medium tracking-tight">
            {!newAttachmentMenuIsOpen ? 'ABRIR MENU DE NOVOS ANEXOS' : 'FECHAR MENU DE NOVOS ANEXOS'}
          </h1>
        </button>
      </div>
      {newAttachmentMenuIsOpen ? (
        <motion.div
          variants={SlideMotionVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="bg-card border-primary/20 flex w-full flex-col gap-3 rounded-xl border px-3 py-4 shadow-xs"
        >
          <h2 className="text-start text-sm font-medium tracking-tight">NOVOS ANEXOS</h2>
          {attachments.map((attachment, index) => (
            <div key={index} className="flex w-full flex-col gap-1">
              <TextInput
                label="TÍTULO"
                labelClassName="text-[0.6rem]"
                holderClassName="text-xs p-2 min-h-[34px]"
                value={attachment.title}
                placeholder="Preencha aqui o título do anexo..."
                handleChange={(value) => updateAttachmentItem(index, { title: value })}
                width="100%"
              />
              <div className="relative flex w-full items-center justify-center">
                <label
                  htmlFor="dropzone-file"
                  className="dark:hover:bg-bray-800 border-primary/20 hover:bg-primary/10 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-[#fff] px-3 py-1 dark:bg-[#121212]"
                >
                  <div className="text-primary flex flex-col items-center justify-center px-6 pt-5 pb-6">
                    <CloudUpload className="h-6 min-h-6 w-6 min-w-6" />
                    <p className="text-center text-xs font-medium tracking-tight">
                      Clique aqui para selecionar os arquivos ou arraste-os para área demarcada.
                    </p>
                  </div>
                  <input
                    onChange={(e) => {
                      if (e.target.files) {
                        console.log(e.target.files)
                        const files = Array.from(e.target.files)
                        const attachments: TSupportCallAttachmentHolderItem['attachments'] = files.map((file) => ({
                          file: file,
                          previewUrl: isFileImage(file.type) ? URL.createObjectURL(file) : null,
                          type: file.type,
                          title: file.name,
                        }))
                        console.log(attachments)
                        updateAttachmentItem(index, { attachments: [...attachment.attachments, ...attachments] })
                      }
                      return
                    }}
                    id="dropzone-file"
                    type="file"
                    multiple={true}
                    className="absolute h-full w-full opacity-0"
                  />
                </label>
              </div>
              <div className="flex w-full flex-wrap items-center gap-2">
                {attachment.attachments.length > 0 ? (
                  attachment.attachments.map((file, index) => (
                    <div key={`${file.file?.name}-${index}`} className="border-primary/50 flex h-[100px] w-[100px] flex-col rounded border">
                      <div className="relative flex h-[100px] w-full grow items-center justify-center bg-gradient-to-b from-sky-400 to-sky-200">
                        {file.previewUrl ? (
                          <Image src={file.previewUrl} alt={file.file?.name || ''} fill={true} />
                        ) : (
                          <h1 className="rounded-lg bg-blue-600 px-4 py-1 text-[0.65rem] font-bold text-white">
                            {getFileTypeTitle(file.type || '')}
                          </h1>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-primary/80 text-xs font-light">Nenhum arquivo encontrado.</p>
                )}
              </div>
            </div>
          ))}
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="fit"
              className="flex w-fit items-center gap-2 rounded-lg px-2 py-1 text-xs"
              onClick={initializeNewAttachmentItem}
            >
              <Plus className="h-3 min-h-3 w-3 min-w-3" />
              NOVO ANEXO
            </Button>
            {callId ? (
              <LoadingButton
                loading={handleAttachmentsMutationIsPending}
                onClick={() => handleAttachmentsMutation({ attachments: attachments })}
                className="flex w-fit items-center gap-2 rounded-lg px-2 py-1 text-xs"
              >
                CRIAR ANEXOS
              </LoadingButton>
            ) : null}
          </div>
        </motion.div>
      ) : null}
      <div className="flex w-full items-center justify-end">
        {projectId ? (
          <button
            onClick={() => setShowProjectFiles((prev) => !prev)}
            className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
              'bg-cyan-400 hover:bg-gray-400': showProjectFiles,
              'bg-primary/20 hover:bg-cyan-300': !showProjectFiles,
            })}
          >
            <MdDashboard className="h-3 min-h-3 w-3 min-w-3" />
            <h1 className="text-xs font-medium tracking-tight">MOSTRAR ANEXOS DO PROJETO</h1>
          </button>
        ) : null}
      </div>
      {isLoading ? <p className="animate-pulse text-center text-sm font-medium tracking-tight">Carregando arquivos...</p> : null}
      {isError ? <p className="text-center text-sm font-medium tracking-tight text-red-500">{getErrorMessage(error)}</p> : null}
      {isSuccess ? (
        <div className="flex w-full flex-col gap-2">
          {fileReferences.length > 0 ? (
            <div className="flex w-full flex-col gap-2">
              {fileReferences.map((fileReference) => (
                <FileReferenceCard key={fileReference._id} info={fileReference} />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm font-medium tracking-tight">Nenhum arquivo encontrado</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
