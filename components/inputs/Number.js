import React from 'react'
import { isEmpty } from '../../utils/methods/shared'

function NumberInput({
  width,
  label,
  labelClassName = 'font-sans font-bold  text-[#353432]',
  showLabel = true,
  value,
  min,
  editable = true,
  placeholder,
  handleChange,
}) {
  const inputIdentifier = label ? label.toLowerCase().replace(' ', '_') : ''
  return (
    <div className={`flex w-full flex-col gap-1 lg:w-[${width ? width : '350px'}]`}>
      {showLabel ? (
        <label htmlFor={inputIdentifier} className={labelClassName}>
          {label}
        </label>
      ) : null}

      <input
        readOnly={!editable}
        value={!isEmpty(value) ? value.toString() : ''}
        onChange={(e) => handleChange(Number(e.target.value))}
        id={inputIdentifier}
        type="number"
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:italic"
      />
    </div>
  )
}

export default NumberInput
