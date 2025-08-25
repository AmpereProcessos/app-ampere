import dayjs from 'dayjs'
import React from 'react'
type DatetimeProps = {
  width?: string
  label: string
  labelClassName?: string
  showLabel?: boolean
  value: string | undefined
  min?: number
  editable?: boolean
  handleChange: (value: string | undefined) => void
}
function DatetimeInput({
  width,
  label,
  labelClassName = 'font-sans font-bold  text-[#353432]',
  showLabel = true,
  value,
  min,
  editable = true,
  handleChange,
}: DatetimeProps) {
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
        value={dayjs(value || null).isValid() ? dayjs(value).format('YYYY-MM-DDTHH:mm') : undefined}
        onChange={(e) => handleChange(e.target.value != '' ? e.target.value : undefined)}
        onReset={() => handleChange(undefined)}
        id={inputIdentifier}
        type="datetime-local"
        className="border-primary/20 h-[47px] w-full rounded-md border p-3 text-sm outline-hidden placeholder:italic"
      />
    </div>
  )
}

export default DatetimeInput
