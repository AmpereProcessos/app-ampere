import React, { useState } from 'react'
import { BsSuitDiamondFill } from 'react-icons/bs'
import { VscChromeClose } from 'react-icons/vsc'
import TextInput from '../../inputs/Text'
import NumberInput from '../../inputs/Number'
import { MdOutlineAddCircle } from 'react-icons/md'
import { IoIosAdd } from 'react-icons/io'
import toast from 'react-hot-toast'
import { AiFillDelete } from 'react-icons/ai'

function TakeMaterialsBlock({ osInfo, setOsInfo, useMissingMaterialInformation }) {
  const [equipmentHolder, setEquipmentHolder] = useState({ qtde: null, descricao: null })
  const [addMenuIsOpen, setAddMenuIsOpen] = useState(false)
  function addMaterial() {
    if (!equipmentHolder.qtde || equipmentHolder.qtde < 0) {
      toast.error('Preencha uma quantidade válida.')
      return
    }
    if (!equipmentHolder.descricao || equipmentHolder.descricao?.trim().length == 0) {
      toast.error('Preencha uma descrição válida.')
    }
    const currentMaterials = osInfo.equipamentos.retirada ? [...osInfo.equipamentos.retirada] : []
    currentMaterials.push({ qtde: equipmentHolder.qtde, descricao: equipmentHolder.descricao })
    return setOsInfo((prev) => ({ ...prev, equipamentos: { ...prev.equipamentos, retirada: currentMaterials } }))
  }
  function removeMaterial(index) {
    const currentMaterials = [...osInfo.equipamentos.retirada]
    currentMaterials.splice(index, 1)
    return setOsInfo((prev) => ({ ...prev, equipamentos: { ...prev.equipamentos, retirada: currentMaterials } }))
  }
  return (
    <div className="flex h-full max-h-[300px] min-h-[300px] w-full flex-col rounded-lg border border-cyan-500 p-3">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-center font-sans font-bold text-[#353432]">MATERIAIS PARA RETIDADA</h1>
        {addMenuIsOpen ? (
          <button
            onClick={() => setAddMenuIsOpen(false)}
            type="button"
            className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
          >
            <VscChromeClose style={{ color: 'red' }} />
          </button>
        ) : (
          <button onClick={() => setAddMenuIsOpen(true)} className="flex items-center justify-center text-green-500">
            <MdOutlineAddCircle style={{ fontSize: '25px' }} />
          </button>
        )}
      </div>
      {useMissingMaterialInformation ? (
        <button
          onClick={useMissingMaterialInformation}
          className="text-primary/60 w-fit self-center rounded p-1 text-xs font-medium duration-300 ease-in-out hover:bg-blue-50 hover:text-cyan-500"
        >
          USAR MATERIAIS FALTANTES
        </button>
      ) : null}

      {addMenuIsOpen ? (
        <div className="flex w-full items-center gap-1">
          <div className="w-[70%]">
            <TextInput
              showLabel={false}
              placeholder={'Descrição do item...'}
              value={equipmentHolder.descricao}
              handleChange={(value) => setEquipmentHolder((prev) => ({ ...prev, descricao: value }))}
              width={'100%'}
            />
          </div>
          <div className="w-[20%]">
            <NumberInput
              showLabel={false}
              placeholder={'Quantidade do item...'}
              value={equipmentHolder.qtde}
              handleChange={(value) => setEquipmentHolder((prev) => ({ ...prev, qtde: value }))}
              width={'100%'}
            />
          </div>
          <div className="flex w-[10%] items-center justify-center">
            <button onClick={() => addMaterial()} className="flex items-center justify-center text-green-500">
              <IoIosAdd />
            </button>
          </div>
        </div>
      ) : null}
      <div className="overscroll-y scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-primary/20 mt-2 flex w-full grow flex-col overflow-y-auto px-2">
        {osInfo.equipamentos.retirada && osInfo.equipamentos.retirada.length > 0 ? (
          osInfo.equipamentos.retirada.map((equip, index) => (
            <div key={index} className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <BsSuitDiamondFill />
                <p className="text-primary/60 text-xs tracking-tight">
                  {equip.qtde ? `${equip.qtde}x ` : ''}
                  {equip.descricao}
                </p>
              </div>
              <button onClick={() => removeMaterial(index)} className="flex items-center justify-center text-sm text-red-300 hover:text-red-500">
                <AiFillDelete />
              </button>
            </div>
          ))
        ) : (
          <div className="flex grow items-center justify-center">
            <p className="text-primary/60 text-center text-sm italic">Nenhum material adicionado para retirada...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TakeMaterialsBlock
