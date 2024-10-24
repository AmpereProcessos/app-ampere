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
function handleRenderIcon(format: string) {
  //   useKey('Escape', () => setSelectMenuIsOpen(false))
  const extensionInfo = Object.values(fileTypes).find((f) => f.title == format)
  if (!extensionInfo)
    return (
      <div className="text-lg text-black">
        <AiFillFile />
      </div>
    )
  return <div className="text-lg text-black">{renderIcon(extensionInfo.icon)}</div>
}
type FileReferenceCardProps = {
  info: TFileReferenceDTO
}
function FileReferenceCard({ info }: FileReferenceCardProps) {
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
