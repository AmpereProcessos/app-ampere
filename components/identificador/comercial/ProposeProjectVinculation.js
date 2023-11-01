import React, { useState } from 'react'
import TextInput from '../../inputs/Text'
import { useMutationWithFeedback } from '../../../utils/methods/mutation/general-hook'
import { updateCRMProject } from '../../../utils/methods/mutation/comercial'

import toast from 'react-hot-toast'
import { updateProject } from '../../../utils/methods/mutation/clients'
import createHttpError from 'http-errors'
import { useQueryClient } from 'react-query'

function ProposeProjectVinculation({ idProject, idSolicitation, signatureDate, contractRequestDate }) {
  const queryClient = useQueryClient()
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [CRMInformation, setCRMInformation] = useState({
    projectId: '',
    proposeId: '',
  })
  const { mutate } = useMutationWithFeedback({
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
      const crmChanges = {
        propostaAtiva: proposeId,
        solicitacaoContrato: {
          id: idSolicitation,
          idProposta: proposeId,
          dataSolicitacao: contractRequestDate,
        },
        contrato: {
          id: idProject,
          idProposta: proposeId,
          dataAssinatura: signatureDate,
        },
      }
      const projectChanges = {
        idPropostaCRM: proposeId,
        idProjetoCRM: projectId,
      }
      await updateProject({ id: idProject, changes: projectChanges })
      await updateCRMProject({ idCRMProject: projectId, changes: crmChanges })
    } catch (error) {
      throw error
    }
  }
  return (
    <div className="flex flex-col min-w-[350px]">
      <button
        onClick={() => setMenuIsOpen((prev) => !prev)}
        className={`text-sm text-gray-500 hover:text-cyan-500 duration-300 ease-in-out text-center`}
      >
        {menuIsOpen ? 'FECHAR MENU' : 'ABRIR MENU DE VINCULAÇÃO'}
      </button>
      {menuIsOpen ? (
        <div className="w-full border border-gray-300 flex flex-col gap-2 p-3 rounded">
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
            onClick={mutate}
            className="w-full text-sm py-2 rounded-md border border-black hover:bg-black hover:text-white duration-300 ease-in-out font-medium tracking-tight leading-none"
          >
            VINCULAR
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default ProposeProjectVinculation
