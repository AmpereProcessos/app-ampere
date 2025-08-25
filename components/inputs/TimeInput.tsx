import React from 'react'

type TimeInputProps = {
  width?: string
  label: string
  labelClassName?: string
  showLabel?: boolean
  value: string | undefined
  editable?: boolean
  handleChange: (value: string | undefined) => void
}
function TimeInput({
  width,
  label,
  labelClassName = 'font-sans font-bold text-[#353432]',
  showLabel = true,
  value,
  editable = true,
  handleChange,
}: TimeInputProps) {
  const inputIdentifier = label.toLowerCase().replace(' ', '_')
  return (
    <div className={`flex w-full flex-col gap-1 lg:w-[${width ? width : '350px'}]`}>
      {showLabel ? (
        <label htmlFor={inputIdentifier} className={labelClassName}>
          {label}
        </label>
      ) : null}

      <input
        readOnly={!editable}
        value={value ? value : ''}
        onChange={(e) => {
          handleChange(e.target.value != '' ? e.target.value : undefined)
        }}
        id={inputIdentifier}
        onReset={() => handleChange(undefined)}
        type="time"
        className="border-primary/20 h-[47px] w-full rounded-md border p-3 text-sm outline-hidden placeholder:italic"
      />
    </div>
  )
}

export default TimeInput
