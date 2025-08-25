import { getBlob, getMetadata, ref } from 'firebase/storage'
import { storage } from '../../utils/services/firebase/firebase-storage'
import React, { useEffect, useRef, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { TbDownload } from 'react-icons/tb'
import axios from 'axios'
import { fileTypes } from '../../utils/constants'
import { AiFillFile } from 'react-icons/ai'
import { renderIcon } from '../../utils/methods/rendering'
import { useClickOutside } from '../../utils/hooks'
import { handleDownload } from '@/utils/methods/firebase'
function ArchiveLinkBlock({ obj, deleteFile, showDeleteMenu = true }) {
  const divRef = useRef(null)
  useClickOutside(divRef, () => setDeleteMenu(false))
  const [deleteMenu, setDeleteMenu] = useState(false)

  // async function handleDownload(url) {
  //   var splitFileName = obj.title.replace('/', '').toUpperCase().split(' ')
  //   var fixedFileName = splitFileName.join('_')
  //   if (prefix) {
  //     fixedFileName = `${prefix}-${fixedFileName}`
  //   }
  //   let fileRef = ref(storage, obj.link)
  //   const metadata = await getMetadata(fileRef)

  //   const filePath = fileRef.fullPath
  //   const extension = fileTypes[metadata.contentType]?.extension

  //   try {
  //     const response = await axios.get(`/api/firebase/download?filePath=${encodeURIComponent(filePath)}`, {
  //       responseType: 'blob',
  //     })
  //     const url = window.URL.createObjectURL(new Blob([response.data]))
  //     const link = document.createElement('a')
  //     link.href = url
  //     link.setAttribute('download', `${fixedFileName}${extension}`)
  //     document.body.appendChild(link)
  //     link.click()
  //     link.remove()
  //   } catch (error) {
  //     alert('Houve um erro no download do arquivo.')
  //   }

  //   // const xhr = new XMLHttpRequest();
  //   // xhr.responseType = "blob";
  //   // xhr.onload = (event) => {
  //   //   const blob = xhr.response;
  //   //   console.log(blob);
  //   // };
  //   // xhr.open("GET", url);
  //   // xhr.send();

  //   // let fileRef = ref(storage, obj.link);
  //   // const resp = await getBlob(fileRef);
  //   // console.log(resp);
  // }
  function handleRenderIcon(format) {
    const extensionInfo = Object.values(fileTypes).find((f) => f.title == format)
    if (!extensionInfo)
      return (
        <div className="text-lg text-black">
          <AiFillFile />{' '}
        </div>
      )
    return <div className="text-lg text-black">{renderIcon(extensionInfo.icon)}</div>
  }
  return (
    <div ref={divRef} className="flex w-full flex-col rounded-md border border-cyan-500 p-2">
      <div className="flex w-full items-center gap-2">
        {handleRenderIcon(obj.format)}
        <a href={obj.link} className="text-primary/60 text-sm leading-none font-bold tracking-tight duration-300 ease-in-out hover:text-cyan-500">
          {obj.title}
        </a>
      </div>
      <div className="mt-1 flex w-full items-center justify-between gap-2">
        <h1 className="text-primary/60 text-center text-xs font-medium italic">{obj.format}</h1>
        <div className="flex items-center gap-2">
          <div
            onClick={() => handleDownload({ fileName: obj.title, fileUrl: obj.link })}
            className="flex cursor-pointer items-center justify-center text-blue-700 duration-300 ease-in-out hover:scale-105 hover:text-blue-500"
          >
            <TbDownload />
          </div>
          {showDeleteMenu ? (
            <div className="relative grid grid-cols-1">
              {deleteMenu ? (
                <div className="flex flex-col items-center justify-center">
                  <div onClick={() => setDeleteMenu(false)} className="w-fit scale-110 cursor-pointer text-[20px] text-red-500">
                    <MdDelete />
                  </div>
                  <div className="bg-background border-primary/20 absolute -top-8 z-2 w-fit rounded border shadow-lg">
                    <button onClick={() => deleteFile(obj)} className="text-primary/70 p-2 text-xs font-bold hover:bg-red-200">
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
          ) : null}
        </div>
      </div>
    </div>
  )
  return (
    <div ref={divRef} className="flex items-center justify-center gap-2">
      <a className="text-center text-xs font-bold text-[#15599a]" href={obj.link}>
        {obj.title} ({obj.format})
      </a>
      <div className="relative grid grid-cols-1">
        {deleteMenu ? (
          <div className="flex flex-col items-center justify-center">
            <div onClick={() => setDeleteMenu(false)} className="w-fit scale-110 cursor-pointer text-[20px] text-red-500">
              <MdDelete />
            </div>
            <div className="bg-background border-primary/20 absolute -top-8 z-2 w-fit rounded border shadow-lg">
              <button onClick={() => deleteFile(obj)} className="text-primary/70 p-2 text-xs font-bold hover:bg-red-200">
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
      <div
        onClick={() => handleDownload(obj.link)}
        className="flex cursor-pointer items-center justify-center text-blue-700 duration-300 ease-in-out hover:scale-105 hover:text-blue-500"
      >
        <TbDownload />
      </div>
    </div>
  )
}

export default ArchiveLinkBlock
