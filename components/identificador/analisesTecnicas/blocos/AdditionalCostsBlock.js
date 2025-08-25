import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../../../utils/methods/handlers'
import TextInput from '../../../inputs/Text'
import { AiFillDelete, AiFillEdit, AiOutlineSearch } from 'react-icons/ai'
import SelectInput from '../../../inputs/Select'
import { additionalCostsCategories, units } from '../../../../utils/select-options'
import NumberInput from '../../../inputs/Number'
import { IoMdAdd } from 'react-icons/io'
import { FaBox, FaSave } from 'react-icons/fa'
import { ImPriceTag } from 'react-icons/im'

import { formatToMoney } from '../../../../utils/constants'

function AdditionalCostsBlock({ infoHolder, setInfoHolder, changes, setChanges }) {
  // Warehouse materials
  const [warehouseSearchText, setWarehouseSearchText] = useState('')
  const [warehouseMaterials, setWarehouseMaterials] = useState()
  function setWarehouseItemAsHolder(material) {
    setCostHolder((prev) => ({
      ...prev,
      description: material.nome,
      unitaryCost: material.preco,
      unit: material.grandeza,
    }))
  }
  async function fetchWarehouseMaterialsBySearch(searchText) {
    const searchTooShort = searchText.trim().length < 3
    if (searchTooShort) {
      toast.error('Faça uma pesquisa de ao menos 3 letras.')
      return
    }
    const loadingToastId = toast.loading('Buscando items...')
    try {
      const { data } = await axios.get(`/api/almoxarifado/pesquisarMateriais?search=${searchText}`)
      toast.dismiss(loadingToastId)
      toast.success('Busca realizada com sucesso !')
      if (data) setWarehouseMaterials(data)
      else return
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      toast.error(msg)
    }
  }
  // Costs holder
  const [activeCostIndex, setActiveCostIndex] = useState(undefined)
  const [costHolder, setCostHolder] = useState({
    category: 'INSTALAÇÃO',
    description: '',
    unit: null,
    qty: null,
    unitaryCost: null,
  })
  function addCost() {
    if (!costHolder.category) {
      toast.error('Preencha uma categoria de custo.')
      return
    }
    if (costHolder.description.trim().length < 3) {
      toast.error('Preencha um nome/descrição válida ao custo.')
      return
    }
    if (!costHolder.unit) {
      toast.error('Preencha a grandeza do custo.')
      return
    }
    if (costHolder.qty <= 0) {
      toast.error('Preencha uma quantidade válida para o item de custo.')
      return
    }
    if (costHolder.unitaryCost <= 0) {
      toast.error('Preencha o custo unitário do item de custo.')
      return
    }
    const costsList = infoHolder.custos ? [...infoHolder.custos] : []
    const newCost = {
      categoria: costHolder.category,
      descricao: costHolder.description,
      grandeza: costHolder.unit,
      qtde: costHolder.qty,
      custoUnitario: costHolder.unitaryCost,
      total: costHolder.qty * costHolder.unitaryCost,
    }
    costsList.push(newCost)
    setInfoHolder((prev) => ({ ...prev, custos: costsList }))
    setChanges((prev) => ({ ...prev, custos: costsList }))
    setCostHolder({
      category: 'INSTALAÇÃO',
      description: '',
      unit: null,
      qty: null,
      unitaryCost: null,
    })
    toast.success('Item adicionado aos custos com sucesso !')
  }
  function removeCost(index) {
    const costsList = [...infoHolder.custos]
    costsList.splice(index, 1)
    setInfoHolder((prev) => ({ ...prev, custos: costsList }))
    setChanges((prev) => ({ ...prev, custos: costsList }))

    toast.success('Custo removido!')
  }
  function saveChanges({ index }) {
    const costsList = [...infoHolder.custos]
    const cost = {
      //
      categoria: costHolder.category,
      descricao: costHolder.description,
      grandeza: costHolder.unit,
      qtde: costHolder.qty,
      custoUnitario: costHolder.unitaryCost,
      total: costHolder.qty * costHolder.unitaryCost,
    }
    costsList[index] = cost
    setInfoHolder((prev) => ({ ...prev, custos: costsList }))
    setChanges((prev) => ({ ...prev, custos: costsList }))
    setCostHolder({
      category: 'INSTALAÇÃO',
      description: '',
      unit: null,
      qty: null,
      unitaryCost: null,
    })
    toast.success('Custo atualizado!')
    setActiveCostIndex(undefined)
  }
  return (
    <div className="flex w-full flex-col">
      <div className="bg-primary/80 flex w-full items-center justify-center gap-2 rounded-md p-2">
        <h1 className="font-bold text-white">CUSTOS ADICIONAIS</h1>
      </div>
      <div className="mt-2 flex w-full flex-col gap-2">
        <div className="flex w-full flex-col items-end justify-center gap-2 lg:flex-row">
          <div className="w-full lg:w-[350px]">
            <TextInput
              label={'BUSCA DE MATERIAIS'}
              placeholder={'Busque materiais no estoque...'}
              value={warehouseSearchText}
              handleChange={(value) => setWarehouseSearchText(value)}
              width={'100%'}
            />
          </div>
          <button
            onClick={() => fetchWarehouseMaterialsBySearch(warehouseSearchText)}
            className="h-[47px] rounded border border-[#fead41] p-3 text-[#fead41] duration-300 ease-in-out hover:bg-[#fead41] hover:text-black"
          >
            <AiOutlineSearch />
          </button>
        </div>
        <div className="overscroll-y scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-primary/20 my-4 flex max-h-[450px] w-full flex-wrap justify-around gap-2 overflow-y-auto">
          {warehouseMaterials ? (
            warehouseMaterials.length > 0 ? (
              warehouseMaterials.map((mat, index) => (
                <div key={index} className="border-primary/20 flex w-[350px] flex-col gap-3 rounded-md border p-3">
                  <h1 className="w-full text-center text-sm leading-none font-bold tracking-tight lg:text-start">{mat.nome}</h1>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaBox color="#fead41" />
                      <p className="text-primary/60 text-sm font-medium">{mat.qtde}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ImPriceTag color="rgb(34,197,94)" />
                      <p className="text-primary/60 text-sm font-medium">{formatToMoney(mat.preco)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setWarehouseItemAsHolder(mat)}
                    className="self-center rounded border-green-500 p-1 font-medium text-green-500 duration-300 ease-in-out hover:bg-green-500 hover:text-white"
                  >
                    ADICIONAR
                  </button>
                </div>
              ))
            ) : (
              <p className="text-primary/60 w-full text-center italic">Nenhum material foi encontrado...</p>
            )
          ) : null}
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <SelectInput
              label={'CATEGORIA DO CUSTO'}
              selectedItemLabel={'NÃO DEFINIDO'}
              options={additionalCostsCategories}
              value={costHolder.category}
              handleChange={(value) => setCostHolder((prev) => ({ ...prev, category: value }))}
              onReset={() => setCostHolder((prev) => ({ ...prev, category: null }))}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label={'DESCRIÇÃO DO CUSTO'}
              placeholder={'Preencha o nome ou descreva o custo...'}
              value={costHolder.description}
              handleChange={(value) => setCostHolder((prev) => ({ ...prev, description: value }))}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <SelectInput
              label={'GRANDEZA DO CUSTO'}
              selectedItemLabel={'NÃO DEFINIDO'}
              options={units}
              value={costHolder.unit}
              handleChange={(value) => setCostHolder((prev) => ({ ...prev, unit: value }))}
              onReset={() => setCostHolder((prev) => ({ ...prev, unit: null }))}
              width={'100%'}
            />
          </div>
        </div>
        <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <NumberInput
              label={'QUANTIDADE'}
              placeholder={'Preencha a quantidade o item de custo...'}
              value={costHolder.qty}
              handleChange={(value) => setCostHolder((prev) => ({ ...prev, qty: value }))}
              min={0}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <NumberInput
              label={'PREÇO UNITÁRIO'}
              placeholder={'Preencha a preço unitário do item de custo...'}
              value={costHolder.unitaryCost}
              handleChange={(value) => setCostHolder((prev) => ({ ...prev, unitaryCost: value }))}
              min={0}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <NumberInput
              label={'TOTAL'}
              editable={false}
              placeholder={'Valor total do item de custo...'}
              value={costHolder.qty && costHolder.unitaryCost ? costHolder.qty * costHolder.unitaryCost : null}
              handleChange={(value) => console.log('NO')}
              min={0}
              width={'100%'}
            />
          </div>
        </div>
        <div className="mt-4 flex w-full items-center justify-end">
          {activeCostIndex >= 0 ? (
            <button
              onClick={() => saveChanges({ index: activeCostIndex })}
              className="flex w-fit items-center gap-2 rounded border border-blue-500 p-1 text-blue-500 duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
            >
              <p className="font-bold">SALVAR</p>
              <FaSave />
            </button>
          ) : (
            <button
              onClick={() => addCost()}
              className="flex w-fit items-center gap-2 rounded border border-green-500 p-1 text-green-500 duration-300 ease-in-out hover:bg-green-500 hover:text-white"
            >
              <p className="font-bold">ADICIONAR ITEM</p>
              <IoMdAdd />
            </button>
          )}
        </div>
        {infoHolder.custos?.length > 0 ? (
          <div className="mt-2 flex w-full flex-col gap-2">
            {infoHolder.custos.map((cost, index) => (
              <div key={index} className="border-primary/20 flex w-full flex-col rounded-md border p-3">
                <div className="flex w-full justify-between">
                  <h1 className="text-start leading-none font-bold tracking-tight">{cost.categoria}</h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const holder = {
                          category: cost.categoria,
                          description: cost.descricao,
                          unit: cost.grandeza,
                          qty: cost.qtde,
                          unitaryCost: cost.custoUnitario,
                        }
                        setActiveCostIndex(index)
                        setCostHolder(holder)
                      }}
                      className="text-red-400 duration-300 ease-in-out hover:text-red-500"
                    >
                      <AiFillEdit />
                    </button>
                    <button onClick={() => removeCost(index)} className="text-red-400 duration-300 ease-in-out hover:text-red-500">
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
                <p className="text-primary/60 text-sm">{cost.descricao}</p>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <FaBox color="#fead41" />
                      <p className="text-primary/60 text-sm font-medium">
                        {cost.qtde} {cost.grandeza}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-green-500">
                      <ImPriceTag color="rgb(34,197,94)" />
                      <p className="text-primary/60 text-sm font-medium">
                        {cost.custoUnitario ? formatToMoney(cost.custoUnitario) : 'R$ 0,00'} / {cost.grandeza}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <MdAttachMoney /> */}
                    <p className="text-lg font-black">{formatToMoney(cost.total)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default AdditionalCostsBlock
