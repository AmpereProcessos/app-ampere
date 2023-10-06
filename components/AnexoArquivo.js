import React, { useState } from 'react'
import axios from 'axios'
import { useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import TextInput from './inputs/Text'
import SelectInput from './inputs/Select'

import { fileTypes, formatLongString } from '../utils/constants'
import { storage } from '../utils/firebase'
import { BiSolidCloudDownload } from 'react-icons/bi'

function renderInputText(files) {
  if (!files)
    return (
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 px-2 text-center">
        <span className="font-semibold">Clique para escolher um arquivo</span> ou o arraste para a àrea demarcada
      </p>
    )
  const filesAsArr = Array.from(files)
  if (filesAsArr.length > 1) {
    const str = filesAsArr.map((file) => formatLongString(file.name, 15)).join(', ')
    return <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{str}</p>
  }
  return <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{filesAsArr[0]?.name}</p>
}

function AnexoArquivo({ categories, client, id, multiple }) {
  const queryClient = useQueryClient()
  const [fileInfo, setFileInfo] = useState({
    name: '',
    category: null,
  })
  const [files, setFiles] = useState(null)
  const [loading, setLoading] = useState(false)
  async function uploadFiles() {
    if (fileInfo.name.trim().length < 3) {
      return toast.error('Preencha o nome do arquivo')
    }
    if (!fileInfo.category) {
      return toast.error('Preencha a categoria do arquivo.')
    }
    if (!files) return toast.error('Anexe ao menos um arquivo.')

    var splitNome = fileInfo.name.replace('/', '').toLowerCase().split(' ')
    var fixedNome = splitNome.join('_')
    const loadingToastID = toast.loading('Enviando arquivos...')
    try {
      var linkArr = []
      setLoading(true)
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let file = files.item(i)
          if (!file) return
          let storageName = files.length > 1 ? `clientes/${client}/${fixedNome}-{${i + 1}}` : `clientes/${client}/${fixedNome}`
          var fileRef = ref(storage, storageName)
          const uploadResult = await uploadBytes(fileRef, file)
          console.log('UPLOAD RESULT', uploadResult)
          var url = await getDownloadURL(ref(storage, uploadResult.metadata.fullPath))
          let name = file.length > 1 ? `${fileInfo.name} (${i + 1})` : `${fileInfo.name}`
          linkArr.push({
            title: name,
            link: url,
            category: categories.filter((x) => x.value == fileInfo.category)[0].label,
            format:
              uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
                ? fileTypes[uploadResult.metadata.contentType].title
                : 'INDEFINIDO',
          })
        }
      }
      // Updating project files
      await axios.put(`/api/projects/update/${id}`, {
        operation: {
          $push: {
            [`${fileInfo.category}`]: {
              $each: linkArr,
            },
          },
        },
      })

      // Giving feedback on success
      toast.dismiss(loadingToastID)
      toast.success('Arquivos anexados com sucesso !')
      setFileInfo({ name: '', category: null })
      setFiles(null)
      // Invalidating projects query
      await queryClient.invalidateQueries({ queryKey: ['project-by-id', id] })
      setLoading(false)
      return
    } catch (error) {
      setLoading(false)
      // Giving feedback on error
      toast.dismiss(loadingToastID)
      const msg = getErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <div className="flex w-full flex-col gap-2 px-4">
      <div className="relative flex w-full items-center justify-center">
        <label
          htmlFor="dropzone-file"
          className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5 text-gray-800">
            <BiSolidCloudDownload color={'rgb(31,41,55)'} size={50} />

            {renderInputText(files)}
          </div>
          <input
            onChange={(e) => setFiles(e.target.files)}
            multiple={multiple != undefined ? multiple : true}
            id="dropzone-file"
            type="file"
            className="absolute h-full w-full opacity-0"
          />
        </label>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-[50%]">
          <TextInput
            label="NOME DO(S) ARQUIVO(S)"
            placeholder="Preencha o nome a ser dado ao(s) arquivo(s)."
            value={fileInfo.name}
            handleChange={(value) => setFileInfo((prev) => ({ ...prev, name: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-[50%]">
          <SelectInput
            label="CATEGORIA DO(S) ARQUIVO(S)"
            value={fileInfo.category}
            options={categories.map((category, index) => ({ value: category.value, label: category.label, id: index + 1 }))}
            onReset={() => setFileInfo((prev) => ({ ...prev, category: null }))}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value) => setFileInfo((prev) => ({ ...prev, category: value }))}
            width="100%"
          />
        </div>
      </div>
      <button
        disabled={loading}
        onClick={uploadFiles}
        className="w-fit self-center rounded-md border border-[#15599a] p-1 text-center font-bold text-[#15599a] duration-300 ease-in-out disabled:bg-gray-500 disabled:text-white enabled:hover:bg-[#15599a] enabled:hover:text-white"
      >
        ANEXAR
      </button>
    </div>
  )
}

export default AnexoArquivo
