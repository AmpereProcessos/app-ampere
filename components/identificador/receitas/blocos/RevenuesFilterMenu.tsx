'use client'
import React, { useState } from 'react'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import MultipleSelectInputVirtualized from '@/components/inputs/MultipleSelectInputVirtualized'
import { Button } from '@/components/ui/button'
import { TRevenueQueryFilters } from '@/utils/schemas/revenues'
import TextInput from '@/components/inputs/Text'
import { revenueSources } from '@/utils/select-options'

type RevenuesFilterMenuProps = {
  queryParams: TRevenueQueryFilters & { page: number }
  updateQueryParams: (params: Partial<TRevenueQueryFilters & { page: number }>) => void
  closeMenu: () => void
}
function RevenuesFilterMenu({ queryParams, updateQueryParams, closeMenu }: RevenuesFilterMenuProps) {
  const [queryParamsHolder, setQueryParamsHolder] = useState<TRevenueQueryFilters & { page: number }>(queryParams)
  return (
    <Sheet open onOpenChange={closeMenu}>
      <SheetContent>
        <div className="flex h-full w-full flex-col">
          <SheetHeader>
            <SheetTitle>FILTRAR RECEITAS</SheetTitle>
            <SheetDescription>Escolha aqui parâmetros para filtrar as receitas.</SheetDescription>
          </SheetHeader>

          <div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex h-full flex-col gap-y-4 overflow-y-auto overscroll-y-auto p-2">
            <div className="flex w-full flex-col gap-2">
              <MultipleSelectInputVirtualized
                label={'STATUS'}
                selected={queryParamsHolder.status}
                options={[
                  { id: 1, label: 'RECEBIDO', value: 'RECEBIDO' },
                  { id: 2, label: 'RECEBIDO PARCIAL', value: 'RECEBIDO PARCIAL' },
                  { id: 3, label: 'PENDENTE', value: 'PENDENTE' },
                ]}
                handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, status: value as any[] }))}
                selectedItemLabel={'NÃO DEFINIDO'}
                onReset={() => setQueryParamsHolder((prev) => ({ ...prev, status: [] }))}
                width="100%"
              />

              <TextInput
                label="TÍTULO"
                value={queryParamsHolder.search}
                placeholder={'Preenha aqui o título da receita para filtro.'}
                handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, search: value }))}
                width={'100%'}
              />

              <MultipleSelectInputVirtualized
                label={'CATEGORIAS'}
                selected={queryParamsHolder.types}
                options={revenueSources}
                handleChange={(value) => {
                  setQueryParamsHolder((prev) => ({ ...prev, types: value as string[] }))
                  localStorage.setItem('revenues-types-filter', JSON.stringify(value))
                }}
                selectedItemLabel={'NÃO DEFINIDO'}
                onReset={() => {
                  setQueryParamsHolder((prev) => ({ ...prev, types: [] }))
                  localStorage.setItem('revenues-types-filter', JSON.stringify([]))
                }}
                width="100%"
              />
            </div>
          </div>
          <Button
            onClick={() => {
              updateQueryParams({ ...queryParamsHolder, page: 1 })
              closeMenu()
            }}
          >
            FILTRAR
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default RevenuesFilterMenu
