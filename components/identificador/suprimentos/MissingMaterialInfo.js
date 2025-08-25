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
    <div className="flex h-full max-h-[300px] min-h-[300px] w-full flex-col rounded-lg border border-cyan-500 p-3">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-center font-sans font-bold text-[#353432]">MATERIAL FALTANTE</h1>
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
        {getMissingMaterialAsList(infoHolder.material?.materialFaltante).length > 0 ? (
          getMissingMaterialAsList(infoHolder.material?.materialFaltante).map((equip, index) => (
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
            <p className="text-primary/60 text-center text-sm italic">Nenhum material adicionado a lista...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectMissingMaterialInfo
