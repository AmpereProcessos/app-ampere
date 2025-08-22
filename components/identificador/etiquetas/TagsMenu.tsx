// React and Next.js
import { useState } from 'react'

// Types
import type { TTag, TTagDTO } from '@/utils/schemas/tags'
import type { TGetTagsRouteOutputDefault } from '@/pages/api/tags'

// Components
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'

// Icons
import { Plus, Tag, Tags, X } from 'lucide-react'

// Utils
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/lib/hooks/media-query'
import { TagsColorPalette } from '@/utils/select-options'
import { formatWithoutDiacritics } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import { useTags } from '@/utils/methods/query/tags'
import { createTag } from '@/utils/methods/mutation/tags'
import type { TAuthSession } from '@/lib/authentication/types'

// Third-party
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

type GeneralTagsHolderProps = {
  session: TAuthSession
  applicableTagsIds: string[]
  handleAddTag: (tag: TTagDTO) => void
  handleRemoveTag: (tagId: string) => void
  entities: TTag['entidades']
}
export function GeneralTagsHolder({ session, applicableTagsIds, handleAddTag, handleRemoveTag, entities }: GeneralTagsHolderProps) {
  const {
    data: tags,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useTags({
    initialFilters: {
      applicableToOpportunities: entities.oportunidades ? 'true' : 'false',
      applicableToProposals: entities.propostas ? 'true' : 'false',
      applicableToPurchases: entities.compras ? 'true' : 'false',
      applicableToProjects: entities.projetos ? 'true' : 'false',
      applicableToServiceOrders: entities.ordensServico ? 'true' : 'false',
    },
  })
  const [tagsMenuIsOpen, setTagsMenuIsOpen] = useState(false)

  return (
    <>
      {isLoading ? <h1 className="animate-pulse text-sm tracking-tight text-primary/80">Carregando etiquetas...</h1> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess ? (
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          {tags
            .filter((p) => applicableTagsIds.includes(p._id))
            .map((tag) => (
              <div
                key={`${tag._id}`}
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
                  type="button"
                  onClick={() => handleRemoveTag(tag._id)}
                  className="items-center justify-center opacity-0 duration-300 ease-in-out group-hover:opacity-100"
                >
                  <X height={12} width={12} />
                </button>
              </div>
            ))}
          <Button onClick={() => setTagsMenuIsOpen(true)} variant={'ghost'} className="flex items-center gap-2">
            <Tags className="min-w-4 min-h-4 h-4 w-4" />
            <p className="text-sm font-bold">+ TAGS</p>
          </Button>
        </div>
      ) : null}
      {tagsMenuIsOpen ? (
        <TagsMenu
          session={session}
          tags={tags || []}
          applicableTagsIds={applicableTagsIds}
          handleAddTag={handleAddTag}
          handleRemoveTag={handleRemoveTag}
          entities={entities}
          closeModal={() => setTagsMenuIsOpen(false)}
        />
      ) : null}
    </>
  )
}

type TagsMenuProps = {
  session: TAuthSession
  tags: TGetTagsRouteOutputDefault
  applicableTagsIds: string[]
  handleAddTag: (tag: TTagDTO) => void
  handleRemoveTag: (tagId: string) => void
  entities: TTag['entidades']
  closeModal: () => void
}
function TagsMenu({ session, tags, applicableTagsIds, handleAddTag, handleRemoveTag, entities, closeModal }: TagsMenuProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const MENU_TITLE = 'MENU DE ETIQUETAS'
  const MENU_DESCRIPTION = 'Gerencie suas etiquetas...'
  return isDesktop ? (
    <Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
      <DialogContent className="flex h-fit max-h-[70vh] min-h-[50vh] flex-col">
        <DialogHeader>
          <DialogTitle>{MENU_TITLE}</DialogTitle>
          <DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <TagsMenuContent
            session={session}
            tags={tags}
            entities={entities}
            applicableTagsIds={applicableTagsIds}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
          />
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open onOpenChange={(v) => (!v ? closeModal() : null)}>
      <DrawerContent className="flex h-fit max-h-[70vh] flex-col">
        <DrawerHeader className="text-left">
          <DrawerTitle>{MENU_TITLE}</DrawerTitle>
          <DrawerDescription>{MENU_DESCRIPTION}</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-auto pb-4">
          <TagsMenuContent
            session={session}
            tags={tags}
            entities={entities}
            applicableTagsIds={applicableTagsIds}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

type TagsMenuContentProps = {
  session: TAuthSession
  tags: TGetTagsRouteOutputDefault
  entities: TTag['entidades']
  applicableTagsIds: string[]
  handleAddTag: (tag: TTagDTO) => void
  handleRemoveTag: (tagId: string) => void
}
function TagsMenuContent({ session, tags, entities, applicableTagsIds, handleAddTag, handleRemoveTag }: TagsMenuContentProps) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState<TTag>({
    titulo: '',
    cores: {
      primaria: TagsColorPalette[0].primaria,
      secundaria: TagsColorPalette[0].secundaria,
    },
    entidades: entities,
    autor: session.user,
    dataInsercao: new Date().toISOString(),
  })
  function updateInfoHolder(changes: Partial<TTag>) {
    setInfoHolder((prev) => ({ ...prev, ...changes }))
  }

  const { mutate: mutationCreateTag, isPending: isCreateTagLoading } = useMutation({
    mutationKey: ['create-tag', `${infoHolder.titulo}-${infoHolder.cores.primaria}-${infoHolder.cores.secundaria}`],
    mutationFn: createTag,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['tags'] })
    },
    onSuccess: async (data, variables) => {
      handleAddTag({
        _id: data.insertedId,
        ...variables.tag,
      })
      return toast.success(data.message)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
    onError: (error) => {
      return toast.error(getErrorMessage(error))
    },
  })
  function getFilteredTags(tags: TGetTagsRouteOutputDefault) {
    return {
      applicable: tags.filter((p) => applicableTagsIds.includes(p._id)),
      available: tags.filter(
        (p) =>
          !applicableTagsIds.includes(p._id) && formatWithoutDiacritics(p.titulo, true).includes(formatWithoutDiacritics(infoHolder.titulo, true))
      ),
    }
  }
  const { applicable, available } = getFilteredTags(tags || [])
  return (
    <div className="flex h-full w-full flex-col gap-6 px-4">
      <input
        type="text"
        value={infoHolder.titulo}
        placeholder="Pesquise aqui por uma etiqueta..."
        onChange={(e) => updateInfoHolder({ titulo: e.target.value })}
        className="w-full rounded-md p-1 text-sm outline-none duration-500 ease-in-out placeholder:italic"
      />
      <div className="flex w-full flex-col gap-1.5">
        <h1 className="text-sm font-medium tracking-tight text-primary/80">ETIQUETAS APLICADAS</h1>
        <div className="flex w-full flex-wrap gap-2">
          {applicable.map((tag) => (
            <div
              key={`${tag._id}`}
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
                type="button"
                onClick={() => handleRemoveTag(tag._id)}
                className="items-center justify-center opacity-0 duration-300 ease-in-out group-hover:opacity-100"
              >
                <X height={12} width={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <h1 className="text-sm font-medium tracking-tight text-primary/80">ETIQUETAS DISPONÍVEIS</h1>
        <div className="flex w-full flex-wrap gap-2">
          {available.length > 0 ? (
            available.map((tag) => (
              <button
                type="button"
                onClick={() => handleAddTag(tag)}
                key={`${tag._id}`}
                style={{
                  border: '1px solid',
                  borderColor: tag.cores.primaria,
                  color: tag.cores.primaria,
                  backgroundColor: tag.cores.secundaria,
                }}
                className={cn('group flex items-center gap-1 rounded py-0.5 pl-2 pr-1 duration-300 ease-in-out hover:scale-[1.02]')}
              >
                <Tag width={12} height={12} />
                <h1 className="text-[0.65rem] font-bold tracking-tight">{tag.titulo}</h1>
              </button>
            ))
          ) : (
            <div className="flex w-full grow flex-col items-center justify-center gap-2 p-2">
              <p className="text-xs font-medium text-primary/80">
                Oops, não encontramos nenhuma etiqueta. Se precisar, crie uma preenchendo os dados abaixo.
              </p>
              <div
                style={{
                  border: '1px solid',
                  borderColor: infoHolder.cores.primaria,
                  color: infoHolder.cores.primaria,
                  backgroundColor: infoHolder.cores.secundaria,
                }}
                className={cn('flex items-center gap-1 rounded px-2 py-0.5')}
              >
                <Tag width={12} height={12} />
                <h1 className="text-[0.7rem] font-bold tracking-tight">{infoHolder.titulo}</h1>
              </div>
              <div className="flex w-full flex-wrap items-center justify-center gap-1">
                {TagsColorPalette.map((tagColor) => (
                  <button
                    key={`${tagColor.primaria}-${tagColor.secundaria}`}
                    type="button"
                    onClick={() => updateInfoHolder({ cores: { primaria: tagColor.primaria, secundaria: tagColor.secundaria } })}
                    style={{ border: '1px solid', borderColor: tagColor.primaria, backgroundColor: tagColor.secundaria }}
                    className={cn('h-4 w-4 rounded-full opacity-60', tagColor.primaria === infoHolder.cores.primaria ? 'scale-110 opacity-100' : '')}
                  />
                ))}
              </div>
              <LoadingButton
                loading={isCreateTagLoading}
                onClick={() =>
                  mutationCreateTag({
                    tag: infoHolder,
                  })
                }
                size={'xs'}
              >
                ADICIONAR ETIQUETA
              </LoadingButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
