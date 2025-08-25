// React and Next.js
import { useState } from 'react'

// Types
// Components
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'

// Icons
import { Tag, Tags, X } from 'lucide-react'

// Utils
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/lib/hooks/media-query'
import { TagsColorPalette } from '@/utils/select-options'
import { formatWithoutDiacritics } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import { useMaterialSuppliers } from '@/utils/methods/query/materials'
import { createMaterialSupplier } from '@/utils/methods/mutation/materials'

// Third-party
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { TMaterialSupplier, TMaterialSupplierDTO } from '@/utils/schemas/materials'
import type { TAuthSession } from '@/lib/authentication/types'

type MaterialSuppliersHolderProps = {
  session: TAuthSession
  applicableSuppliersIds: string[]
  handleAddSupplier: (supplier: TMaterialSupplierDTO) => void
  handleRemoveSupplier: (supplierId: string) => void
}
export function MaterialSuppliersHolder({ session, applicableSuppliersIds, handleAddSupplier, handleRemoveSupplier }: MaterialSuppliersHolderProps) {
  const { data: suppliers, isLoading, isError, isSuccess, error } = useMaterialSuppliers()
  const [tagsMenuIsOpen, setTagsMenuIsOpen] = useState(false)

  return (
    <>
      {isLoading ? <h1 className="animate-pulse text-sm tracking-tight text-primary/80">Carregando fornecedores...</h1> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess ? (
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          {suppliers
            .filter((p) => applicableSuppliersIds.includes(p._id))
            .map((supplier) => (
              <div
                key={`${supplier._id}`}
                style={{
                  border: '1px solid',
                  borderColor: supplier.cores.primaria,
                  color: supplier.cores.primaria,
                  backgroundColor: supplier.cores.secundaria,
                }}
                className={cn('group flex items-center gap-1 rounded py-0.5 pl-2 pr-1')}
              >
                <Tag width={12} height={12} />
                <h1 className="text-[0.65rem] font-bold tracking-tight">{supplier.nome}</h1>
                <button
                  type="button"
                  onClick={() => handleRemoveSupplier(supplier._id)}
                  className="items-center justify-center opacity-0 duration-300 ease-in-out group-hover:opacity-100"
                >
                  <X height={12} width={12} />
                </button>
              </div>
            ))}
          <Button onClick={() => setTagsMenuIsOpen(true)} variant={'ghost'} className="flex items-center gap-2">
            <Tags className="min-w-4 min-h-4 h-4 w-4" />
            <p className="text-sm font-bold">+ FORNECEDORES</p>
          </Button>
        </div>
      ) : null}
      {tagsMenuIsOpen ? (
        <SuppliersMenu
          session={session}
          suppliers={suppliers || []}
          applicableSuppliersIds={applicableSuppliersIds}
          handleAddSupplier={handleAddSupplier}
          handleRemoveSupplier={handleRemoveSupplier}
          closeModal={() => setTagsMenuIsOpen(false)}
        />
      ) : null}
    </>
  )
}

type SuppliersMenuProps = {
  session: TAuthSession
  suppliers: TMaterialSupplierDTO[]
  applicableSuppliersIds: string[]
  handleAddSupplier: (supplier: TMaterialSupplierDTO) => void
  handleRemoveSupplier: (supplierId: string) => void
  closeModal: () => void
}
function SuppliersMenu({ session, suppliers, applicableSuppliersIds, handleAddSupplier, handleRemoveSupplier, closeModal }: SuppliersMenuProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const MENU_TITLE = 'MENU DE FORNECEDORES'
  const MENU_DESCRIPTION = 'Gerencie seus fornecedores...'
  return isDesktop ? (
    <Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
      <DialogContent className="flex h-fit max-h-[70vh] min-h-[50vh] flex-col">
        <DialogHeader>
          <DialogTitle>{MENU_TITLE}</DialogTitle>
          <DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <SuppliersMenuContent
            session={session}
            suppliers={suppliers}
            applicableSuppliersIds={applicableSuppliersIds}
            handleAddSupplier={handleAddSupplier}
            handleRemoveSupplier={handleRemoveSupplier}
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
          <SuppliersMenuContent
            session={session}
            suppliers={suppliers}
            applicableSuppliersIds={applicableSuppliersIds}
            handleAddSupplier={handleAddSupplier}
            handleRemoveSupplier={handleRemoveSupplier}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

type SuppliersMenuContentProps = {
  session: TAuthSession
  suppliers: TMaterialSupplierDTO[]
  applicableSuppliersIds: string[]
  handleAddSupplier: (supplier: TMaterialSupplierDTO) => void
  handleRemoveSupplier: (supplierId: string) => void
}
function SuppliersMenuContent({ session, suppliers, applicableSuppliersIds, handleAddSupplier, handleRemoveSupplier }: SuppliersMenuContentProps) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState<TMaterialSupplier>({
    nome: '',
    telefone: '',
    email: '',
    cnpj: '',
    cores: {
      primaria: TagsColorPalette[0].primaria,
      secundaria: TagsColorPalette[0].secundaria,
    },
    dataInsercao: new Date().toISOString(),
  })
  function updateInfoHolder(changes: Partial<TMaterialSupplier>) {
    setInfoHolder((prev) => ({ ...prev, ...changes }))
  }

  const { mutate: mutationCreateSupplier, isPending: isCreateSupplierLoading } = useMutation({
    mutationKey: ['create-supplier', `${infoHolder.nome}-${infoHolder.cores.primaria}-${infoHolder.cores.secundaria}`],
    mutationFn: createMaterialSupplier,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['material-suppliers'] })
    },
    onSuccess: async (data, variables) => {
      handleAddSupplier({
        _id: data.data.insertedId,
        ...variables.info,
      })
      return toast.success(data.message)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['material-suppliers'] })
    },
    onError: (error) => {
      return toast.error(getErrorMessage(error))
    },
  })
  function getFilteredSuppliers(suppliers: TMaterialSupplierDTO[]) {
    return {
      applicable: suppliers.filter((p) => applicableSuppliersIds.includes(p._id)),
      available: suppliers.filter(
        (p) =>
          !applicableSuppliersIds.includes(p._id) && formatWithoutDiacritics(p.nome, true).includes(formatWithoutDiacritics(infoHolder.nome, true))
      ),
    }
  }
  const { applicable, available } = getFilteredSuppliers(suppliers || [])
  return (
    <div className="flex h-full w-full flex-col gap-6 px-4">
      <input
        type="text"
        value={infoHolder.nome}
        placeholder="Pesquise aqui por um fornecedor..."
        onChange={(e) => updateInfoHolder({ nome: e.target.value })}
        className="w-full rounded-md p-1 text-sm outline-hidden duration-500 ease-in-out placeholder:italic"
      />
      <div className="flex w-full flex-col gap-1.5">
        <h1 className="text-sm font-medium tracking-tight text-primary/80">FORNECEDORES APLICADOS</h1>
        <div className="flex w-full flex-wrap gap-2">
          {applicable.map((supplier) => (
            <div
              key={`${supplier._id}`}
              style={{
                border: '1px solid',
                borderColor: supplier.cores.primaria,
                color: supplier.cores.primaria,
                backgroundColor: supplier.cores.secundaria,
              }}
              className={cn('group flex items-center gap-1 rounded py-0.5 pl-2 pr-1')}
            >
              <Tag width={12} height={12} />
              <h1 className="text-[0.65rem] font-bold tracking-tight">{supplier.nome}</h1>
              <button
                type="button"
                onClick={() => handleRemoveSupplier(supplier._id)}
                className="items-center justify-center opacity-0 duration-300 ease-in-out group-hover:opacity-100"
              >
                <X height={12} width={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <h1 className="text-sm font-medium tracking-tight text-primary/80">FORNECEDORES DISPONÍVEIS</h1>
        <div className="flex w-full flex-wrap gap-2">
          {available.length > 0 ? (
            available.map((supplier) => (
              <button
                type="button"
                onClick={() => handleAddSupplier(supplier)}
                key={`${supplier._id}`}
                style={{
                  border: '1px solid',
                  borderColor: supplier.cores.primaria,
                  color: supplier.cores.primaria,
                  backgroundColor: supplier.cores.secundaria,
                }}
                className={cn('group flex items-center gap-1 rounded py-0.5 pl-2 pr-1 duration-300 ease-in-out hover:scale-[1.02]')}
              >
                <Tag width={12} height={12} />
                <h1 className="text-[0.65rem] font-bold tracking-tight">{supplier.nome}</h1>
              </button>
            ))
          ) : (
            <div className="flex w-full grow flex-col items-center justify-center gap-2 p-2">
              <p className="text-xs font-medium text-primary/80">
                Oops, não encontramos nenhum fornecedor. Se precisar, crie um preenchendo os dados abaixo.
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
                <h1 className="text-[0.7rem] font-bold tracking-tight">{infoHolder.nome}</h1>
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
                loading={isCreateSupplierLoading}
                onClick={() =>
                  mutationCreateSupplier({
                    info: infoHolder,
                  })
                }
                size={'xs'}
              >
                ADICIONAR FORNECEDOR
              </LoadingButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
