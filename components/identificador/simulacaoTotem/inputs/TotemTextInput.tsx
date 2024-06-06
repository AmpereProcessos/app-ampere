import React, { useRef, useState } from 'react'
import LetterKeyboard from './LetterKeyboard'
import { useClickOutside } from '@/utils/hooks'
type TotemTextInputProps = {
  width?: string
  label: string
  labelClassName?: string
  showLabel?: boolean
  showEmailDomains?: boolean
  value: string
  placeholder: string
  editable?: boolean
  handleChange: (value: string) => void
}
function TotemTextInput({
  width,
  label,
  labelClassName = 'font-sans font-bold  text-[#353432]',
  showLabel = true,
  value,
  showEmailDomains = false,
  placeholder,
  editable = true,
  handleChange,
}: TotemTextInputProps) {
  const divReff = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const inputIdentifier = label.toLowerCase().replace(' ', '_')
  function handleAjust(letter: string) {
    const currentValueAsString = value || ''
    const newValue = currentValueAsString?.concat(letter)
    handleChange(newValue)
  }
  function dropLastLetter() {
    var currentValueAsString = value || ''
    const newValue = currentValueAsString.slice(0, -1)
    console.log('FUI CHAMADO', newValue)
    handleChange(newValue)
  }
  useClickOutside(divReff, () => setIsFocused(false))
  return (
    <div ref={divReff} className={`relative flex w-full flex-col gap-1 lg:w-[${width ? width : '350px'}]`}>
      {showLabel ? (
        <label htmlFor={inputIdentifier} className={labelClassName}>
          {label}
        </label>
      ) : null}

      <div
        onClick={() => setIsFocused(true)}
        className="flex min-h-[47px] w-full items-center justify-center gap-2 rounded-lg border border-gray-300 p-3 shadow-sm"
      >
        {value}
      </div>
      {isFocused ? (
        <LetterKeyboard
          closeModal={() => setIsFocused(false)}
          handleClick={(x) => handleAjust(x)}
          dropLastLetter={dropLastLetter}
          showEmailDomains={showEmailDomains}
        />
      ) : null}
    </div>
  )
}

export default TotemTextInput
