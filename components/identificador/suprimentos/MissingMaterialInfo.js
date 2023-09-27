import React, { useState } from 'react'
import { BsSuitDiamondFill } from 'react-icons/bs'
import { IoIosAdd } from 'react-icons/io'
import NumberInput from '../../inputs/Number'
import TextInput from '../../inputs/Text'
import { AiFillDelete } from 'react-icons/ai'
import toast from 'react-hot-toast'
import { MdOutlineAddCircle } from 'react-icons/md'
import { VscChromeClose } from 'react-icons/vsc'
function getMissingMaterialAsList(str) {
  if (!str) return []
  const spllited = str.split('\n')
  const formattedSpllited = spllited.map((i) => {
    const arr = i.split('-')
    console.log(i, arr)
    var qty = null
    var desc = null
    if (arr.length > 1) {
      qty = Number(arr[0].trim())
      desc = arr[1]
    } else desc = arr[0]
    if (qty || desc)
      return {
        qtde: qty,
        descricao: desc,
      }
  })
  return formattedSpllited.filter((x) => !!x)
}
function ProjectMissingMaterialInfo({ infoHolder, setInfoHolder, setChanges }) {
  const [equipmentHolder, setEquipmentHolder] = useState({ qtde: null, descricao: null })
  const [addMenuIsOpen, setAddMenuIsOpen] = useState(false)
  function addMaterial() {
    if (!equipmentHolder.descricao || equipmentHolder.descricao?.trim().length == 0) {
      toast.error('Preencha uma descrição válida.')
    }
    const equipStr = equipmentHolder.qtde ? `${equipmentHolder.qtde}-${equipmentHolder.descricao}` : `${equipmentHolder.descricao}`
    const newKitInfoStr = infoHolder.material?.materialFaltante ? infoHolder.material.materialFaltante + '\n' + equipStr : equipStr

    setChanges((prev) => ({
      ...prev,
      'material.materialFaltante': newKitInfoStr,
    }))
    setInfoHolder((prev) => ({ ...prev, material: { ...prev.material, materialFaltante: newKitInfoStr } }))
    setEquipmentHolder({ qtde: null, descricao: null })
    return
  }
  function removeMaterial(index) {
    const currentMaterialsList = getMissingMaterialAsList(infoHolder.material?.materialFaltante)
    currentMaterialsList.splice(index, 1)
    const currentMaterialsAsStrArr = currentMaterialsList.map((item) =>
      item.qtde ? `${item.qtde}-${item.descricao}` : `${equipmentHolder.descricao}`
    )
    const newKitInfoStr = currentMaterialsAsStrArr.join('\n')
    setChanges((prev) => ({
      ...prev,
      'material.materialFaltante': newKitInfoStr,
    }))
    setInfoHolder((prev) => ({ ...prev, material: { ...prev.material, materialFaltante: newKitInfoStr } }))
    return
  }
  return (
    <div className="w-full flex flex-col border border-cyan-500 p-3 rounded-lg h-full min-h-[300px] max-h-[300px]">
      <div className="w-full flex items-center justify-between">
        <h1 className="font-sans font-bold  text-[#353432] text-center">MATERIAL FALTANTE</h1>
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
        {getMissingMaterialAsList(infoHolder.material?.materialFaltante).length > 0 ? (
          getMissingMaterialAsList(infoHolder.material?.materialFaltante).map((equip, index) => (
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
            <p className="text-sm italic text-gray-500 text-center">Nenhum material adicionado a lista...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectMissingMaterialInfo
