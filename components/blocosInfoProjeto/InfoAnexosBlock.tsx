import { cn } from '@/lib/utils'
import { formatLongString, GeneralVisibleHiddenExitMotionVariants, getFileTypeTitle, isFileImage } from '@/utils/constants'
import { TFileReference, TFileReferencesQueryParams } from '@/utils/schemas/crm/file-reference.schema'
import { TAttachmentHolder } from '@/utils/schemas/useful'
import { AnimatePresence, motion } from 'framer-motion'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import { BsCalendarPlus, BsCloudUploadFill } from 'react-icons/bs'
import { MdAttachFile } from 'react-icons/md'
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
                <div className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
                  <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
                    <div className="flex items-center gap-2">
                      {handleRenderFileIcon(fileReference.formato)}
                      <a
                        href={fileReference.url}
                        className="cursor-pointer text-sm font-bold leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500"
                      >
                        {fileReference.titulo}
                      </a>
                      <h1 className="rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-medium italic text-primary/80">
                        {fileReference.formato}
                      </h1>
                    </div>
                    <div className="hidden items-center justify-end gap-2 md:flex">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1">
                          <BsCalendarPlus />
                          <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(fileReference.dataInsercao, true)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Avatar
                            url={fileReference.autor.avatar_url || undefined}
                            width={20}
                            height={20}
                            fallback={formatNameAsInitials(fileReference.autor.nome || '')}
                          />

                          <p className="text-[0.65rem] font-medium text-primary/80">{fileReference.autor.nome}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload({ fileName: fileReference.titulo, fileUrl: fileReference.url })}
                          className="flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-[0.6rem] text-white hover:bg-blue-500"
                        >
                          <TbDownload width={10} height={10} />
                          <p>BAIXAR</p>
                        </button>
                      </div>
                    </div>
                  </div>
                  {!!fileReference.categorias && fileReference.categorias.length > 0 ? (
                    <div className="flex w-full flex-wrap items-center gap-2">
                      <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">CATEGORIAS</h1>
                      {fileReference.categorias.map((category, index) => (
                        <h1 key={index} className="rounded-lg bg-primary px-2 py-0.5 text-[0.5rem] text-secondary">
                          {category}
                        </h1>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex flex-col items-center gap-2 md:hidden">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1">
                        <BsCalendarPlus />
                        <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(fileReference.dataInsercao, true)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Avatar
                          url={fileReference.autor.avatar_url || undefined}
                          width={20}
                          height={20}
                          fallback={formatNameAsInitials(fileReference.autor.nome || '')}
                        />

                        <p className="text-[0.65rem] font-medium text-primary/80">{fileReference.autor.nome}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload({ fileName: fileReference.titulo, fileUrl: fileReference.url })}
                        className="flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-[0.6rem] text-white hover:bg-blue-500"
                      >
                        <TbDownload width={10} height={10} />
                        <p>BAIXAR</p>
                      </button>
                    </div>
                  </div>
                </div>
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
