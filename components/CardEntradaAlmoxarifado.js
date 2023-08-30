import React, { useState } from 'react'
import { useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'

import { FaBox, FaLongArrowAltRight } from 'react-icons/fa'
import { ImPriceTag } from 'react-icons/im'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

import { formatToMoney, units } from '../utils/constants'
import { addMaterial, handleMaterialEntrance } from '../utils/methods/mutation/materials'
import { getErrorMessage } from '../utils/methods/handlers'
import SelectFoatingInput from './SelectFloatingInput'
import SelectInput from './inputs/Select'
import NumberFloatingInput from './NumberFloatingInput'

function CardEntradaAlmoxarifado({ item, index, items, setItems, materials }) {
  const queryClient = useQueryClient()
  const [wareHouseMaterial, setWareHouseMaterial] = useState({
    id: null,
    nome: '',
    preco: 0,
    qtde: 0,
    grandeza: '',
  })
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  function getNewPrice({ warehouseQty, warehousePrice, entranceQty, entrancePrice }) {
    // Doing weighted average
    const newPrice = (warehouseQty * warehousePrice + entranceQty * entrancePrice) / (warehouseQty + entranceQty)
    return Number(newPrice.toFixed(2))
  }
  async function handleUpdate() {
    try {
      // Request update in API endpoint
      const response = await handleMaterialEntrance({
        materialId: wareHouseMaterial.id,
        newPrice: getNewPrice({
          warehouseQty: wareHouseMaterial.qtde,
          warehousePrice: wareHouseMaterial.preco,
          entranceQty: Number(item.qtde),
          entrancePrice: Number(item.preco),
        }),
        diff: Number(item.qtde),
      })
      toast.success(response)
      // Cleaning items arr for better update flow
      var itemsArr = [...items]
      itemsArr.splice(index, 1)
      setItems((prev) => itemsArr)
      setMenuIsOpen(false)
      await queryClient.invalidateQueries({ queryKey: ['materials'] })
    } catch (error) {
      const msg = getErrorMessage(error)
      console.log(msg)
      toast.error(msg)
    }
  }
  async function handleAddMaterial() {
    try {
      const response = await addMaterial(item)
      toast.success(response)
      // Cleaning items arr for better update flow
      var itemsArr = [...items]
      itemsArr.splice(index, 1)
      setItems((prev) => itemsArr)
      setMenuIsOpen(false)
      await queryClient.invalidateQueries({ queryKey: ['materials'] })
    } catch (error) {
      const msg = getErrorMessage(error)
      console.log(msg)
      toast.error(msg)
    }
  }
  return (
    <div className="w-full p-2 rounded border border-200 flex flex-col gap-2">
      <h1 className="w-full text-center text-[#15599a] font-bold">{item.nome}</h1>
      <div className="w-full flex items-center gap-2">
        <div className="flex items-center justify-start gap-2 w-1/3">
          <FaBox color="#fead41" />
          <p className="text-xs text-gray-700 text-center">
            {item.qtde
              ? Number(item.qtde).toLocaleString('pt-br', {
                  maximumFractionDigits: 2,
                })
              : '-'}{' '}
            {item.grandeza}
          </p>
        </div>
        {menuIsOpen ? (
          <div onClick={() => setMenuIsOpen(false)} className="text-gray-600 hover:text-blue-400 cursor-pointer flex justify-center w-1/3">
            <IoMdArrowDropupCircle />
          </div>
        ) : (
          <div onClick={() => setMenuIsOpen(true)} className="text-gray-600 hover:text-blue-400 cursor-pointer flex justify-center w-1/3">
            <IoMdArrowDropdownCircle />
          </div>
        )}

        <div className="flex items-center justify-end gap-2 w-1/3">
          <ImPriceTag color={'#15599a'} />
          <p className="text-xs text-gray-700 text-center">{item.preco ? `R$${item.preco.toFixed(2).replace('.', ',')}` : '-'}</p>
        </div>
      </div>
      {menuIsOpen ? (
        <div className="w-full flex flex-col gap-1">
          <h1 className="text-center text-[#fead41] font-bold text-sm mb-2">AJUSTES</h1>
          <NumberFloatingInput
            label={'QUANTIDADE DE ENTRADA'}
            editable={true}
            value={item.qtde}
            handleChange={(value) => {
              var currentItemsArr = [...items]
              currentItemsArr[index].qtde = Number(value)
              console.log('ITEMS', currentItemsArr)
              setItems((prev) => currentItemsArr)
            }}
            width={'100%'}
          />
          <NumberFloatingInput
            label={'PREÇO DE ENTRADA'}
            editable={true}
            value={item.preco}
            handleChange={(value) => {
              var currentItemsArr = [...items]
              currentItemsArr[index].preco = Number(value)
              console.log('ITEMS', currentItemsArr)
              setItems((prev) => currentItemsArr)
            }}
            width={'100%'}
          />
          <SelectFoatingInput
            label={'GRANDEZA'}
            editable={true}
            value={item.grandeza}
            options={units}
            handleChange={(value) => {
              var currentItemsArr = [...items]
              currentItemsArr[index].grandeza = value
              console.log('ITEMS', currentItemsArr)
              setItems((prev) => currentItemsArr)
            }}
            width={'100%'}
          />
          <div className="flex flex-col"></div>
          <h1 className="text-center text-[#fead41] font-bold text-sm">VINCULE UM ITEM DO ESTOQUE</h1>
          <SelectInput
            label={'ITEM DO ESTOQUE'}
            value={wareHouseMaterial.id}
            options={materials.map((mat, index) => ({
              id: index,
              label: mat.nome,
              value: mat._id,
            }))}
            selectedItemLabel={'NÃO DEFINIDO'}
            handleChange={(value) => {
              const equivalent = materials.find((x) => x._id == value)
              setWareHouseMaterial((prev) => ({
                ...prev,
                id: equivalent._id,
                nome: equivalent.nome,
                preco: equivalent.preco,
                qtde: equivalent.qtde,
                grandeza: equivalent.grandeza,
              }))
            }}
            onReset={() =>
              setWareHouseMaterial({
                id: null,
                nome: '',
                preco: 0,
                qtde: 0,
                grandeza: '',
              })
            }
            width={'100%'}
          />
          {wareHouseMaterial.id ? (
            <div className="flex flex-col w-full">
              <h1 className="text-center text-green-500 font-bold">ALTERAÇÕES</h1>
              <div className="w-full flex justify-center items-center gap-2">
                <p className="font-bold">{formatToMoney(wareHouseMaterial.preco)}</p>
                <FaLongArrowAltRight color="blue" />
                <p className="font-bold">
                  {formatToMoney(
                    getNewPrice({
                      warehouseQty: wareHouseMaterial.qtde,
                      warehousePrice: wareHouseMaterial.preco,
                      entranceQty: Number(item.qtde),
                      entrancePrice: Number(item.preco),
                    })
                  )}
                </p>
              </div>
              <div className="w-full flex justify-center items-center gap-2">
                <p className="font-bold">
                  {wareHouseMaterial.qtde} {wareHouseMaterial.grandeza}
                </p>
                <FaLongArrowAltRight color="blue" />
                <p className="font-bold">
                  {wareHouseMaterial.qtde + Number(item.qtde)}
                  {item.grandeza}
                </p>
              </div>
              <button
                onClick={() => handleUpdate()}
                className="w-fit self-end p-1 rounded border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              >
                ATUALIZAR ITEM
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-end mt-2">
              <button
                onClick={() => handleAddMaterial()}
                className="w-fit p-1 rounded border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              >
                CRIAR NOVO ITEM
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default CardEntradaAlmoxarifado
