import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { cn } from '@/lib/utils'
import { TGetSalesRankingOutput } from '@/pages/api/stats/sales-ranking'
import { formatNameAsInitials } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import { useSDRRanking } from '@/utils/methods/query/stats'
import { CheckCircle, CirclePlus, Send } from 'lucide-react'

export default function ModernSDRRanking() {
  const { data, isLoading, isSuccess, isError, error, queryParams, updateQueryParams } = useSDRRanking({})

  const PERIOD_NAMING_MAP = {
    'current-month': 'RANKING DE SDRS DO MÊS',
    'current-semester': 'RANKING DE SDRS DO SEMESTRE',
    'current-year': 'RANKING DE SDRS DO ANO',
  }

  return (
    <div className={cn('bg-card border-primary/20 flex w-full flex-col gap-3 rounded-xl border px-3 py-4 shadow-xs')}>
      <div className="flex items-center justify-between">
        <h1 className="text-xs font-medium tracking-tight uppercase">{PERIOD_NAMING_MAP[queryParams.type]}</h1>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={queryParams.rankBy === 'opportunities-send-qty' ? 'default' : 'ghost'}
                size="fit"
                className="rounded-lg p-2"
                onClick={() => updateQueryParams({ rankBy: 'opportunities-send-qty' })}
              >
                <Send className="h-3 min-h-3 w-3 min-w-3 lg:h-4 lg:min-h-4 lg:w-4 lg:min-w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>PROJETOS ENVIADOS</p>
            </TooltipContent>
          </Tooltip>

          {/* DISABLED FOR NOW <Button variant="ghost" size="icon" onClick={() => updateQueryParams({ metric: 'SALE_VALUE' })}>
            <BadgeDollarSign className="h-4 min-h-4 w-4 min-w-4" />
          </Button> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={queryParams.rankBy === 'opportunities-won-qty' ? 'default' : 'ghost'}
                size="fit"
                className="rounded-lg p-2"
                onClick={() => updateQueryParams({ rankBy: 'opportunities-won-qty' })}
              >
                <CheckCircle className="h-3 min-h-3 w-3 min-w-3 lg:h-4 lg:min-h-4 lg:w-4 lg:min-w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>PROJETOS GANHOS</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={queryParams.rankBy === 'opportunities-created-qty' ? 'default' : 'ghost'}
                size="fit"
                className="rounded-lg p-2"
                onClick={() => updateQueryParams({ rankBy: 'opportunities-created-qty' })}
              >
                <CirclePlus className="h-3 min-h-3 w-3 min-w-3 lg:h-4 lg:min-h-4 lg:w-4 lg:min-w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>PROJETOS CRIADOS</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {/* Top 3 Section */}
      {isLoading ? <h3 className="text-muted-foreground animate-pulse">Carregando ranking...</h3> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess ? <SalesRankingContent ranking={data.ranking} /> : null}
    </div>
  )
}

type PodiumCardProps = {
  rankingItem: TGetSalesRankingOutput['data']['ranking'][number]
  maxValue: number
  minValue: number
  position: number
  size?: 'h-24 w-24' | 'h-16 w-16' | 'h-12 w-12'
  containerClassName?: string
  nameClassName?: string
}

function PodiumCard({
  rankingItem,
  maxValue,
  minValue,
  position,
  size = 'h-16 w-16',
  containerClassName = '',
  nameClassName = 'text-primary text-xs font-bold tracking-tight',
}: PodiumCardProps) {
  const percentage = ((rankingItem.value - minValue) / (maxValue - minValue)) * 100

  const strokeWidth = size === 'h-24 w-24' ? 4 : size === 'h-16 w-16' ? 3 : 2
  const radius = size === 'h-24 w-24' ? 44 : size === 'h-16 w-16' ? 29 : 21
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn('flex flex-col items-center gap-3', containerClassName)}>
      <div className="relative">
        {/* SVG Progress Circle */}
        <svg
          className={`${size} absolute inset-0 z-10 -rotate-90`}
          viewBox={`0 0 ${size === 'h-24 w-24' ? 96 : size === 'h-16 w-16' ? 64 : 48} ${size === 'h-24 w-24' ? 96 : size === 'h-16 w-16' ? 64 : 48}`}
        >
          {/* Background circle */}
          <circle
            cx={size === 'h-24 w-24' ? 48 : size === 'h-16 w-16' ? 32 : 24}
            cy={size === 'h-24 w-24' ? 48 : size === 'h-16 w-16' ? 32 : 24}
            r={radius}
            stroke="hsl(var(--primary))"
            strokeWidth={strokeWidth}
            fill="none"
            opacity="0.3"
          />
          {/* Progress circle */}
          <circle
            cx={size === 'h-24 w-24' ? 48 : size === 'h-16 w-16' ? 32 : 24}
            cy={size === 'h-24 w-24' ? 48 : size === 'h-16 w-16' ? 32 : 24}
            r={radius}
            stroke="hsl(var(--primary))"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {/* Avatar */}
        <div className={cn('relative overflow-hidden rounded-full', size)}>
          <Avatar className="h-full w-full">
            <AvatarImage src={rankingItem.avatar} alt={rankingItem.name} />
            <AvatarFallback className="text-lg font-semibold">{rankingItem.name ? formatNameAsInitials(rankingItem.name) : 'NA'}</AvatarFallback>
          </Avatar>
        </div>

        {/* Position badge */}
        <div className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold shadow-md">
          {position}
        </div>
      </div>

      <h3 className={cn(nameClassName, 'text-center')}>{rankingItem.name}</h3>
    </div>
  )
}

type SalesRankingContentProps = {
  ranking: TGetSalesRankingOutput['data']['ranking']
}
function SalesRankingContent({ ranking }: SalesRankingContentProps) {
  const rankingMaxValue = Math.max(...ranking.map((item) => item.value))
  const rankingMinValue = Math.min(...ranking.map((item) => item.value))

  const first = ranking[0] || null
  const second = ranking[1] || null
  const third = ranking[2] || null
  const others = ranking.slice(3)

  function OthersListCard({ rankingItem }: { rankingItem: TGetSalesRankingOutput['data']['ranking'][number] }) {
    const percentage = ((rankingItem.value - rankingMinValue) / (rankingMaxValue - rankingMinValue)) * 100
    return (
      <div className="flex w-full items-center gap-3 rounded p-2">
        <div className="bg-primary/30 flex h-6 w-6 min-w-fit items-center justify-center rounded-full">
          <p className="text-xs font-semibold">{rankingItem.index}</p>
        </div>
        <div className="flex h-full grow flex-col justify-between gap-2">
          <h1 className="text-primary text-[0.65rem] font-semibold tracking-tight lg:text-xs">{rankingItem.name}</h1>
          <Progress value={percentage} className="h-1" />
        </div>

        <div className="flex items-center justify-center">
          <Avatar className="h-8 min-h-8 w-8 min-w-8">
            <AvatarImage src={rankingItem.avatar} alt={rankingItem.name} />
            <AvatarFallback className="text-[0.65rem] font-semibold lg:text-sm">
              {rankingItem.name ? formatNameAsInitials(rankingItem.name) : 'NA'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full items-end justify-center gap-8">
        {/* 2nd Place */}
        {second && (
          <PodiumCard
            rankingItem={second}
            maxValue={rankingMaxValue}
            minValue={rankingMinValue}
            position={2}
            size="h-16 w-16"
            containerClassName="w-1/3"
            nameClassName="hidden lg:block"
          />
        )}

        {/* 1st Place */}
        {first && (
          <PodiumCard
            rankingItem={first}
            maxValue={rankingMaxValue}
            minValue={rankingMinValue}
            position={1}
            size="h-24 w-24"
            containerClassName="w-1/3"
            nameClassName="hidden lg:block"
          />
        )}

        {/* 3rd Place */}
        {third && (
          <PodiumCard
            rankingItem={third}
            maxValue={rankingMaxValue}
            minValue={rankingMinValue}
            position={3}
            size="h-16 w-16"
            containerClassName="w-1/3"
            nameClassName="hidden lg:block"
          />
        )}
      </div>
      <div className="flex w-full flex-col gap-1">
        <h2 className="text-primary text-[0.65rem] font-bold uppercase lg:text-xs">OUTROS</h2>
        <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex h-[250px] w-full flex-col gap-2 overflow-y-auto lg:h-[400px]">
          {others.map((item, index) => (
            <OthersListCard key={`${item.name}-${index}`} rankingItem={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
