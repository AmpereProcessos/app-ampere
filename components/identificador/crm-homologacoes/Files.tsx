import { fileTypes } from '@/utils/constants'
import { uploadFile } from '@/utils/methods/firebase'
import { createFileReference } from '@/utils/methods/mutation/crm/file-references'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { useFileReferencesByHomologationId } from '@/utils/methods/query/crm/file-references'
import { TFileReference } from '@/utils/schemas/crm/file-reference.schema'
import { storage } from '@/utils/services/firebase/firebase-storage'
import { getMetadata, ref } from 'firebase/storage'
import { Session } from 'next-auth'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import FileReferenceCard from '../referencias-arquivos/FileReferenceCard'
import DocumentFileInput from '@/components/inputs/DocumentFileInput'
import TextInput from '@/components/inputs/Text'

type HomologationFilesProps = {
  session: Session
  homologationId: string
}
function HomologationFiles({ session, homologationId }: HomologationFilesProps) {
  const queryClient = useQueryClient()
  const { data: references, isLoading, isError, isSuccess } = useFileReferencesByHomologationId({ homologationId })
  const [personalizedFile, setPersonalizedFile] = useState<{ titulo: string; arquivo: File | string | null }>({
    titulo: '',
    arquivo: null,
  })

  async function attachFile(info: { titulo: string; arquivo: File | string | null }) {
    try {
      if (info.titulo.trim().length < 3) throw new Error('Preencha um título de ao menos 3 caractéres.')
      if (!info.arquivo) throw new Error('Vincule o arquivo a ser anexado.')
      const file = info.arquivo
      if (!file) return
      if (typeof file == 'string') {
        const fileRef = ref(storage, file)
        const metaData = await getMetadata(fileRef)
        const format = metaData.contentType && fileTypes[metaData.contentType] ? fileTypes[metaData.contentType].title : 'INDEFINIDO'
        const link: TFileReference = {
          idParceiro: '65454ba15cf3e3ecf534b308',
          idHomologacao: homologationId,
          titulo: info.titulo.toUpperCase(),
          formato: format,
          url: file,
          tamanho: metaData.size,
          autor: {
            id: session.user.id,
            nome: session.user.nome,
            avatar_url: session.user.avatar_url,
          },
          dataInsercao: new Date().toISOString(),
        }
        await createFileReference({ info: link })
      }
      if (typeof file != 'string') {
        const formattedFileName = info.titulo.toLowerCase().replaceAll(' ', '_')
        const vinculationId = homologationId
        // Uploading file to Firebase and getting url and format
        const { url, format, size } = await uploadFile({
          file: file,
          fileName: formattedFileName,
          vinculationId: vinculationId,
          prefix: 'homologacoes',
        })
        const link: TFileReference = {
          idParceiro: '65454ba15cf3e3ecf534b308',
          idHomologacao: homologationId,
          titulo: info.titulo.toUpperCase(),
          formato: format,
          url: url,
          tamanho: size,
          autor: {
            id: session.user.id,
            nome: session.user.nome,
            avatar_url: session.user.avatar_url,
          },
          dataInsercao: new Date().toISOString(),
        }
        await createFileReference({ info: link })
      }
      return 'Arquivo anexado com sucesso !'
    } catch (error) {
      throw error
    }
  }
  const { mutate: handleAttachFile, isPending: mutationLoading } = useMutationWithFeedback({
    mutationKey: ['attach-homologation-file'],
    mutationFn: attachFile,
    queryClient: queryClient,
    affectedQueryKey: ['file-references-by-homologation', homologationId],
  })
  console.log(personalizedFile)
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">ARQUIVOS</h1>
      <div className="mt-2 flex w-full flex-wrap justify-around gap-2">
        {references && references.length > 0 ? (
          references.map((file, index) => <FileReferenceCard info={file} />)
        ) : (
          <p className="w-full text-center text-xs font-medium italic text-gray-500">Nenhum arquivo adicionado.</p>
        )}
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <div className="w-full lg:w-1/2">
          <DocumentFileInput
            label="ARQUIVO"
            value={personalizedFile.arquivo}
            handleChange={(value) => setPersonalizedFile((prev) => ({ ...prev, arquivo: value }))}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label="TITULO DO ARQUIVO"
            placeholder="Digite o nome a ser dado ao arquivo..."
            value={personalizedFile.titulo}
            handleChange={(value) => setPersonalizedFile((prev) => ({ ...prev, titulo: value }))}
            width="100%"
          />
        </div>
        <button
          disabled={mutationLoading}
          // @ts-ignore
          onClick={() => handleAttachFile(personalizedFile)}
          className="rounded bg-black p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out hover:bg-gray-700"
        >
          ADICIONAR ARQUIVO
        </button>
      </div>
    </div>
  )
}

export default HomologationFiles
