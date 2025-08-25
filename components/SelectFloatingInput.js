import dayjs from 'dayjs'
import React, { useState } from 'react'

function SelectFoatingInput({ value, handleChange, width, editable, label, options, notDefinedOption }) {
  const [selectActive, setSelectActive] = useState(false)
  return (
    <div className={`relative z-0 flex flex-col items-center ${width ? `w-full lg:w-[${width}]` : 'w-full lg:w-[250px]'} group mb-6`}>
      <select
        value={value}
        disabled={!editable}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setSelectActive(false)}
        className="bg-background font-arial peer border-primary/20 z-1 flex w-full appearance-none border-0 border-b-2 px-0 py-2.5 text-center text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-hidden"
      >
        {options &&
          options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        {notDefinedOption && <option value={'NÃO DEFINIDO'}>NÃO DEFINIDO</option>}
      </select>

      <label
        htmlFor="floating_numberInput"
        className="text-primary/60 absolute top-3 z-2 w-full origin-[0] -translate-y-6 scale-75 transform text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600"
      >
        {label}
      </label>
    </div>
  )
}

export default SelectFoatingInput
