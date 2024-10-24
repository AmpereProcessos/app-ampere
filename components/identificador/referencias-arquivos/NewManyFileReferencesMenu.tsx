import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { BsCloudUploadFill } from 'react-icons/bs'

import { FileReferenceCategories } from '@/utils/select-options'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { TFileReference } from '@/utils/schemas/crm/file-reference.schema'
import { TAttachmentHolder } from '@/utils/schemas/useful'
import { Session } from 'next-auth'
import { uploadFile } from '@/utils/methods/firebase'
import { createManyFileReferences } from '@/utils/methods/mutation/crm/file-references'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'
import { formatLongString, GeneralVisibleHiddenExitMotionVariants, getFileTypeTitle, isFileImage } from '@/utils/constants'
import TextInput from '@/components/inputs/Text'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/methods/handlers'
import CheckboxInput from '@/components/inputs/Checkbox'
import { getAllowedCategories } from '@/utils/methods/util/file-references'

type TNewFileAttachmentHolder = {
  fileReference: {
    idCliente: TFileReference['idCliente']
    idOportunidade: TFileReference['idOportunidade']
    idAnaliseTecnica: TFileReference['idAnaliseTecnica']
    idHomologacao: TFileReference['idHomologacao']
    idProjeto: TFileReference['idProjeto']
    idCompra: TFileReference['idCompra']
    idReceita: TFileReference['idReceita']
    idDespesa: TFileReference['idDespesa']
    idOrdemServico: TFileReference['idOrdemServico']
    idParceiro: TFileReference['idParceiro']
    titulo: TFileReference['titulo']
    categorias: TFileReference['categorias']
    dataInsercao: TFileReference['dataInsercao']
    autor: TFileReference['autor']
  }
  attachments: TAttachmentHolder[]
}

type NewManyFileReferencesMenuProps = {
  vinculationId: string
  prefix: string
  session: Session
  vinculations: {
    partnerId?: {
      blocked: boolean
      value: string
    }
    clientId?: {
      blocked: boolean
      value: string
    }
    opportunityId?: {
      blocked: boolean
      value: string
    }
    projectId?: {
      blocked: boolean
      value: string
    }
    technicalAnalysisId?: {
      blocked: boolean
      value: string
    }
    revenueId?: {
      blocked: boolean
      value: string
    }
    expenseId?: {
      blocked: boolean
      value: string
    }
    serviceOrderId?: {
      blocked: boolean
      value: string
    }
    purchaseId?: {
      blocked: boolean
      value: string
    }
    homologationId?: {
      blocked: boolean
      value: string
    }
    activityId?: {
      blocked: boolean
      value: string
    }
  }
  callbacks?: {
    onMutate?: () => void
    onSuccess?: () => void
    onSettled?: () => void
  }
  closeMenu: () => void
}
function NewManyFileReferencesMenu({ vinculationId, prefix, session, vinculations, callbacks, closeMenu }: NewManyFileReferencesMenuProps) {
  const [infoHolder, setInfoHolder] = useState<TNewFileAttachmentHolder>({
    fileReference: {
      titulo: '',
      categorias: [],
      idParceiro: vinculations.partnerId?.blocked ? vinculations.partnerId.value : undefined,
      idCliente: vinculations.clientId?.blocked ? vinculations.clientId.value : undefined,
      idOportunidade: vinculations.opportunityId?.blocked ? vinculations.opportunityId.value : undefined,
      idAnaliseTecnica: vinculations.technicalAnalysisId?.blocked ? vinculations.technicalAnalysisId.value : undefined,
      idHomologacao: vinculations.homologationId?.blocked ? vinculations.homologationId.value : undefined,
      idProjeto: vinculations.projectId?.blocked ? vinculations.projectId.value : undefined,
      idCompra: vinculations.purchaseId?.blocked ? vinculations.purchaseId.value : undefined,
      idReceita: vinculations.revenueId?.blocked ? vinculations.revenueId.value : undefined,
      idDespesa: vinculations.expenseId?.blocked ? vinculations.expenseId.value : undefined,
      idOrdemServico: vinculations.serviceOrderId?.blocked ? vinculations.serviceOrderId.value : undefined,
      autor: { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url },
      dataInsercao: new Date().toISOString(),
    },
    attachments: [],
  })
  function resetInfoHolder() {
    setInfoHolder({
      fileReference: {
        titulo: '',
        categorias: [],
        idParceiro: vinculations.partnerId?.blocked ? vinculations.partnerId.value : undefined,
        idCliente: vinculations.clientId?.blocked ? vinculations.clientId.value : undefined,
        idOportunidade: vinculations.opportunityId?.blocked ? vinculations.opportunityId.value : undefined,
        idAnaliseTecnica: vinculations.technicalAnalysisId?.blocked ? vinculations.technicalAnalysisId.value : undefined,
        idHomologacao: vinculations.homologationId?.blocked ? vinculations.homologationId.value : undefined,
        idProjeto: vinculations.projectId?.blocked ? vinculations.projectId.value : undefined,
        idCompra: vinculations.purchaseId?.blocked ? vinculations.purchaseId.value : undefined,
        idReceita: vinculations.revenueId?.blocked ? vinculations.revenueId.value : undefined,
        idDespesa: vinculations.expenseId?.blocked ? vinculations.expenseId.value : undefined,
        idOrdemServico: vinculations.serviceOrderId?.blocked ? vinculations.serviceOrderId.value : undefined,
        autor: { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url },
        dataInsercao: new Date().toISOString(),
      },
      attachments: [],
    })
  }
  function addAttachments(newAttachments: TNewFileAttachmentHolder['attachments']) {
    setInfoHolder((prev) => ({ ...prev, attachments: [...prev.attachments, ...newAttachments] }))
  }
  function addCategory(category: string) {
    setInfoHolder((prev) => ({ ...prev, fileReference: { ...prev.fileReference, categorias: [...(prev.fileReference.categorias || []), category] } }))
  }
  function removeCategory(index: number) {
    setInfoHolder((prev) => ({
      ...prev,
      fileReference: { ...prev.fileReference, categorias: (prev.fileReference.categorias || []).filter((c, i) => i !== index) },
    }))
  }
  function updateReference(info: Partial<TNewFileAttachmentHolder['fileReference']>) {
    setInfoHolder((prev) => ({ ...prev, fileReference: { ...prev.fileReference, ...info } }))
  }
  async function handleCreateFileReference(reference: TNewFileAttachmentHolder) {
    try {
      var filesMetadata: { url: TFileReference['url']; formato: TFileReference['formato']; tamanho: TFileReference['tamanho'] }[] = []
      const uploadPromises = reference.attachments
        .filter((f) => !!f.file)
        .map(async (file, index) => {
          const fileName = reference.attachments.length > 1 ? `${reference.fileReference.titulo} (${index + 1})` : reference.fileReference.titulo
          const {
            url,
            format: formato,
            size: tamanho,
          } = await uploadFile({ file: file.file as File, fileName, vinculationId: vinculationId, prefix })
          filesMetadata.push({ url, formato, tamanho })
        })
      await Promise.all(uploadPromises)

      const fileReferences: TFileReference[] = filesMetadata.map((file, index, arr) => ({
        titulo: reference.fileReference.titulo,
        categorias: reference.fileReference.categorias,
        formato: file.formato,
        url: file.url,
        tamanho: file.tamanho,
        idParceiro: reference.fileReference.idParceiro,
        idCliente: reference.fileReference.idCliente,
        idOportunidade: reference.fileReference.idOportunidade,
        idAnaliseTecnica: reference.fileReference.idAnaliseTecnica,
        idHomologacao: reference.fileReference.idHomologacao,
        idProjeto: reference.fileReference.idProjeto,
        idCompra: reference.fileReference.idCompra,
        idReceita: reference.fileReference.idReceita,
        idDespesa: reference.fileReference.idDespesa,
        idOrdemServico: reference.fileReference.idOrdemServico,
        autor: reference.fileReference.autor,
        dataInsercao: new Date().toISOString(),
      }))
      const response = await createManyFileReferences({ info: fileReferences })

      return response
    } catch (error) {
      throw error
    }
  }
  const { mutate, isPending } = useMutation({
    mutationKey: ['create-many-file-references'],
    mutationFn: handleCreateFileReference,
    onMutate: async () => {
      if (!!callbacks?.onMutate) callbacks.onMutate()
    },
    onSuccess: async (data) => {
      if (!!callbacks?.onSuccess) callbacks.onSuccess()
      return toast.success(data)
    },
    onSettled: async () => {
      if (!!callbacks?.onSettled) callbacks.onSettled()
      resetInfoHolder()
    },
    onError: (error) => {
      const msg = getErrorMessage(error)
      return toast.error(msg)
    },
  })

  const allowedCategories = getAllowedCategories({ session })

  return (
    <AnimatePresence>
      <motion.div
        key={'menu-open'}
        variants={GeneralVisibleHiddenExitMotionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex w-full flex-col gap-2 rounded border border-green-600 bg-[#fff] shadow-sm dark:bg-[#121212]"
      >
        <h1 className="rounded-tl rounded-tr bg-green-600 p-1 text-center text-xs text-white">NOVOS ANEXOS</h1>
        <div className="flex w-full flex-col gap-2 p-3 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <AttachmentMenu data={infoHolder} addAttachment={addAttachments} />
          </div>
          <div className="flex w-full flex-col gap-2 lg:w-1/2">
            <TextInput
              label="TÍTULO DO ARQUIVO"
              placeholder="Preencha o título a ser dado ao arquivo..."
              value={infoHolder.fileReference.titulo}
              handleChange={(value) => updateReference({ titulo: value })}
              width="100%"
            />
            <CategoriesMenu allowedCategories={allowedCategories} data={infoHolder} addCategory={addCategory} removeCategory={removeCategory} />

            <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-2">
              {vinculations?.clientId ? (
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="VINCULAR AO CLIENTE"
                    labelTrue="VINCULAR AO CLIENTE"
                    checked={!!infoHolder.fileReference.idCliente}
                    editable={!vinculations.clientId.blocked}
                    handleChange={(value) =>
                      updateReference({
                        idCliente: value ? vinculations.clientId?.value : undefined,
                      })
                    }
                  />
                </div>
              ) : null}
              {vinculations?.projectId ? (
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="VINCULAR AO PROJETO"
                    labelTrue="VINCULAR AO PROJETO"
                    checked={!!infoHolder.fileReference.idProjeto}
                    editable={!vinculations.projectId.blocked}
                    handleChange={(value) =>
                      updateReference({
                        idProjeto: value ? vinculations.projectId?.value : undefined,
                      })
                    }
                  />
                </div>
              ) : null}
              {vinculations?.revenueId ? (
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="VINCULAR À RECEITA"
                    labelTrue="VINCULAR À RECEITA"
                    checked={!!infoHolder.fileReference.idReceita}
                    editable={!vinculations.revenueId.blocked}
                    handleChange={(value) =>
                      updateReference({
                        idReceita: value ? vinculations.revenueId?.value : undefined,
                      })
                    }
                  />
                </div>
              ) : null}
              {vinculations?.expenseId ? (
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="VINCULAR À DESPESA"
                    labelTrue="VINCULAR À DESPESA"
                    checked={!!infoHolder.fileReference.idDespesa}
                    editable={!vinculations.expenseId.blocked}
                    handleChange={(value) =>
                      updateReference({
                        idDespesa: value ? vinculations.expenseId?.value : undefined,
                      })
                    }
                  />
                </div>
              ) : null}
              {vinculations?.purchaseId ? (
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="VINCULAR À COMPRA"
                    labelTrue="VINCULAR À COMPRA"
                    checked={!!infoHolder.fileReference.idCompra}
                    editable={!vinculations.purchaseId.blocked}
                    handleChange={(value) =>
                      updateReference({
                        idCompra: value ? vinculations.purchaseId?.value : undefined,
                      })
                    }
                  />
                </div>
              ) : null}
              {vinculations?.homologationId ? (
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="VINCULAR À HOMOLOGAÇÃO"
                    labelTrue="VINCULAR À HOMOLOGAÇÃO"
                    checked={!!infoHolder.fileReference.idHomologacao}
                    editable={!vinculations.homologationId.blocked}
                    handleChange={(value) =>
                      updateReference({
                        idHomologacao: value ? vinculations.homologationId?.value : undefined,
                      })
                    }
                  />
                </div>
              ) : null}
            </div>
            <div className="flex w-full flex-wrap items-start justify-center gap-4">
              {infoHolder.attachments
                .filter((a) => !!a.file)
                .map((attachment, index) => (
                  <div key={index} className="flex h-[130px] w-[100px] flex-col rounded border border-primary/50">
                    <div className="relative flex h-[100px] w-full grow items-center justify-center bg-gradient-to-b from-sky-400 to-sky-200">
                      {attachment.previewUrl ? (
                        <Image src={attachment.previewUrl} alt={attachment.file?.name || ''} fill={true} />
                      ) : (
                        <h1 className="rounded-lg bg-blue-600 px-4 py-1 text-[0.65rem] font-bold text-white">
                          {getFileTypeTitle(attachment.type || '')}
                        </h1>
                      )}
                    </div>
                    <div className="h-[30px] rounded rounded-tl-none rounded-tr-none bg-primary p-2 text-center text-[0.55rem] font-bold text-primary-foreground">
                      {formatLongString(attachment.file?.name || '', 15)}
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-2 flex w-full items-center justify-end gap-2">
              <Button onClick={() => closeMenu()} variant={'ghost'}>
                FECHAR MENU
              </Button>
              <LoadingButton loading={isPending} onClick={() => mutate(infoHolder)} type="button">
                {infoHolder.attachments.filter((x) => !!x.file).length > 0 ? 'ANEXAR ARQUIVOS' : 'ANEXAR ARQUIVO'}
              </LoadingButton>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NewManyFileReferencesMenu

type AttachmentMenuProps = {
  data: TNewFileAttachmentHolder
  addAttachment: (info: TNewFileAttachmentHolder['attachments']) => void
}
function AttachmentMenu({ data, addAttachment }: AttachmentMenuProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <label
        htmlFor="dropzone-file"
        className="dark:hover:bg-bray-800 min-h-64 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/20 bg-[#fff] hover:bg-primary/10 dark:bg-[#121212]"
      >
        <div className="flex flex-col items-center justify-center px-2 pb-6 pt-5 text-primary">
          <BsCloudUploadFill color={'rgb(31,41,55)'} size={50} />
          <p className="text-center text-xs lg:text-base">Clique para escolher um ou mais arquivos ou os arraste para a àrea demarcada</p>
        </div>
        <input
          onChange={(e) => {
            if (e.target.files) {
              const files = Array.from(e.target.files)
              const attachments = files.map((file) => ({
                title: data.fileReference.titulo,
                file: file,
                previewUrl: isFileImage(file.type) ? URL.createObjectURL(file) : null,
                type: file.type,
              }))
              return addAttachment(attachments)
            } else return
          }}
          multiple={true}
          id="dropzone-file"
          type="file"
          className="absolute h-full w-full opacity-0"
        />
      </label>
    </div>
  )
}

type CategoriesMenuProps = {
  allowedCategories: string[]
  data: TNewFileAttachmentHolder
  addCategory: (info: string) => void
  removeCategory: (index: number) => void
}
function CategoriesMenu({ allowedCategories, data, addCategory, removeCategory }: CategoriesMenuProps) {
  function handleCategoriesChange(category: string) {
    const categories = [...(data.fileReference.categorias || [])]

    const selectedCategoryIndex = categories.indexOf(category)
    if (selectedCategoryIndex === -1) addCategory(category)
    else removeCategory(selectedCategoryIndex)
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="text-[0.65rem] font-bold leading-none tracking-tight text-primary/80 lg:text-xs">CATEGORIAS APLICÁVEIS</h1>
      <div className="my-1 flex w-full flex-wrap items-center justify-around gap-4 gap-y-1 px-2 lg:justify-center">
        {FileReferenceCategories.filter((c) => allowedCategories.includes(c.value)).map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoriesChange(category.value)}
            className={`rounded-lg ${
              data.fileReference.categorias?.find((c) => c == category.value) ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-500'
            } border border-blue-500 px-2 py-1 text-xs font-bold`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}
