import React from 'react'

import { AiFillFile } from 'react-icons/ai'
import { TbDownload } from 'react-icons/tb'

import { fileTypes } from '@/utils/constants'
import { handleDownload } from '@/utils/methods/firebase'
import { handleRenderFileIcon, renderIcon } from '@/utils/methods/rendering'
import { TFileReferenceDTO } from '@/utils/schemas/crm/file-reference.schema'
import { BsCalendarPlus } from 'react-icons/bs'
import Avatar from '@/components/utils/Avatar'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import { MdDelete } from 'react-icons/md'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { deleteFileReference } from '@/utils/methods/mutation/crm/file-references'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/methods/handlers'

type FileReferenceCardProps = {
  info: TFileReferenceDTO
  onDeleteCallbacks?: {
    onMutate?: () => void
    onSuccess?: () => void
    onSettled?: () => void
  }
}
function FileReferenceCard({ info, onDeleteCallbacks }: FileReferenceCardProps) {
  const { mutate: handleDeleteFileReference, isPending } = useMutation({
    mutationKey: ['create-new-file-references'],
    mutationFn: deleteFileReference,
    onMutate: async () => {
      if (!!onDeleteCallbacks?.onMutate) onDeleteCallbacks.onMutate()
    },
    onSuccess: async (data) => {
      if (!!onDeleteCallbacks?.onSuccess) onDeleteCallbacks.onSuccess()
      return toast.success(data)
    },
    onSettled: async () => {
      if (!!onDeleteCallbacks?.onSettled) onDeleteCallbacks.onSettled()
    },
    onError: (error) => {
      const msg = getErrorMessage(error)
      return toast.error(msg)
    },
  })
  return (
    <div className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
        <div className="flex items-center gap-2">
          {handleRenderFileIcon(info.formato)}
          <a href={info.url} className="cursor-pointer text-sm font-bold leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500">
            {info.titulo}
          </a>
          <h1 className="rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-medium italic text-primary/80">{info.formato}</h1>
        </div>
        <div className="hidden items-center justify-end gap-2 md:flex">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <BsCalendarPlus />
              <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(info.dataInsercao, true)}</p>
            </div>
            <div className="flex items-center gap-1">
              <Avatar url={info.autor.avatar_url || undefined} width={20} height={20} fallback={formatNameAsInitials(info.autor.nome || '')} />

              <p className="text-[0.65rem] font-medium text-primary/80">{info.autor.nome}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={isPending}
              onClick={() => handleDeleteFileReference({ id: info._id })}
              className="flex items-center gap-1 rounded-lg bg-red-600 px-2 py-1 text-[0.6rem] text-white disabled:bg-gray-500 enabled:hover:bg-red-500"
            >
              <MdDelete width={10} height={10} />
              <p>DELETAR</p>
            </button>
            <button
              onClick={() => handleDownload({ fileName: info.titulo, fileUrl: info.url })}
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-[0.6rem] text-white hover:bg-blue-500"
            >
              <TbDownload width={10} height={10} />
              <p>BAIXAR</p>
            </button>
          </div>
        </div>
      </div>
      {!!info.categorias && info.categorias.length > 0 ? (
        <div className="flex w-full flex-wrap items-center gap-2">
          <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">CATEGORIAS</h1>
          {info.categorias.map((category, index) => (
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
            <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(info.dataInsercao, true)}</p>
          </div>
          <div className="flex items-center gap-1">
            <Avatar url={info.autor.avatar_url || undefined} width={20} height={20} fallback={formatNameAsInitials(info.autor.nome || '')} />

            <p className="text-[0.65rem] font-medium text-primary/80">{info.autor.nome}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload({ fileName: info.titulo, fileUrl: info.url })}
            className="flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-[0.6rem] text-white hover:bg-blue-500"
          >
            <TbDownload width={10} height={10} />
            <p>BAIXAR</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileReferenceCard
