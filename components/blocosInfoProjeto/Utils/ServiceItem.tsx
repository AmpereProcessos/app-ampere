import { TServiceItem } from '@/utils/schemas/crm/kits.schema'
import React from 'react'
import { AiOutlineSafety } from 'react-icons/ai'
import { MdDelete, MdOutlineMiscellaneousServices } from 'react-icons/md'

type ServiceItemProps = {
  service: TServiceItem
  index: number
  showRemoveButton?: boolean
  removeService: (index: number) => void
}
function ServiceItem({ service, index, showRemoveButton = true, removeService }: ServiceItemProps) {
  return (
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-2 lg:w-[450px]">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex  items-center gap-1">
          <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1">
            <MdOutlineMiscellaneousServices />
          </div>
          <p className="text-xs font-medium leading-none tracking-tight lg:text-sm">{service.descricao}</p>
        </div>
        {showRemoveButton ? (
          <button
            onClick={() => removeService(index)}
            type="button"
            className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
          >
            <MdDelete style={{ color: 'red' }} size={15} />
          </button>
        ) : null}
      </div>
      <div className="mt-1 flex w-full items-center justify-end gap-2 pl-2">
        <div className="flex items-center gap-1">
          <AiOutlineSafety size={12} />
          <p className="text-[0.6rem] font-light text-gray-500 lg:text-xs">
            {service.garantia} {service.garantia > 0 ? 'ANOS' : 'ANO'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ServiceItem
