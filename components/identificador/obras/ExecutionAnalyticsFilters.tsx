import { Button } from '@/components/ui/button'
import { InteractiveFilter, type InteractiveFilterOption } from '@/components/ui/interactive-filter'
import type { ExecutionAnalytics, ExecutionFilters } from '@/lib/analytics/execution'
import { CalendarDays, ChartNoAxesColumn, FolderTree, ListFilter, MapPin, Plus, RotateCcw, Tags, UsersRound } from 'lucide-react'
import { type ReactNode } from 'react'

const granularityOptions: InteractiveFilterOption<ExecutionFilters['granularity']>[] = [
  { id: 'day', value: 'day', label: 'Diário' },
  { id: 'week', value: 'week', label: 'Semanal' },
  { id: 'month', value: 'month', label: 'Mensal' },
]
const calendarDate = (value: string) => (value ? new Date(`${value}T12:00:00`) : undefined)
const dateValue = (value?: Date) =>
  value ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}` : ''
const displayDate = (value: string) => (value ? value.split('-').reverse().join('/') : 'Selecionar')
const optionsFor = (values: string[] = []): InteractiveFilterOption[] => values.map((value) => ({ id: value, value, label: value }))

export default function ExecutionAnalyticsFilters({
  draft,
  options,
  update,
  apply,
  reset,
  preset,
  invalid,
  changed,
  loading,
}: {
  draft: ExecutionFilters
  options?: ExecutionAnalytics['options']
  update: (changes: Partial<ExecutionFilters>) => void
  apply: () => void
  reset: () => void
  preset: (value: string) => void
  invalid: boolean
  changed: boolean
  loading: boolean
}) {
  const additional = [
    { key: 'cities' as const, label: 'Cidade', icon: <MapPin className="size-4" />, options: optionsFor(options?.cities) },
    { key: 'states' as const, label: 'UF', icon: <MapPin className="size-4" />, options: optionsFor(options?.states) },
    { key: 'projectTypes' as const, label: 'Tipo de projeto', icon: <FolderTree className="size-4" />, options: optionsFor(options?.projectTypes) },
  ]
  return (
    <form
      className="space-y-3 border-b pb-5"
      aria-label="Filtros do analítico"
      onSubmit={(e) => {
        e.preventDefault()
        if (!invalid) apply()
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <InteractiveFilter.Root>
          <InteractiveFilter.Trigger>
            <InteractiveFilter.Icon>
              <CalendarDays className="size-4" />
              <InteractiveFilter.Label>Período</InteractiveFilter.Label>
            </InteractiveFilter.Icon>
            <InteractiveFilter.Value>
              <strong>
                {displayDate(draft.start)} – {displayDate(draft.end)}
              </strong>
            </InteractiveFilter.Value>
          </InteractiveFilter.Trigger>
          <InteractiveFilter.Content className="w-auto max-w-[calc(100vw-2rem)] p-0">
            <div className="flex flex-wrap gap-1 border-b p-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => preset('month')}>
                Este mês
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => preset('30')}>
                Últimos 30 dias
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => preset('year')}>
                Este ano
              </Button>
            </div>
            <InteractiveFilter.DateRangeContent
              numberOfMonths={1}
              value={{ from: calendarDate(draft.start), to: calendarDate(draft.end) }}
              onChange={(range) => update({ start: dateValue(range.from), end: dateValue(range.to) })}
              closeOnComplete
            />
          </InteractiveFilter.Content>
        </InteractiveFilter.Root>
        <InteractiveFilter.Root>
          <InteractiveFilter.Trigger>
            <InteractiveFilter.Icon>
              <ChartNoAxesColumn className="size-4" />
              <InteractiveFilter.Label>Agrupamento</InteractiveFilter.Label>
            </InteractiveFilter.Icon>
            <InteractiveFilter.Value>
              <strong>{granularityOptions.find((o) => o.value === draft.granularity)?.label}</strong>
            </InteractiveFilter.Value>
          </InteractiveFilter.Trigger>
          <InteractiveFilter.Content>
            <InteractiveFilter.SingleContent
              options={granularityOptions}
              value={draft.granularity}
              onChange={(granularity) => {
                if (granularity) update({ granularity })
              }}
              closeOnSelect
            />
          </InteractiveFilter.Content>
        </InteractiveFilter.Root>
        <MultiFilter
          label="Categoria"
          icon={<Tags className="size-4" />}
          options={optionsFor(options?.categories)}
          values={draft.categories}
          onChange={(categories) => update({ categories })}
        />
        <MultiFilter
          label="Pessoa atribuída"
          icon={<UsersRound className="size-4" />}
          options={(options?.people || []).map((p) => ({ id: p.id, value: p.id, label: p.name }))}
          values={draft.people}
          onChange={(people) => update({ people })}
        />
        {additional
          .filter((f) => draft[f.key].length)
          .map((f) => (
            <MultiFilter
              key={f.key}
              label={f.label}
              icon={f.icon}
              options={f.options}
              values={draft[f.key]}
              onChange={(values) => update({ [f.key]: values })}
            />
          ))}
        {additional.some((f) => !draft[f.key].length) ? (
          <InteractiveFilter.AddFilterRoot>
            <InteractiveFilter.AddFilterTrigger>
              <Plus className="size-4" />
              <InteractiveFilter.Label>Adicionar filtro</InteractiveFilter.Label>
            </InteractiveFilter.AddFilterTrigger>
            <InteractiveFilter.AddFilterContent>
              <InteractiveFilter.AddFilterSection>
                {additional
                  .filter((f) => !draft[f.key].length)
                  .map((f) => (
                    <InteractiveFilter.AddFilterItem key={f.key} id={f.key} label={f.label} icon={f.icon}>
                      <InteractiveFilter.MultiContent
                        options={f.options}
                        value={draft[f.key]}
                        onChange={(values) => update({ [f.key]: values })}
                        closeOnChange
                      />
                    </InteractiveFilter.AddFilterItem>
                  ))}
              </InteractiveFilter.AddFilterSection>
            </InteractiveFilter.AddFilterContent>
          </InteractiveFilter.AddFilterRoot>
        ) : null}
        <Button type="submit" size="sm" disabled={invalid || loading}>
          <ListFilter className="size-3.5" />
          {loading ? 'Atualizando…' : 'Aplicar filtros'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={reset}>
          <RotateCcw className="size-3.5" />
          Limpar
        </Button>
      </div>
      {invalid ? (
        <p role="alert" className="text-destructive text-sm">
          Escolha um intervalo válido de até 366 dias, sem datas futuras.
        </p>
      ) : changed ? (
        <p role="status" className="text-muted-foreground text-xs">
          Há alterações nos filtros. Clique em Aplicar filtros para atualizar os indicadores.
        </p>
      ) : null}
    </form>
  )
}

function MultiFilter({
  label,
  icon,
  options,
  values,
  onChange,
}: {
  label: string
  icon: ReactNode
  options: InteractiveFilterOption[]
  values: string[]
  onChange: (values: string[]) => void
}) {
  const selected = options.filter((o) => values.includes(o.value)).map((o) => o.label)
  return (
    <InteractiveFilter.Root>
      <InteractiveFilter.Trigger>
        <InteractiveFilter.Icon>
          {icon}
          <InteractiveFilter.Label>{label}</InteractiveFilter.Label>
        </InteractiveFilter.Icon>
        <InteractiveFilter.Value>
          <strong className="max-w-40 truncate">{selected.length > 1 ? `${selected[0]} +${selected.length - 1}` : selected[0] || 'Todos'}</strong>
        </InteractiveFilter.Value>
        {values.length ? <InteractiveFilter.Clear onClear={() => onChange([])} label={`Limpar ${label.toLowerCase()}`} /> : null}
      </InteractiveFilter.Trigger>
      <InteractiveFilter.Content>
        <InteractiveFilter.MultiContent
          options={options}
          value={values}
          onChange={onChange}
          onClear={() => onChange([])}
          isCleared={!values.length}
          clearLabel="Todos"
          searchPlaceholder={`Buscar ${label.toLowerCase()}...`}
        />
      </InteractiveFilter.Content>
    </InteractiveFilter.Root>
  )
}
