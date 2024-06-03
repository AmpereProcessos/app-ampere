import UpdateRegistriesCard from '@/components/identificador/estoque/UpdateRegistriesCard'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { useMaterialLogsByType, useMaterials } from '@/utils/methods/query/materials'
import xml2js from 'xml2js'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { ZodNumberCheck } from 'zod'
import { BiSolidCloudDownload } from 'react-icons/bi'
import { formatLongString } from '@/utils/constants'
import toast from 'react-hot-toast'
import InputMaterialCard from '@/components/identificador/almoxarifado/estoque/InputMaterialCard'

function renderInputText(files: File | null) {
  if (!files)
    return (
      <p className="mb-2 px-2 text-center text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Clique para escolher um arquivo</span> ou o arraste para a àrea demarcada
      </p>
    )

  return <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{files.name}</p>
}

export type InputMaterialItem = { codigo: string | number; nome: string; preco: number; qtde: number; grandeza: string }
async function readXML(file: File) {
  return new Promise<InputMaterialItem[]>((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onload = async (e) => {
      if (!e.target || !e.target.result) {
        reject(new Error('Failed to read file'))
        return
      }
      const xmlData = e.target.result as string
      try {
        const result = await new Promise<any>((resolve, reject) => {
          xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
            if (err) {
              reject(err)
              return
            }
            resolve(result)
          })
        })

        const NFeItems = result.nfeProc.NFe.infNFe.det
        let items: InputMaterialItem[] = []

        if (Array.isArray(NFeItems)) {
          items = NFeItems.map((x: any, index) => {
            const itemInfo = x.prod
            const nome = itemInfo.xProd
            const qtde = itemInfo.qCom
            const grandeza = itemInfo.uCom
            const valor = itemInfo.vUnCom
            const NCMCode = itemInfo.NCM
            console.log(itemInfo.xProd)
            return {
              codigo: index,
              nome: nome,
              qtde: Number(qtde),
              grandeza: grandeza,
              preco: Number(valor),
            }
          })
        } else {
          const itemInfo = NFeItems.prod
          const nome = itemInfo.xProd
          const qtde = itemInfo.qCom
          const grandeza = itemInfo.uCom
          const valor = itemInfo.vUnCom
          const NCMCode = itemInfo.NCM
          items = [{ codigo: NCMCode || 1, nome: nome, qtde: Number(qtde), grandeza: grandeza, preco: Number(valor) }]
        }

        resolve(items)
      } catch (error) {
        reject(error)
      }
    }

    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

function MaterialsInput() {
  const { data: session, status } = useSession({ required: true })
  const { data: logs, isLoading, isError, isSuccess } = useMaterialLogsByType({ type: 'ENTRADA' })
  const { data: materials } = useMaterials()
  const [fileHolder, setFileHolder] = useState<File | null>(null)
  const [itemsHolder, setItemsHolder] = useState<InputMaterialItem[]>([])
  async function handleDataExtraction(file: File | null) {
    if (!file) return toast.error('Nenhum arquivo vinculado.')
    const items = await readXML(file)
    setItemsHolder(items)
  }
  console.log(itemsHolder)
  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex grow flex-col p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">ENTRADA DE MATERIAIS</p>
          </div>
        </div>
      </div>
      <div className="flex max-h-[300px] min-h-[200px] w-full flex-col rounded border border-gray-500">
        <h1 className="w-full rounded-bl rounded-br bg-gray-500 p-1 text-center font-bold text-white">ÚLTIMAS ENTRADAS</h1>
        <div className="flex w-full grow flex-wrap items-start justify-around gap-2 overflow-y-auto overscroll-y-auto p-3 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorComponent msg={'Erro ao buscar registros de alteração.'} /> : null}
          {isSuccess ? logs.map((log) => <UpdateRegistriesCard key={log._id} registry={log} showMaterialName={true} />) : null}
        </div>
      </div>
      <h1 className="my-2 w-full text-start font-bold tracking-tighter">IDENTIFICAÇÃO DE MATERIAIS DA NOTA FISCAL</h1>
      <div className="relative flex w-full items-center justify-center">
        <label
          htmlFor="dropzone-file"
          className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5 text-gray-800">
            <BiSolidCloudDownload color={'rgb(31,41,55)'} size={50} />

            {renderInputText(fileHolder)}
          </div>
          <input
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null
              setFileHolder(file)
            }}
            id="dropzone-file"
            type="file"
            className="absolute h-full w-full opacity-0"
            accept=".xml"
          />
        </label>
      </div>
      <div className="my-2 flex w-full items-center justify-end">
        <button
          onClick={() => handleDataExtraction(fileHolder)}
          className="rounded bg-gray-800 py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-900"
        >
          IDENTIFICAR
        </button>
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        {itemsHolder.length > 0 ? (
          itemsHolder.map((item, index) => (
            <InputMaterialCard
              key={item.codigo}
              inputMaterial={item}
              materials={materials || []}
              clearMaterialHolder={() => {
                const currentItems = [...itemsHolder]
                currentItems.splice(index, 1)
                setItemsHolder(currentItems)
              }}
            />
          ))
        ) : (
          <p className="text-center text-sm italic text-gray-500">Sem itens identificados...</p>
        )}
      </div>
    </div>
  )
}

export default MaterialsInput
