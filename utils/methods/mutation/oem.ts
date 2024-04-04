import { TProjectDTO } from '@/utils/schemas/projects'
import { QueryClient } from 'react-query'
import { formatDateAsLocale } from '../formatting'
import { sendEmail } from '../email'
import { updateProject } from './clients'

type HandleOeMUpdateParams = {
  previousData: TProjectDTO
  newData: TProjectDTO
  changes: { [key: string]: any }
  queryClient: QueryClient
}
export async function handleOeMUpdate({ previousData, newData, changes, queryClient }: HandleOeMUpdateParams) {
  const projectId = previousData._id

  const hasOeMPlan =
    previousData.oem.aplicavel && !['NÃO SE APLICA', 'INCLUSO NO CONTRATO', 'NÃO DEFINIDO', null].includes(previousData.oem.plano || '')

  const previousMaintenanceDate = previousData.manutencaoPreventiva.data
  const newMaintenanceDate = newData.manutencaoPreventiva.data

  if (hasOeMPlan && previousMaintenanceDate != newMaintenanceDate) {
    const emailMessage = {
      emailTo: 'processos@ampereenergias.com.br', // amperecontasareceber@gmail.com
      subject: 'EXECUÇÃO DE MANUTENÇÃO',
      message: `Olá, passando para te informar que o cliente ${
        newData.nomeDoContrato
      } teve uma manutenção executada pela nossa equipe no dia ${formatDateAsLocale(newData.manutencaoPreventiva.data)}. Desde já agradeço, Volts.`,
    }
    await sendEmail(emailMessage)
  }
  // Update project
  await updateProject({ id: projectId, changes: changes })

  return 'Atualizações feitas com sucesso'
}
