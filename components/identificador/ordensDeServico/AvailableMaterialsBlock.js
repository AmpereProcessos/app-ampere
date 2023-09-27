import React, { useState } from 'react'
import { BsSuitDiamondFill } from 'react-icons/bs'
import { VscChromeClose } from 'react-icons/vsc'
import TextInput from '../../inputs/Text'
import NumberInput from '../../inputs/Number'
import { MdOutlineAddCircle } from 'react-icons/md'
import { IoIosAdd } from 'react-icons/io'
import toast from 'react-hot-toast'
import { AiFillDelete } from 'react-icons/ai'

function AvailableMaterialsBlock({ osInfo, setOsInfo, useKitInformation }) {
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
    const currentMaterials = osInfo.equipamentos.disponivel ? [...osInfo.equipamentos.disponivel] : []
    currentMaterials.push({ qtde: equipmentHolder.qtde, descricao: equipmentHolder.descricao })
    return setOsInfo((prev) => ({ ...prev, equipamentos: { ...prev.equipamentos, disponivel: currentMaterials } }))
  }
  function removeMaterial(index) {
    const currentMaterials = [...osInfo.equipamentos.disponivel]
    currentMaterials.splice(index, 1)
    return setOsInfo((prev) => ({ ...prev, equipamentos: { ...prev.equipamentos, disponivel: currentMaterials } }))
  }
  return (
    <div className="w-full flex flex-col border border-cyan-500 p-3 rounded-lg h-full min-h-[300px] max-h-[300px]">
      <div className="w-full flex items-center justify-between">
        <h1 className="font-sans font-bold  text-[#353432] text-center">MATERIAIS DISPONÍVEIS</h1>
        {addMenuIsOpen ? (
          <button
            onClick={() => setAddMenuIsOpen(false)}
            type="button"
            className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
          >
            <VscChromeClose style={{ color: 'red' }} />
          </button>
        ) : (
          <button onClick={() => setAddMenuIsOpen(true)} className="flex items-center justify-center text-green-500 ">
            <MdOutlineAddCircle style={{ fontSize: '25px' }} />
          </button>
        )}
      </div>
      <button
        onClick={useKitInformation}
        className="text-xs self-center w-fit text-gray-500 font-medium rounded p-1 hover:bg-blue-50 hover:text-cyan-500  duration-300 ease-in-out"
      >
        USAR MATERIAIS DO KIT
      </button>
      {addMenuIsOpen ? (
        <div className="w-full flex items-center gap-1">
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
          <div className="w-[10%] flex items-center justify-center">
            <button onClick={() => addMaterial()} className="flex items-center justify-center text-green-500">
              <IoIosAdd />
            </button>
          </div>
        </div>
      ) : null}
      <div className="mt-2 px-2 flex flex-col grow w-full overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {osInfo.equipamentos.disponivel && osInfo.equipamentos.disponivel.length > 0 ? (
          osInfo.equipamentos.disponivel.map((equip, index) => (
            <div key={index} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <BsSuitDiamondFill />
                <p className="text-xs text-gray-500 tracking-tight">
                  {equip.qtde ? `${equip.qtde}x ` : ''}
                  {equip.descricao}
                </p>
              </div>
              <button onClick={() => removeMaterial(index)} className="flex items-center text-red-300 hover:text-red-500 justify-center text-sm">
                <AiFillDelete />
              </button>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center grow">
            <p className="text-sm italic text-gray-500 text-center">Nenhum material na lista de disponíveis....</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AvailableMaterialsBlock
