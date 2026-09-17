import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import type { TAuthSession } from '@/lib/authentication/types'
import { equipesTecnicas, formatToMoney } from '@/utils/constants'
import { getErrorMessage } from '@/utils/methods/handlers'
import { createLaborCostConfiguration, updateLaborCostConfiguration } from '@/utils/methods/mutation/labor-costs'
import { laborCostConfigurationsQueryKey, useLaborCostConfigurations } from '@/utils/methods/query/labor-costs'
import { useEmployeesSimplified } from '@/utils/methods/query/users'
import { UpsertLaborCostConfigurationSchema, type TLaborCostConfigurationDTO, type TUpsertLaborCostConfiguration } from '@/utils/schemas/labor-costs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import LaborCostConfigurationModal from './LaborCostConfigurationModal'

const DEFAULT_INTERNAL_CONFIGURATION: TUpsertLaborCostConfiguration = {
  ativo: true,
  padrao: false,
  sujeito: { tipo: 'EQUIPE', chave: '', nome: '' },
  regra: {
    modelo: 'EQUIPE_INTERNA_DIARIA',
    valorDiaria: 560.24,
    faixas: [
      { minimoModulos: 2, maximoModulos: 8, dias: 1 },
      { minimoModulos: 9, maximoModulos: 16, dias: 2 },
    ],
  },
}

const DEFAULT_EXTERNAL_CONFIGURATION: TUpsertLaborCostConfiguration = {
  ativo: true,
  padrao: false,
  sujeito: { tipo: 'USUARIO', id: '', nome: '' },
  regra: {
    modelo: 'TERCEIRO_POR_EQUIPAMENTO',
    valorPorModulo: 50,
    valorPorInversor: 50,
    excecoes: [],
  },
}

type LaborCostsBlockProps = { session: TAuthSession }

export default function LaborCostsBlock({ session }: LaborCostsBlockProps) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<{
    id: string | null
    value: TUpsertLaborCostConfiguration
  } | null>(null)
  const configurationsQuery = useLaborCostConfigurations()
  const employeesQuery = useEmployeesSimplified({})
  const canEdit = session.user.permissoes.financeiro.editar

  const saveMutation = useMutation({
    mutationKey: ['save-labor-cost-configuration'],
    mutationFn: async (editor: NonNullable<typeof editing>) => {
      const configuration = UpsertLaborCostConfigurationSchema.parse(editor.value)
      return editor.id ? updateLaborCostConfiguration({ id: editor.id, configuration }) : createLaborCostConfiguration(configuration)
    },
    onSuccess: async (response) => {
      toast.success(response.message)
      setEditing(null)
      await queryClient.invalidateQueries({ queryKey: laborCostConfigurationsQueryKey })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const userOptions = useMemo(
    () =>
      employeesQuery.data?.map((employee) => ({
        id: employee._id,
        value: employee._id,
        label: employee.nome,
      })) || [],
    [employeesQuery.data]
  )
  const teamOptions = useMemo(
    () => [
      { id: 'internal-default', value: 'Equipe interna (padrão)', label: 'EQUIPE INTERNA (PADRÃO)' },
      ...equipesTecnicas
        .filter((team) => team.value)
        .map((team, index) => ({
          id: `${index}-${team.value}`,
          value: team.value as string,
          label: team.label,
        })),
    ],
    []
  )

  function editConfiguration(configuration: TLaborCostConfigurationDTO) {
    const { _id, autor: _author, dataInsercao: _createdAt, dataAtualizacao: _updatedAt, ...value } = configuration
    setEditing({ id: _id, value })
  }

  const configurationCount = configurationsQuery.isSuccess ? configurationsQuery.data.length : 0

  return (
    <div className="flex h-full grow flex-col">
      <div className="border-border flex w-full flex-col items-center justify-between border-b pb-2 lg:flex-row">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">Custos de mão de obra</h1>
          <p className="text-sm text-foreground">Configure valores operacionais por equipe interna ou prestador</p>
          <p className="text-sm text-foreground">
            {configurationCount} {configurationCount === 1 ? 'regra configurada' : 'regras configuradas'}
          </p>
        </div>
        {canEdit ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => setEditing({ id: null, value: structuredClone(DEFAULT_INTERNAL_CONFIGURATION) })}
            >
              <UsersRound className="h-4 w-4 min-h-4 min-w-4" aria-hidden />
              NOVA EQUIPE
            </Button>
            <Button
              type="button"
              className="gap-2"
              onClick={() => setEditing({ id: null, value: structuredClone(DEFAULT_EXTERNAL_CONFIGURATION) })}
            >
              <Plus className="h-4 w-4 min-h-4 min-w-4" aria-hidden />
              NOVO TERCEIRO
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-2 py-2">
        {configurationsQuery.isLoading ? <LoadingComponent /> : null}
        {configurationsQuery.isError ? <ErrorComponent msg={getErrorMessage(configurationsQuery.error)} /> : null}
        {configurationsQuery.isSuccess ? (
          configurationsQuery.data.length > 0 ? (
            configurationsQuery.data.map((configuration) => (
              <LaborCostConfigurationCard
                key={configuration._id}
                configuration={configuration}
                canEdit={canEdit}
                onEdit={() => editConfiguration(configuration)}
              />
            ))
          ) : (
            <div className="text-foreground w-full text-center text-sm font-medium tracking-tight">
              Nenhuma regra de custo configurada. Cadastre a equipe interna e os prestadores com valores próprios.
            </div>
          )
        ) : null}
      </div>

      {editing ? (
        <LaborCostConfigurationModal
          editor={editing}
          setEditor={setEditing}
          userOptions={userOptions}
          teamOptions={teamOptions}
          loading={saveMutation.isPending}
          closeModal={() => setEditing(null)}
          onSave={() => saveMutation.mutate(editing)}
        />
      ) : null}
    </div>
  )
}

function LaborCostConfigurationCard({
  configuration,
  canEdit,
  onEdit,
}: {
  configuration: TLaborCostConfigurationDTO
  canEdit: boolean
  onEdit: () => void
}) {
  const isTeam = configuration.sujeito.tipo === 'EQUIPE'

  return (
    <div className="border-primary bg-background flex w-full flex-col gap-1 rounded border p-2 shadow-xs dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full items-center justify-start gap-2 lg:grow">
          <p className="text-sm leading-none font-bold tracking-tight">{configuration.sujeito.nome}</p>
          <Badge variant={configuration.ativo ? 'default' : 'secondary'} className="text-[0.65rem]">
            {configuration.ativo ? 'Ativa' : 'Inativa'}
          </Badge>
          {configuration.padrao ? (
            <Badge variant="outline" className="text-[0.65rem]">
              Padrão
            </Badge>
          ) : null}
          <Badge variant="secondary" className="text-[0.65rem]">
            {isTeam ? 'Equipe interna' : 'Terceiro'}
          </Badge>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <p className="text-muted-foreground text-[0.65rem] font-medium">
          {configuration.regra.modelo === 'EQUIPE_INTERNA_DIARIA' ? (
            <>
              {formatToMoney(configuration.regra.valorDiaria)} por dia · {configuration.regra.faixas.length}{' '}
              {configuration.regra.faixas.length === 1 ? 'faixa' : 'faixas'} de módulos
            </>
          ) : (
            <>
              {formatToMoney(configuration.regra.valorPorModulo)} por módulo · {formatToMoney(configuration.regra.valorPorInversor)} por inversor
              {configuration.regra.excecoes.length > 0 ? ` · ${configuration.regra.excecoes.length} exceção(ões)` : ''}
            </>
          )}
        </p>
        {canEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="bg-primary text-secondary flex items-center gap-1 rounded-lg px-2 py-1 text-[0.6rem]"
          >
            <Pencil width={10} height={10} />
            <p>EDITAR</p>
          </button>
        ) : null}
      </div>
    </div>
  )
}
