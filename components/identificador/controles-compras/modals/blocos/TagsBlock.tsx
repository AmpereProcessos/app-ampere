import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { cn } from '@/lib/utils'
import { formatWithoutDiacritics } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import { usePurchaseControlsTags } from '@/utils/methods/query/purchase-controls'
import { TPurchaseControl, TPurchaseControlTag, TPurchaseControlTagDTO } from '@/utils/schemas/purchases'
import { TagsColorPalette } from '@/utils/select-options'
import { Tag, Tags, X } from 'lucide-react'
import React, { useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'

type PurchaseControlTagsBlockProps = {
  infoHolder: TPurchaseControl
  setInfoHolder: React.Dispatch<React.SetStateAction<TPurchaseControl>>
}
function PurchaseControlTagsBlock({ infoHolder, setInfoHolder }: PurchaseControlTagsBlockProps) {
  const [tagsMenuIsOpen, setTagsMenuIsOpen] = useState<boolean>(false)

  const { data: tags, isLoading, isError, isSuccess, error } = usePurchaseControlsTags()
  console.log('MENU IS OPEN', tagsMenuIsOpen)
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">ETIQUETAS DA COMPRA</h1>
      <div className="flex w-full items-center justify-center gap-2">
        {tags?.map((tag) => (
          <div
            style={{
              border: '1px solid',
              borderColor: tag.cores.primaria,
              color: tag.cores.primaria,
              backgroundColor: tag.cores.secundaria,
            }}
            className={cn('flex items-center gap-1 rounded px-2 py-0.5')}
          >
            <Tag width={12} height={12} />
            <h1 className="text-[0.65rem] font-bold tracking-tight">{tag.titulo}</h1>
          </div>
        ))}
        <Button onClick={() => setTagsMenuIsOpen(true)} variant="secondary" className="flex items-center gap-1" size={'xs'}>
          <Tags height={13} width={13} />
          <h1 className="text-[0.65rem] font-bold tracking-tight">+ TAGS</h1>
        </Button>
        {/* {infoHolder.etiquetas.map((tag) => (
          <div key={tag.id} className="group flex items-center gap-1 rounded border border-primary bg-secondary text-primary">
            <Tag height={12} width={12} />
            <p className="text-[0.6rem] tracking-tight">{tag.titulo}</p>
            <button className="hidden items-center justify-center rounded p-1 duration-300 ease-in-out group-hover:flex hover:bg-gray-100">
              <X />
            </button>
          </div>
        ))}*/}
        <TagsMenu
          currentApplicableTags={infoHolder.etiquetas.map((c) => c.id)}
          handleClick={() => {}}
          menuIsOpen={tagsMenuIsOpen}
          closeMenu={() => setTagsMenuIsOpen(false)}
        />
      </div>
    </div>
  )
}

export default PurchaseControlTagsBlock

type TTagMenuHolder = {
  title: string
  colors: { primary: string; secondary: string }
}
type TagsMenuProps = {
  currentApplicableTags: string[]
  handleClick: (tag: TPurchaseControlTagDTO) => void
  menuIsOpen: boolean
  closeMenu: () => void
}
function TagsMenu({ currentApplicableTags, handleClick, menuIsOpen, closeMenu }: TagsMenuProps) {
  const { data: tags, isLoading, isError, isSuccess, error } = usePurchaseControlsTags()

  const [holder, setHolder] = useState<TTagMenuHolder>({
    title: '',
    colors: { primary: TagsColorPalette[0].primaria, secondary: TagsColorPalette[0].secundaria },
  })
  function getFilteredTags(tags: TPurchaseControlTagDTO[]) {
    return tags.filter((t) => formatWithoutDiacritics(t.titulo, true).includes(formatWithoutDiacritics(holder.title, true)))
  }

  const filteredTags = getFilteredTags(tags || [])
  return (
    <Popover open={menuIsOpen}>
      <PopoverContent className="w-80">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
          <h3 className="text-xs font-bold">Menu de Etiquetas</h3>
          <button
            onClick={() => closeMenu()}
            type="button"
            className="flex items-center justify-center rounded-lg p-1 text-sm duration-300 ease-linear hover:scale-105 hover:bg-red-200"
          >
            <VscChromeClose style={{ color: 'red' }} />
          </button>
        </div>
        <input
          className="bg-transparent p-2 text-xs outline-none placeholder:italic"
          value={holder.title}
          onChange={(e) => setHolder((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Filtre pelo título da tag..."
        />
        <div className="flex w-full grow flex-col gap-2">
          {isLoading ? (
            <div className="flex w-full grow items-center justify-center">
              <h1 className="animate-pulse text-xs tracking-tight text-primary/80">Carregando...</h1>
            </div>
          ) : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? (
            filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <button
                  style={{
                    border: '1px solid',
                    borderColor: tag.cores.primaria,
                    color: tag.cores.primaria,
                    backgroundColor: tag.cores.secundaria,
                  }}
                  className={cn('flex items-center gap-1 rounded px-2 py-0.5')}
                >
                  <Tag width={12} height={12} />
                  <h1 className="text-[0.65rem] font-bold tracking-tight">{tag.titulo}</h1>
                </button>
              ))
            ) : (
              <div className="flex w-full grow flex-col items-center justify-center gap-1 p-2">
                <p className="w-full text-center text-xs tracking-tight text-primary/80">Criar nova etiqueta.</p>
                <h1 className="rounded px-2 py-1 text-sm font-bold tracking-tight">{holder.title}</h1>
                <div className="flex w-full flex-wrap items-center justify-center gap-1">
                  {TagsColorPalette.map((tagColor) => (
                    <button
                      type="button"
                      style={{ border: '1px solid', borderColor: tagColor.primaria, backgroundColor: tagColor.secundaria }}
                      className={cn('h-3 w-3 rounded-full', tagColor.primaria == holder.colors.primary ? 'scale-105' : '')}
                    ></button>
                  ))}
                </div>
              </div>
            )
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}
