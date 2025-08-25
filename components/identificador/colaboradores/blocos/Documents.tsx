import TextInput from '@/components/inputs/Text'
import { uploadFile } from '@/utils/methods/firebase'
import { createFileReference } from '@/utils/methods/mutation/file-references'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { TFileReference } from '@/utils/schemas/file-reference.schema'
import type { TAuthSession } from '@/lib/authentication/types'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { BsCloudUploadFill } from 'react-icons/bs'
import { useQueryClient } from '@tanstack/react-query'
import EmployeeFiles from '../EmployeeFiles'

type DocumentsProps = {
  employeeId: string
  session: TAuthSession
}
function Documents({ employeeId, session }: DocumentsProps) {
  const queryClient = useQueryClient()
  const [fileHolder, setFileHolder] = useState<File | null>(null)
  const [infoHolder, setInfoHolder] = useState<TFileReference>({
    titulo: '',
    idColaborador: employeeId,
    formato: '',
    url: '',
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: new Date().toISOString(),
  })
  async function handleFileReferenceCreation() {
    try {
      // Validating file attachment and fields
      if (!fileHolder) return toast.error('Anexe o arquivo desejado.')
      if (infoHolder.titulo.trim().length < 2) return toast.error('Preencha um titulo de ao menos 2 letras.')
      const formattedFileName = infoHolder.titulo.toLowerCase().replaceAll(' ', '_')
      const vinculationId = employeeId || 'naodefinido'
      // Uploading file to Firebase and getting url and format
      const { url, format, size } = await uploadFile({
        file: fileHolder,
        fileName: formattedFileName,
        vinculationId: vinculationId,
        prefix: 'colaboradores',
      })
      // Callign endpoint for file reference creation
      const fileReference = { ...infoHolder, formato: format, url: url, tamanho: size }
      const insertResponse = await createFileReference({ info: fileReference })
      return insertResponse
    } catch (error) {
      throw error
    }
  }
  const { mutate, isPending } = useMutationWithFeedback({
    mutationKey: ['create-file-reference'],
    mutationFn: handleFileReferenceCreation,
    affectedQueryKey: ['file-references-by-user-id', employeeId],
    queryClient: queryClient,
    callbackFn: () => console.log('Referência criada !'),
  })
  return (
    <div className="flex w-full flex-col gap-y-2">
      <h1 className="bg-primary/80 w-full rounded py-1 text-center font-bold text-white">DOCUMENTOS</h1>
      <div className="mb-2 w-full">
        <TextInput
          label="TITULO DO ARQUIVO"
          placeholder="Preencha aqui o nome a ser dado ao arquivo..."
          value={infoHolder.titulo}
          handleChange={(value) => setInfoHolder((prev) => ({ ...prev, titulo: value }))}
          width="100%"
        />
      </div>
      <div className="relative mb-4 flex w-full items-center justify-center">
        <label
          htmlFor="dropzone-file"
          className="dark:hover:bg-bray-800 dark:border-primary/80 dark:hover:bg-primary/80 border-primary/20 dark:hover:border-primary/60 hover:bg-primary/20 dark:bg-primary/70 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50"
        >
          <div className="text-primary/80 flex flex-col items-center justify-center pt-5 pb-6">
            <BsCloudUploadFill color={'rgb(31,41,55)'} size={50} />

            {fileHolder ? (
              <p className="text-primary/60 mb-2 text-sm dark:text-gray-400">{fileHolder.name}</p>
            ) : (
              <p className="text-primary/60 mb-2 px-2 text-center text-sm dark:text-gray-400">
                <span className="font-semibold">Clique para escolher um arquivo</span> ou o arraste para a àrea demarcada
              </p>
            )}
          </div>
          <input
            onChange={(e) => {
              if (e.target.files) return setFileHolder(e.target.files[0])
              else return setFileHolder(null)
            }}
            id="dropzone-file"
            type="file"
            className="absolute h-full w-full opacity-0"
          />
        </label>
      </div>
      <div className="flex w-full items-center justify-end">
        <button
          // @ts-ignore
          disabled={isPending}
          onClick={() => mutate()}
          className="disabled:bg-primary/60 enabled:hover:bg-primary/80 h-9 rounded bg-gray-900 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm enabled:hover:text-white disabled:text-white"
        >
          ANEXAR
        </button>
      </div>
      <EmployeeFiles employeeId={employeeId} />
    </div>
  )
}

export default Documents
