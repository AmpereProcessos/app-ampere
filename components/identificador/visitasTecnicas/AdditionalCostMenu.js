import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../../utils/methods/handlers'
import TextInput from '../../inputs/Text'
import { AiFillDelete, AiOutlineSearch } from 'react-icons/ai'
import SelectInput from '../../inputs/Select'
import { additionalCostsCategories, units } from '../../../utils/select-options'
import NumberInput from '../../inputs/Number'
import { IoMdAdd } from 'react-icons/io'
import { FaBox } from 'react-icons/fa'
import { ImPriceTag } from 'react-icons/im'
import { LuPencilRuler } from 'react-icons/lu'
import { formatToMoney } from '../../../utils/constants'
import { MdAttachMoney } from 'react-icons/md'
function AdditionalCosts({ info, setInfo }) {
  console.log(info, info.custosAdicionais)
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
    const costsList = info.custosAdicionais ? [...info.custosAdicionais] : []
    const newCost = {
      categoria: costHolder.category,
      descricao: costHolder.description,
      grandeza: costHolder.unit,
      qtde: costHolder.qty,
      custo: costHolder.unitaryCost,
      valor: costHolder.qty * costHolder.unitaryCost,
    }
    costsList.push(newCost)
    setInfo((prev) => ({ ...prev, custosAdicionais: costsList }))
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
    const costsList = [...info.custosAdicionais]
    costsList.splice(index, 1)
    setInfo((prev) => ({ ...prev, custosAdicionais: costsList }))
    toast.success('Custo removido!')
  }
  return (
    <div className="flex flex-col w-full">
      <span className="w-full bg-[#15599a] text-white text-center font-bold py-2 rounded-tr-md rounded-tl-md mb-2">CUSTOS ADICIONAIS</span>
      <div className="flex flex-col w-full px-2">
        <div className="w-full flex flex-col lg:flex-row items-end gap-2 justify-center">
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
            className="p-3 rounded border border-[#fead41] text-[#fead41] hover:bg-[#fead41] hover:text-black duration-300 ease-in-out h-[47px]"
          >
            <AiOutlineSearch />
          </button>
        </div>
        <div className="flex w-full flex-wrap justify-around gap-2 my-4 max-h-[450px] overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {warehouseMaterials ? (
            warehouseMaterials.length > 0 ? (
              warehouseMaterials.map((mat, index) => (
                <div key={index} className="w-[350px] flex flex-col border border-gray-300 rounded-md p-3 gap-3">
                  <h1 className="w-full text-center text-sm font-bold leading-none tracking-tight  lg:text-start">{mat.nome}</h1>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaBox color="#fead41" />
                      <p className="text-sm text-gray-500 font-medium">{mat.qtde}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ImPriceTag color="rgb(34,197,94)" />
                      <p className="text-sm text-gray-500 font-medium">{formatToMoney(mat.preco)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setWarehouseItemAsHolder(mat)}
                    className="p-1 rounded self-center text-green-500 border-green-500 font-medium hover:bg-green-500 hover:text-white duration-300 ease-in-out"
                  >
                    ADICIONAR
                  </button>
                </div>
              ))
            ) : (
              <p className="w-full text-center text-gray-500 italic">Nenhum material foi encontrado...</p>
            )
          ) : null}
        </div>
        <div className="w-full flex flex-col lg:flex-row items-center gap-2">
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
        <div className="w-full flex flex-col lg:flex-row items-center gap-2 mt-2">
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
        <div className="w-full flex items-center justify-end mt-4">
          <button
            onClick={() => addCost()}
            className="flex items-center gap-2 p-1 rounded w-fit border border-green-500 text-green-500 hover:bg-green-500 hover:text-white duration-300 ease-in-out"
          >
            <p className="font-bold">ADICIONAR ITEM</p>
            <IoMdAdd />
          </button>
        </div>
        {info.custosAdicionais?.length > 0 ? (
          <div className="w-full flex flex-col gap-2 mt-2">
            {info.custosAdicionais.map((cost, index) => (
              <div key={index} className="p-3 rounded-md w-full flex flex-col border border-gray-300">
                <div className="w-full flex justify-between">
                  <h1 className="font-bold leading-none tracking-tight text-start">{cost.categoria}</h1>
                  <button onClick={() => removeCost(index)} className="text-red-400 hover:text-red-500 duration-300 ease-in-out">
                    <AiFillDelete />
                  </button>
                </div>
                <p className="text-sm text-gray-500">{cost.descricao}</p>
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <FaBox color="#fead41" />
                      <p className="text-sm text-gray-500 font-medium">
                        {cost.qtde} / {cost.grandeza}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-green-500">
                      <ImPriceTag color="rgb(34,197,94)" />
                      <p className="text-sm text-gray-500 font-medium">
                        {cost.custo ? formatToMoney(cost.custo) : 'R$ 0,00'} / {cost.grandeza}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <MdAttachMoney /> */}
                    <p className="text-lg font-black">{formatToMoney(cost.valor)}</p>
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

export default AdditionalCosts
