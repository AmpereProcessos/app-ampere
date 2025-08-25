import TextInput from '@/components/inputs/Text'
import type { TProperty } from '@/utils/schemas/properties'
import React, { useState } from 'react'
import { FaTag } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

type TagsMenuProps = {
  infoHolder: TProperty
  updateInfoHolder: (info: Partial<TProperty>) => void
}
function TagsMenu({ infoHolder, updateInfoHolder }: TagsMenuProps) {
  const [tagHolder, setTagHolder] = useState<TProperty['tags'][number]>('')
  function addProperty(info: TProperty['tags'][number]) {
    updateInfoHolder({ tags: [...infoHolder.tags, info] })
  }
  function removeProperty(index: number) {
    updateInfoHolder({ tags: infoHolder.tags.filter((_, i) => i !== index) })
  }
  return (
    <div className="flex w-full flex-col items-center gap-1">
      <h1 className="w-full text-center font-black">TAGS</h1>
      <p className="text-primary/60 w-full text-center text-sm tracking-tight">
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
          type="button"
          onClick={() => addProperty(tagHolder)}
          className="disabled:bg-primary/60 enabled:hover:bg-primary/70 rounded bg-black px-4 py-1 text-xs font-medium text-white duration-300 ease-in-out"
        >
          ADICIONAR TAG
        </button>
      </div>
      <div className="flex w-full flex-wrap items-start justify-around gap-2">
        {infoHolder.tags.length > 0 ? (
          infoHolder.tags.map((tag, index) => (
            <div key={`${tag}-${index.toString()}`} className="flex flex-col rounded-xl bg-[#15599a] p-2">
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <FaTag size={15} color="white" />

                  <h1 className="text-[0.65rem] leading-none font-bold tracking-tight text-white lg:text-xs">{tag}</h1>
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
          <p className="text-primary/60 text-xs font-medium italic">Não há tags cadastradas</p>
        )}
      </div>
    </div>
  )
}

export default TagsMenu
