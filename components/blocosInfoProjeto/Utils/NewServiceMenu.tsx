import NumberInput from '@/components/inputs/Number'
import TextInput from '@/components/inputs/Text'
import TextareaInput from '@/components/inputs/TextareaInput'
import { TServiceItem } from '@/utils/schemas/crm/kits.schema'
import { TProjectDTO } from '@/utils/schemas/projects'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineSafety } from 'react-icons/ai'
import { MdDelete, MdOutlineMiscellaneousServices } from 'react-icons/md'
import { VscChromeClose } from 'react-icons/vsc'

type NewServiceMenuProps = {
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  closeMenu: () => void
}
function NewServiceMenu({ infoHolder, setInfo, changes, setChanges, closeMenu }: NewServiceMenuProps) {
  const [serviceHolder, setServiceHolder] = useState<TServiceItem>({
    descricao: '',
    observacoes: '',
    garantia: 0,
  })

  function addServiceToKit() {
    if (serviceHolder.descricao.trim().length < 2) return toast.error('Preencha uma descrição de serviço válida.')
    if (serviceHolder.garantia < 0) return toast.error('Preencha uma garantia válida.')
    var serviceArr = [...(infoHolder.servicos || [])]
    serviceArr.push(serviceHolder)
    setInfo((prev) => ({ ...prev, servicos: serviceArr }))
    setChanges((prev) => ({ ...prev, servicos: serviceArr }))
    setServiceHolder({
      descricao: '',
      observacoes: '',
      garantia: 0,
    })
    return
  }
  function removeServiceFromKit(index: number) {
    const currentServices = [...(infoHolder.servicos || [])]
    currentServices.splice(index, 1)
    setInfo((prev) => ({ ...prev, servicos: currentServices }))
    setChanges((prev) => ({ ...prev, servicos: currentServices }))
  }
  return (
    <div className="my-2 flex w-full flex-col gap-y-2 px-2">
      <div className="flex w-full items-center justify-end">
        <button
          onClick={() => closeMenu()}
          className="flex items-center gap-1 rounded-lg border border-red-500 bg-red-50 px-2 py-1 text-xs text-red-500 duration-300 ease-in-out hover:border-red-700 hover:text-red-700"
        >
          <VscChromeClose />
          <p className="font-medium">FECHAR MENU</p>
        </button>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-3/4">
            <TextInput
              label="DESCRIÇÃO"
              placeholder="Preencha a descrição do serviço..."
              value={serviceHolder.descricao}
              handleChange={(value) => setServiceHolder((prev) => ({ ...prev, descricao: value }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <NumberInput
              label="GARANTIA"
              placeholder="Preencha a garantia do serviço..."
              value={serviceHolder.garantia}
              handleChange={(value) => setServiceHolder((prev) => ({ ...prev, garantia: value }))}
              width="100%"
            />
          </div>
        </div>
        <TextareaInput
          label="OBSERVAÇÕES DO SERVIÇO"
          value={serviceHolder.observacoes}
          handleChange={(value) => setServiceHolder((prev) => ({ ...prev, observacoes: value }))}
          placeholder="Preencha aqui uma descrição acerca do serviço..."
        />

        <div className="flex items-center justify-end">
          <button
            className="rounded bg-black p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out hover:bg-gray-700"
            onClick={() => addServiceToKit()}
          >
            ADICIONAR SERVIÇO
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewServiceMenu
