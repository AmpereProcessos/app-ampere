import { useState } from 'react'
import { Session } from 'next-auth'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'

import { BsCloudUploadFill } from 'react-icons/bs'

import TextInput from '@/components/inputs/Text'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'

import { uploadFile } from '@/utils/methods/firebase'
import { getErrorMessage } from '@/utils/methods/handlers'
import { createManyFileReferences } from '@/utils/methods/mutation/crm/file-references'
import { TFileReference } from '@/utils/schemas/crm/file-reference.schema'
import { TAttachmentHolder } from '@/utils/schemas/useful'
import { FileReferenceCategories } from '@/utils/select-options'
import { formatLongString, GeneralVisibleHiddenExitMotionVariants, getFileTypeTitle, isFileImage } from '@/utils/constants'

type TNewFileAttachmentHolder = {
  fileReference: {
    idCliente: TFileReference['idCliente']
    idOportunidade: TFileReference['idOportunidade']
    idAnaliseTecnica: TFileReference['idAnaliseTecnica']
    idHomologacao: TFileReference['idHomologacao']
    idProjeto: TFileReference['idProjeto']
    idCompra: TFileReference['idCompra']
    idReceita: TFileReference['idReceita']
    idParceiro: TFileReference['idParceiro']
    titulo: TFileReference['titulo']
    categorias: TFileReference['categorias']
    dataInsercao: TFileReference['dataInsercao']
    autor: TFileReference['autor']
  }
  attachments: TAttachmentHolder[]
}
type NewAttachmentMenuProps = {
  partnerId: string
  projectId: string
  projectName: string
  projectCode: string
  session: Session
  allowedCategories: string[]
  callbacks?: {
    onMutate?: () => void
    onSuccess?: () => void
    onSettled?: () => void
  }
  closeMenu: () => void
}
function NewAttachmentMenu({
  partnerId,
  projectId,
  projectName,
  projectCode,
  allowedCategories,
  session,
  callbacks,
  closeMenu,
}: NewAttachmentMenuProps) {
  const [infoHolder, setInfoHolder] = useState<TNewFileAttachmentHolder>({
    fileReference: {
      titulo: '',
      categorias: [],
      idParceiro: partnerId,
      idCliente: null,
      idOportunidade: null,
      idAnaliseTecnica: null,
      idHomologacao: null,
      idProjeto: projectId,
      idCompra: null,
      idReceita: null,
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
        idParceiro: partnerId,
        idCliente: null,
        idOportunidade: null,
        idAnaliseTecnica: null,
        idHomologacao: null,
        idProjeto: projectId,
        idCompra: null,
        idReceita: null,
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

  async function handleCreateManyFileReferences(info: TNewFileAttachmentHolder) {
    try {
      if (info.attachments.length == 0) throw new Error('Anexe ao menos 1 arquivo.')
      let fileReferences: TFileReference[] = []

      const uploadPromises = info.attachments
        .filter((a) => !!a.file)
        .map(async (reference, index) => {
          const prefix = `clientes/${projectId}-${projectName}-${projectCode}`
          const fileName = info.attachments.length > 1 ? `${info.fileReference.titulo} (${index + 1})` : info.fileReference.titulo
          const {
            url,
            format: formato,
            size: tamanho,
          } = await uploadFile({ file: reference.file as File, fileName, vinculationId: projectId, prefix })
          fileReferences.push({
            titulo: info.fileReference.titulo,
            categorias: info.fileReference.categorias,
            formato: formato,
            url: url,
            tamanho: tamanho,
            idParceiro: partnerId,
            idCliente: info.fileReference.idCliente,
            idOportunidade: info.fileReference.idOportunidade,
            idAnaliseTecnica: info.fileReference.idAnaliseTecnica,
            idHomologacao: info.fileReference.idHomologacao,
            idProjeto: info.fileReference.idProjeto,
            idCompra: info.fileReference.idCompra,
            idReceita: info.fileReference.idReceita,
            autor: info.fileReference.autor,
            dataInsercao: new Date().toISOString(),
          })
        })
      await Promise.all(uploadPromises)

      await createManyFileReferences({ info: fileReferences })
      return 'Arquivos anexados com sucesso !'
    } catch (error) {
      throw error
    }
  }
  const { mutate, isPending } = useMutation({
    mutationKey: ['create-new-file-references'],
    mutationFn: handleCreateManyFileReferences,
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
  return (
    <AnimatePresence>
      <motion.div
        key={'menu-open'}
        variants={GeneralVisibleHiddenExitMotionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex w-[90%] flex-col gap-2 self-center rounded border border-green-600 bg-[#fff] shadow-sm dark:bg-[#121212]"
      >
        <h1 className="rounded-tl rounded-tr bg-green-600 p-1 text-center text-xs text-white">NOVOS ANEXOS</h1>
        <div className="flex w-full grow flex-col gap-2 p-3">
          <div className="flex w-full flex-col gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <AttachmentMenu data={infoHolder} addAttachment={addAttachments} />
            </div>
            <div className="flex w-full flex-col gap-2 lg:w-1/2">
              <TextInput
                label="TÍTULO DO ARQUIVO"
                placeholder="Preencha o título a ser dado ao(s) arquivo(s)..."
                value={infoHolder.fileReference.titulo}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, fileReference: { ...prev.fileReference, titulo: value } }))}
                width="100%"
              />
              <CategoriesMenu allowedCategories={allowedCategories} data={infoHolder} addCategory={addCategory} removeCategory={removeCategory} />
              <div className="flex w-full flex-col gap-1">
                <h1 className="text-xs font-medium tracking-tight text-primary/60">ARQUIVOS ANEXADOS</h1>
                <div className="flex w-full flex-wrap items-start justify-start gap-4">
                  {infoHolder.attachments.length > 0 ? (
                    infoHolder.attachments
                      .filter((a) => !!a.file)
                      .map((attachment, index) => (
                        <div key={index} className="flex h-[100px] max-h-[100px] w-[80px] flex-col rounded border border-primary/50">
                          <div className="relative flex h-[80] w-full grow items-center justify-center bg-gradient-to-b from-sky-400 to-sky-200">
                            {attachment.previewUrl ? (
                              <Image src={attachment.previewUrl} alt={attachment.file?.name || ''} fill={true} />
                            ) : (
                              <h1 className="rounded-lg bg-blue-600 px-4 py-1 text-[0.65rem] font-bold text-white">
                                {getFileTypeTitle(attachment.type || '')}
                              </h1>
                            )}
                          </div>
                          <div className="h-[20px] rounded rounded-tl-none rounded-tr-none bg-primary p-1 text-center text-[0.45rem] font-bold text-primary-foreground">
                            {formatLongString(attachment.file?.name || '', 12)}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="w-full text-start font-medium tracking-tight text-primary/80">Nenhum arquivo anexado.</p>
                  )}
                </div>
              </div>
            </div>
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
      </motion.div>
    </AnimatePresence>
  )
}
export default NewAttachmentMenu

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
