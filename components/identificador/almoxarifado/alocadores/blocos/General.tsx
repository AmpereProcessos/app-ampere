import TextInput from '@/components/inputs/Text'
import TextareaInput from '@/components/inputs/TextareaInput'
import { TAllocator } from '@/utils/schemas/allocators'
import React from 'react'

type AllocatorGeneralProps = {
  data: TAllocator
  updateAllocator: (data: Partial<TAllocator>) => void
}
function AllocatorGeneral({ data, updateAllocator }: AllocatorGeneralProps) {
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">INFORMAÇÕES GERAIS</h1>
      <div className="flex w-full grow flex-col gap-2">
        <TextInput
          label="NOME DO ALOCADOR"
          placeholder="Preencha aqui o nome do alocador..."
          value={data.nome}
          handleChange={(value) => updateAllocator({ nome: value })}
          width="100%"
        />
        <TextareaInput
          label="DESCRIÇÃO DO ALOCADOR"
          placeholder="Preencha aqui a descrição do alocador..."
          value={data.descricao || ''}
          handleChange={(value) => updateAllocator({ descricao: value })}
        />
      </div>
    </div>
  )
}

export default AllocatorGeneral
