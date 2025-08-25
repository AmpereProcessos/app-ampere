import TextInput from '@/components/inputs/Text'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { formatToPhone } from '@/utils/methods/formatting'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { createIndication } from '@/utils/methods/mutation/indications'
import { useIndicationsByIndicatorId } from '@/utils/methods/query/indications'

import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

type IndicationsBlockProps = {
  projectId: string
  projectName: string
}
function IndicationsBlock({ projectId, projectName }: IndicationsBlockProps) {
  const queryClient = useQueryClient()
  const [indication, setIndication] = useState({ nome: '', telefone: '' })

  const { data: indications, isLoading, isError, isSuccess } = useIndicationsByIndicatorId({ projectId })
  const { mutate: handleCreateIndication, isPending: creationLoading } = useMutationWithFeedback({
    mutationKey: ['create-indication'],
    mutationFn: createIndication,
    queryClient: queryClient,
    affectedQueryKey: ['indications-by-indicator-id', projectId],
  })
  return (
    <div className="flex w-full flex-col">
      <div className="bg-primary/60 my-6 h-px w-full"></div>
      <p className="text-primary/80 my-2 w-full self-center text-center font-medium tracking-tight lg:w-[60%]">
        Gostou dos nossos serviços ? Indique um conhecido para começar já a economizar na conta de luz.
      </p>
      <div className="flex w-full items-center gap-2">
        <div className="w-full lg:w-1/2">
          <TextInput
            label="NOME DO INDICADO"
            showLabel={false}
            value={indication.nome}
            placeholder="Preencha o nome do indicado..."
            handleChange={(value) => setIndication((prev) => ({ ...prev, nome: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label="TELEFONE DO INDICADO"
            showLabel={false}
            value={indication.telefone}
            placeholder="Preencha o telefone do indicado..."
            handleChange={(value) => setIndication((prev) => ({ ...prev, telefone: formatToPhone(value) }))}
            width="100%"
          />
        </div>
      </div>
      <div className="mt-1 flex w-full items-center justify-end">
        <button
          disabled={creationLoading}
          onClick={() =>
            //@ts-ignore
            handleCreateIndication({
              indication: { nome: indication.nome, telefone: indication.telefone, idIndicacao: projectId },
            })
          }
          className="disabled:bg-primary/60 enabled:hover:bg-primary/70 rounded bg-black px-4 py-1 text-xs font-medium text-white duration-300 ease-in-out"
        >
          ADICIONAR INDICAÇÃO
        </button>
      </div>
      <h1 className="w-full text-start font-bold tracking-tight">SUAS INDICAÇÕES</h1>
      <div className="flex w-full items-start justify-around gap-2">
        {isLoading ? <LoadingPage /> : null} {isError ? <ErrorComponent msg={'Erro ao buscar indicações.'} /> : null}{' '}
        {isSuccess ? (
          indications.length > 0 ? (
            indications.map((indication) => (
              <div key={indication._id} className="border-primary/60 flex w-[350px] flex-col rounded-md border p-3">
                <h1 className="grow text-xs leading-none font-black tracking-tight lg:text-sm">{indication.nome}</h1>
              </div>
            ))
          ) : (
            <p className="text-primary/60 flex w-full grow items-center justify-center py-2 text-center font-medium tracking-tight italic">
              Oops, parece que não tem nenhuma indicação feita por você. Vamos começar ?
            </p>
          )
        ) : null}
      </div>
      <div className="bg-primary/60 my-6 h-px w-full"></div>
    </div>
  )
}

export default IndicationsBlock
