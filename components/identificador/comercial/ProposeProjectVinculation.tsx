import React, { useState } from 'react'
import TextInput from '../../inputs/Text'
import { useMutationWithFeedback } from '../../../utils/methods/mutation/general-hook'
import { updateCRMProject } from '../../../utils/methods/crm-integration'

import toast from 'react-hot-toast'
import { updateProject } from '../../../utils/methods/mutation/clients'
import createHttpError from 'http-errors'
import { useQueryClient } from 'react-query'
import { TOpportunity } from '@/utils/schemas/crm/opportunity.schema'
import { updateOpportunity } from '@/utils/methods/mutation/crm/opportunities'

type ProposeProjectVinculationProps = {
  idProject: string
  idSolicitation: string | null | undefined
  signatureDate: string | null | undefined
  contractRequestDate: string | null | undefined
}
function ProposeProjectVinculation({ idProject, idSolicitation, signatureDate, contractRequestDate }: ProposeProjectVinculationProps) {
  const queryClient = useQueryClient()
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [CRMInformation, setCRMInformation] = useState({
    projectId: '',
    proposeId: '',
  })
  const { mutate, isLoading } = useMutationWithFeedback({
    mutationKey: ['crm-vinculation', idProject],
    mutationFn: handleVinculation,
    affectedQueryKey: ['analytical-comercial'],
    queryClient: queryClient,
  })
  async function handleVinculation() {
    try {
      if (CRMInformation.projectId.trim().length < 20) {
        throw new createHttpError.BadRequest('ID de projeto inválido.')
      }
      if (CRMInformation.proposeId.trim().length < 20) {
        throw new createHttpError.BadRequest('ID de projeto inválido.')
      }
      const projectId = CRMInformation.projectId.trim()
      const proposeId = CRMInformation.proposeId.trim()
      const crmChanges: Partial<TOpportunity> = {
        ganho: {
          idProjeto: idProject,
          data: signatureDate,
          idProposta: proposeId,
          dataSolicitacao: contractRequestDate,
          idSolicitacao: idSolicitation,
        },
        idPropostaAtiva: proposeId,
      }
      const projectChanges = {
        idPropostaCRM: proposeId,
        idProjetoCRM: projectId,
      }
      await updateProject({ id: idProject, changes: projectChanges })
      await updateOpportunity({ id: projectId, changes: crmChanges })
    } catch (error) {
      throw error
    }
  }
  return (
    <div className="flex min-w-[350px] flex-col">
      <button
        onClick={() => setMenuIsOpen((prev) => !prev)}
        className={`text-center text-sm text-gray-500 duration-300 ease-in-out hover:text-cyan-500`}
      >
        {menuIsOpen ? 'FECHAR MENU' : 'ABRIR MENU DE VINCULAÇÃO'}
      </button>
      {menuIsOpen ? (
        <div className="flex w-full flex-col gap-2 rounded border border-gray-300 p-3">
          <TextInput
            label={'ID DO PROJETO NO CRM'}
            value={CRMInformation.projectId}
            placeholder={'Preencha aqui o ID do projeto no CRM'}
            handleChange={(value) => setCRMInformation((prev) => ({ ...prev, projectId: value }))}
            width={'100%'}
          />
          <TextInput
            label={'ID DA PROPOSTA NO CRM'}
            value={CRMInformation.proposeId}
            placeholder={'Preencha aqui o ID da proposta no CRM'}
            handleChange={(value) => setCRMInformation((prev) => ({ ...prev, proposeId: value }))}
            width={'100%'}
          />
          <button
            // @ts-ignore
            disabled={isLoading}
            onClick={() => mutate()}
            className="w-full rounded-md border border-black py-2 text-sm font-medium leading-none tracking-tight duration-300 ease-in-out hover:bg-black hover:text-white"
          >
            VINCULAR
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default ProposeProjectVinculation
