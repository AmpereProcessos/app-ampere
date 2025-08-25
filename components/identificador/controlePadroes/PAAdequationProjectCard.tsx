import type { TEnergyPAExecution, TEnergyPAExecutionWithFiltersOutput } from '@/pages/api/gestao-obras/padroes'
import { formatDateAsLocale, formatLocation } from '@/utils/methods/formatting'
import type { TLocation } from '@/utils/schemas/useful'
import React from 'react'
import { BsCalendarCheck, BsCode } from 'react-icons/bs'
import { FaCircle, FaPiggyBank } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { MdAssistantPhoto, MdDashboard, MdSettingsInputComponent } from 'react-icons/md'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '@/utils/methods/mutation/clients'
import CheckboxWithDate from '@/components/inputs/CheckboxWithDate'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { formatDateInputChange } from '@/utils/methods/shared'
import { cn } from '@/lib/utils'
import { getServiceTypeTagColor } from '@/components/TagTipoDeServico'
import { AlertCircle, BadgeCheck, Banknote, Cable, Contact, Signature, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

type PAAdequationProjectCardProps = {
  project: TEnergyPAExecutionWithFiltersOutput['data']['projects'][number]
  callbacks?: {
    onMutate?: () => void
    onSuccess?: () => void
    onSettled?: () => void
  }
}
function PAAdequationProjectCard({ project, callbacks }: PAAdequationProjectCardProps) {
  const queryClient = useQueryClient()
  const location: TLocation = {
    cep: project.cep?.toString(),
    uf: project.uf,
    cidade: project.cidade,
    bairro: project.bairro,
    endereco: project.logradouro,
    numeroOuIdentificador: project.numeroResidencia?.toString(),
  }

  async function updatePAAdequationExecutionDate(date: string | null) {
    try {
      await updateProject({ id: project._id, changes: { 'padrao.aumentoCarga.dataEfetivacao': date } })

      return 'Projeto atualizado com sucesso !'
    } catch (error) {
      throw error
    }
  }
  function getEnergyPAExecutionStatusFlag(project: TEnergyPAExecution) {
    return (
      <h1
        className={cn('text-xxs min-w-fit rounded-lg px-2 py-0.5 text-white', {
          'bg-green-500': project.padrao.aumentoCarga.dataEfetivacao,
          'bg-orange-600': !project.padrao.aumentoCarga.dataEfetivacao,
        })}
      >
        {project.padrao.aumentoCarga.dataEfetivacao ? 'CONCLUÍDO' : 'PENDENTE'}
      </h1>
    )
  }
  const { mutate: handleUpdate, isPending } = useMutation({
    mutationKey: ['update-project', project._id],
    mutationFn: updatePAAdequationExecutionDate,
    onMutate: () => {
      if (callbacks?.onMutate) callbacks.onMutate()
    },
    onSuccess: (data) => {
      if (callbacks?.onSuccess) callbacks.onSuccess()
      toast.success(data)
    },
    onSettled: () => {
      if (callbacks?.onSettled) callbacks.onSettled()
    },
  })
  return (
    <div className="bg-background border-primary/20 flex w-full flex-col gap-4 rounded border p-3 font-[Inter]">
      <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="text-primary/80 flex items-center gap-1 text-center text-xs font-bold italic">
              <MdDashboard className="h-3 min-h-3 w-3 min-w-3" />
              <p className="text-xs">{project.qtde}</p>
            </div>
            <h1 className="text-sm leading-none font-black tracking-tight">{project.nomeDoContrato}</h1>
          </div>
          <div className={cn('flex items-center gap-1 self-center rounded-lg px-2 py-1', getServiceTypeTagColor(project.tipoDeServico || ''))}>
            <MdDashboard className="h-3 min-h-3 w-3 min-w-3" />
            <h1 className="text-xxs font-medium">{project.tipoDeServico}</h1>
          </div>
          <div className="flex items-center gap-1">
            <FaLocationDot />
            <p className="text-primary/80 text-[0.65rem] font-medium italic">{formatLocation({ location, includeUf: true, includeCity: true })}</p>
          </div>
        </div>
        {getEnergyPAExecutionStatusFlag(project)}
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
          <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">HOMOLOGAÇÃO</h1>
          <div
            className={cn('bg-secondary text-xxs text-primary/80 flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic', {
              'bg-orange-100 text-orange-700': project.homologacao.status !== 'APROVADO',
              'bg-green-100 text-green-700': project.homologacao.status === 'APROVADO',
            })}
          >
            <BadgeCheck className={cn('h-3 min-h-3 w-3 min-w-3')} />
            <p className={cn('text-[0.6rem] font-medium')}>PARECER DE ACESSO: {project.homologacao.status}</p>
          </div>
          <div
            className={cn('bg-secondary text-xxs text-primary/80 flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic', {
              'bg-orange-100 text-orange-700': !project.homologacao.documentacao.dataConclusaoElaboracao,
              'bg-green-100 text-green-700': project.homologacao.documentacao.dataConclusaoElaboracao,
            })}
          >
            <Signature className={cn('h-3 min-h-3 w-3 min-w-3')} />
            <p className={cn('text-[0.6rem] font-medium')}>
              DOCUMENTAÇÃO: {project.homologacao.documentacao.dataConclusaoElaboracao ? 'CONCLUÍDA' : 'PENDENTE'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
          <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">PADRÃO</h1>
          <div
            className={cn('bg-secondary text-xxs text-primary/80 flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic', {
              'bg-orange-100 text-orange-700': !project.compra.dataPagamento,
              'bg-green-100 text-green-700': project.compra.dataPagamento,
            })}
          >
            <Banknote className={cn('h-3 min-h-3 w-3 min-w-3')} />
            <p className={cn('text-[0.6rem] font-medium')}>PAGAMENTO: {project.compra.dataPagamento ? 'CONCLUÍDO' : 'PENDENTE'}</p>
          </div>
          <div className={cn('bg-secondary text-xxs text-primary/80 flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic')}>
            <Contact className={cn('h-3 min-h-3 w-3 min-w-3')} />
            <p className={cn('text-[0.6rem] font-medium')}>RESPONSÁVEL: {project.padrao.respInstalacao || 'N/A'}</p>
          </div>
          <div className={cn('bg-secondary text-xxs text-primary/80 flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic')}>
            <Cable className={cn('h-3 min-h-3 w-3 min-w-3')} />
            <p className={cn('text-[0.6rem] font-medium')}>
              TIPO: {project.visitaTecnica.amperagem || ''} {project.padrao.tipo || 'N/A'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
          <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">ORDEM DE SERVIÇO</h1>
          {project.ordemDeServico ? (
            <>
              <div
                className={cn(
                  'bg-secondary text-xxs text-primary/80 flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic',
                  {}
                )}
              >
                <User className={cn('h-3 min-h-3 w-3 min-w-3')} />
                <p className={cn('text-[0.6rem] font-medium')}>TÍTULO: {project.ordemDeServico?.descricao || 'N/A'}</p>
              </div>
              <div
                className={cn('bg-secondary text-xxs text-primary/80 flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic')}
              >
                <Contact className={cn('h-3 min-h-3 w-3 min-w-3')} />
                <p className={cn('text-[0.6rem] font-medium')}>RESPONSÁVEL: {project.ordemDeServico?.responsavel?.nome || 'N/A'}</p>
              </div>
              <div
                className={cn('bg-secondary text-xxs text-primary/80 flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic')}
              >
                <Cable className={cn('h-3 min-h-3 w-3 min-w-3')} />
                <p className={cn('text-[0.6rem] font-medium')}>
                  AGENDAMENTO: {project.ordemDeServico?.agendamento?.inicio ? formatDateAsLocale(project.ordemDeServico?.agendamento?.inicio) : 'N/A'}{' '}
                  - {project.ordemDeServico?.agendamento?.fim ? formatDateAsLocale(project.ordemDeServico?.agendamento?.fim) : 'N/A'}
                </p>
              </div>
              <div
                className={cn('bg-secondary text-xxs text-primary/80 flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic')}
              >
                <Cable className={cn('h-3 min-h-3 w-3 min-w-3')} />
                <p className={cn('text-[0.6rem] font-medium')}>
                  EXECUÇÃO: {project.ordemDeServico?.periodo.inicio ? formatDateAsLocale(project.ordemDeServico?.periodo.inicio) : 'N/A'} -{' '}
                  {project.ordemDeServico?.periodo.fim ? formatDateAsLocale(project.ordemDeServico?.periodo.fim) : 'N/A'}
                </p>
              </div>
            </>
          ) : (
            <div className={cn('text-xxs flex items-center gap-1 rounded-lg bg-orange-100 px-2 py-0.5 text-center font-bold text-orange-700 italic')}>
              <AlertCircle className={cn('h-3 min-h-3 w-3 min-w-3')} />
              <p className={cn('text-[0.6rem] font-medium')}>ORDEM DE SERVIÇO NÃO DEFINIDA</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full items-center justify-end">
        <CheckboxWithDate
          labelFalse="EXECUTADO"
          labelTrue="EXECUTADO"
          editable={!isPending}
          showDate={!!project.padrao.aumentoCarga.dataEfetivacao}
          date={project.padrao.aumentoCarga.dataEfetivacao || project.obra.saida || null}
          handleChange={(value) => {
            handleUpdate(formatDateInputChange(value, 'string'))
          }}
        />
      </div>
    </div>
  )
}

export default PAAdequationProjectCard
