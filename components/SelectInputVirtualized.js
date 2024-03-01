import React, { useState } from 'react'
import { FixedSizeList as List } from 'react-window'

function SelectInputVirtualized({ label, value, options, handleChange, editable, widthFit, labelColor }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = (selectedValue) => {
    handleChange(selectedValue)
    toggleDropdown()
  }

  const Row = ({ index, style }) => (
    <div style={style} onClick={() => handleItemClick(options[index].value)} className="cursor-pointer text-center uppercase text-gray-600">
      {options[index].label}
    </div>
  )

  return (
    <div className={`flex w-full flex-col text-sm lg:text-base ${widthFit ? 'w-full' : 'lg:w-[350px]'} items-center`}>
      <span className={`text-center font-raleway text-sm font-bold uppercase ${labelColor ? labelColor : ''}`} onClick={toggleDropdown}>
        {label}
      </span>
      <select
        className="w-full bg-transparent text-center text-xs uppercase text-gray-600 outline-none"
        onChange={(e) => handleChange(e.target.value)}
        disabled={!editable}
        value={value}
      >
        <List height={150} itemCount={options.length} itemSize={25} width={100}>
          {Row}
        </List>
      </select>
      {/* {isOpen && (
        <div className="h-32 w-full overflow-y-auto border border-gray-300">
          <List
            height={128}
            itemCount={options.length}
            itemSize={32} // Height of each item
            width="100%"
          >
            {Row}
          </List>
        </div>
      )} */}
    </div>
  )
}

export default SelectInputVirtualized
