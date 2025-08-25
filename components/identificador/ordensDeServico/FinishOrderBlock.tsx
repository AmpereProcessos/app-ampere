import React, { useState } from 'react'
import DateInput from '../../inputs/Date'
import { formatDate } from '../../../utils/constants'
import { formatDateInputChange } from '../../../utils/methods/shared'
import { VscChromeClose } from 'react-icons/vsc'
import { TServiceOrderDTO } from '@/utils/schemas/service-order'

type FinishOrderBlockProps = {
  infoHolder: TServiceOrderDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TServiceOrderDTO>>
}
function FinishOrderBlock({ infoHolder, setInfoHolder }: FinishOrderBlockProps) {
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      {menuIsOpen ? (
        <div className="mt-2 flex items-center gap-2">
          <DateInput
            label={'DATA DE FINALIZAÇÃO'}
            labelClassName="font-bold text-xs text-primary/60"
            value={infoHolder.dataEfetivacao ? formatDate(infoHolder.dataEfetivacao) : undefined}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, dataEfetivacao: formatDateInputChange(value) }))}
          />

          <button
            onClick={() => setMenuIsOpen(false)}
            type="button"
            className="mt-4 flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
          >
            <VscChromeClose style={{ color: 'red' }} />
          </button>
        </div>
      ) : (
        <>
          <div className="border-primary/80 text-primary/80 mt-4 flex w-fit items-center justify-center gap-2 self-center rounded border p-1">
            <p className="text-xs font-medium">EM ANDAMENTO</p>
          </div>
          <button onClick={() => setMenuIsOpen(true)} className="mb-4 text-sm font-medium text-green-500">
            FINALIZAR
          </button>
        </>
      )}
    </div>
  )
}

export default FinishOrderBlock
