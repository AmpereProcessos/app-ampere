import React from 'react'

import { AiFillFile } from 'react-icons/ai'
import { TbDownload } from 'react-icons/tb'

import { fileTypes } from '@/utils/constants'
import { handleDownload } from '@/utils/methods/firebase'
import { renderIcon } from '@/utils/methods/rendering'
import { TFileReferenceDTO } from '@/utils/schemas/file-reference.schema'
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
    <div className="flex w-full flex-col rounded-md border border-cyan-500 p-2">
      <div className="flex w-full items-center gap-2">
        {handleRenderIcon(info.formato)}
        <a href={info.url} className="text-sm font-bold leading-none tracking-tight text-gray-500 duration-300 ease-in-out hover:text-cyan-500">
          {info.titulo}
        </a>
      </div>
      <div className="mt-1 flex w-full items-center justify-between gap-2">
        <h1 className="text-center text-xs font-medium italic text-gray-500">{info.formato}</h1>
        <div className="flex items-center gap-2">
          <div
            onClick={() => handleDownload({ fileName: info.titulo, fileUrl: info.url })}
            className="flex cursor-pointer items-center justify-center text-blue-700 duration-300 ease-in-out hover:scale-105 hover:text-blue-500"
          >
            <TbDownload />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileReferenceCard
