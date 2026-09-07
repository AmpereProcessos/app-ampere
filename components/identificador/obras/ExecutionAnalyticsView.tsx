import { Button } from '@/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import ExecutionAnalyticsFilters from './ExecutionAnalyticsFilters'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import type {
  CostDetail,
  ExecutionAnalytics,
  ExecutionBucket,
  ExecutionDetail,
  ExecutionFilters,
  ExecutionGroup,
  ExecutionMetric,
} from '@/lib/analytics/execution'
import { formatToMoney } from '@/utils/constants'
import { getErrorMessage } from '@/utils/methods/handlers'
import { useExecutionAnalytics } from '@/utils/methods/query/execution-analytics'
import { ArrowLeft, ArrowUpRight, ChevronDown, Download, Activity, UsersRound, Wallet, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

const TZ = 'America/Sao_Paulo'
const number = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })
const days = (n: number | null) => (n === null ? '—' : `${number.format(n)} dias`)
const dateLabel = (d: string | null) =>
  d && Number.isFinite(Date.parse(d))
    ? new Intl.DateTimeFormat('pt-BR', { timeZone: TZ }).format(new Date(d.length === 10 ? `${d}T12:00:00Z` : d))
    : 'Não informada'
function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}
function defaults(): ExecutionFilters {
  const end = today()
  return { start: `${end.slice(0, 4)}-01-01`, end, granularity: 'month', categories: [], people: [], cities: [], states: [], projectTypes: [] }
}
const config = {
  initiated: { label: 'Iniciadas', color: '#738a9f' },
  concluded: { label: 'Concluídas', color: '#15599a' },
  open: { label: 'Em aberto', color: '#15599a' },
  average: { label: 'Média (dias)', color: '#15599a' },
  median: { label: 'Mediana (dias)', color: '#738a9f' },
  recorded: { label: 'Custo registrado', color: '#15599a' },
  paid: { label: 'Pago', color: '#738a9f' },
} satisfies ChartConfig
type Selection = { title: string; description: string; orders?: ExecutionDetail[]; expenses?: CostDetail[] }
type OpenOrders = (title: string, metric?: ExecutionMetric, predicate?: (d: ExecutionDetail) => boolean) => void
type ChartPoint = { key: string; label: string; [key: string]: string | number | null }
type Series = { key: keyof typeof config; label: string }
const metricLabels: Record<ExecutionMetric, string> = {
  initiated: 'Iniciadas',
  concluded: 'Concluídas',
  ongoing: 'Em andamento do período',
  open: 'Em aberto no fim',
  duration: 'Prazo de conclusão',
}

export default function ExecutionAnalyticsView() {
  const [filters, setFilters] = useState<ExecutionFilters>(defaults)
  const [draft, setDraft] = useState<ExecutionFilters>(defaults)
  const [selection, setSelection] = useState<Selection | null>(null)
  const { data, error, isPending, isFetching, refetch } = useExecutionAnalytics(filters)
  const update = (changes: Partial<ExecutionFilters>) => setDraft((f) => ({ ...f, ...changes }))
  const invalidPeriod =
    !draft.start || !draft.end || draft.start > draft.end || draft.end > today() || Date.parse(draft.end) - Date.parse(draft.start) > 365 * 86_400_000
  const changed = JSON.stringify(draft) !== JSON.stringify(filters)
  const openOrders: OpenOrders = (title, metric, predicate) => {
    const orders = (data?.details || []).filter(
      (d) => (!metric || (metric === 'duration' ? d.concluded && d.duration !== null : d[metric])) && (!predicate || predicate(d))
    )
    setSelection({ title, description: `${orders.length} OS no recorte. Datas de execução em horário de São Paulo.`, orders })
  }
  function preset(value: string) {
    const end = today()
    const d = new Date(`${end}T12:00:00Z`)
    if (value === '30') d.setUTCDate(d.getUTCDate() - 29)
    update({
      start: value === 'year' ? `${end.slice(0, 4)}-01-01` : value === 'month' ? `${end.slice(0, 7)}-01` : d.toISOString().slice(0, 10),
      end,
      granularity: value === 'year' ? 'month' : 'day',
    })
  }
  return (
    <main className="flex min-w-0 grow flex-col gap-6 p-4 md:p-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-primary text-2xl font-bold tracking-tight">Analítico de Obras</h1>
          <p className="text-muted-foreground mt-1 text-sm">Execução, participação da equipe e custos dos projetos.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/obras">
            <ArrowLeft className="size-4" /> Voltar às obras
          </Link>
        </Button>
      </header>

      <ExecutionAnalyticsFilters
        draft={draft}
        options={data?.options}
        update={update}
        invalid={invalidPeriod}
        changed={changed}
        loading={isFetching}
        preset={preset}
        apply={() => {
          setSelection(null)
          setFilters({ ...draft })
        }}
        reset={() => {
          const f = defaults()
          setDraft(f)
          setFilters(f)
          setSelection(null)
        }}
      />

      {error ? (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4">
          <p className="text-sm">{getErrorMessage(error)}</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : null}
      {isPending ? (
        <div aria-label="Carregando indicadores" className="space-y-6">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : null}
      {data ? (
        <>
          <div className="text-muted-foreground flex flex-wrap justify-between gap-2 text-xs">
            <span>
              {dateLabel(filters.start)} a {dateLabel(filters.end)} · {data.details.length} OS com atividade ou saldo em aberto
            </span>
            <span>
              Atualizado em{' '}
              {new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, dateStyle: 'short', timeStyle: 'short' }).format(new Date(data.generatedAt))}
            </span>
          </div>
          <section className="bg-background overflow-hidden rounded-xl border" aria-labelledby="execution-section-title">
            <MajorSectionHeading
              id="execution-section-title"
              icon={Activity}
              title="Execução dos serviços"
              description="Volume de entregas, andamento e tempo de execução."
            />
            <div className="space-y-6 p-4 md:p-6">
              <section aria-label="Indicadores de execução" className="grid gap-x-6 gap-y-4 border-b pb-6 sm:grid-cols-2 xl:grid-cols-5">
                <Kpi
                  label="Concluídas"
                  value={String(data.summary.concluded)}
                  note="Conclusão dentro do período"
                  onClick={() => openOrders('Serviços concluídos', 'concluded')}
                  primary
                />
                <Kpi
                  label="Iniciadas"
                  value={String(data.summary.initiated)}
                  note="Início dentro do período"
                  onClick={() => openOrders('Serviços iniciados', 'initiated')}
                />
                <Kpi
                  label="Em andamento do período"
                  value={String(data.summary.ongoing)}
                  note="Iniciadas no período, ainda sem conclusão"
                  onClick={() => openOrders('Em andamento do período', 'ongoing')}
                />
                <Kpi
                  label="Em aberto no fim"
                  value={String(data.summary.open)}
                  note="Inclui serviços iniciados antes do período"
                  onClick={() => openOrders('Em aberto no fim do período', 'open')}
                />
                <Kpi
                  label="Tempo médio de conclusão"
                  value={days(data.summary.average)}
                  note={`Mediana: ${days(data.summary.median)} · ${data.summary.durationCount} OS válidas`}
                  onClick={() => openOrders('Tempo de conclusão', 'duration')}
                />
              </section>
              {!data.details.length ? (
                <p className="text-muted-foreground rounded-md border p-6 text-sm">
                  Nenhuma OS com atividade ou saldo em aberto neste recorte. Ajuste o período ou os filtros.
                </p>
              ) : null}
              <section className="grid min-w-0 gap-6 xl:grid-cols-2" aria-label="Evolução da execução">
                <Trend
                  title="Iniciadas e concluídas"
                  description="Entradas e entregas em cada intervalo."
                  points={data.buckets}
                  series={[
                    { key: 'initiated', label: 'Iniciadas' },
                    { key: 'concluded', label: 'Concluídas' },
                  ]}
                  onSelect={(key, metric) => openBucket(data, key, metric, openOrders)}
                />
                <Trend
                  title="Saldo de serviços em aberto"
                  description="Posição ao fim de cada intervalo, incluindo trabalho anterior."
                  points={data.buckets}
                  series={[{ key: 'open', label: 'Em aberto' }]}
                  line
                  onSelect={(key, metric) => openBucket(data, key, metric, openOrders)}
                />
                <Trend
                  title="Tempo até a conclusão"
                  description="Dias corridos das OS concluídas. Ausência de datas válidas aparece como lacuna."
                  points={data.buckets}
                  series={[
                    { key: 'average', label: 'Média (dias)' },
                    { key: 'median', label: 'Mediana (dias)' },
                  ]}
                  line
                  onSelect={(key) => openBucket(data, key, 'duration', openOrders)}
                />
                <section className="min-w-0 space-y-4 border-t pt-5">
                  <SectionHeading
                    title="Idade dos serviços em aberto"
                    description="Tempo desde o início até o fim do período selecionado (ou agora)."
                  />
                  <Ranking
                    rows={data.aging.map((a) => ({ key: a.key, label: a.label, value: a.count }))}
                    onSelect={(key) => openOrders(`Em aberto há ${key} dias`, 'open', (d) => d.age !== null && ageKey(d.age) === key)}
                  />
                  <p className="text-muted-foreground text-xs">
                    OS canceladas são excluídas. A posição histórica usa as datas e atribuições atualmente registradas.
                  </p>
                </section>
              </section>
            </div>
          </section>
          <Breakdowns data={data} openOrders={openOrders} />
          {data.costs ? (
            <Costs costs={data.costs} onSelect={setSelection} />
          ) : (
            <p className="text-muted-foreground border-t pt-5 text-sm">A análise de custos requer permissão de visualização do Financeiro.</p>
          )}
          <details className="text-muted-foreground border-t pt-4 text-xs">
            <summary className="text-foreground cursor-pointer font-medium">Critérios e qualidade dos dados</summary>
            <div className="mt-3 space-y-2 leading-relaxed">
              <p>
                Conclusões e durações usam as datas do período de execução, independentemente da finalização administrativa. Datas e limites seguem o
                fuso de São Paulo. A duração inclui fins de semana e pausas.
              </p>
              <p>
                {data.quality.invalidDurations} conclusões excluídas das médias por início ausente ou duração inválida. {data.quality.invalidDates} OS
                nos filtros com datas inválidas. {data.quality.unassigned} OS do recorte sem pessoas atribuídas; {data.quality.withoutProject} sem
                projeto vinculado.
              </p>
              <p>
                Em andamento do período representa as OS iniciadas no intervalo e ainda sem conclusão hoje. Em aberto no fim representa a posição na
                data final, inclusive OS concluídas depois dela. Alterações retroativas e cancelamentos podem modificar os resultados históricos.
              </p>
            </div>
          </details>
        </>
      ) : null}
      <DetailPanel key={selection?.title || 'closed'} selection={selection} close={() => setSelection(null)} />
    </main>
  )
}

function Kpi({
  label,
  value,
  note,
  onClick,
  primary = false,
}: {
  label: string
  value: string
  note: string
  onClick?: () => void
  primary?: boolean
}) {
  const body = (
    <>
      <span className="flex items-start justify-between gap-2 text-xs font-medium">
        {label}
        {onClick ? <ArrowUpRight aria-hidden className="text-muted-foreground size-3.5 shrink-0" /> : null}
      </span>
      <span className={`block py-2 text-2xl font-bold tabular-nums ${primary ? 'text-primary' : ''}`}>{value}</span>
      <span className="text-muted-foreground block text-xs leading-relaxed">{note}</span>
    </>
  )
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className="hover:bg-muted focus-visible:ring-ring min-w-0 rounded-md p-2 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      {body}
    </button>
  ) : (
    <div className="min-w-0 p-2">{body}</div>
  )
}
function MajorSectionHeading({ id, title, description, icon: Icon }: { id: string; title: string; description: string; icon: LucideIcon }) {
  return (
    <header className="bg-primary/5 flex items-center gap-3 border-b px-4 py-5 md:px-6">
      <Icon aria-hidden className="text-primary size-5 shrink-0" />
      <div>
        <h2 id={id} className="text-primary text-lg font-bold tracking-tight">
          {title}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
    </header>
  )
}
function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{description}</p>
    </div>
  )
}

function Trend({
  title,
  description,
  points,
  series,
  line = false,
  currency = false,
  onSelect,
}: {
  title: string
  description: string
  points: ChartPoint[] | ExecutionBucket[]
  series: Series[]
  line?: boolean
  currency?: boolean
  onSelect: (key: string, metric: string) => void
}) {
  const [table, setTable] = useState(false)
  const axes = (
    <>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} tickMargin={8} />
      <YAxis
        tickLine={false}
        axisLine={false}
        width={55}
        allowDecimals={currency || series.some((s) => s.key === 'average' || s.key === 'median')}
        tickFormatter={(v) => (currency ? new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(v) : number.format(v))}
      />
      <ChartTooltip
        content={
          <ChartTooltipContent
            formatter={(value, name) => (
              <span>
                {config[name as keyof typeof config]?.label || String(name)}:{' '}
                <strong>{currency ? formatToMoney(Number(value)) : number.format(Number(value))}</strong>
              </span>
            )}
          />
        }
      />
    </>
  )
  return (
    <section className="min-w-0 space-y-4 border-t pt-5">
      <SectionHeading title={title} description={description} />
      <div className="text-muted-foreground flex flex-wrap gap-4 text-xs">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ backgroundColor: config[s.key].color }} />
            {s.label}
          </span>
        ))}
      </div>
      <ChartContainer config={config} className="aspect-auto h-64 w-full">
        {line ? (
          <LineChart
            accessibilityLayer
            data={points}
            margin={{ left: 0, right: 12, top: 10 }}
            onClick={(event) => {
              const point = event?.activePayload?.[0]?.payload
              if (point?.key) onSelect(point.key, series[0].key)
            }}
          >
            {axes}
            {series.map((s) => (
              <Line
                key={s.key}
                dataKey={s.key}
                type="linear"
                stroke={`var(--color-${s.key})`}
                strokeWidth={2}
                strokeDasharray={s.key === 'median' ? '5 4' : undefined}
                dot={points.length < 32}
                connectNulls={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart accessibilityLayer data={points} margin={{ left: 0, right: 12, top: 10 }}>
            {axes}
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                fill={`var(--color-${s.key})`}
                radius={[3, 3, 0, 0]}
                maxBarSize={32}
                isAnimationActive={false}
                cursor="pointer"
                onClick={(point) => {
                  if (point?.key) onSelect(point.key, s.key)
                }}
              />
            ))}
          </BarChart>
        )}
      </ChartContainer>
      <Button variant="ghost" size="sm" onClick={() => setTable(!table)} aria-expanded={table}>
        {table ? 'Ocultar valores' : 'Ver valores e registros'}
        <ChevronDown className="size-3.5" />
      </Button>
      {table ? (
        <div className="max-h-64 overflow-auto">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr>
                <th className="p-2">Intervalo</th>
                {series.map((s) => (
                  <th key={s.key} className="p-2 text-right">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.key} className="border-t">
                  <td className="p-2">{p.label}</td>
                  {series.map((s) => {
                    const value = (p as unknown as ChartPoint)[s.key]
                    return (
                      <td className="p-2 text-right tabular-nums" key={s.key}>
                        <button
                          className="text-primary focus-visible:ring-ring rounded px-1 font-medium underline-offset-4 hover:underline focus-visible:ring-2"
                          onClick={() => onSelect(p.key, s.key)}
                          aria-label={`${s.label}, ${p.label}: ver registros`}
                        >
                          {value == null ? '—' : currency ? formatToMoney(Number(value)) : number.format(Number(value))}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
function ageKey(n: number) {
  return n < 8 ? '0-7' : n < 16 ? '8-15' : n < 31 ? '16-30' : '31+'
}
function openBucket(data: ExecutionAnalytics, key: string, metric: string, open: OpenOrders) {
  const bucket = data.buckets.find((b) => b.key === key)
  if (!bucket) return
  const start = Date.parse(bucket.start),
    end = Math.min(Date.parse(bucket.end), Date.parse(data.generatedAt) + 1)
  const within = (d: string | null) => !!d && Date.parse(d) >= start && Date.parse(d) < end
  const m = metric as ExecutionMetric
  open(`${metricLabels[m]} · ${bucket.label}`, undefined, (d) =>
    m === 'open'
      ? !!d.start && Date.parse(d.start) < end && (d.end ? Date.parse(d.end) >= end : d.open)
      : m === 'initiated'
        ? within(d.start)
        : within(d.end) && (m !== 'duration' || d.duration !== null)
  )
}
function Ranking({
  rows,
  onSelect,
  currency = false,
}: {
  rows: Array<{ key: string; label: string; value: number }>
  onSelect: (key: string) => void
  currency?: boolean
}) {
  const [all, setAll] = useState(false)
  const max = Math.max(1, ...rows.map((r) => Math.abs(r.value)))
  return (
    <div className="space-y-1">
      {!rows.length ? (
        <p className="text-muted-foreground py-6 text-sm">Nenhum registro neste recorte.</p>
      ) : (
        (all ? rows : rows.slice(0, 8)).map((r) => (
          <button
            key={r.key}
            onClick={() => onSelect(r.key)}
            className="group hover:bg-muted focus-visible:ring-ring w-full rounded-md p-2 text-left focus-visible:ring-2 focus-visible:outline-none"
          >
            <span className="flex items-baseline justify-between gap-3 text-xs">
              <span className="min-w-0 font-medium break-words">{r.label}</span>
              <span className="shrink-0 font-semibold tabular-nums">{currency ? formatToMoney(r.value) : number.format(r.value)}</span>
            </span>
            <span aria-hidden className="bg-muted mt-2 block h-1.5 w-full rounded-sm">
              <span className="bg-primary block h-full rounded-sm" style={{ width: `${(Math.abs(r.value) / max) * 100}%` }} />
            </span>
          </button>
        ))
      )}
      {rows.length > 8 ? (
        <Button variant="ghost" size="sm" onClick={() => setAll(!all)}>
          {all ? 'Mostrar principais' : `Ver todos (${rows.length})`}
        </Button>
      ) : null}
    </div>
  )
}
function Breakdowns({ data, openOrders }: { data: ExecutionAnalytics; openOrders: OpenOrders }) {
  const [dimension, setDimension] = useState<'people' | 'cities' | 'categories'>('people')
  const [page, setPage] = useState(0)
  const rows = data.groups[dimension]
  const [sort, setSort] = useState<keyof Pick<ExecutionGroup, 'concluded' | 'initiated' | 'ongoing' | 'open' | 'average'>>('concluded')
  const sorted = useMemo(() => [...rows].sort((a, b) => (b[sort] ?? -1) - (a[sort] ?? -1)), [rows, sort])
  const effectivePage = Math.min(page, Math.max(0, Math.ceil(rows.length / 15) - 1))
  const match = (key: string) => (d: ExecutionDetail) =>
    dimension === 'people' ? d.people.some((p) => p.id === key) : dimension === 'cities' ? `${d.city}/${d.state}` === key : d.category === key
  return (
    <section className="bg-background overflow-hidden rounded-xl border" aria-labelledby="people-section-title">
      <MajorSectionHeading
        id="people-section-title"
        icon={UsersRound}
        title="Quem executa e onde"
        description="Conclusões por pessoa atribuída, cidade/UF e categoria de serviço."
      />
      <div className="space-y-5 p-4 md:p-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Dimensão da análise">
          {(
            [
              { key: 'people', label: 'Pessoas atribuídas' },
              { key: 'cities', label: 'Cidade / UF' },
              { key: 'categories', label: 'Categorias' },
            ] as const
          ).map((d) => (
            <Button
              key={d.key}
              size="sm"
              variant={dimension === d.key ? 'default' : 'outline'}
              aria-pressed={dimension === d.key}
              onClick={() => {
                setDimension(d.key)
                setPage(0)
              }}
            >
              {d.label}
            </Button>
          ))}
        </div>
        {dimension === 'people' ? (
          <p className="text-muted-foreground text-xs">
            Cada pessoa recebe uma participação por OS. Uma OS compartilhada aparece para cada pessoa, mas apenas uma vez no total geral. O ranking
            reflete as atribuições atuais.
          </p>
        ) : null}
        <div className="grid min-w-0 gap-6 2xl:grid-cols-[1fr_2fr]">
          <div>
            <h3 className="mb-3 text-sm font-medium">Mais serviços concluídos</h3>
            <Ranking
              key={dimension}
              rows={rows.map((r) => ({ key: r.key, label: r.label, value: r.concluded }))}
              onSelect={(key) => openOrders(`Concluídas · ${rows.find((r) => r.key === key)?.label}`, 'concluded', match(key))}
            />
          </div>
          <div className="min-w-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs">
                <caption className="sr-only">
                  Indicadores por {dimension === 'people' ? 'pessoa' : dimension === 'cities' ? 'cidade' : 'categoria'}
                </caption>
                <thead>
                  <tr className="border-b">
                    <th className="py-3 pr-3">{dimension === 'people' ? 'Pessoa' : dimension === 'cities' ? 'Cidade / UF' : 'Categoria'}</th>
                    {(
                      [
                        { key: 'concluded', label: 'Concluídas' },
                        { key: 'initiated', label: 'Iniciadas' },
                        { key: 'ongoing', label: 'Andamento¹' },
                        { key: 'open', label: 'Em aberto²' },
                        { key: 'average', label: 'Média (dias)' },
                      ] as const
                    ).map((c) => (
                      <th key={c.key} className="px-2 text-right" aria-sort={sort === c.key ? 'descending' : 'none'}>
                        <button
                          className="hover:text-primary focus-visible:ring-ring rounded py-2 focus-visible:ring-2"
                          onClick={() => {
                            setSort(c.key)
                            setPage(0)
                          }}
                        >
                          {c.label}
                          {sort === c.key ? ' ↓' : ''}
                        </button>
                      </th>
                    ))}
                    <th className="px-2 text-right">Mediana</th>
                    <th className="px-2 text-right">Participação³</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.slice(effectivePage * 15, effectivePage * 15 + 15).map((r) => (
                    <tr key={r.key} className="hover:bg-muted/50 border-b">
                      <th className="max-w-56 py-3 pr-3 font-medium">
                        <button
                          className="hover:text-primary focus-visible:ring-ring rounded text-left focus-visible:ring-2"
                          onClick={() => openOrders(r.label, undefined, match(r.key))}
                        >
                          {r.label}
                        </button>
                      </th>
                      {(['concluded', 'initiated', 'ongoing', 'open'] as const).map((m) => (
                        <td key={m} className="px-2 text-right tabular-nums">
                          <button
                            className="text-primary focus-visible:ring-ring rounded px-1 py-2 hover:underline focus-visible:ring-2"
                            aria-label={`${metricLabels[m]} de ${r.label}`}
                            onClick={() => openOrders(`${metricLabels[m]} · ${r.label}`, m, match(r.key))}
                          >
                            {r[m]}
                          </button>
                        </td>
                      ))}
                      <td className="px-2 text-right tabular-nums">
                        <button
                          className="text-primary focus-visible:ring-ring rounded hover:underline focus-visible:ring-2"
                          onClick={() => openOrders(`Prazo · ${r.label}`, 'duration', match(r.key))}
                        >
                          {r.average === null ? '—' : number.format(r.average)}
                        </button>
                      </td>
                      <td className="px-2 text-right tabular-nums">{r.median === null ? '—' : number.format(r.median)}</td>
                      <td className="px-2 text-right tabular-nums">{number.format(r.share)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!rows.length ? <p className="text-muted-foreground py-6 text-sm">Nenhum registro neste recorte.</p> : null}
            <Pager page={effectivePage} total={rows.length} size={15} onChange={setPage} />
            <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
              ¹ Iniciadas no período e ainda sem conclusão. ² Abertas na data final, inclusive anteriores. ³ Percentual das OS concluídas com
              participação nesta linha; pessoas podem somar mais de 100%.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Costs({ costs, onSelect }: { costs: NonNullable<ExecutionAnalytics['costs']>; onSelect: (s: Selection) => void }) {
  const [mode, setMode] = useState<'period' | 'completed'>('period')
  const scope = costs[mode]
  const select = (title: string, predicate?: (e: CostDetail) => boolean) =>
    onSelect({
      title,
      description: 'Despesas de execução vinculadas ao projeto, contadas uma única vez. Valores em reais.',
      expenses: scope.details.filter((e) => !predicate || predicate(e)),
    })
  return (
    <section className="bg-background overflow-hidden rounded-xl border" aria-labelledby="costs-section-title">
      <MajorSectionHeading
        id="costs-section-title"
        icon={Wallet}
        title="Custos de execução"
        description="Despesas dos projetos e divisão dos custos entre as pessoas atribuídas."
      />
      <div className="space-y-5 p-4 md:p-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Perspectiva de custos">
          <Button size="sm" variant={mode === 'period' ? 'default' : 'outline'} aria-pressed={mode === 'period'} onClick={() => setMode('period')}>
            Movimentação no período
          </Button>
          <Button
            size="sm"
            variant={mode === 'completed' ? 'default' : 'outline'}
            aria-pressed={mode === 'completed'}
            onClick={() => setMode('completed')}
          >
            Projetos com serviços concluídos
          </Button>
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {mode === 'period'
            ? 'Custos pela data de efetivação da despesa; pagamentos pela data em que foram realizados. Inclui projetos das OS que correspondem aos filtros, mesmo com execução fora do período. O saldo pendente considera apenas despesas efetivadas no intervalo.'
            : 'Todas as despesas de execução dos projetos com pelo menos uma OS concluída no período, inclusive despesas anteriores e posteriores. Pago e pendente representam a posição atual; não significam que o projeto inteiro foi concluído.'}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi
            label="Custo registrado"
            value={formatToMoney(scope.recorded)}
            note={mode === 'period' ? 'Efetivação no período' : 'Total associado aos projetos'}
            onClick={() => select('Custos registrados', (e) => e.recorded !== 0)}
            primary
          />
          <Kpi
            label={mode === 'period' ? 'Pago no período' : 'Pago até agora'}
            value={formatToMoney(scope.paid)}
            note="Soma das parcelas pagas"
            onClick={() => select('Pagamentos', (e) => e.paid !== 0)}
          />
          <Kpi
            label={mode === 'period' ? 'Pendente no fim do período' : 'Pendente atual'}
            value={formatToMoney(scope.outstanding)}
            note={mode === 'period' ? 'Das despesas efetivadas no intervalo' : 'Das despesas associadas'}
            onClick={() => select('Despesas com saldo pendente', (e) => e.outstanding !== 0)}
          />
          <Kpi
            label="Custo médio por projeto"
            value={scope.averagePerProject === null ? '—' : formatToMoney(scope.averagePerProject)}
            note="Projetos com despesas no total registrado"
          />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-y py-3 text-xs">
          <span>
            <strong className="tabular-nums">{scope.coverage === null ? '—' : `${number.format(scope.coverage)}%`}</strong> com despesas vinculadas ·{' '}
            {scope.coveredProjects}/{scope.projects} projetos {mode === 'period' ? 'com atividade ou saldo em aberto' : 'com serviços concluídos'}
          </span>
          <span className="text-muted-foreground">
            {scope.missingDates} despesas sem data de efetivação válida{mode === 'period' ? ' (não entram no custo registrado)' : ''}. Sem vínculo
            financeiro não significa custo zero.
          </span>
        </div>
        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          {mode === 'period' ? (
            <Trend
              title="Custos e pagamentos"
              description="As duas séries têm datas de referência diferentes e podem divergir."
              points={costs.trend}
              series={[
                { key: 'recorded', label: 'Custo registrado' },
                { key: 'paid', label: 'Pago' },
              ]}
              currency
              onSelect={(key, metric) => {
                const point = costs.trend.find((p) => p.key === key)
                if (!point) return
                const inside = (date: string | null) =>
                  !!date && Date.parse(date) >= Date.parse(point.start) && Date.parse(date) < Date.parse(point.end)
                const expenses = scope.details
                  .map((e) => ({
                    ...e,
                    recorded: inside(e.date) ? e.recorded : 0,
                    paid: e.payments.filter((p) => inside(p.date)).reduce((sum, p) => sum + p.value, 0),
                    outstanding: 0,
                    items: inside(e.date) ? e.items : [],
                  }))
                  .filter((e) => (metric === 'paid' ? e.paid !== 0 : e.recorded !== 0))
                onSelect({
                  title: `${metric === 'paid' ? 'Pagamentos' : 'Custos'} · ${point.label}`,
                  description: 'Movimentação neste intervalo. O saldo pendente não é calculado neste recorte.',
                  expenses,
                })
              }}
            />
          ) : null}
          <section className="min-w-0 space-y-4 border-t pt-5">
            <SectionHeading
              title="Custos por pessoa atribuída"
              description="Divisão igual entre as pessoas distintas das OS de cada projeto. O total rateado corresponde ao custo registrado."
            />
            <p className="text-muted-foreground text-xs leading-relaxed">
              O rateio considera todas as OS não canceladas do projeto. Os filtros selecionam os projetos, sem redistribuir as parcelas das outras
              pessoas. Projetos sem pessoas atribuídas aparecem em “Sem responsável”.
            </p>
            <Ranking
              rows={scope.people}
              currency
              onSelect={(key) => {
                const person = scope.people.find((p) => p.key === key)
                const expenses = scope.details.flatMap((e) => {
                  const share = e.allocations.find((a) => a.id === key)
                  return share
                    ? [
                        {
                          ...e,
                          recorded: share.recorded,
                          paid: share.paid,
                          outstanding: share.outstanding,
                          attribution: `${share.name} · 1 de ${e.allocations.length} participantes`,
                          items: [],
                          payments: [],
                        },
                      ]
                    : []
                })
                onSelect({
                  title: `Custos rateados · ${person?.label}`,
                  description:
                    'Valores da participação desta pessoa. Cada despesa é dividida igualmente entre os participantes distintos do projeto; diferenças de centavos são distribuídas de forma estável.',
                  expenses,
                })
              }}
            />
          </section>
          <section className="min-w-0 space-y-4 border-t pt-5">
            <SectionHeading title="Projetos com maior custo" description="Total registrado por projeto, sem multiplicar pelas OS vinculadas." />
            <Ranking
              rows={scope.projectsBreakdown}
              currency
              onSelect={(key) => select(`Custos · ${scope.projectsBreakdown.find((p) => p.key === key)?.label}`, (e) => e.projectId === key)}
            />
          </section>
          <section className="min-w-0 space-y-4 border-t pt-5">
            <SectionHeading
              title="Composição dos custos"
              description="Itens das despesas: deslocamento, alimentação, módulos e demais descrições cadastradas."
            />
            <Ranking rows={scope.items} currency onSelect={(key) => select(`Despesas com ${key}`, (e) => e.items.some((i) => i.label === key))} />
          </section>
        </div>
      </div>
    </section>
  )
}

function Pager({ page, total, size, onChange }: { page: number; total: number; size: number; onChange: (page: number) => void }) {
  return total > size ? (
    <div className="mt-3 flex items-center justify-between gap-2 text-xs">
      <span>
        {page * size + 1}–{Math.min((page + 1) * size, total)} de {total}
      </span>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" disabled={!page} onClick={() => onChange(page - 1)}>
          Anterior
        </Button>
        <Button variant="outline" size="sm" disabled={(page + 1) * size >= total} onClick={() => onChange(page + 1)}>
          Próxima
        </Button>
      </div>
    </div>
  ) : null
}
function csvCell(value: string | number | null) {
  const text = String(value ?? '')
  return `"${(typeof value === 'string' && /^[\s]*[=+@-]/.test(text) ? `'${text}` : text).replace(/"/g, '""')}"`
}
function exportSelection(selection: Selection) {
  const rows: Array<Array<string | number | null>> = selection.orders
    ? [
        [
          'OS',
          'Descrição',
          'Categoria',
          'Projeto',
          'Pessoas atribuídas',
          'Cidade',
          'UF',
          'Início',
          'Conclusão',
          'Duração (dias)',
          'Idade em aberto (dias)',
        ],
        ...selection.orders.map((d) => [
          d.id,
          d.title,
          d.category,
          d.projectName,
          d.people.map((p) => p.name).join(', '),
          d.city,
          d.state,
          d.start,
          d.end,
          d.duration,
          d.age,
        ]),
      ]
    : [
        ['Despesa', 'Descrição', 'Projeto', 'Categoria', 'Efetivação', 'Custo registrado', 'Pago', 'Pendente', 'Rateio'],
        ...(selection.expenses || []).map((d) => [
          d.id,
          d.title,
          d.projectName,
          d.category,
          d.date,
          d.recorded,
          d.paid,
          d.outstanding,
          d.attribution || 'Total da despesa',
        ]),
      ]
  const url = URL.createObjectURL(new Blob(['\uFEFF', rows.map((r) => r.map(csvCell).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8;' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'analitico-obras.csv'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
function DetailPanel({ selection, close }: { selection: Selection | null; close: () => void }) {
  const [page, setPage] = useState(0)
  const total = selection?.orders?.length ?? selection?.expenses?.length ?? 0
  return (
    <Sheet
      open={!!selection}
      onOpenChange={(open) => {
        if (!open) close()
      }}
    >
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>{selection?.title || 'Registros'}</SheetTitle>
          <SheetDescription>{selection?.description || 'Registros do recorte selecionado.'}</SheetDescription>
        </SheetHeader>
        {selection ? (
          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
              <span className="text-sm font-medium">{total} registro(s)</span>
              <Button size="sm" variant="outline" disabled={!total} onClick={() => exportSelection(selection)}>
                <Download className="size-4" /> Exportar recorte
              </Button>
            </div>
            {selection.expenses ? (
              <div className="flex flex-wrap gap-3 text-xs">
                <span>
                  Registrado: <strong>{formatToMoney(selection.expenses.reduce((s, e) => s + e.recorded, 0))}</strong>
                </span>
                <span>
                  Pago: <strong>{formatToMoney(selection.expenses.reduce((s, e) => s + e.paid, 0))}</strong>
                </span>
                <span>
                  Pendente: <strong>{formatToMoney(selection.expenses.reduce((s, e) => s + e.outstanding, 0))}</strong>
                </span>
              </div>
            ) : null}
            {selection.orders?.slice(page * 25, page * 25 + 25).map((d) => (
              <article key={d.id} className="space-y-2 border-b pb-4 text-xs">
                <Link
                  href={`/ordens-de-servico/pdf/${d.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary inline-flex gap-1 text-sm font-semibold underline-offset-4 hover:underline"
                >
                  {d.title}
                  <ArrowUpRight className="size-4 shrink-0" />
                  <span className="sr-only">Abrir OS em nova aba</span>
                </Link>
                <p>
                  {d.category} · {d.city}/{d.state}
                </p>
                <p className="text-muted-foreground">{d.people.map((p) => p.name).join(', ')}</p>
                <p>
                  Início: {dateLabel(d.start)} · Conclusão: {dateLabel(d.end)}
                </p>
                <p className="tabular-nums">
                  Duração: {days(d.duration)}
                  {d.age !== null ? ` · Em aberto há ${days(d.age)}` : ''}
                </p>
                <p className="text-muted-foreground">{d.projectId ? d.projectName : 'Sem projeto vinculado'}</p>
              </article>
            ))}
            {selection.expenses?.slice(page * 25, page * 25 + 25).map((e) => (
              <article key={e.id} className="space-y-2 border-b pb-4 text-xs">
                <p className="text-sm font-semibold">{e.title}</p>
                <p>
                  {e.projectName} · {e.category}
                </p>
                <p className="text-muted-foreground">Efetivação: {dateLabel(e.date)}</p>
                {e.attribution ? <p className="text-primary font-medium">Rateio: {e.attribution}</p> : null}
                <div className="flex flex-wrap gap-3 tabular-nums">
                  <span>Registrado: {formatToMoney(e.recorded)}</span>
                  <span>Pago: {formatToMoney(e.paid)}</span>
                  <span>Pendente: {formatToMoney(e.outstanding)}</span>
                </div>
                {e.items.length ? (
                  <details>
                    <summary className="text-primary cursor-pointer">Ver itens</summary>
                    <ul className="mt-2 space-y-1">
                      {e.items.map((i, index) => (
                        <li key={`${i.label}-${index}`} className="flex justify-between gap-3">
                          <span>{i.label}</span>
                          <span className="shrink-0 tabular-nums">{formatToMoney(i.value)}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </article>
            ))}
            {!total ? <p className="text-muted-foreground py-8 text-center text-sm">Nenhum registro neste recorte.</p> : null}
            <Pager page={page} total={total} size={25} onChange={setPage} />
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
