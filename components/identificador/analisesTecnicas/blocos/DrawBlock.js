import Image from 'next/image'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { BiSolidCloudDownload } from 'react-icons/bi'
import { generalFirebaseUpload } from '../../../../utils/methods/uploading'
function renderInputText(file) {
  if (!file)
    return (
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 px-2 text-center">
        <span className="font-semibold">Clique para escolher um arquivo</span> ou o arraste para a àrea demarcada
      </p>
    )
  return <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{file.name}</p>
}
function DrawBlock({ infoHolder, setInfoHolder, changes, setChanges, updateAnalysis }) {
  const [drawImageFile, setDrawImageFile] = useState(null)
  const [previewImageURL, setPreviewImageURL] = useState(null)
  function handleFileInput(e) {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null
    if (!file) {
      setPreviewImageURL(null)
      setDrawImageFile(null)
      return
    }
    const previewURL = URL.createObjectURL(file)
    setPreviewImageURL(previewURL)
    setDrawImageFile(file)
  }
  async function handleDrawImageUpload() {
    if (!drawImageFile) return toast.error('Favor, adicionar um arquivo.')
    const filePath = `/clientes/${infoHolder.nome}/desenhoVisitaTecnica-${new Date().toISOString()}`
    const { url } = await generalFirebaseUpload({ file: drawImageFile, path: filePath })
    console.log('URL UPLOAD', url)
    setInfoHolder((prev) => ({ ...prev, desenho: { ...prev.desenho, url: url } }))
    setChanges((prev) => ({ ...prev, 'desenho.url': url }))
    updateAnalysis({ 'desenho.url': url })
  }
  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2">
        <h1 className="font-bold text-white">DESENHO</h1>
      </div>
      <div className="mt-2 flex w-full flex-col gap-2">
        {previewImageURL || infoHolder.desenho.url ? (
          <div className="flex flex-col w-full items-center gap-2">
            {previewImageURL && !infoHolder.desenho.url ? (
              <h1 className="text-center font-bold tracking-tight leading-none">PREVIEW DA IMAGEM</h1>
            ) : null}
            {!!infoHolder.desenho.url ? <h1 className="text-center font-bold tracking-tight leading-none">IMAGEM</h1> : null}
            <div className="h-[300px] flex items-center justify-center w-fit min-w-[300px] relative rounded-[5%] border border-gray-500">
              {previewImageURL || infoHolder.desenho.url ? (
                <Image src={previewImageURL || infoHolder.desenho.url} objectFit="fill" layout="fill" style={{ borderRadius: '5%' }} />
              ) : null}
            </div>
          </div>
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center">
            <p className="text-sm text-gray-500 font-medium italic">Nenhuma imagem de desenho vinculada.</p>
          </div>
        )}
        <div className="relative flex w-full items-center justify-center">
          <label
            htmlFor="dropzone-file"
            className="dark:hover:bg-bray-800 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5 text-gray-800">
              <BiSolidCloudDownload color={'rgb(31,41,55)'} size={50} />

              {renderInputText(drawImageFile)}
            </div>
            <input
              onChange={(e) => handleFileInput(e)}
              id="dropzone-file"
              type="file"
              className="absolute h-full w-full opacity-0"
              accept=".png, .jpg"
            />
          </label>
        </div>
        <div className="flex w-full items-center justify-end mb-2">
          <button
            onClick={handleDrawImageUpload}
            className="rounded border border-[#15599a] p-1 font-bold text-[#15599a] duration-300 ease-in-out hover:bg-[#15599a] hover:text-white"
          >
            VINCULAR IMAGEM
          </button>
        </div>
      </div>
    </div>
  )
}

export default DrawBlock
