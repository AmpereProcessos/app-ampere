import { cn } from '@/lib/utils'
import { formatLongString, GeneralVisibleHiddenExitMotionVariants, getFileTypeTitle, isFileImage } from '@/utils/constants'
import { TFileReference, TFileReferencesQueryParams } from '@/utils/schemas/crm/file-reference.schema'
import { TAttachmentHolder } from '@/utils/schemas/useful'
import { AnimatePresence, motion } from 'framer-motion'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import { BsCalendarPlus, BsCloudUploadFill } from 'react-icons/bs'
import { MdAttachFile, MdDelete } from 'react-icons/md'
import { FileReferenceCategories } from '@/utils/select-options'

import { getErrorMessage } from '@/utils/methods/handlers'
import { TProject } from '@/utils/schemas/projects'
import { TUseFileReferencesFilters, useFileReferences } from '@/utils/methods/query/crm/file-references'
import LoadingComponent from '../utils/LoadingComponent'
import ErrorComponent from '../utils/ErrorComponent'
import { handleRenderFileIcon } from '@/utils/methods/rendering'
import { handleDownload, uploadFile } from '@/utils/methods/firebase'
import { TbDownload } from 'react-icons/tb'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import Avatar from '../utils/Avatar'
import NewAttachmentMenu from './Utils/NewAttachmentMenu'
import { Input } from '../ui/input'
import { ListFilter } from 'lucide-react'
import { getAllowedCategories } from '@/utils/methods/util/file-references'
import { useQueryClient } from '@tanstack/react-query'
import FileReferenceCard from '../identificador/referencias-arquivos/FileReferenceCard'

type InfoAnexosBlockProps = {
  projectId: string
  project: TProject
  session: Session
}
function InfoAnexosBlock({ projectId, project, session }: InfoAnexosBlockProps) {
  const queryClient = useQueryClient()
  const [newAttachmentMenuIsOpen, setNewAttachmentMenuIsOpen] = useState<boolean>(false)

  const allowedCategories = getAllowedCategories({ session })
  const queryParam: TFileReferencesQueryParams = { projectId: projectId }
  const { data: fileReferences, isLoading, isError, isSuccess, error, filters, setFilters } = useFileReferences(queryParam)

  async function handleOnMutate() {
    await queryClient.cancelQueries({
      queryKey: ['file-references-by-query', queryParam],
    })
  }
  async function handleOnSettled() {
    await queryClient.invalidateQueries({
      queryKey: ['file-references-by-query', queryParam],
    })
  }
  return (
    <div className="flex w-full flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">ARQUIVOS DO PROJETO</span>
      <div className="flex w-full flex-col gap-2 p-2">
        <div className="flex w-full flex-wrap items-center justify-end gap-2">
          <button
            onClick={() => setNewAttachmentMenuIsOpen((prev) => !prev)}
            className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
              'bg-gray-300  hover:bg-red-300': newAttachmentMenuIsOpen,
              'bg-green-300  hover:bg-green-400': !newAttachmentMenuIsOpen,
            })}
          >
            <MdAttachFile />
            <h1 className="text-xs font-medium tracking-tight">
              {!newAttachmentMenuIsOpen ? 'ABRIR MENU DE NOVOS ANEXOS' : 'FECHAR MENU DE NOVOS ANEXOS'}
            </h1>
          </button>
        </div>
        <ProjectFilesFiltersMenu allowedCategories={allowedCategories} filters={filters} setFilters={setFilters} />
        {newAttachmentMenuIsOpen ? (
          <NewAttachmentMenu
            partnerId={project.idParceiro || ''}
            projectId={projectId}
            projectName={project.nomeDoContrato}
            projectCode={project.codigoSVB.toString()}
            allowedCategories={allowedCategories}
            session={session}
            closeMenu={() => setNewAttachmentMenuIsOpen(false)}
            callbacks={{
              onMutate: async () => await handleOnMutate(),
              onSettled: async () => await handleOnSettled(),
            }}
          />
        ) : null}
        <div className="flex w-full flex-wrap gap-3 gap-y-1">
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess
            ? fileReferences.map((fileReference) => (
                <FileReferenceCard
                  key={fileReference._id}
                  info={fileReference}
                  onDeleteCallbacks={{
                    onMutate: async () => await handleOnMutate(),
                    onSettled: async () => await handleOnSettled(),
                  }}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  )
}

export default InfoAnexosBlock

type ProjectFilesFiltersProps = {
  allowedCategories: string[]
  filters: TUseFileReferencesFilters
  setFilters: React.Dispatch<React.SetStateAction<TUseFileReferencesFilters>>
}

function ProjectFilesFiltersMenu({ allowedCategories, filters, setFilters }: ProjectFilesFiltersProps) {
  function handleCategoryChange(category: string) {
    const selectedCategoryIndex = filters.categories.indexOf(category)
    if (selectedCategoryIndex === -1) setFilters((prev) => ({ ...prev, categories: [...prev.categories, category] }))
    else setFilters((prev) => ({ ...prev, categories: prev.categories.filter((x) => x != category) }))
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="text-sm font-bold tracking-tight">FILTROS</h1>
      <div className="flex w-full flex-wrap items-start gap-2">
        {FileReferenceCategories.filter((c) => allowedCategories.includes(c.value)).map((cat, index) => (
          <button
            key={index}
            onClick={() => handleCategoryChange(cat.value)}
            className={cn(
              'rounded-lg border border-primary bg-transparent px-2 py-1 text-[0.55rem] font-bold text-primary duration-300 ease-in-out lg:text-[0.6rem]',
              filters.categories.includes(cat.value) ? 'bg-primary text-secondary' : ''
            )}
            // className={`rounded-lg ${category == cat ? "bg-blue-500 text-white" : "bg-transparent text-blue-500"} border border-blue-500 px-2 py-1 text-[0.6rem] font-bold`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <Input
        placeholder="Pesquise pelo nome do anexo..."
        value={filters.title}
        onChange={(e) => setFilters((prev) => ({ ...prev, title: e.target.value }))}
      />
    </div>
  )
}
