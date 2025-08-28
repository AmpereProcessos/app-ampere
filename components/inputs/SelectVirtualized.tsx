import React, { useEffect, useRef, useState } from 'react'

import { HiCheck } from 'react-icons/hi'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import { VariableSizeList } from 'react-window'
import { Drawer, DrawerContent } from '../ui/drawer'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/lib/hooks/media-query'

type SelectOption<T> = {
  id: string | number
  value: any
  label: string
}
type SelectInputVirtualizedProps<T> = {
  width?: string
  label: string
  labelClassName?: string
  holderClassName?: string
  showLabel?: boolean
  value: T | null
  editable?: boolean
  selectedItemLabel: string
  options: SelectOption<T>[] | null
  handleChange: (value: T) => void
  onReset: () => void
}

function SelectInputVirtualized<T>({
  width,
  label,
  labelClassName,
  holderClassName,
  showLabel = true,
  value,
  editable = true,
  options,
  selectedItemLabel,
  handleChange,
  onReset,
}: SelectInputVirtualizedProps<T>) {
  function getValueID(value: T | null) {
    if (options && value) {
      // console.log("OPTIONS", options);
      // console.log("VALUE", value);
      const filteredOption = options?.find((option) => option.value === value)
      if (filteredOption) return filteredOption.id
      else return null
    } else return null
  }

  const ref = useRef<any>(null)
  const [items, setItems] = useState<SelectOption<T>[] | null>(options)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectMenuIsOpen, setSelectMenuIsOpen] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<number | string | null>(getValueID(value))
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [dropdownDirection, setDropdownDirection] = useState<'up' | 'down'>('down')

  const inputIdentifier = label.toLowerCase().replace(' ', '_')
  function handleSelect(id: string | number, item: T) {
    handleChange(item)
    setSelectedId(id)
    setSelectMenuIsOpen(false)
  }
  function handleFilter(value: string) {
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
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target) && isDesktop) {
        onClickOutside()
      }
    }
    document.addEventListener('click', (e) => handleClickOutside(e), true)
    return () => {
      document.removeEventListener('click', (e) => handleClickOutside(e), true)
    }
  }, [onClickOutside])
  useEffect(() => {
    if (selectMenuIsOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top

      if (spaceBelow < 250 && spaceAbove > spaceBelow) {
        setDropdownDirection('up')
      } else {
        setDropdownDirection('down')
      }
    }
  }, [selectMenuIsOpen])
  const List = ({ height, width, list }: { height: number | string; width: number | string; list: SelectOption<T>[] }) => (
    <VariableSizeList
      height={height}
      width={width}
      itemCount={list ? list.length : 0}
      itemSize={(index) => 30} // Adjust the item height as needed
    >
      {({ index, style }) => (
        <div
          style={style}
          onClick={() => handleSelect(list[index]?.id || 0, list[index]?.value)}
          className={`hover:bg-primary/20 flex w-full cursor-pointer items-center rounded p-1 px-2 ${
            selectedId === list[index]?.id ? 'bg-primary/20' : ''
          }`}
        >
          <p className="text-primary grow text-sm font-medium">{list[index]?.label}</p>
          {selectedId === list[index]?.id ? <HiCheck style={{ color: '#fead61', fontSize: '20px' }} /> : null}
        </div>
      )}
    </VariableSizeList>
  )

  if (isDesktop)
    return (
      <div ref={ref} className={`relative flex w-full flex-col gap-1 lg:w-[${width ? width : '350px'}]`}>
        {showLabel ? (
          <label htmlFor={inputIdentifier} className={cn('text-primary/80 text-start text-sm font-medium tracking-tight', labelClassName)}>
            {label}
          </label>
        ) : null}
        <div
          className={cn(
            'bg-background flex h-full min-h-[46.6px] w-full items-center justify-between rounded-md border p-3 text-sm shadow-xs duration-500 ease-in-out dark:bg-[#121212]',
            selectMenuIsOpen ? 'border-primary' : 'border-primary/20',
            holderClassName
          )}
        >
          {selectMenuIsOpen ? (
            <input
              type="text"
              autoFocus
              value={searchFilter}
              onChange={(e) => handleFilter(e.target.value)}
              placeholder="Filtre o item desejado..."
              className="h-full w-full text-sm italic outline-hidden"
            />
          ) : (
            <p
              onClick={() => {
                if (editable) setSelectMenuIsOpen((prev) => !prev)
              }}
              className="text-primary grow cursor-pointer text-start"
            >
              {selectedId && options ? options.filter((item) => item.id == selectedId)[0]?.label : selectedItemLabel}
            </p>
          )}
          {selectMenuIsOpen ? (
            <IoMdArrowDropup
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (editable) setSelectMenuIsOpen((prev) => !prev)
              }}
            />
          ) : (
            <IoMdArrowDropdown
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (editable) setSelectMenuIsOpen((prev) => !prev)
              }}
            />
          )}
        </div>
        {/** overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20*/}
        {selectMenuIsOpen ? (
          <div
            className={`absolute ${
              dropdownDirection === 'down' ? 'top-[75px]' : 'bottom-[75px]'
            } border-primary/20 bg-background scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 z-100 flex h-[250px] max-h-[250px] w-full flex-col self-center overflow-y-auto overscroll-y-auto rounded-md border p-2 py-1 shadow-xs dark:bg-[#121212]`}
          >
            <div
              onClick={() => resetState()}
              className={`hover:bg-primary/20 flex w-full cursor-pointer items-center rounded p-1 px-2 ${!selectedId ? 'bg-primary/20' : ''}`}
            >
              <p className="text-primary grow text-sm font-medium">{selectedItemLabel}</p>
              {!selectedId ? <HiCheck style={{ color: '#fead61', fontSize: '20px' }} /> : null}
            </div>
            <div className="my-2 h-px w-full bg-gray-200"></div>
            <div className="flex w-full flex-col gap-y-1">
              {items ? (
                <List height={180} width={'100%'} list={items} />
              ) : (
                <p className="text-primary w-full text-center text-sm italic">Sem opções disponíveis.</p>
              )}
            </div>
          </div>
        ) : (
          false
        )}
      </div>
    )

  return (
    <Drawer open={selectMenuIsOpen} onOpenChange={setSelectMenuIsOpen}>
      <div ref={ref} className={`relative flex w-full flex-col gap-1 lg:w-[${width ? width : '350px'}]`}>
        {showLabel ? (
          <label htmlFor={inputIdentifier} className={cn('text-primary/80 text-start text-sm font-medium tracking-tight', labelClassName)}>
            {label}
          </label>
        ) : null}
        <div
          className={cn(
            'bg-background flex h-full min-h-[46.6px] w-full items-center justify-between rounded-md border p-3 text-sm shadow-xs duration-500 ease-in-out dark:bg-[#121212]',
            selectMenuIsOpen ? 'border-primary' : 'border-primary/20',
            holderClassName
          )}
        >
          <p
            onClick={() => {
              if (editable) setSelectMenuIsOpen((prev) => !prev)
            }}
            className="text-primary grow cursor-pointer text-start"
          >
            {selectedId && options ? options.filter((item) => item.id == selectedId)[0]?.label : selectedItemLabel}
          </p>

          <IoMdArrowDropdown
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (editable) setSelectMenuIsOpen((prev) => !prev)
            }}
          />
        </div>
        <DrawerContent className="gap-2 p-2">
          <input
            type="text"
            autoFocus={true}
            value={searchFilter}
            onChange={(e) => handleFilter(e.target.value)}
            placeholder="Filtre o item desejado..."
            className="w-full bg-transparent p-2 text-sm italic outline-hidden"
          />

          <div
            onClick={() => resetState()}
            className={`hover:bg-primary/20 flex w-full cursor-pointer items-center rounded p-1 px-2 ${!selectedId ? 'bg-primary/20' : ''}`}
          >
            <p className="text-primary grow text-sm font-medium">{selectedItemLabel}</p>
            {!selectedId ? <HiCheck style={{ color: '#fead61', fontSize: '20px' }} /> : null}
          </div>
          <div className="my-2 h-px w-full bg-gray-200"></div>
          <div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex h-[200px] min-h-[200px] flex-col gap-2 overflow-y-auto overscroll-y-auto lg:h-[350px] lg:max-h-[350px]">
            {items ? (
              <List height={180} width={'100%'} list={items} />
            ) : (
              <p className="text-primary w-full text-center text-sm italic">Sem opções disponíveis.</p>
            )}
          </div>
        </DrawerContent>
      </div>
    </Drawer>
  )
}

export default SelectInputVirtualized
