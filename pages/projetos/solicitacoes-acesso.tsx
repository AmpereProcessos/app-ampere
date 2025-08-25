import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

function AccessRequestsPage() {
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  const [newAccessRequestModalIsOpen, setNewAccessRequestModalIsOpen] = useState<boolean>(false)
  return (
    <div className="bg-background flex grow flex-col p-6">
      <div className="border-primary/20 flex flex-col items-center justify-between gap-2 border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">Projetos no estágio de engenharia</p>
          </div>
          {dropdownMenuVisible ? (
            <div className="text-primary/80 cursor-pointer hover:text-blue-400">
              <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
            </div>
          ) : (
            <div className="text-primary/80 cursor-pointer hover:text-blue-400">
              <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
            </div>
          )}
        </div>
        <div className="flex w-full items-center justify-end">
          <button
            // @ts-ignore
            onClick={() => handleCreateActivity({ info: newActivityHolder })}
            className='enabled:hover:text-white" disabled:bg-primary/60 enabled:hover:bg-primary/80 rounded bg-gray-900 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm disabled:text-white'
          >
            NOVO
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccessRequestsPage
