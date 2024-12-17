import FileReferenceCard from '@/components/identificador/referencias-arquivos/FileReferenceCard'
import NewManyFileReferencesMenu from '@/components/identificador/referencias-arquivos/NewManyFileReferencesMenu'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { cn } from '@/lib/utils'
import { getErrorMessage } from '@/utils/methods/handlers'
import { useFileReferences } from '@/utils/methods/query/crm/file-references'
import { TFileReferencesQueryParams } from '@/utils/schemas/crm/file-reference.schema'
import { useQueryClient } from '@tanstack/react-query'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import { MdAttachFile, MdDashboard } from 'react-icons/md'

type ServiceOrderFileReferencesProps = {
  attachmentPrefix: string
  session: Session
  projectId?: string
  serviceOrderId: string
}
function ServiceOrderFileReferences({ attachmentPrefix, session, projectId, serviceOrderId }: ServiceOrderFileReferencesProps) {
  const queryClient = useQueryClient()

  const [newFileReferencesMenuIsOpen, setNewFileReferencesMenuIsOpen] = useState<boolean>(false)
  const [showProjectFiles, setShowProjectFiles] = useState<boolean>(false)

  const queryParam: TFileReferencesQueryParams = { serviceOrderId: serviceOrderId, projectId: showProjectFiles ? projectId : undefined }
  const { data: fileReferences, isLoading, isSuccess, isError, error } = useFileReferences(queryParam)

  async function createMutateCallback() {
    await queryClient.cancelQueries({ queryKey: ['file-references-by-query', queryParam] })
    return
  }
  async function createSettledCallback() {
    await queryClient.invalidateQueries({ queryKey: ['file-references-by-query', queryParam] })
    return
  }

  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">ARQUIVOS</h1>
      <div className="flex w-full items-center justify-end">
        {projectId ? (
          <button
            onClick={() => setShowProjectFiles((prev) => !prev)}
            className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
              'bg-cyan-400  hover:bg-gray-400': showProjectFiles,
              'bg-gray-300  hover:bg-cyan-300': !showProjectFiles,
            })}
          >
            <MdDashboard />
            <h1 className="text-xs font-medium tracking-tight">MOSTRAR ANEXOS DO PROJETO</h1>
          </button>
        ) : null}
      </div>
      <div className="flex w-full grow flex-col gap-2">
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
        {isSuccess ? (
          fileReferences.length > 0 ? (
            fileReferences.map((fileReference) => <FileReferenceCard key={fileReference._id} info={fileReference} />)
          ) : (
            <div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhum arquivo anexado.</div>
          )
        ) : null}
      </div>
      <div className="flex w-full items-center justify-end">
        <button
          onClick={() => setNewFileReferencesMenuIsOpen((prev) => !prev)}
          className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
            'bg-gray-300  hover:bg-red-300': newFileReferencesMenuIsOpen,
            'bg-green-300  hover:bg-green-400': !newFileReferencesMenuIsOpen,
          })}
        >
          <MdAttachFile />
          <h1 className="text-xs font-medium tracking-tight">
            {!newFileReferencesMenuIsOpen ? 'ABRIR MENU DE NOVOS ANEXOS' : 'FECHAR MENU DE NOVOS ANEXOS'}
          </h1>
        </button>
      </div>
      {newFileReferencesMenuIsOpen ? (
        <NewManyFileReferencesMenu
          vinculationId={projectId ? projectId : serviceOrderId}
          prefix={attachmentPrefix}
          session={session}
          vinculations={{
            serviceOrderId: { blocked: true, value: serviceOrderId },
            projectId: projectId ? { blocked: true, value: projectId } : undefined,
          }}
          callbacks={{ onMutate: createMutateCallback, onSettled: createSettledCallback }}
          closeMenu={() => setNewFileReferencesMenuIsOpen(false)}
        />
      ) : null}
    </div>
  )
}

export default ServiceOrderFileReferences
