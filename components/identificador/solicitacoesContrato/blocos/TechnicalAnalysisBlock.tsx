import TextInput from '@/components/inputs/Text'
import { editContractRequest } from '@/utils/methods/mutation/contract-requests'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { TContractRequestDTO } from '@/utils/schemas/contract-requests'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import TechnicalAnalysis from './TechnicalAnalysis'

import { z } from 'zod'
import { fetchTechnicalAnalysisById } from '@/utils/methods/query/technical-analysis'

type TechnicalAnalysisBlockProps = {
  infoHolder: TContractRequestDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TContractRequestDTO>>
  userHasEditPermission: boolean
}
function TechnicalAnalysisBlock({ infoHolder, setInfoHolder, userHasEditPermission }: TechnicalAnalysisBlockProps) {
  const queryClient = useQueryClient()
  const [analysisIdHolder, setAnalysisIdHolder] = useState<string | null>(infoHolder.idVisitaTecnica ? infoHolder.idVisitaTecnica : null)

  async function handleAnalysisVinculation(analysisId: string) {
    try {
      if (analysisId.trim().length < 10) return toast.error('Preencha um ID válido.')
      const analysis = await fetchTechnicalAnalysisById({ id: analysisId })
      const updateData = {
        ...infoHolder,
        nomeDoProjeto: analysis.nome,
        visitaTecnica: 'REALIZADA',
        respVisitaTecnica: analysis.analista?.nome,
        materialEstrutura: analysis.detalhes.tipoEstrutura,
        tipoDaTelha: analysis.detalhes.tipoTelha,
        idVisitaTecnica: analysisId,
      }
      const resp = await editContractRequest({ id: infoHolder._id, changes: { ...updateData } })

      return 'Análise vinculada com sucesso !'
    } catch (error) {
      throw error
    }
  }
  const {
    mutate: handleVinculate,
    isPending,
    isError,
  } = useMutationWithFeedback({
    mutationKey: ['vinculate-technical-analysis'],
    mutationFn: handleAnalysisVinculation,
    queryClient: queryClient,
    affectedQueryKey: ['contract-request-by-id', infoHolder._id],
  })
  console.log(infoHolder.idVisitaTecnica, !!infoHolder.idVisitaTecnica, analysisIdHolder)
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES DE ANÁLISE TÉCNICA</h1>
      <div className="flex w-[90%] flex-col items-center gap-2 self-center rounded border border-gray-300 p-3 md:w-[85%] lg:w-[50%]">
        <TextInput
          label="ID DE ANÁLISE TÉCNICA"
          placeholder="Preencha aqui, se aplicavél, o ID da análise técnica do projeto."
          value={analysisIdHolder || ''}
          handleChange={(value) => setAnalysisIdHolder(value)}
          width="100%"
        />

        <div className="flex w-full items-center justify-end">
          <button
            disabled={isPending}
            onClick={() => {
              // @ts-ignore
              handleVinculate(analysisIdHolder)
            }}
            className="h-9 whitespace-nowrap rounded bg-blue-800 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-blue-800 enabled:hover:text-white"
          >
            VINCULAR
          </button>
        </div>
      </div>
      {infoHolder.idVisitaTecnica && infoHolder.idVisitaTecnica?.trim().length > 12 ? (
        <TechnicalAnalysis analysisId={infoHolder.idVisitaTecnica} />
      ) : null}
    </div>
  )
}

export default TechnicalAnalysisBlock
