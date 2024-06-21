import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import ModalNewServiceOrder from './identificador/ordensDeServico/ModalNewServiceOrder'
import { TProjectDTO } from '@/utils/schemas/projects'

type OSCreationBlockProps = {
  project: TProjectDTO
  categories: { label: string; value: string }[]
}
function OSCreationBlock({ project, categories }: OSCreationBlockProps) {
  const { data: session, status } = useSession()
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  if (status != 'authenticated') return null
  return (
    <div className="flex w-full flex-col items-center">
      <div
        onClick={() => setDropdownMenuVisible(true)}
        className="mb-2 flex w-fit  cursor-pointer items-center justify-between rounded-md bg-gray-500 p-2 hover:bg-cyan-500"
      >
        <h1 className="text-center font-bold text-white">ABRIR PAINEL DE CRIAÇÃO DE ORDEM DE SERVIÇO</h1>
      </div>

      {dropdownMenuVisible ? (
        <ModalNewServiceOrder project={project} categories={categories} closeModal={() => setDropdownMenuVisible(false)} session={session} />
      ) : null}
    </div>
  )
}

export default OSCreationBlock
