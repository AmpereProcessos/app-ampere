import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

function LeadsLostBlock({ lostLeads }) {
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  return (
    <div className="bg-background flex w-full flex-col rounded-md p-3 shadow-md">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <h1 className="text-primary/80 font-medium">PERDIDOS</h1>
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
      {dropdownMenuVisible ? (
        <div className="grid w-full grid-cols-2 gap-2">
          {lostLeads.map((lead, index) => (
            <div key={index} className="flex w-full flex-col rounded-md bg-red-100 p-2">
              <h1 className="text-primary/80 font-medium">{lead.nome}</h1>
              <p className="w-full py-1 text-center text-xs font-medium text-red-500 italic">{lead.motivoPerda}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default LeadsLostBlock
