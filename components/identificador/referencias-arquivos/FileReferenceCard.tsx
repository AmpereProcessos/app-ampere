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
          {/* {showDeleteMenu ? (
            <div className="relative grid grid-cols-1">
              {deleteMenu ? (
                <div className="flex flex-col items-center justify-center">
                  <div onClick={() => setDeleteMenu(false)} className="w-fit scale-110 cursor-pointer text-[20px] text-red-500">
                    <MdDelete />
                  </div>
                  <div className="z-2 absolute -top-8 w-fit rounded border border-gray-200 bg-[#fff] shadow-lg">
                    <button onClick={() => deleteFile(obj)} className="p-2 text-xs font-bold text-gray-700 hover:bg-red-200">
                      EXCLUIR
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <div
                    onClick={() => setDeleteMenu(true)}
                    className="w-fit cursor-pointer text-[20px] text-red-500 opacity-40 duration-300 ease-in hover:scale-110 hover:text-red-500 hover:opacity-100"
                  >
                    <MdDelete />
                  </div>
                </div>
              )}
            </div>
          ) : null} */}
        </div>
      </div>
    </div>
  )
}

export default FileReferenceCard
