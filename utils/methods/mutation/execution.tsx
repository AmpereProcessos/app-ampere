import { TProjectDTO } from '@/utils/schemas/projects'
import { QueryClient } from 'react-query'
import { sendEmail } from '../email'
import { updateProject } from './clients'

type HandleExecutionUpdateParams = {
  previousData: TProjectDTO
  newData: TProjectDTO
  changes: { [key: string]: any }
  queryClient: QueryClient
}
export async function handleExecutionUpdate({ previousData, newData, changes, queryClient }: HandleExecutionUpdateParams) {
  const projectId = previousData._id

  const previousExecutionStatus = previousData.obra.statusDaObra
  const wasExecutionUnfinished = previousExecutionStatus != 'CONCLUIDA'

  const newExecutionStatus = newData.obra.statusDaObra
  const isExecutionFinished = newExecutionStatus == 'CONCLUIDA'

  try {
    // If execution passed status to CONCLUIDA, sending email to finances sector
    if (wasExecutionUnfinished && isExecutionFinished) {
      const emailMessage = {
        emailTo: 'processos@ampereenergias.com.br', // amperecontasareceber@gmail.com
        subject: 'FINALIZAÇÃO DE OBRA/SERVIÇO',
        message: `Olá, passando para te informar que o cliente ${newData.nomeDoContrato} teve sua obra/execução de serviço finalizada. Desde já agradeço, Volts.`,
      }
      await sendEmail(emailMessage)
    }
    // Update project
    await updateProject({ id: projectId, changes: changes })

    return 'Atualizações feitas com sucesso'
  } catch (error) {
    throw error
  }
}
