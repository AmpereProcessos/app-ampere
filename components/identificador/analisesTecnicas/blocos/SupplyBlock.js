import React, { useState } from 'react'
import toast from 'react-hot-toast'

import { supplyOptions } from '../../../../utils/select-options'

import NumberInput from '../../../inputs/Number'
import TextInput from '../../../inputs/Text'
import SelectInput from '../../../inputs/Select'

import { MdDelete } from 'react-icons/md'
import { TbRulerMeasure } from 'react-icons/tb'

function SupplyBlock({ infoHolder, setInfoHolder, changes, setChanges }) {
  const firstOption = Object.keys(supplyOptions)[0]
  const [supplyHolder, setSupplyHolder] = useState({
    descricao: firstOption,
    qtde: 0,
    grandeza: supplyOptions[firstOption].grandeza,
    tipo: supplyOptions[firstOption].tipos[0],
  })
  function addSupplyItem() {
    const itemsList = infoHolder.suprimentos?.itens ? [...infoHolder.suprimentos?.itens] : []
    itemsList.push(supplyHolder)
    setInfoHolder((prev) => ({
      ...prev,
      suprimentos: prev.suprimentos ? { ...prev.suprimentos, itens: itemsList } : { observacoes: '', itens: itemsList },
    }))
    setChanges((prev) => ({ ...prev, 'suprimentos.itens': itemsList }))
    // setSupplyHolder({
    //   descricao: firstOption,
    //   qtde: 0,
    //   grandeza: supplyOptions[firstOption].grandeza,
    //   tipo: supplyOptions[firstOption].tipos[0],
    // })

    return toast.success('Item adicionado com sucesso.')
  }
  function removeSupplyItem(index) {
    const itemsList = infoHolder.suprimentos?.itens ? [...infoHolder.suprimentos?.itens] : []
    itemsList.splice(index, 1)
    setInfoHolder((prev) => ({
      ...prev,
      suprimentos: prev.suprimentos ? { ...prev.suprimentos, itens: itemsList } : { observacoes: '', itens: itemsList },
    }))
    setChanges((prev) => ({ ...prev, 'suprimentos.itens': itemsList }))
    return toast.success('Item removido com sucesso.')
  }
  console.log('SUPPLY HOLDER', supplyHolder)
  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2">
        <h1 className="font-bold text-white">SUPRIMENTOS</h1>
      </div>
      <div className="mt-2 flex w-full flex-col gap-2">
        <div className="w-full flex flex-col">
          <h1 className="w-full p-1 bg-gray-500 text-white font-bold text-center rounded-tr-sm rounded-tl-sm">OBSERVAÇÕES</h1>
          <textarea
            placeholder="SEM OBSERVAÇÕES PREENCHIDAS..."
            value={infoHolder.suprimentos?.observacoes || ''}
            onChange={(e) => {
              setInfoHolder((prev) => ({
                ...prev,
                suprimentos: prev.suprimentos ? { ...prev.suprimentos, observacoes: e.target.value } : { observacoes: e.target.value, itens: [] },
              }))
              setChanges((prev) => ({ ...prev, 'suprimentos.observacoes': e.target.value }))
            }}
            className="min-h-[80px] w-full resize-none rounded-bl-sm rounded-br-sm bg-gray-100 p-3 text-center text-xs font-medium text-gray-600 outline-none"
          />
        </div>

        <div className="flex w-full flex-col gap-2 lg:flex-row">
          <div className="w-full lg:w-1/4">
            <SelectInput
              label="DESCRIÇÃO"
              options={Object.keys(supplyOptions).map((option, index) => ({ id: index + 1, label: option, value: option }))}
              value={supplyHolder.descricao}
              handleChange={(value) => setSupplyHolder((prev) => ({ ...prev, descricao: value }))}
              onReset={() => setSupplyHolder((prev) => ({ ...prev, descricao: firstOption }))}
              selectedItemLabel="NÃO DEFINIDO"
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/4">
            <NumberInput
              label="QUANTIDADE"
              placeholder="Preencha aqui a quantidade de itens..."
              value={supplyHolder.qtde}
              handleChange={(value) => setSupplyHolder((prev) => ({ ...prev, qtde: value }))}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/4">
            <SelectInput
              label="TIPO"
              options={supplyOptions[supplyHolder.descricao || firstOption].tipos.map((option, index) => ({
                id: index + 1,
                label: option,
                value: option,
              }))}
              value={supplyHolder.tipo}
              handleChange={(value) => setSupplyHolder((prev) => ({ ...prev, tipo: value }))}
              onReset={() => setSupplyHolder((prev) => ({ ...prev, tipo: supplyOptions[firstOption].tipos[0] }))}
              selectedItemLabel="NÃO DEFINIDO"
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/4">
            <TextInput
              label="GRANDEZA"
              placeholder="Preencha a grandeza do item..."
              editable={false}
              value={supplyOptions[supplyHolder.descricao].grandeza}
              handleChange={(value) => setSupplyHolder((prev) => ({ ...prev, grandeza: value }))}
              width={'100%'}
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-end mt-2">
          <button
            onClick={addSupplyItem}
            className="rounded border border-green-500 p-1 font-bold text-green-500 duration-300 ease-in-out hover:bg-green-500 hover:text-white"
          >
            ADICIONAR ITEM
          </button>
        </div>
        <div className="flex w-full flex-wrap items-center justify-around gap-2">
          {infoHolder.suprimentos?.itens?.map((item, index) => (
            <div key={index} className="flex w-full  items-center justify-between lg:w-[350px] border border-cyan-500 p-2 rounded-md shadow-sm">
              <div className="flex flex-col">
                <h1 className="text-sm font-medium text-gray-500">
                  <strong>{item.qtde}</strong> x {item.descricao} <strong className="text-[#fead41]">({item.tipo})</strong>
                </h1>
                <div className="flex items-center gap-1">
                  <TbRulerMeasure />
                  <p className="text-xs italic text-gray-500">{item.grandeza}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => removeSupplyItem(index)}
                  className="w-fit cursor-pointer text-[20px] text-red-500 opacity-40 duration-300 ease-in hover:scale-110 hover:text-red-500 hover:opacity-100"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          )) || <p className="w-full font-medium text-center text-xs italic text-gray-500">Nenhum item adicionado.</p>}
        </div>
      </div>
    </div>
  )
}

export default SupplyBlock
