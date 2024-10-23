import React from 'react'
import { isEmpty } from '../../utils/methods/shared'
import { cn } from '@/lib/utils'

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
function TextInput({ width, label, labelClassName, showLabel = true, value, placeholder, editable = true, handleChange }: TextInputProps) {
  const inputIdentifier = label ? label.toLowerCase().replace(' ', '_') : ''
  return (
    <div className={`flex  w-full flex-col gap-1 lg:w-[${width ? width : '350px'}]`}>
      {showLabel ? (
        <label htmlFor={inputIdentifier} className={cn('font-sans text-start font-bold text-[#353432]', labelClassName)}>
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
        className="h-[47px] w-full rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:italic"
      />
    </div>
  )
}

export default TextInput
