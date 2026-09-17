import CheckboxInput from '@/components/inputs/Checkbox'
import NumberInput from '@/components/inputs/Number'
import SelectInput from '@/components/inputs/Select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ResponsiveDialogDrawer from '@/components/utils/ResponsiveDialogDrawer'
import ResponsiveDialogDrawerSection from '@/components/utils/ResponsiveDialogDrawerSection'
import { normalizeLaborCostTeamKey } from '@/lib/service-orders/labor-cost'
import type { TUpsertLaborCostConfiguration } from '@/utils/schemas/labor-costs'
import { Cog, Plus, Trash2, UsersRound } from 'lucide-react'

const repeatableListHeaderClass =
  'hidden border-border bg-muted/50 text-muted-foreground border-b px-3 py-1.5 text-[0.65rem] font-medium tracking-wide uppercase sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_2.25rem] sm:items-center sm:gap-2'
const repeatableRowClass =
  'border-border flex min-w-0 flex-col gap-2 rounded-md border bg-background px-3 py-2 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_2.25rem] sm:items-end sm:gap-2'
const exceptionRowClass =
  'border-border flex min-w-0 flex-col gap-2 rounded-md border bg-background px-3 py-2 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.25rem] sm:items-end sm:gap-2'
const exceptionListHeaderClass =
  'hidden border-border bg-muted/50 text-muted-foreground border-b px-3 py-1.5 text-[0.65rem] font-medium tracking-wide uppercase sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.25rem] sm:items-center sm:gap-2'

type LaborCostConfigurationModalProps = {
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
  closeModal: () => void
  onSave: () => void
}

export default function LaborCostConfigurationModal({
  editor,
  setEditor,
  userOptions,
  teamOptions,
  loading,
  closeModal,
  onSave,
}: LaborCostConfigurationModalProps) {
  const configuration = editor.value
  const isTeam = configuration.sujeito.tipo === 'EQUIPE'
  const isEditing = Boolean(editor.id)

  function update(value: TUpsertLaborCostConfiguration) {
    setEditor((current) => (current ? { ...current, value } : current))
  }

  const menuTitle = isEditing
    ? isTeam
      ? 'EDITAR REGRA DE EQUIPE'
      : 'EDITAR REGRA DE TERCEIRO'
    : isTeam
      ? 'NOVA REGRA DE EQUIPE'
      : 'NOVA REGRA DE TERCEIRO'

  return (
    <ResponsiveDialogDrawer
      menuTitle={menuTitle}
      menuDescription={
        isTeam
          ? 'Defina a diária e as faixas de módulos. O valor é aplicado uma vez por ordem de serviço.'
          : 'Defina valores por equipamento e exceções de valor fechado quando necessário.'
      }
      menuActionButtonText="SALVAR CONFIGURAÇÃO"
      menuCancelButtonText="CANCELAR"
      actionFunction={onSave}
      actionIsPending={loading}
      stateIsLoading={false}
      closeMenu={closeModal}
      dialogVariant="sm"
      drawerVariant="lg"
      dialogContentClassName="flex w-full max-w-3xl min-w-0 flex-col gap-5 overflow-x-hidden"
      drawerContentClassName="gap-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-[0.65rem] font-medium">
          {isTeam ? 'Equipe interna · diária' : 'Prestador · por equipamento'}
        </Badge>
        {configuration.ativo ? (
          <Badge className="text-[0.65rem] font-medium">Ativa</Badge>
        ) : (
          <Badge variant="outline" className="text-[0.65rem] font-medium">Inativa</Badge>
        )}
        {isTeam && configuration.padrao ? (
          <Badge variant="outline" className="text-[0.65rem] font-medium">Padrão</Badge>
        ) : null}
      </div>

      <ResponsiveDialogDrawerSection
        sectionTitleText="IDENTIFICAÇÃO"
        sectionTitleIcon={<UsersRound className="h-4 w-4 min-h-4 min-w-4" />}
      >
        <div className="flex w-full flex-col gap-4">
          {isTeam ? (
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

          <div className="border-border flex flex-col gap-3 rounded-md border bg-muted/20 p-3">
            <p className="text-muted-foreground text-[0.65rem] font-medium tracking-wide uppercase">Status da regra</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <CheckboxInput
                checked={configuration.ativo}
                labelTrue="Configuração ativa"
                labelFalse="Configuração inativa"
                handleChange={(ativo) => update({ ...configuration, ativo })}
                padding="0"
              />
              {isTeam ? (
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
        </div>
      </ResponsiveDialogDrawerSection>

      <ResponsiveDialogDrawerSection
        sectionTitleText="REGRAS DE CÁLCULO"
        sectionTitleIcon={<Cog className="h-4 w-4 min-h-4 min-w-4" />}
      >
        {configuration.regra.modelo === 'EQUIPE_INTERNA_DIARIA' ? (
          <InternalRuleEditor configuration={configuration} rule={configuration.regra} update={update} />
        ) : (
          <ExternalRuleEditor configuration={configuration} rule={configuration.regra} update={update} />
        )}
      </ResponsiveDialogDrawerSection>
    </ResponsiveDialogDrawer>
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
    <div className="flex w-full flex-col gap-4">
      <div className="max-w-xs">
        <NumberInput
          label="VALOR DA DIÁRIA"
          placeholder="0,00"
          width="100%"
          value={rule.valorDiaria}
          handleChange={(valorDiaria) => update({ ...configuration, regra: { ...rule, valorDiaria } })}
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Faixas de produtividade</p>
            <p className="text-muted-foreground text-xs">Quantidade de dias conforme o total de módulos na ordem.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="gap-2"
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
            <Plus className="size-4" aria-hidden />
            Adicionar faixa
          </Button>
        </div>

        <div className="border-border overflow-hidden rounded-md border">
          <div className={repeatableListHeaderClass}>
            <span>Mín. módulos</span>
            <span>Máx. módulos</span>
            <span>Dias</span>
            <span className="sr-only">Remover</span>
          </div>
          <div className="flex flex-col gap-2 p-2">
            {rule.faixas.map((range, index) => (
              <div key={`${index}-${range.minimoModulos}-${range.maximoModulos}`} className={repeatableRowClass}>
                <NumberInput
                  label="MÍNIMO DE MÓDULOS"
                  labelClassName="text-[0.65rem] sm:hidden"
                  width="100%"
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
                  labelClassName="text-[0.65rem] sm:hidden"
                  width="100%"
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
                  labelClassName="text-[0.65rem] sm:hidden"
                  width="100%"
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
                  type="button"
                  className="size-9 shrink-0 self-end sm:self-auto"
                  disabled={rule.faixas.length === 1}
                  aria-label="Remover faixa"
                  onClick={() =>
                    update({
                      ...configuration,
                      regra: { ...rule, faixas: rule.faixas.filter((_, itemIndex) => itemIndex !== index) },
                    })
                  }
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
            ))}
          </div>
        </div>
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
    <div className="flex w-full flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <NumberInput
          label="VALOR POR MÓDULO"
          placeholder="0,00"
          width="100%"
          value={rule.valorPorModulo}
          handleChange={(valorPorModulo) => update({ ...configuration, regra: { ...rule, valorPorModulo } })}
        />
        <NumberInput
          label="VALOR POR INVERSOR"
          placeholder="0,00"
          width="100%"
          value={rule.valorPorInversor}
          handleChange={(valorPorInversor) => update({ ...configuration, regra: { ...rule, valorPorInversor } })}
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Exceções de valor fechado</p>
            <p className="text-muted-foreground text-xs">Substituem a fórmula quando a quantidade de módulos bate exatamente.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="gap-2"
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
            <Plus className="size-4" aria-hidden />
            Adicionar exceção
          </Button>
        </div>

        {rule.excecoes.length === 0 ? (
          <p className="text-muted-foreground rounded-md border border-dashed px-3 py-4 text-center text-sm">
            Nenhuma exceção. A fórmula por módulo e inversor vale para todas as quantidades.
          </p>
        ) : (
          <div className="border-border overflow-hidden rounded-md border">
            <div className={exceptionListHeaderClass}>
              <span>Módulos</span>
              <span>Valor fechado</span>
              <span className="sr-only">Remover</span>
            </div>
            <div className="flex flex-col gap-2 p-2">
              {rule.excecoes.map((exception, index) => (
                <div key={`${index}-${exception.quantidadeModulos}`} className={exceptionRowClass}>
                  <NumberInput
                    label="QUANTIDADE DE MÓDULOS"
                    labelClassName="text-[0.65rem] sm:hidden"
                    width="100%"
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
                    labelClassName="text-[0.65rem] sm:hidden"
                    width="100%"
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
                    type="button"
                    className="size-9 shrink-0 self-end sm:self-auto"
                    aria-label="Remover exceção"
                    onClick={() =>
                      update({
                        ...configuration,
                        regra: { ...rule, excecoes: rule.excecoes.filter((_, itemIndex) => itemIndex !== index) },
                      })
                    }
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
