import { useDebounce } from '@/lib/hooks/debounce'
import { getErrorMessage } from '@/utils/methods/handlers'
import { useVinculationMaterialsBySearch } from '@/utils/methods/query/materials'
import { TMaterial, TMaterialSimplifiedWithAlocatorDTO, TQueryVinculationMaterialsFilter } from '@/utils/schemas/materials'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import React, { useState } from 'react'
import ErrorComponent from './utils/ErrorComponent'
import { Box, Link, Ruler, Warehouse } from 'lucide-react'
import { Button } from './ui/button'
import { TPurchaseControl } from '@/utils/schemas/purchases'
import { useMediaQuery } from '@/lib/hooks/media-query'
import NumberInput from './inputs/Number'
import SelectInput from './inputs/Select'
import { units } from '@/utils/select-options'
import { LoadingButton } from './utils/Buttons/LoadingButton'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMaterial } from '@/utils/methods/mutation/materials'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { useAllocators } from '@/utils/methods/query/allocators'

function StockMaterialSearch() {
  return <PurchaseComponentDefinition />
}

export default StockMaterialSearch

type TCompositionItemHolder = TPurchaseControl['composicao'][number]
function PurchaseComponentDefinition() {
  const { data: allocators } = useAllocators()
  const [compositionItemHolder, setCompositionItemHolder] = useState<TCompositionItemHolder>({
    materialId: null,
    categoria: 'OUTROS',
    descricao: '',
    qtde: 1,
    unidade: 'UN',
    valor: 0,
  })

  function updateCompositionItemHolder(holder: Partial<TCompositionItemHolder>) {
    setCompositionItemHolder((prev) => ({ ...prev, ...holder }))
  }
  return (
    <div className="flex w-[90%] flex-col gap-2 rounded border border-primary/20 p-3">
      <h1 className="text-center text-sm font-medium tracking-tight text-primary/80">Adicione um material à composição da compra.</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-[30%]">
          <MaterialSelector compositionItemHolder={compositionItemHolder} updateCompositionItemHolder={updateCompositionItemHolder} />
        </div>
        <div className="w-full lg:w-[20%]">
          <NumberInput
            value={compositionItemHolder.qtde}
            handleChange={(value) => updateCompositionItemHolder({ qtde: value })}
            label="QUANTIDADE"
            placeholder="Preencha aqui a quantidade."
          />
        </div>
        <div className="w-full lg:w-[20%]">
          <NumberInput
            value={compositionItemHolder.valor}
            handleChange={(value) => updateCompositionItemHolder({ valor: value })}
            label="VALOR UNITÁRIO"
            placeholder="Preencha aqui o valor unitário."
          />
        </div>
        <div className="w-full lg:w-[20%]">
          <SelectInput
            value={compositionItemHolder.alocadorDestinoId}
            handleChange={(value) => updateCompositionItemHolder({ alocadorDestinoId: value })}
            label="ALOCADOR DESTINO"
            options={allocators?.map((allocator) => ({ id: allocator._id, label: allocator.nome, value: allocator._id })) || []}
            selectedItemLabel={'ALOCADOR DO PROJETO'}
            onReset={() => updateCompositionItemHolder({ alocadorDestinoId: null })}
          />
        </div>
      </div>
    </div>
  )
}

type MaterialSelectorProps = {
  compositionItemHolder: TCompositionItemHolder
  updateCompositionItemHolder: (holder: Partial<TCompositionItemHolder>) => void
}
function MaterialSelector({ compositionItemHolder, updateCompositionItemHolder }: MaterialSelectorProps) {
  const debouncedQueryParams = useDebounce({ search: compositionItemHolder.descricao }, 350)
  const { data: materials, isLoading, isFetching, isError, isSuccess, isStale, error } = useVinculationMaterialsBySearch(debouncedQueryParams)

  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  function getSelectedMaterial({ materialId, materials }: { materialId?: string | null; materials?: TMaterialSimplifiedWithAlocatorDTO[] }) {
    if (!materialId || !materials) return null
    return materials.find((material) => material._id === materialId) || null
  }
  const selectedMaterial = getSelectedMaterial({ materialId: compositionItemHolder.materialId, materials })

  function handleMaterialVinculation(materialId: string) {
    if (!materials) return toast.error('Não foi possível vincular o material.')
    const selectedMaterial = materials.find((material) => material._id === materialId)
    updateCompositionItemHolder({ materialId, descricao: selectedMaterial?.nome || '', unidade: selectedMaterial?.grandeza || 'UN' })
    setOpen(false)
  }
  function handleMaterialUnvinculation() {
    updateCompositionItemHolder({ materialId: null, descricao: '' })
  }
  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full rounded-md border border-primary/20 p-3 text-xs shadow-sm outline-none duration-500 ease-in-out placeholder:italic focus:border-primary"
          >
            {selectedMaterial ? (
              <div className="flex items-center gap-1">
                <h1 className="text-sm font-medium tracking-tight text-primary">{selectedMaterial.nome}</h1>
                <div className="flex items-center gap-1">
                  <Ruler width={15} height={15} />
                  <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{selectedMaterial.grandeza}</h1>
                </div>
                <div className="flex items-center gap-1">
                  <Warehouse width={15} height={15} />
                  <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">
                    {selectedMaterial.alocadorDados?.nome || 'N/A'}
                  </h1>
                </div>
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full bg-green-600 p-1 text-xs font-medium text-white duration-300 ease-in-out'
                  )}
                >
                  <Link size={12} />
                </div>
              </div>
            ) : (
              <>Defina aqui um material...</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="flex max-h-[350px] w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)] flex-col gap-2 overflow-y-auto overscroll-y-auto p-3 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300"
          sideOffset={5}
        >
          {isLoading ? <h1 className="animate-pulse text-center text-xs font-medium italic text-primary/80">Carregando...</h1> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? (
            <MaterialList
              vinculatedMaterialId={compositionItemHolder.materialId}
              materials={materials}
              materialDescription={compositionItemHolder.descricao}
              updateMaterialDescription={(value) => updateCompositionItemHolder({ descricao: value })}
              handleMaterialVinculation={handleMaterialVinculation}
              handleMaterialUnvinculation={handleMaterialUnvinculation}
            />
          ) : null}
        </PopoverContent>
      </Popover>
    )
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedMaterial ? <>{selectedMaterial.nome}</> : <>Defina aqui um material...</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex h-[80%] max-h-[80%]  w-full flex-col gap-2 p-3">
        {isLoading ? <h1 className="animate-pulse text-center text-xs font-medium italic text-primary/80">Carregando...</h1> : null}
        {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
        {isSuccess ? (
          <MaterialList
            vinculatedMaterialId={compositionItemHolder.materialId}
            materials={materials}
            materialDescription={compositionItemHolder.descricao}
            updateMaterialDescription={(value) => updateCompositionItemHolder({ descricao: value })}
            handleMaterialVinculation={handleMaterialVinculation}
            handleMaterialUnvinculation={handleMaterialUnvinculation}
          />
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
type MaterialListProps = {
  materials: TMaterialSimplifiedWithAlocatorDTO[]
  vinculatedMaterialId?: string | null
  materialDescription: string
  updateMaterialDescription: (description: string) => void
  handleMaterialVinculation: (materialId: string) => void
  handleMaterialUnvinculation: () => void
}
function MaterialList({
  materials,
  vinculatedMaterialId,
  materialDescription,
  updateMaterialDescription,
  handleMaterialVinculation,
  handleMaterialUnvinculation,
}: MaterialListProps) {
  return (
    <>
      {/**HEADER BLOCK */}
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-center justify-center gap-2">
          <Box size={15} />
          <h1 className="text-center text-sm font-medium tracking-tight text-primary/80">MENU DE MATERIAIS</h1>
        </div>
        <input
          type="text"
          value={materialDescription}
          onChange={(e) => updateMaterialDescription(e.target.value)}
          placeholder="Filtre o item desejado..."
          className="h-full w-full italic outline-none"
        />
      </div>
      <div className="my-2 h-[1px] w-full bg-primary/30"></div>
      <div className="flex w-full grow flex-col gap-2 overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        {materials.length > 0 ? (
          materials.map((material) => (
            <div key={material._id} className="group flex w-full items-center justify-between gap-2 rounded px-2 py-1 hover:bg-blue-100">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-medium tracking-tight text-primary">{material.nome}</h1>
                <div className="flex items-center gap-1">
                  <Ruler width={15} height={15} />
                  <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{material.grandeza}</h1>
                </div>
                <div className="flex items-center gap-1">
                  <Warehouse width={15} height={15} />
                  <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{material.alocadorDados?.nome || 'N/A'}</h1>
                </div>
              </div>
              <button
                onClick={() => {
                  if (vinculatedMaterialId === material._id) {
                    handleMaterialUnvinculation()
                  } else {
                    handleMaterialVinculation(material._id)
                  }
                }}
                className={cn(
                  'flex items-center justify-center rounded-full bg-blue-500 p-1 text-xs font-medium text-white duration-300 ease-in-out hover:bg-blue-700',
                  vinculatedMaterialId === material._id && 'bg-green-500 hover:bg-green-700'
                )}
              >
                <Link size={12} />
              </button>
            </div>
          ))
        ) : materialDescription.trim().length > 3 ? (
          <NewMaterialMenu initialName={materialDescription} />
        ) : (
          <p className="text-center text-xs font-medium italic text-primary/80">Nenhum material encontrado...</p>
        )}
      </div>
    </>
  )
}
type NewMaterialMenuProps = {
  initialName: string
}
function NewMaterialMenu({ initialName }: NewMaterialMenuProps) {
  const queryClient = useQueryClient()
  const [newMaterial, setNewMaterial] = useState<TMaterial>({
    nome: initialName,
    grandeza: 'UN',
    qtde: 0,
    dataInsercao: new Date().toISOString(),
    preco: 0,
    alocadorId: null,
    nomeTecnico: null,
    qtdeMaxima: null,
  })

  const { mutate: handleCreateMaterial, isPending } = useMutation({
    mutationKey: ['create-material'],
    mutationFn: createMaterial,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['materials-vinculation-search'] })
    },
    onSuccess: () => {
      toast.success('Material criado com sucesso!')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['materials-vinculation-search'] })
    },
  })
  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-1">
      <h1 className="w-full text-center text-xs font-medium tracking-tight text-primary/80">Adicione um novo material ao estoque.</h1>
      <div className="flex items-center">
        <SelectInput
          label="GRANDEZA"
          labelClassName="text-[0.6rem]"
          holderClassName="text-xs p-2 min-h-[34px]"
          value={newMaterial.grandeza}
          selectedItemLabel={'NÃO DEFINIDO'}
          options={units}
          handleChange={(value) => setNewMaterial((prev) => ({ ...prev, grandeza: value }))}
          onReset={() => setNewMaterial((prev) => ({ ...prev, grandeza: 'UN' }))}
        />
      </div>
      <LoadingButton loading={isPending} onClick={() => handleCreateMaterial({ info: { ...newMaterial, nome: initialName } })} size={'xs'}>
        CRIAR MATERIAL
      </LoadingButton>
    </div>
  )
}
