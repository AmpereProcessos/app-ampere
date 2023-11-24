import React from 'react'
import { isEmpty } from '../../utils/methods/shared'

type TextInputProps = {
  width?: string
  label: string
  labelClassName?: string
  showLabel?: boolean
  value: string
  placeholder: string
  editable?: boolean
  handleChange: (value: string) => void
  handleOnBlur?: () => void
}
function TextInput({
  width,
  label,
  labelClassName = 'font-sans font-bold  text-[#353432]',
  showLabel = true,
  value,
  placeholder,
  editable = true,
  handleChange,
}: TextInputProps) {
  const inputIdentifier = label ? label.toLowerCase().replace(' ', '_') : ''
  return (
    <div className={`flex  w-full flex-col gap-1 lg:w-[${width ? width : '350px'}]`}>
      {showLabel ? (
        <label htmlFor={inputIdentifier} className={labelClassName}>
          {label}
        </label>
      ) : null}

      <input
        value={!isEmpty(value) ? value : ''}
        onChange={(e) => handleChange(e.target.value)}
        id={inputIdentifier}
        readOnly={!editable}
        type="text"
        placeholder={placeholder}
        className="w-full h-[47px] rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:italic"
      />
    </div>
  )
}

export default TextInput
