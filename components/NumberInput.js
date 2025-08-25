import React from 'react'

function NumberInput({ label, value, handleChange, editable, tag, unit, labelColor, widthFit }) {
  return (
    <div className={`flex w-full flex-col text-xs ${widthFit ? 'w-fit' : 'lg:w-[350px]'} items-center lg:text-base`}>
      <span className={`font-raleway font-bold uppercase ${labelColor ? labelColor : ''} text-center text-sm`}>{label}</span>
      <div className="flex items-center justify-center">
        {tag && <p className="text-primary/80 w-fit text-center text-xs uppercase">{tag}</p>}
        <input
          id={label}
          name={label}
          className="text-primary/80 w-fit bg-transparent text-center text-xs uppercase outline-hidden"
          type="number"
          readOnly={!editable}
          value={value ? value.toString() : 0}
          onChange={(e) => handleChange(e.target.value)}
        />
        {unit && <p className="w-fittext-center text-primary/80 text-xs">{unit}</p>}
      </div>
    </div>
  )
}

export default NumberInput
