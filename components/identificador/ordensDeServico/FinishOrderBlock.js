import React, { useState } from 'react'
import DateInput from '../../inputs/Date'
import { formatDate } from '../../../utils/constants'
import { formatDateInputChange } from '../../../utils/methods/shared'
import { VscChromeClose } from 'react-icons/vsc'

function FinishOrderBlock({ infoHolder, setInfoHolder }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  return (
    <div className="flex flex-col items-center w-full justify-center gap-2">
      {menuIsOpen ? (
        <div className="flex items-center gap-2 mt-2">
          <DateInput
            label={'DATA DE FINALIZAÇÃO'}
            labelClassName="font-bold text-xs text-gray-500"
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
          <div className="flex self-center justify-center mt-4 items-center gap-2 text-gray-600 border border-gray-600 p-1 rounded w-fit">
            <p className="text-xs font-medium">EM ANDAMENTO</p>
          </div>
          <button onClick={() => setMenuIsOpen(true)} className="text-green-500 text-xs font-medium">
            FINALIZAR
          </button>
        </>
      )}
    </div>
  )
}

export default FinishOrderBlock
