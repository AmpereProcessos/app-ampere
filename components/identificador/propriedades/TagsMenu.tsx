import TextInput from '@/components/inputs/Text'
import { TProperty, TPropertyDTO } from '@/utils/schemas/properties'
import React, { useState } from 'react'
import { FaTag } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

type TagsMenuProps = {
  propertyHolder: TPropertyDTO
  setPropertyHolder: React.Dispatch<React.SetStateAction<TPropertyDTO>>
}
function TagsMenu({ propertyHolder, setPropertyHolder }: TagsMenuProps) {
  const [tagHolder, setTagHolder] = useState<TProperty['tags'][number]>('')
  function addProperty(info: TProperty['tags'][number]) {
    const list = [...propertyHolder.tags]
    list.push(info)
    setPropertyHolder((prev) => ({ ...prev, tags: list }))
  }
  function removeProperty(index: number) {
    const list = [...propertyHolder.tags]
    list.splice(index, 1)
    setPropertyHolder((prev) => ({ ...prev, tags: list }))
  }
  return (
    <div className="flex w-full flex-col items-center gap-1">
      <h1 className="w-full text-center font-black">TAGS</h1>
      <p className="w-full text-center text-sm tracking-tight text-gray-500">
        Utilize das tags para facilitar os filtros e a identificação das propriedades.
      </p>
      <TextInput
        label="NOME DA TAG"
        placeholder="Preencha o nome da tag..."
        value={tagHolder}
        handleChange={(value) => setTagHolder(value)}
        width="100%"
      />
      <div className="mt-1 flex w-full items-center justify-end">
        <button
          onClick={() => addProperty(tagHolder)}
          className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
        >
          ADICIONAR TAG
        </button>
      </div>
      <div className="flex w-full flex-wrap items-start justify-around gap-2">
        {propertyHolder.tags.length > 0 ? (
          propertyHolder.tags.map((tag, index) => (
            <div key={index} className="flex flex-col rounded-xl bg-[#15599a] p-2">
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <FaTag size={15} color="white" />

                  <h1 className="text-[0.65rem] font-bold leading-none tracking-tight text-white lg:text-xs">{tag}</h1>
                </div>

                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="flex items-center justify-center rounded-lg p-1 text-red-300 duration-300 ease-linear hover:scale-105 hover:bg-red-200 hover:text-red-500"
                >
                  <MdDelete size={15} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs font-medium italic text-gray-500">Não há tags cadastradas</p>
        )}
      </div>
    </div>
  )
}

export default TagsMenu
