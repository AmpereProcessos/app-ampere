import TextInput from '@/components/inputs/Text'
import ArchiveLinkBlock from '@/components/utils/FileLinkBlock'
import { fileTypes } from '@/utils/constants'
import { TContractRequest } from '@/utils/schemas/contract-requests'
import { storage } from '@/utils/services/firebase/firebase-storage'
import { deleteObject, getDownloadURL, ref, uploadBytes, UploadResult } from 'firebase/storage'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { BsCloudUploadFill } from 'react-icons/bs'
import { useQueryClient } from 'react-query'

type TFileHolder = { title: string; files: FileList | null }
type FilesBlockProps = {
  tag: string
  files: TContractRequest['links']
  vinculateFiles: (files: TContractRequest['links']) => void
  vinculationPending: boolean
}
function FilesBlock({ tag, files, vinculateFiles, vinculationPending }: FilesBlockProps) {
  const queryClient = useQueryClient()
  const [fileHolder, setFileHolder] = useState<TFileHolder>({ title: '', files: null })

  async function attachFiles(fileHolder: TFileHolder) {
    const links: {
      title: string
      link: string
      format: string
    }[] = []
    if (fileHolder.title.trim().length < 2) return toast.error('Preencha um nome de ao menos 2 caractéres para o arquivo.')
    if (!fileHolder.files || fileHolder.files.length == 0) return toast.error('Anexe ao menos um arquivo.')
    // In case was attached more than one file
    if (fileHolder.files.length > 0) {
      const promises = Array.from(fileHolder.files).map(async (file, index) => {
        const fileAttachmentName = fileHolder.title.toLocaleLowerCase().replaceAll(' ', '_')
        const storageStr = `formSolicitacao/${tag}/${fileAttachmentName} ${index + 1} - ${new Date().toISOString()}`
        const fileRef = ref(storage, storageStr)
        const firebaseUploadResponse = await uploadBytes(fileRef, file)
        const uploadResult = firebaseUploadResponse as UploadResult
        const fileTitle = `${fileHolder.title.toUpperCase()} (${index + 1})`
        const fileUrl = await getDownloadURL(ref(storage, firebaseUploadResponse.metadata.fullPath))
        const fileFormat = fileTypes[uploadResult.metadata.contentType || '']?.title || 'NÃO DEFINIDO'
        links.push({ title: fileTitle, format: fileFormat, link: fileUrl })
      })
      await Promise.all(promises)
    } else {
      // In case only one file was attached
      const file = fileHolder.files[0]
      const fileAttachmentName = fileHolder.title.toLocaleLowerCase().replaceAll(' ', '_')
      const storageStr = `formSolicitacao/${tag}/${fileAttachmentName} - ${new Date().toISOString()}`
      const fileRef = ref(storage, storageStr)
      const firebaseUploadResponse = await uploadBytes(fileRef, file)
      const uploadResult = firebaseUploadResponse as UploadResult
      const fileTitle = fileHolder.title.toUpperCase()
      const fileUrl = await getDownloadURL(ref(storage, firebaseUploadResponse.metadata.fullPath))
      const fileFormat = fileTypes[uploadResult.metadata.contentType || '']?.title || 'NÃO DEFINIDO'
      links.push({ title: fileTitle, format: fileFormat, link: fileUrl })
    }
    const newLinks = [...(files || []), ...links]
    vinculateFiles(newLinks)
    setFileHolder({ title: '', files: null })
    return
  }
  async function deleteFile({ index, url }: { index: number; url: string }) {
    try {
      const storageRef = ref(storage, url)
      const firebaseDeleteResponse = await deleteObject(storageRef)
      const newLinks = [...(files || [])]
      newLinks.splice(index, 1)
      vinculateFiles(newLinks)
    } catch (error) {
      throw error
    }
  }
  return (
    <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">DOCUMENTAÇÃO</span>
      <div className="flex w-full grow flex-wrap items-start justify-around gap-2 px-2">
        {files?.map((x, index) => (
          <div key={index} className="w-full lg:w-[450px]">
            <ArchiveLinkBlock
              obj={x}
              deleteFile={(x: { title: string; link: string; format: string }) => deleteFile({ index: index, url: x.link })}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex w-full flex-col items-center px-2">
        <h1 className="text-sm font-bold tracking-tight">ANEXE NOVOS ARQUIVOS</h1>
        <div className="mb-2 w-full">
          <TextInput
            label="TITULO DO ARQUIVO"
            placeholder="Preencha aqui o nome a ser dado ao arquivo..."
            value={fileHolder.title}
            handleChange={(value) => setFileHolder((prev) => ({ ...prev, title: value }))}
            width="100%"
          />
        </div>
        <div className="relative mb-4 flex w-full items-center justify-center">
          <label
            htmlFor="dropzone-file"
            className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5 text-gray-800">
              <BsCloudUploadFill color={'rgb(31,41,55)'} size={50} />

              {fileHolder.files ? (
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  {fileHolder.files.length > 0 ? `${fileHolder.files[0]?.name}, outros...` : fileHolder.files[0].name}
                </p>
              ) : (
                <p className="mb-2 px-2 text-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Clique para escolher um arquivo</span> ou o arraste para a àrea demarcada
                </p>
              )}
            </div>
            <input
              onChange={(e) => {
                if (e.target.files) return setFileHolder((prev) => ({ ...prev, files: e.target.files }))
                else return setFileHolder((prev) => ({ ...prev, files: null }))
              }}
              id="dropzone-file"
              type="file"
              multiple={true}
              className="absolute h-full w-full opacity-0"
            />
          </label>
        </div>
        <div className="flex w-full items-center justify-end">
          <button
            // @ts-ignore
            disabled={vinculationPending}
            onClick={() => attachFiles(fileHolder)}
            className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
          >
            ANEXAR
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilesBlock
