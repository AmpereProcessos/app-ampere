import Avatar from '@/components/utils/Avatar'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { CRM_APP_URL } from '@/utils/constants'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import { createOpportunityInteraction, updateOpportunityFunnelReference } from '@/utils/methods/mutation/crm/opportunities'
import { useFunnelById } from '@/utils/methods/query/crm/funnels'
import { useNutritionOpportunities } from '@/utils/methods/query/crm/opportunities'
import type { TFunnelDTO } from '@/utils/schemas/crm/funnels.schema'
import type { TOpportunitySimplifiedDTOWithProposalAndActivitiesAndFunnels } from '@/utils/schemas/crm/opportunity.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Share2 } from 'lucide-react'
import type { TAuthSession } from '@/lib/authentication/types'
import { useSession } from '@/components/providers/SessionProvider'
import toast from 'react-hot-toast'
import { BsCalendar, BsCalendarPlus, BsFillMegaphoneFill } from 'react-icons/bs'
import { MdDashboard } from 'react-icons/md'

function MainNutritionPage() {
  const { session, status } = useSession({ required: true })
  if (status !== 'authenticated') return <LoadingComponent />

  return <NutritionPage session={session} />
}

export default MainNutritionPage

type NutritionPageProps = {
  session: TAuthSession
}
function NutritionPage({ session }: NutritionPageProps) {
  const { data: funnel } = useFunnelById({ id: '67f97583e21e0e11bc36559d' })
  const { data: opportunities, isLoading, isError, isSuccess, error } = useNutritionOpportunities()

  return (
    <div className="flex w-full grow flex-col p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-300 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">PROJETOS PARA NUTRIÇÃO</p>
          </div>
        </div>
      </div>
      <div className="1.5xl:max-h- 2.25xl:max-h-[800px] mt-2 flex w-full overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 md:max-h-[500px]  lg:max-h-[600px]">
        {funnel?.etapas.map((stage) => (
          <StageBlock key={stage.id} session={session} stage={stage} opportunities={opportunities || []} />
        ))}
      </div>
    </div>
  )
}

type StageBlockProps = {
  session: TAuthSession //
  stage: TFunnelDTO['etapas'][number]
  opportunities: TOpportunitySimplifiedDTOWithProposalAndActivitiesAndFunnels[]
}
function StageBlock({ session, stage, opportunities }: StageBlockProps) {
  function getOpportunitiesInStage({
    stageId,
    opportunities,
  }: {
    stageId: string | number
    opportunities: TOpportunitySimplifiedDTOWithProposalAndActivitiesAndFunnels[]
  }) {
    return opportunities.filter((opportunity) => opportunity.funil.idEstagio.toString() === stageId.toString())
  }
  const opportunitiesInStage = getOpportunitiesInStage({
    stageId: stage.id,
    opportunities: (opportunities || []) as TOpportunitySimplifiedDTOWithProposalAndActivitiesAndFunnels[],
  })
  return (
    <div className="flex w-full min-w-[375px] flex-col p-2 px-4 lg:w-[375px]">
      <div className="flex h-[100px] w-full flex-col rounded bg-[#15599a] px-2 lg:h-[60px] lg:min-h-[60px]">
        <h1 className="w-full rounded p-1 text-center font-bold text-white">{stage.nome}</h1>
        <div className="flex w-full items-center justify-center gap-1 text-white">
          <MdDashboard />
          <h3 className="text-[0.65rem] font-medium">{opportunitiesInStage.length}</h3>
        </div>
      </div>
      <div className="my-1 flex flex-col gap-2">
        {opportunitiesInStage.map((opportunity) => (
          <OpportunityCard key={opportunity._id} session={session} opportunity={opportunity} stageTitle={stage.nome} />
        ))}
      </div>
    </div>
  )
}

function OpportunityCard({
  session,
  opportunity,
  stageTitle,
}: {
  session: TAuthSession
  opportunity: TOpportunitySimplifiedDTOWithProposalAndActivitiesAndFunnels
  stageTitle: string
}) {
  const queryClient = useQueryClient()
  const { mutate: handleNotifyInteraction } = useMutation({
    mutationKey: ['notify-opportunity-interaction', opportunity._id],
    mutationFn: async () => {
      await createOpportunityInteraction({
        info: {
          idParceiro: opportunity.idParceiro,
          categoria: 'INTERAÇÃO',
          oportunidade: {
            id: opportunity._id,
            nome: opportunity.nome,
            identificador: opportunity.identificador,
          },
          conteudo: `Interação de ${stageTitle}`,
          tipoInteracao: 'MENSAGEM',
          dataInsercao: new Date().toISOString(),
          autor: {
            id: session.user.id,
            nome: session.user.nome,
            avatar_url: session.user.avatar_url,
          },
        },
      })

      await updateOpportunityFunnelReference({
        id: opportunity.funil.id,
        changes: { idEstagioFunil: (Number(opportunity.funil.idEstagio) + 1).toString() },
      })

      return 'Interação notificada com sucesso !'
    },
    onMutate: async () => {
      await queryClient.invalidateQueries({ queryKey: ['nutrition-opportunities'] })
    },
    onSuccess: async (data) => {
      toast.success(data)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['nutrition-opportunities'] })
    },
    onError: (error) => {
      const msg = getErrorMessage(error)
      toast.error(msg)
    },
  })
  return (
    <div className="flex w-full flex-col gap-2 rounded border border-primary/20 bg-[#fff] p-2 shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <h1 className="text-xs font-bold text-[#fead41]">{opportunity.identificador}</h1>
          {opportunity.idMarketing ? <BsFillMegaphoneFill color="#3e53b2" /> : null}
          {opportunity.idIndicacao ? <Share2 size={15} color="#06b6d4" /> : null}
        </div>
        <a href={`${CRM_APP_URL}/comercial/oportunidades/id/${opportunity._id}`}>
          <h1 className="font-bold text-[#353432] hover:text-blue-400">{opportunity.nome}</h1>
        </a>
      </div>
      <div className="flex w-full grow flex-col gap-2">
        {opportunity.ultimaInteracao?.data ? (
          <div className="flex w-full items-center justify-center gap-1">
            <BsCalendar />
            <p className={'text-[0.65rem] font-medium text-primary/50'}>
              Última interação em: {formatDateAsLocale(opportunity.ultimaInteracao?.data, true)}
            </p>
          </div>
        ) : null}
        <div className="flex w-full items-center justify-center">
          <LoadingButton size={'xs'} onClick={() => handleNotifyInteraction()}>
            NOTIFICAR INTERAÇÃO
          </LoadingButton>
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex grow flex-wrap items-center gap-2">
          {opportunity.responsaveis.map((resp, index) => {
            if (index <= 1)
              return (
                <div className="flex items-center gap-1">
                  <Avatar url={resp.avatar_url || undefined} fallback={formatNameAsInitials(resp.nome)} height={18} width={18} />
                  <p className="text-[0.65rem] font-light text-primary/50">{resp.nome}</p>
                </div>
              )
            return null
          })}
          {opportunity.responsaveis.length > 2 ? <p className="text-[0.65rem] font-light text-primary/50">...</p> : null}
        </div>

        <div className="ites-center flex min-w-fit gap-1">
          <BsCalendarPlus />
          <p className={'text-[0.65rem] font-medium text-primary/50'}>{formatDateAsLocale(opportunity.dataInsercao, true)}</p>
        </div>
      </div>
    </div>
  )
}
