import React from 'react'

function NumberFloatingInput({
  label,
  value,
  editable,
  handleChange,
  width,
  marginBottom,
  step = 0.01,
  min = undefined,
  max = undefined,
  toString = true,
}) {
  function fixValue(value) {
    if (toString) {
      return value.toString()
    } else return value
  }
  return (
    <div
      className={`relative z-0 flex flex-col items-center ${
        width ? `w-full lg:w-[${width}]` : 'w-full lg:w-[250px]'
      } ${marginBottom ? `mb-[${marginBottom}]` : 'mb-6'} group`}
    >
      <input
        value={value ? fixValue(value) : 0}
        onChange={(e) => handleChange(e.target.value)}
        readOnly={!editable}
        type="number"
        name={label.toLowerCase()}
        id={label.toLowerCase()}
        step={step}
        min={min}
        max={max}
        className="font-arial bg-background peer border-primary/20 z-1 flex w-full appearance-none border-0 border-b-2 px-0 py-2.5 text-center text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-hidden"
        placeholder=" "
      />

      <label
        htmlFor={label.toLowerCase()}
        className="text-primary/60 absolute top-3 z-2 origin-[0] -translate-y-6 scale-75 transform text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600"
      >
        {label}
      </label>
    </div>
  )
}

export default NumberFloatingInput
