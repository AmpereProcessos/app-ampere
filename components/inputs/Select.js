import React, { useEffect, useRef, useState } from 'react'
import lodash from 'lodash'
import { HiCheck } from 'react-icons/hi'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import { FixedSizeList } from 'react-window'

function SelectInput({
  width,
  label,
  labelClassName = 'font-sans font-bold  text-[#353432] text-start',
  showLabel = true,
  value,
  editable = true,
  options,
  selectedItemLabel,
  handleChange,
  onReset,
}) {
  function getValueID(value) {
    if (options && value) {
      // console.log("OPTIONS", options);
      // console.log("VALUE", value);
      const filteredOption = options?.find((option) => option.value === value)
      if (filteredOption) return filteredOption.id
      else return null
    } else return null
  }

  const ref = useRef(null)
  const [items, setItems] = useState(options)
  const [selectMenuIsOpen, setSelectMenuIsOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(getValueID(value))

  const [searchFilter, setSearchFilter] = useState('')
  const inputIdentifier = label ? label.toLowerCase().replace(' ', '_') : ''
  function handleSelect(id, item) {
    handleChange(item)
    setSelectedId(id)
    setSelectMenuIsOpen(false)
  }
  function handleFilter(value) {
    setSearchFilter(value)
    if (!items || !options) return
    if (value.trim().length > 0) {
      let filteredItems = options.filter((item) => item.label.toUpperCase().includes(value.toUpperCase()))
      setItems(filteredItems)
      return
    } else {
      setItems(options)
      return
    }
  }
  function resetState() {
    onReset()
    setSelectedId(null)
    setSelectMenuIsOpen(false)
  }
  function onClickOutside() {
    setSearchFilter('')
    setSelectMenuIsOpen(false)
  }
  useEffect(() => {
    setSelectedId(getValueID(value))
    setItems(options)
  }, [options, value])
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside()
      }
    }
    document.addEventListener('click', (e) => handleClickOutside(e), true)
    return () => {
      document.removeEventListener('click', (e) => handleClickOutside(e), true)
    }
  }, [onClickOutside])
  const Item = ({ index, style }) => (
    <div
      onClick={() => handleSelect(items[index].id, items[index].value)}
      key={items[index].id ? items[index].id : index}
      className={`flex w-full cursor-pointer items-center rounded p-1 px-2 hover:bg-gray-100 ${selectedId == items[index].id ? 'bg-gray-100' : ''}`}
    >
      <p className="grow font-medium text-[#353432]">{items[index].label}</p>
      {selectedId == items[index].id ? <HiCheck style={{ color: '#fead61', fontSize: '20px' }} /> : null}
    </div>
  )
  return (
    <div ref={ref} className={`relative flex w-full flex-col gap-1 lg:w-[${width ? width : '350px'}]`}>
      {showLabel ? (
        <label htmlFor={inputIdentifier} className={labelClassName}>
          {label}
        </label>
      ) : null}

      <div
        onClick={() => {
          if (editable && !selectMenuIsOpen) setSelectMenuIsOpen((prev) => !prev)
        }}
        className="flex min-h-[47px] cursor-pointer w-full items-center justify-between rounded-md border border-gray-200 bg-[#fff] p-3 text-sm shadow-sm"
      >
        {selectMenuIsOpen ? (
          <input
            type="text"
            autoFocus
            value={searchFilter}
            onChange={(e) => handleFilter(e.target.value)}
            placeholder="Filtre o item desejado..."
            className="h-full w-full text-sm italic outline-none"
          />
        ) : (
          <p className="grow text-[#353432]">
            {selectedId && options ? options.filter((item) => item.id == selectedId)[0]?.label : selectedItemLabel}
          </p>
        )}
        {selectMenuIsOpen ? (
          <IoMdArrowDropup
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (editable) setSelectMenuIsOpen(false)
            }}
          />
        ) : (
          <IoMdArrowDropdown
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (editable) setSelectMenuIsOpen(true)
            }}
          />
        )}
      </div>
      {selectMenuIsOpen ? (
        <div className="absolute top-[75px] z-[100] flex h-[250px] max-h-[250px] w-full flex-col self-center overflow-y-auto overscroll-y-auto rounded-md border border-gray-200 bg-[#fff] p-2 py-1 shadow-sm scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          <div
            onClick={() => resetState()}
            className={`flex w-full cursor-pointer items-center rounded p-1 px-2 hover:bg-gray-100 ${!selectedId ? 'bg-gray-100' : ''}`}
          >
            <p className="grow font-medium text-[#353432]">{selectedItemLabel}</p>
            {!selectedId ? <HiCheck style={{ color: '#fead61', fontSize: '20px' }} /> : null}
          </div>
          <div className="my-2 h-[1px] w-full bg-gray-200"></div>
          {items ? (
            items.map((item, index) => (
              <div
                onClick={() => handleSelect(item.id, item.value)}
                key={item.id ? item.id : index}
                className={`flex w-full cursor-pointer items-center rounded p-1 px-2 hover:bg-gray-100 ${selectedId == item.id ? 'bg-gray-100' : ''}`}
              >
                <p className="grow font-medium text-[#353432]">{item.label}</p>
                {selectedId == item.id ? <HiCheck style={{ color: '#fead61', fontSize: '20px' }} /> : null}
              </div>
            ))
          ) : (
            <p className="w-full text-center text-sm italic text-[#353432]">Sem opções disponíveis.</p>
          )}
        </div>
      ) : (
        false
      )}
    </div>
  )
}

export default SelectInput
