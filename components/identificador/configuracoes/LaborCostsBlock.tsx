import CheckboxInput from '@/components/inputs/Checkbox'
import NumberInput from '@/components/inputs/Number'
import SelectInput from '@/components/inputs/Select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'
import ErrorComponent from '@/components/utils/ErrorComponent'
import type { TAuthSession } from '@/lib/authentication/types'
import { normalizeLaborCostTeamKey } from '@/lib/service-orders/labor-cost'
import { equipesTecnicas, formatToMoney } from '@/utils/constants'
import { getErrorMessage } from '@/utils/methods/handlers'
import { createLaborCostConfiguration, updateLaborCostConfiguration } from '@/utils/methods/mutation/labor-costs'
import { laborCostConfigurationsQueryKey, useLaborCostConfigurations } from '@/utils/methods/query/labor-costs'
import { useEmployeesSimplified } from '@/utils/methods/query/users'
import { UpsertLaborCostConfigurationSchema, type TLaborCostConfigurationDTO, type TUpsertLaborCostConfiguration } from '@/utils/schemas/labor-costs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Calculator, Pencil, Plus, Trash2, UsersRound, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

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
    () =>
      equipesTecnicas
        .filter((team) => team.value)
        .map((team, index) => ({
          id: `${index}-${team.value}`,
          value: team.value as string,
          label: team.label,
        })),
    []
  )

  function editConfiguration(configuration: TLaborCostConfigurationDTO) {
    const { _id, autor: _author, dataInsercao: _createdAt, dataAtualizacao: _updatedAt, ...value } = configuration
    setEditing({ id: _id, value })
  }

  return (
    <div className="flex h-full grow flex-col gap-4">
      <div className="border-border flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-lg font-semibold">Custos de mão de obra</h1>
          <p className="text-muted-foreground text-sm">
            Configure valores operacionais por equipe interna ou prestador. As ordens usam essas regras para criar uma despesa estimada e auditável.
          </p>
        </div>
        {canEdit && !editing ? (
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" onClick={() => setEditing({ id: null, value: structuredClone(DEFAULT_INTERNAL_CONFIGURATION) })}>
              <UsersRound className="size-4" />
              Nova equipe
            </Button>
            <Button onClick={() => setEditing({ id: null, value: structuredClone(DEFAULT_EXTERNAL_CONFIGURATION) })}>
              <Plus className="size-4" />
              Novo terceiro
            </Button>
          </div>
        ) : null}
      </div>

      {editing ? (
        <ConfigurationEditor
          editor={editing}
          setEditor={setEditing}
          userOptions={userOptions}
          teamOptions={teamOptions}
          loading={saveMutation.isPending}
          onCancel={() => setEditing(null)}
          onSave={() => saveMutation.mutate(editing)}
        />
      ) : null}

      {configurationsQuery.isLoading ? <p className="text-muted-foreground py-8 text-center text-sm">Carregando configurações...</p> : null}
      {configurationsQuery.isError ? <ErrorComponent msg={getErrorMessage(configurationsQuery.error)} /> : null}
      {configurationsQuery.isSuccess ? (
        configurationsQuery.data.length > 0 ? (
          <div className="divide-border overflow-hidden rounded-lg border">
            {configurationsQuery.data.map((configuration) => (
              <ConfigurationRow
                key={configuration._id}
                configuration={configuration}
                canEdit={canEdit}
                onEdit={() => editConfiguration(configuration)}
              />
            ))}
          </div>
        ) : (
          <div className="border-border bg-muted/30 flex flex-col items-center gap-2 rounded-lg border px-6 py-12 text-center">
            <Calculator className="text-primary size-7" />
            <p className="font-semibold">Nenhuma regra configurada</p>
            <p className="text-muted-foreground max-w-xl text-sm">
              Cadastre primeiro a equipe interna padrão e depois os prestadores com valores próprios.
            </p>
          </div>
        )
      ) : null}
    </div>
  )
}

type EditorProps = {
  editor: { id: string | null; value: TUpsertLaborCostConfiguration }
  setEditor: React.Dispatch<
    React.SetStateAction<{
      id: string | null
      value: TUpsertLaborCostConfiguration
    } | null>
  >
  userOptions: { id: string; value: string; label: string }[]
  teamOptions: { id: string; value: string; label: string }[]
  loading: boolean
  onCancel: () => void
  onSave: () => void
}

function ConfigurationEditor({ editor, setEditor, userOptions, teamOptions, loading, onCancel, onSave }: EditorProps) {
  const configuration = editor.value
  function update(value: TUpsertLaborCostConfiguration) {
    setEditor((current) => (current ? { ...current, value } : current))
  }

  return (
    <section className="border-border bg-muted/30 rounded-lg border p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{editor.id ? 'Editar configuração' : 'Nova configuração'}</h2>
          <p className="text-muted-foreground text-sm">
            {configuration.sujeito.tipo === 'EQUIPE'
              ? 'A diária será aplicada uma única vez por ordem, conforme a faixa de módulos.'
              : 'O custo será calculado pelos módulos e inversores informados na ordem.'}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Fechar editor">
          <X className="size-4" />
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {configuration.sujeito.tipo === 'EQUIPE' ? (
          <SelectInput
            label="EQUIPE"
            value={configuration.sujeito.nome || null}
            options={teamOptions}
            selectedItemLabel="Selecione a equipe"
            handleChange={(name) =>
              update({
                ...configuration,
                sujeito: { tipo: 'EQUIPE', nome: name, chave: normalizeLaborCostTeamKey(name) },
              })
            }
            onReset={() => update({ ...configuration, sujeito: { tipo: 'EQUIPE', nome: '', chave: '' } })}
            width="100%"
          />
        ) : (
          <SelectInput
            label="PRESTADOR"
            value={configuration.sujeito.id || null}
            options={userOptions}
            selectedItemLabel="Selecione o prestador"
            handleChange={(id) => {
              const employee = userOptions.find((option) => option.value === id)
              update({
                ...configuration,
                sujeito: { tipo: 'USUARIO', id, nome: employee?.label || '' },
              })
            }}
            onReset={() => update({ ...configuration, sujeito: { tipo: 'USUARIO', id: '', nome: '' } })}
            width="100%"
          />
        )}

        <div className="flex flex-wrap items-center gap-4 pt-5">
          <CheckboxInput
            checked={configuration.ativo}
            labelTrue="Configuração ativa"
            labelFalse="Configuração inativa"
            handleChange={(ativo) => update({ ...configuration, ativo })}
            padding="0"
          />
          {configuration.sujeito.tipo === 'EQUIPE' ? (
            <CheckboxInput
              checked={configuration.padrao}
              labelTrue="Equipe padrão"
              labelFalse="Definir como padrão"
              handleChange={(padrao) => update({ ...configuration, padrao })}
              padding="0"
            />
          ) : null}
        </div>
      </div>

      {configuration.regra.modelo === 'EQUIPE_INTERNA_DIARIA' ? (
        <InternalRuleEditor configuration={configuration} rule={configuration.regra} update={update} />
      ) : (
        <ExternalRuleEditor configuration={configuration} rule={configuration.regra} update={update} />
      )}

      <div className="border-border mt-4 flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <LoadingButton loading={loading} onClick={onSave}>
          Salvar configuração
        </LoadingButton>
      </div>
    </section>
  )
}

function InternalRuleEditor({
  configuration,
  rule,
  update,
}: {
  configuration: TUpsertLaborCostConfiguration
  rule: Extract<TUpsertLaborCostConfiguration['regra'], { modelo: 'EQUIPE_INTERNA_DIARIA' }>
  update: (value: TUpsertLaborCostConfiguration) => void
}) {
  return (
    <div className="mt-4 space-y-3">
      <div className="max-w-xs">
        <NumberInput
          label="VALOR DA DIÁRIA"
          placeholder="0,00"
          value={rule.valorDiaria}
          handleChange={(valorDiaria) => update({ ...configuration, regra: { ...rule, valorDiaria } })}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Faixas de produtividade</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              update({
                ...configuration,
                regra: {
                  ...rule,
                  faixas: [...rule.faixas, { minimoModulos: 0, maximoModulos: 0, dias: 1 }],
                },
              })
            }
          >
            <Plus className="size-4" />
            Adicionar faixa
          </Button>
        </div>
        {rule.faixas.map((range, index) => (
          <div key={`${index}-${range.minimoModulos}-${range.maximoModulos}`} className="grid items-end gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <NumberInput
              label="MÍNIMO DE MÓDULOS"
              placeholder="2"
              value={range.minimoModulos}
              handleChange={(value) => {
                const faixas = [...rule.faixas]
                faixas[index] = { ...range, minimoModulos: value }
                update({ ...configuration, regra: { ...rule, faixas } })
              }}
            />
            <NumberInput
              label="MÁXIMO DE MÓDULOS"
              placeholder="8"
              value={range.maximoModulos}
              handleChange={(value) => {
                const faixas = [...rule.faixas]
                faixas[index] = { ...range, maximoModulos: value }
                update({ ...configuration, regra: { ...rule, faixas } })
              }}
            />
            <NumberInput
              label="DIAS"
              placeholder="1"
              value={range.dias}
              handleChange={(value) => {
                const faixas = [...rule.faixas]
                faixas[index] = { ...range, dias: value }
                update({ ...configuration, regra: { ...rule, faixas } })
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              disabled={rule.faixas.length === 1}
              aria-label="Remover faixa"
              onClick={() =>
                update({
                  ...configuration,
                  regra: { ...rule, faixas: rule.faixas.filter((_, itemIndex) => itemIndex !== index) },
                })
              }
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExternalRuleEditor({
  configuration,
  rule,
  update,
}: {
  configuration: TUpsertLaborCostConfiguration
  rule: Extract<TUpsertLaborCostConfiguration['regra'], { modelo: 'TERCEIRO_POR_EQUIPAMENTO' }>
  update: (value: TUpsertLaborCostConfiguration) => void
}) {
  return (
    <div className="mt-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <NumberInput
          label="VALOR POR MÓDULO"
          placeholder="0,00"
          value={rule.valorPorModulo}
          handleChange={(valorPorModulo) => update({ ...configuration, regra: { ...rule, valorPorModulo } })}
        />
        <NumberInput
          label="VALOR POR INVERSOR"
          placeholder="0,00"
          value={rule.valorPorInversor}
          handleChange={(valorPorInversor) => update({ ...configuration, regra: { ...rule, valorPorInversor } })}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Exceções de valor fechado</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              update({
                ...configuration,
                regra: {
                  ...rule,
                  excecoes: [...rule.excecoes, { quantidadeModulos: 4, valorFixo: 0 }],
                },
              })
            }
          >
            <Plus className="size-4" />
            Adicionar exceção
          </Button>
        </div>
        {rule.excecoes.length === 0 ? <p className="text-muted-foreground text-sm">A fórmula normal será aplicada a todas as quantidades.</p> : null}
        {rule.excecoes.map((exception, index) => (
          <div key={`${index}-${exception.quantidadeModulos}`} className="grid items-end gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <NumberInput
              label="QUANTIDADE DE MÓDULOS"
              placeholder="4"
              value={exception.quantidadeModulos}
              handleChange={(value) => {
                const excecoes = [...rule.excecoes]
                excecoes[index] = { ...exception, quantidadeModulos: value }
                update({ ...configuration, regra: { ...rule, excecoes } })
              }}
            />
            <NumberInput
              label="VALOR FECHADO"
              placeholder="0,00"
              value={exception.valorFixo}
              handleChange={(value) => {
                const excecoes = [...rule.excecoes]
                excecoes[index] = { ...exception, valorFixo: value }
                update({ ...configuration, regra: { ...rule, excecoes } })
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remover exceção"
              onClick={() =>
                update({
                  ...configuration,
                  regra: { ...rule, excecoes: rule.excecoes.filter((_, itemIndex) => itemIndex !== index) },
                })
              }
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConfigurationRow({ configuration, canEdit, onEdit }: { configuration: TLaborCostConfigurationDTO; canEdit: boolean; onEdit: () => void }) {
  return (
    <div className="bg-background flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-semibold">{configuration.sujeito.nome}</p>
          <Badge variant={configuration.ativo ? 'default' : 'secondary'}>{configuration.ativo ? 'Ativa' : 'Inativa'}</Badge>
          {configuration.padrao ? <Badge variant="outline">Padrão</Badge> : null}
        </div>
        {configuration.regra.modelo === 'EQUIPE_INTERNA_DIARIA' ? (
          <p className="text-muted-foreground text-sm">
            {formatToMoney(configuration.regra.valorDiaria)} por dia · {configuration.regra.faixas.length}{' '}
            {configuration.regra.faixas.length === 1 ? 'faixa' : 'faixas'}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            {formatToMoney(configuration.regra.valorPorModulo)} por módulo · {formatToMoney(configuration.regra.valorPorInversor)} por inversor
            {configuration.regra.excecoes.length > 0 ? ` · ${configuration.regra.excecoes.length} exceção(ões)` : ''}
          </p>
        )}
      </div>
      {canEdit ? (
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="size-4" />
          Editar
        </Button>
      ) : null}
    </div>
  )
}
