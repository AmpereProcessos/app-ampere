import { Button } from '@/components/ui/button'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { formatDateAsLocale, formatLocation } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import { useAllocators } from '@/utils/methods/query/allocators'
import { TAllocatorDTO } from '@/utils/schemas/allocators'
import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import { BsCalendarPlus } from 'react-icons/bs'
import { FaLocationDot } from 'react-icons/fa6'
import ControlAllocator from '../almoxarifado/alocadores/ControlAllocator'
import NewAllocator from '../almoxarifado/alocadores/NewAllocator'
import { useQueryClient } from '@tanstack/react-query'
import { TAuthSession } from '@/lib/authentication/types'

type ConfigurationsAllocatorsBlockProps = {
  session: TAuthSession
}
function ConfigurationsAllocatorsBlock({ session }: ConfigurationsAllocatorsBlockProps) {
  const queryClient = useQueryClient()
  const { data: allocators, isLoading, isSuccess, isError, error } = useAllocators()
  const [newAllocatorModalIsOpen, setNewAllocatorModalIsOpen] = useState(false)
  const [editModal, setEditModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })

  async function handleOnMutate() {
    await queryClient.cancelQueries({ queryKey: ['allocators'] })
  }
  async function handleOnSettled() {
    await queryClient.invalidateQueries({ queryKey: ['allocators'] })
  }
  return (
    <div className="flex h-full grow flex-col">
      <div className="border-primary/20 flex w-full flex-col items-center justify-between border-b pb-2 lg:flex-row">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">Controle de Alocadores</h1>
          <p className="text-sm text-[#71717A]">Gerencie, adicione e edite os alocadores</p>
          <p className="text-sm text-[#71717A]">{isSuccess ? allocators.length : '0'} alocadores atualmente cadastrados</p>
        </div>
        <Button onClick={() => setNewAllocatorModalIsOpen(true)} type="button">
          NOVO ALOCADOR
        </Button>
      </div>
      <div className="flex w-full flex-col gap-2 py-2">
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
        {isSuccess ? (
          allocators && allocators.length > 0 ? (
            allocators.map((allocator) => (
              <AllocatorCard key={allocator._id} allocator={allocator} handleClick={(id) => setEditModal({ id, isOpen: true })} />
            ))
          ) : (
            <div className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Nenhum alocador encontrado.</div>
          )
        ) : null}
      </div>
      {editModal.isOpen && editModal.id ? (
        <ControlAllocator
          allocatorId={editModal.id}
          session={session}
          closeModal={() => setEditModal({ id: null, isOpen: false })}
          callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
        />
      ) : null}
      {newAllocatorModalIsOpen ? (
        <NewAllocator
          session={session}
          closeModal={() => setNewAllocatorModalIsOpen(false)}
          callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
        />
      ) : null}
    </div>
  )
}

export default ConfigurationsAllocatorsBlock

type AllocatorCardProps = {
  allocator: TAllocatorDTO
  handleClick: (id: string) => void
}
function AllocatorCard({ allocator, handleClick }: AllocatorCardProps) {
  return (
    <div className="border-primary bg-background flex w-full flex-col gap-1 rounded border p-2 shadow-xs dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full items-center justify-start gap-2 lg:grow">
          <p className="text-sm leading-none font-bold tracking-tight">{allocator.nome}</p>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
          <div className="flex items-center gap-1">
            <FaLocationDot width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">LOCALIZAÇÃO</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {formatLocation({
                location: {
                  uf: allocator!.localizacao.uf || '',
                  cidade: allocator!.localizacao.cidade || '',
                  cep: allocator!.localizacao.cep,
                  bairro: allocator!.localizacao.bairro,
                  endereco: allocator!.localizacao.endereco,
                  numeroOuIdentificador: allocator!.localizacao.numeroOuIdentificador,
                  complemento: allocator!.localizacao.complemento,
                  latitude: allocator!.localizacao.latitude,
                  longitude: allocator!.localizacao.longitude,
                },
                includeCity: true,
                includeUf: true,
              })}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(allocator.dataInsercao, true)}</p>
          </div>
        </div>
        <button
          onClick={() => handleClick(allocator._id)}
          className="bg-primary text-secondary flex items-center gap-1 rounded-lg px-2 py-1 text-[0.6rem]"
        >
          <Pencil width={10} height={10} />
          <p>EDITAR</p>
        </button>
      </div>
    </div>
  )
}
