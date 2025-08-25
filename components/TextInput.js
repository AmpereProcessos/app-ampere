import React, { useState } from 'react'
function TextInput({ value, label, handleChange, editable, normalCase, placeholder, widthFit, labelColor }) {
  return (
    <div className={`flex w-full flex-col text-sm lg:text-base ${widthFit ? 'w-fit' : 'lg:w-[350px]'} items-center`}>
      <span className={`font-raleway text-center font-bold uppercase ${labelColor ? labelColor : ''} text-sm`}>{label}</span>
      <input
        className={`w-full text-center text-xs ${normalCase ? '' : 'uppercase'} text-primary/80 bg-transparent outline-hidden`}
        value={value}
        readOnly={!editable}
        placeholder={placeholder ? placeholder : 'INFORMAÇÃO A PREENCHER...'}
        onChange={(e) => handleChange(e.target.value)}
        type="text"
      />
    </div>
  )
}

export default TextInput
