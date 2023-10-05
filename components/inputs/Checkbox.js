import React from 'react'
import { BsCheck } from 'react-icons/bs'
function CheckboxInput({ labelTrue, labelFalse, editable, checked, handleChange, justify = 'justify-center', padding = '0.75rem', width }) {
  return (
    <div className={`flex w-full lg:${width ? `w-[${width}]` : 'w-fit'} items-center ${justify} gap-2 ${padding ? `p-[${padding}]` : 'p-3'}`}>
      <div
        className={`flex h-[16px] w-[16px] cursor-pointer items-center justify-center rounded-full border-2 border-[#15599a] ${
          checked ? 'bg-[#15599a]' : ''
        }`}
        onClick={() => {
          if (editable) handleChange(!checked)
        }}
      >
        {checked ? <BsCheck style={{ color: '#fead61' }} /> : null}
      </div>
      <p
        className="cursor-pointer"
        onClick={() => {
          if (editable) handleChange(!checked)
        }}
      >
        {checked ? labelTrue : labelFalse}
      </p>
    </div>
  )
}

export default CheckboxInput
