import React, { useState } from 'react'

import TextInput from '../../../inputs/Text'
import { MdDelete, MdTopic } from 'react-icons/md'
import toast from 'react-hot-toast'

function DescriptiveBlock({ infoHolder, setInfoHolder, changes, setChanges }) {
  const [descriptiveHolder, setDescriptiveHolder] = useState({
    topico: '',
    descricao: '',
  })
  function addDescriptiveItem() {
    if (descriptiveHolder.topico.trim().length < 2) return toast.error('Preencha um tópico de ao menos 2 caracteres.')
    if (descriptiveHolder.descricao.trim().length < 3) return toast.error('Preencha um tópico de ao menos 3 caracteres.')
    const itemsList = infoHolder.descritivo ? [...infoHolder.descritivo] : []
    itemsList.push(descriptiveHolder)
    setInfoHolder((prev) => ({ ...prev, descritivo: itemsList }))
    setChanges((prev) => ({ ...prev, descritivo: itemsList }))
    setDescriptiveHolder({
      topico: '',
      descricao: '',
    })
    return toast.success('Item adicionado com sucesso !')
  }
  function removeDescriptiveItem(index) {
    const itemsList = infoHolder.descritivo ? [...infoHolder.descritivo] : []
    itemsList.splice(index, 1)
    setInfoHolder((prev) => ({ ...prev, descritivo: itemsList }))
    setChanges((prev) => ({ ...prev, descritivo: itemsList }))
    return toast.success('Item removido com sucesso !')
  }

  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2">
        <h1 className="font-bold text-white">DESCRITIVO</h1>
      </div>
      <div className="mt-2 flex w-full flex-col gap-2">
        <div className="w-full lg:w-[500px] self-center">
          <TextInput
            label="TÓPICO"
            placeholder="Preencha o tópico do item de descritivo..."
            value={descriptiveHolder.topico}
            handleChange={(value) => setDescriptiveHolder((prev) => ({ ...prev, topico: value }))}
            width="100%"
          />
        </div>
        <div className="w-full ">
          <TextInput
            label="DESCRIÇÃO"
            placeholder="Preencha o descrição do item de descritivo..."
            value={descriptiveHolder.descricao}
            handleChange={(value) => setDescriptiveHolder((prev) => ({ ...prev, descricao: value }))}
            width="100%"
          />
        </div>
        <div className="flex w-full items-center justify-end mb-2">
          <button
            onClick={addDescriptiveItem}
            className="rounded border border-green-500 p-1 font-bold text-green-500 duration-300 ease-in-out hover:bg-green-500 hover:text-white"
          >
            ADICIONAR ITEM
          </button>
        </div>
      </div>
      {infoHolder.descritivo?.length > 0 ? (
        infoHolder.descritivo.map((item, index) => (
          <div key={index} className="flex w-full flex-col p-2 border border-gray-300 rounded shadow-sm mb-1">
            <div className="flex w-full items-center justify-between">
              <div className="w-full flex items-center justify-center gap-2">
                <MdTopic />
                <h1 className=" leading-none tracking-tight font-bold text-[#15599a] text-lg">{item.topico}</h1>
              </div>
              <button
                onClick={() => removeDescriptiveItem(index)}
                className="w-fit cursor-pointer text-[20px] text-red-500 opacity-40 duration-300 ease-in hover:scale-110 hover:text-red-500 hover:opacity-100"
              >
                <MdDelete />
              </button>
            </div>

            <p className="w-full text-center text-sm text-gray-500 mt-1">{item.descricao}</p>
          </div>
        ))
      ) : (
        <p className="w-full py-1 text-center font-medium italic text-gray-500 text-xs">Nenhum item adicionado...</p>
      )}
    </div>
  )
}

export default DescriptiveBlock
