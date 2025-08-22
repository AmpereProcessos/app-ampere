import React, { useState } from 'react'

import toast from 'react-hot-toast'
import { BsCalendarPlus } from 'react-icons/bs'
import Avatar from '../utils/Avatar'
import { MdDelete } from 'react-icons/md'
import { TProjectDTOWithHomologation } from '@/utils/schemas/projects'
import TextInput from '../inputs/Text'
import { formatDateAsLocale, formatDateTime } from '@/utils/methods/formatting'
import DateTimeInput from '../inputs/DateTimeInput'
import { formatDateInputChange } from '@/utils/methods/shared'
import type { TAuthSession } from '@/lib/authentication/types'

type UpdatesInformationProps = {
  session: TAuthSession
  infoHolder: TProjectDTOWithHomologation
  setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}
function UpdatesInformation({ session, infoHolder, setInfoHolder, setChanges }: UpdatesInformationProps) {
  const [updateHolder, setUpdateHolder] = useState<TProjectDTOWithHomologation['homologacao']['atualizacoes'][number]>({
    data: new Date().toISOString(),
    descricao: '',
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
  })

  function addUpdate(info: TProjectDTOWithHomologation['homologacao']['atualizacoes'][number]) {
    if (!updateHolder.data) return toast.error('Preencha uma data válida.')
    if (updateHolder.descricao.trim().length < 3) return toast.error('Preencha uma descrição de ao menos 3 caractéres...')
    const updates = [...infoHolder.homologacao.atualizacoes]
    updates.push(info)

    setChanges((prev) => ({ ...prev, 'homologacao.atualizacoes': updates }))
    return setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, atualizacoes: updates } }))
  }
  function removeUpdate(index: number) {
    const updates = [...infoHolder.homologacao.atualizacoes]
    updates.splice(index, 1)

    setChanges((prev) => ({ ...prev, 'homologacao.atualizacoes': updates }))
    return setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, atualizacoes: updates } }))
  }
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-cyan-800 p-1 text-center font-bold text-white">ATUALIZAÇÕES</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TextInput
            label="DESCRIÇÃO DA ATUALIZAÇÃO"
            placeholder="Preencha a descrição da atualização..."
            value={updateHolder.descricao}
            handleChange={(value) => {
              setUpdateHolder((prev) => ({ ...prev, descricao: value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <DateTimeInput
            label="DATA DA ATUALIZAÇÃO"
            value={formatDateTime(updateHolder.data)}
            handleChange={(value) => {
              console.log(value)
              setUpdateHolder((prev) => ({ ...prev, data: formatDateInputChange(value) || new Date().toISOString() }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="flex items-center justify-end">
        <button
          className="rounded bg-black p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out hover:bg-gray-700"
          onClick={() => addUpdate(updateHolder)}
        >
          ADICIONAR ATUALIZAÇÃO
        </button>
      </div>

      <div className="mt-2 flex w-full flex-col gap-1">
        <h1 className="font-Inter mb-2 text-start font-bold leading-none tracking-tight">ATUALIZAÇÕES DA HOMOLOGAÇÃO</h1>
        {infoHolder.homologacao.atualizacoes.length > 0 ? (
          infoHolder.homologacao.atualizacoes.map((update, index) => (
            <div key={index} className="flex w-full flex-col gap-1 rounded-md border border-gray-500 p-3">
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <BsCalendarPlus />
                    <h1 className="cursor-pointer text-xs font-black leading-none tracking-tight">{formatDateAsLocale(update.data, true)}</h1>
                  </div>
                  <div className="flex items-center gap-1">
                    <Avatar fallback={'R'} url={update.autor.avatar_url || undefined} height={20} width={20} />
                    <p className="text-xs font-medium text-gray-500">{update.autor.nome}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeUpdate(index)}
                  type="button"
                  className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
                >
                  <MdDelete style={{ color: 'red' }} size={15} />
                </button>
              </div>
              <div className="flex w-full items-center justify-center rounded-md bg-gray-100 p-2 text-center text-xs font-medium text-gray-500">
                {update.descricao}
              </div>
            </div>
          ))
        ) : (
          <p className="flex w-full grow items-center justify-center py-2 text-center font-medium italic tracking-tight text-gray-500">
            Sem atualizações adicionadas.
          </p>
        )}
      </div>
    </div>
  )
}

export default UpdatesInformation
