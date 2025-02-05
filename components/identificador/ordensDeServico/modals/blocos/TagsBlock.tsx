import { Button } from '@/components/ui/button'

import * as Popover from '@radix-ui/react-popover'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { cn } from '@/lib/utils'
import { formatWithoutDiacritics } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'

import { TagsColorPalette } from '@/utils/select-options'
import { Tag, Tags, X } from 'lucide-react'
import React, { useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { useQueryClient } from '@tanstack/react-query'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'
import { TServiceOrder, TServiceOrderTagDTO } from '@/utils/schemas/service-order'
import { useServiceOrderTags } from '@/utils/methods/query/service-orders'
import { createServiceOrderTag } from '@/utils/methods/mutation/service-orders'

type ServiceOrderTagsBlockProps = {
  infoHolder: TServiceOrder
  updateInfoHolder: (changes: Partial<TServiceOrder>) => void
}
function ServiceOrderTagsBlock({ infoHolder, updateInfoHolder }: ServiceOrderTagsBlockProps) {
  function handleAddTag(tag: TServiceOrderTagDTO) {
    const tagFormatted: Exclude<TServiceOrder['etiquetas'], undefined | null>[number] = { id: tag._id, titulo: tag.titulo, cores: tag.cores }
    updateInfoHolder({ etiquetas: [...(infoHolder.etiquetas || []), tagFormatted] })
  }
  function handleRemoveTag(index: number) {
    updateInfoHolder({ etiquetas: (infoHolder.etiquetas || []).filter((e, i) => i != index) })
  }
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">ETIQUETAS DA ORDEM DE SERVIÇO</h1>
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        {infoHolder.etiquetas?.map((tag, index) => (
          <div
            key={index}
            style={{
              border: '1px solid',
              borderColor: tag.cores.primaria,
              color: tag.cores.primaria,
              backgroundColor: tag.cores.secundaria,
            }}
            className={cn('group flex items-center gap-1 rounded py-0.5 pl-2 pr-1')}
          >
            <Tag width={12} height={12} />
            <h1 className="text-[0.65rem] font-bold tracking-tight">{tag.titulo}</h1>
            <button
              onClick={() => handleRemoveTag(index)}
              className="items-center justify-center opacity-0 duration-300 ease-in-out group-hover:opacity-100"
            >
              <X height={12} width={12} />
            </button>
          </div>
        ))}

        <TagsMenu currentApplicableTags={infoHolder.etiquetas?.map((c) => c.id) || []} handleClick={(tag) => handleAddTag(tag)} />
      </div>
    </div>
  )
}

export default ServiceOrderTagsBlock

type TTagMenuHolder = {
  title: string
  colors: { primary: string; secondary: string }
}
type TagsMenuProps = {
  currentApplicableTags: string[]
  handleClick: (tag: TServiceOrderTagDTO) => void
}
function TagsMenu({ currentApplicableTags, handleClick }: TagsMenuProps) {
  const queryClient = useQueryClient()
  const { data: tags, isLoading, isError, isSuccess, error } = useServiceOrderTags()

  const [holder, setHolder] = useState<TTagMenuHolder>({
    title: '',
    colors: { primary: TagsColorPalette[0].primaria, secondary: TagsColorPalette[0].secundaria },
  })
  function getFilteredTags(tags: TServiceOrderTagDTO[]) {
    return tags.filter((t) => formatWithoutDiacritics(t.titulo, true).includes(formatWithoutDiacritics(holder.title, true)))
  }

  const filteredTags = getFilteredTags(tags || [])

  const { mutate: handleCreateServiceOrderTag, isPending: isUpdateLoading } = useMutationWithFeedback({
    mutationKey: ['create-service-order-tag'],
    mutationFn: createServiceOrderTag,
    queryClient,
    affectedQueryKey: ['service-order-tags'],
  })
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="secondary" className="flex items-center gap-1" size={'xs'}>
          <Tags height={13} width={13} />
          <h1 className="text-[0.65rem] font-bold tracking-tight">+ TAGS</h1>
        </Button>
      </Popover.Trigger>
      <Popover.Content className="z-[120] flex min-h-[250px] w-80 flex-col gap-2 rounded border border-gray-500 bg-white p-3 shadow-sm">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
          <h3 className="text-sm font-bold">MENU DE ETIQUETAS</h3>
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
              <div className="flex w-full flex-wrap gap-2">
                {filteredTags.map((tag) => (
                  <button
                    disabled={currentApplicableTags.includes(tag._id)}
                    style={{
                      border: '1px solid',
                      borderColor: tag.cores.primaria,
                      color: tag.cores.primaria,
                      backgroundColor: tag.cores.secundaria,
                    }}
                    className={cn(
                      'flex w-fit items-center gap-1 rounded px-2 py-0.5',
                      currentApplicableTags.includes(tag._id) ? 'opacity-30' : 'opacity-100'
                    )}
                    onClick={() => handleClick(tag)}
                  >
                    <Tag width={12} height={12} />
                    <h1 className="text-[0.65rem] font-bold tracking-tight">{tag.titulo}</h1>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex w-full grow flex-col items-center justify-center gap-2 p-2">
                <div
                  style={{
                    border: '1px solid',
                    borderColor: holder.colors.primary,
                    color: holder.colors.primary,
                    backgroundColor: holder.colors.secondary,
                  }}
                  className={cn('flex items-center gap-1 rounded px-2 py-0.5')}
                >
                  <Tag width={12} height={12} />
                  <h1 className="text-[0.7rem] font-bold tracking-tight">{holder.title}</h1>
                </div>
                <div className="flex w-full flex-wrap items-center justify-center gap-1">
                  {TagsColorPalette.map((tagColor) => (
                    <button
                      type="button"
                      onClick={() => setHolder((prev) => ({ ...prev, colors: { primary: tagColor.primaria, secondary: tagColor.secundaria } }))}
                      style={{ border: '1px solid', borderColor: tagColor.primaria, backgroundColor: tagColor.secundaria }}
                      className={cn('h-4 w-4 rounded-full opacity-60', tagColor.primaria == holder.colors.primary ? 'scale-110 opacity-100' : '')}
                    ></button>
                  ))}
                </div>
                <LoadingButton
                  loading={isUpdateLoading}
                  onClick={() =>
                    // @ts-ignore
                    handleCreateServiceOrderTag({
                      info: {
                        titulo: holder.title,
                        cores: { primaria: holder.colors.primary, secundaria: holder.colors.secondary },
                        dataInsercao: new Date().toISOString(),
                      },
                    })
                  }
                  size={'xs'}
                >
                  CRIAR ETIQUETA
                </LoadingButton>
              </div>
            )
          ) : null}
        </div>
      </Popover.Content>
    </Popover.Root>
  )
}
