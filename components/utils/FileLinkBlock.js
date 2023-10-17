import { getBlob, getMetadata, ref } from 'firebase/storage'
import { storage } from '../../utils/firebase'
import React, { useEffect, useRef, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { TbDownload } from 'react-icons/tb'
import axios from 'axios'
import { fileTypes } from '../../utils/constants'
import { AiFillFile } from 'react-icons/ai'
import { renderIcon } from '../../utils/methods/rendering'
import { useClickOutside } from '../../utils/hooks'
function ArchiveLinkBlock({ obj, deleteFile, prefix, showDeleteMenu = true }) {
  const divRef = useRef(null)
  useClickOutside(divRef, () => setDeleteMenu(false))
  const [deleteMenu, setDeleteMenu] = useState(false)

  async function handleDownload(url) {
    var splitFileName = obj.title.replace('/', '').toUpperCase().split(' ')
    var fixedFileName = splitFileName.join('_')
    if (prefix) {
      fixedFileName = `${prefix}-${fixedFileName}`
    }
    let fileRef = ref(storage, obj.link)
    const metadata = await getMetadata(fileRef)

    const filePath = fileRef.fullPath
    const extension = fileTypes[metadata.contentType]?.extension

    try {
      const response = await axios.get(`/api/firebase/download?filePath=${encodeURIComponent(filePath)}`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${fixedFileName}${extension}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      alert('Houve um erro no download do arquivo.')
    }

    // const xhr = new XMLHttpRequest();
    // xhr.responseType = "blob";
    // xhr.onload = (event) => {
    //   const blob = xhr.response;
    //   console.log(blob);
    // };
    // xhr.open("GET", url);
    // xhr.send();

    // let fileRef = ref(storage, obj.link);
    // const resp = await getBlob(fileRef);
    // console.log(resp);
  }
  function handleRenderIcon(format) {
    const extensionInfo = Object.values(fileTypes).find((f) => f.title == format)
    if (!extensionInfo)
      return (
        <div className="text-black text-lg">
          <AiFillFile />{' '}
        </div>
      )
    return <div className="text-black text-lg">{renderIcon(extensionInfo.icon)}</div>
  }
  return (
    <div ref={divRef} className="flex flex-col w-full rounded-md border border-cyan-500 p-2">
      <div className="flex items-center w-full gap-2">
        {handleRenderIcon(obj.format)}
        <a href={obj.link} className="font-bold text-gray-500 hover:text-cyan-500 duration-300 ease-in-out leading-none tracking-tight text-sm">
          {obj.title}
        </a>
      </div>
      <div className="w-full flex items-center justify-between gap-2 mt-1">
        <h1 className="text-gray-500 text-xs font-medium italic text-center">{obj.format}</h1>
        <div className="flex items-center gap-2">
          <div
            onClick={() => handleDownload(obj.link)}
            className="flex items-center justify-center text-blue-700 hover:text-blue-500 hover:scale-105 duration-300 ease-in-out cursor-pointer"
          >
            <TbDownload />
          </div>
          {showDeleteMenu ? (
            <div className="grid grid-cols-1 relative">
              {deleteMenu ? (
                <div className="flex flex-col items-center justify-center">
                  <div onClick={() => setDeleteMenu(false)} className="w-fit text-red-500 scale-110 cursor-pointer text-[20px]">
                    <MdDelete />
                  </div>
                  <div className="w-fit rounded bg-[#fff] z-2 shadow-lg border border-gray-200 absolute -top-8">
                    <button onClick={() => deleteFile(obj)} className="text-gray-700 font-bold text-xs hover:bg-red-200 p-2">
                      EXCLUIR
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <div
                    onClick={() => setDeleteMenu(true)}
                    className="w-fit text-red-500 opacity-40 hover:opacity-100 hover:text-red-500 hover:scale-110 duration-300 ease-in cursor-pointer text-[20px]"
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
      <a className="text-xs text-[#15599a] font-bold text-center" href={obj.link}>
        {obj.title} ({obj.format})
      </a>
      <div className="grid grid-cols-1 relative">
        {deleteMenu ? (
          <div className="flex flex-col items-center justify-center">
            <div onClick={() => setDeleteMenu(false)} className="w-fit text-red-500 scale-110 cursor-pointer text-[20px]">
              <MdDelete />
            </div>
            <div className="w-fit rounded bg-[#fff] z-2 shadow-lg border border-gray-200 absolute -top-8">
              <button onClick={() => deleteFile(obj)} className="text-gray-700 font-bold text-xs hover:bg-red-200 p-2">
                EXCLUIR
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div
              onClick={() => setDeleteMenu(true)}
              className="w-fit text-red-500 opacity-40 hover:opacity-100 hover:text-red-500 hover:scale-110 duration-300 ease-in cursor-pointer text-[20px]"
            >
              <MdDelete />
            </div>
          </div>
        )}
      </div>
      <div
        onClick={() => handleDownload(obj.link)}
        className="flex items-center justify-center text-blue-700 hover:text-blue-500 hover:scale-105 duration-300 ease-in-out cursor-pointer"
      >
        <TbDownload />
      </div>
    </div>
  )
}

export default ArchiveLinkBlock
