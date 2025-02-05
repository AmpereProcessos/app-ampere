import React, { useRef, useState } from 'react'
import KeyboardModal from './NumberKeyboard'
import { useClickOutside } from '@/utils/hooks'
type TotemNumberInputProps = {
  width?: string
  label: string
  showLabel: boolean
  showTag: boolean
  value: number | string | null
  editable?: boolean
  placeholder: string
  handleChange: (value: string) => void
}
function TotemNumberInput({ width, label, showLabel, showTag = true, value, editable = true, placeholder, handleChange }: TotemNumberInputProps) {
  const divReff = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const inputIdentifier = label.toLowerCase().replace(' ', '_')
  function handleAjust(number: number) {
    const currentValueAsString = value?.toString() || ''
    const newValue = currentValueAsString?.concat(number.toString())
    handleChange(newValue)
  }
  function dropLastNumber() {
    var currentValueAsString = value?.toString() || ''
    const newValue = currentValueAsString.slice(0, -1)
    console.log('FUI CHAMADO', newValue)
    handleChange(newValue)
  }
  useClickOutside(divReff, () => setIsFocused(false))
  return (
    <div ref={divReff} className={`relative flex min-h-[50px] w-full flex-col gap-1 lg:w-[${width ? width : '350px'}]`}>
      {showLabel ? (
        <label htmlFor={inputIdentifier} className="font-sans font-bold  text-[#353432]">
          {label}
        </label>
      ) : null}
      <div onClick={() => setIsFocused(true)} className="flex w-full grow items-center gap-2 rounded-lg border border-gray-300 p-3 shadow-sm">
        {showTag ? <p>R$</p> : null}

        <div className="grow rounded-md bg-transparent text-end text-sm">{value}</div>
        {/* <input
             readOnly={!editable}
             autoFocus={true}
             value={!isEmpty(value) ? value?.toString() : undefined}
             onChange={(e) => handleChange(Number(e.target.value))}
             id={inputIdentifier}
             type="number"
             placeholder={placeholder}
             onFocus={() => setIsFocused(true)}
             className="grow rounded-md text-sm outline-none placeholder:italic text-end bg-transparent"
            /> */}
      </div>
      {isFocused ? (
        <KeyboardModal closeModal={() => setIsFocused(false)} handleClick={(x) => handleAjust(x)} dropLastNumber={dropLastNumber} />
      ) : null}
    </div>
  )
}

export default TotemNumberInput
