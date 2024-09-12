import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/methods/handlers'
import { destroyCookie } from 'nookies'
import { updateServiceOrder } from '../utils/methods/mutation/serviceOrders'
import { useQueryClient } from 'react-query'
import { FaFile } from 'react-icons/fa'
import TextInput from '../components/inputs/Text'
import TextAreaInput from '../components/inputs/TextareaInput'
import { BsCloudUploadFill } from 'react-icons/bs'
import { fileTypes, formatLongString, getFileTypeTitle, isFileImage } from '../utils/constants'
import Image from 'next/image'
import { storage } from '../utils/services/firebase/firebase-storage'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import axios from 'axios'
function renderInputText(files) {
  if (!files)
    return (
      <p className="mb-2 px-2 text-center text-sm text-primary/80">
        <span className="font-semibold">Clique para escolher um arquivo</span> ou o arraste para a àrea demarcada
      </p>
    )
  const filesAsArr = Array.from(files)
  if (filesAsArr.length > 1) {
    const str = filesAsArr.map((file) => formatLongString(file.name, 15)).join(', ')
    return <p className="mb-2 text-sm text-primary/80">{str}</p>
  }
  return <p className="mb-2 text-sm text-primary/80">{filesAsArr[0]?.name}</p>
}
function ConferenciaOutrasCategorias({ order, closeModal, queryKey }) {
  const [finishInProgress, setFinishInProgress] = useState(false)
  const [notes, setNotes] = useState('')
  const [fileHolder, setFileHolder] = useState({
    title: '',
    files: null,
  })
  // {title:string, file:File, previewUrl:string, type:string}[]
  const [files, setFiles] = useState([])
  const queryClient = useQueryClient()

  function handleAddFiles() {
    if (!fileHolder.files || fileHolder.files.length == 0) {
      toast.error('Selecione ao menos um arquivo.')
      return
    }
    if (fileHolder.title.trim().length < 3) {
      toast.error('Preencha o título dos arquivos.')
      return
    }
    const filesAsArr = Array.from(fileHolder.files)
    setFiles((prev) => [
      ...prev,
      ...filesAsArr.map((v, index, arr) => ({
        title: arr.length > 1 ? `${fileHolder.title.toUpperCase()} (${index + 1})` : fileHolder.title,
        file: v,
        previewUrl: isFileImage(v.type) ? URL.createObjectURL(v) : null,
        type: v,
      })),
    ])
    setFileHolder({
      title: '',
      files: null,
    })
  }
  function handleRemoveFile(index) {
    setFiles((prev) => prev.filter((_, i) => i != index))
  }
  async function updateProject({ links, projectId }) {
    try {
      await axios.put(`/api/projects/update/${projectId}`, {
        operation: {
          $push: {
            'links.manutencaoCorretiva': {
              $each: links,
            },
          },
        },
      })
      return
    } catch (error) {
      throw error
    }
  }
  async function uploadFiles(files) {
    var links = []
    const uploadPromises = files
      .filter((f) => !!f.file)
      .map(async (f) => {
        const uploadFileName = f.title.toLowerCase().replace(' ', '_')
        const fileRef = ref(storage, `clientes/${order.favorecido.nome}/${uploadFileName}`)
        let uploadResponse = await uploadBytes(fileRef, f.file)
        let uploadResponseUrl = await getDownloadURL(ref(storage, uploadResponse.metadata.fullPath))

        links.push({
          title: f.title,
          link: uploadResponseUrl,
          format: fileTypes[uploadResponse.metadata.contentType] ? fileTypes[uploadResponse.metadata.contentType].title : 'INDEFINIDO',
        })
      })

    await Promise.all(uploadPromises)

    return links
  }
  async function finishOS() {
    setFinishInProgress(true)
    const loadingToastId = toast.loading('Processando...')
    try {
      let links = await uploadFiles(files)
      const currentDateTime = new Date().toISOString()
      await updateServiceOrder({
        info: { dataEfetivacao: currentDateTime, anotacoes: notes },
        invalidateKey: queryKey,
        orderId: order._id,
        queryClient: queryClient,
      })
      if (order.projeto?.id) await updateProject({ links: links, projectId: order.projeto.id })
      toast.dismiss(loadingToastId)
      toast.success('Ordem de Serviço finalizada com sucesso !')
      closeModal()
    } catch (error) {
      setFinishInProgress(false)
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      toast.error(msg)
    }
  }
  return (
    <div className="my-2 mt-6 flex flex-col items-center justify-center gap-2">
      <h1 className="text-center font-bold text-[#15599a]">FECHAMENTO DA OS</h1>
      {files.length > 0 ? (
        <div className="flex w-full flex-wrap items-center justify-around">
          {files.map((file, index) => (
            <div key={index} className="flex h-[160px] w-[100px] flex-col rounded border border-primary/50">
              <div className="relative flex h-[100px] w-full grow items-center justify-center bg-gradient-to-b from-sky-400 to-sky-200">
                {file.previewUrl ? (
                  <Image src={file.previewUrl} alt={file.file?.name || ''} fill={true} />
                ) : (
                  <h1 className="rounded-lg bg-blue-600 px-4 py-1 text-[0.65rem] font-bold text-white">{getFileTypeTitle(file.type || '')}</h1>
                )}
              </div>
              <div className="h-[30px] rounded-tl-none rounded-tr-none bg-black p-2 text-center text-[0.55rem] font-bold text-white">
                {formatLongString(file.title || '', 15)}
              </div>
              <div
                onClick={() => handleRemoveFile(index)}
                className="h-[30px] cursor-pointer rounded-bl-none rounded-br-none bg-red-300 p-2 text-center text-[0.55rem] font-bold text-white duration-300 ease-in-out hover:bg-red-500"
              >
                REMOVER
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="w-full text-sm tracking-tight text-gray-500">Nenhum arquivo vinculado...</p>
      )}
      <div className="flex w-[90%] flex-col gap-2 self-center rounded-lg border border-green-800">
        <h1 className="w-full rounded-tr-lg rounded-tl-lg bg-green-800 p-1 text-center text-xs font-medium text-white">ANEXO DE ARQUIVOS</h1>
        <div className="flex w-full flex-col items-center gap-2 p-3">
          <div className="relative flex w-full items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5 text-primary">
                <BsCloudUploadFill color={'rgb(31,41,55)'} size={50} />
                {renderInputText(fileHolder.files)}
              </div>
              <input
                onChange={(e) => setFileHolder((prev) => ({ ...prev, files: e.target.files }))}
                multiple={true}
                id="dropzone-file"
                type="file"
                className="absolute h-full w-full opacity-0"
              />
            </label>
          </div>
          <TextInput
            label="TÍTULO DOS ARQUIVOS"
            value={fileHolder.title}
            handleChange={(value) => setFileHolder((prev) => ({ ...prev, title: value }))}
            placeholder="Preencha aqui o título dos arquivos..."
          />
          <div className="flex w-full items-center justify-center">
            <button onClick={() => handleAddFiles()} className="rounded bg-black px-4 py-2 text-xs font-bold text-white shadow hover:bg-black/90">
              ADICIONAR ARQUIVOS
            </button>
          </div>
        </div>
      </div>
      <TextAreaInput
        label="ANOTAÇÕES"
        placeholder="Preencha aqui alguma anotação relevante para a ordem de serviço..."
        value={notes}
        handleChange={(value) => setNotes(value)}
      />
      <button
        disabled={finishInProgress}
        onClick={finishOS}
        className="rounded border border-[#15599a] p-2 font-bold text-[#15599a] duration-500 ease-in-out disabled:bg-gray-500 disabled:text-white disabled:opacity-70 hover:scale-105 hover:bg-[#15599a] hover:text-white"
      >
        FINALIZAR OS
      </button>
    </div>
  )
}

export default ConferenciaOutrasCategorias
