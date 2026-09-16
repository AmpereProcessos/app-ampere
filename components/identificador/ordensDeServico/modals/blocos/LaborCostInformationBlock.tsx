import NumberInput from '@/components/inputs/Number'
import SelectInput from '@/components/inputs/Select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'
import ErrorComponent from '@/components/utils/ErrorComponent'
import ResponsiveDialogDrawerSection from '@/components/utils/ResponsiveDialogDrawerSection'
import type { TAuthSession } from '@/lib/authentication/types'
import { formatToMoney } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import { mutateLaborCostExpense } from '@/utils/methods/mutation/labor-costs'
import { laborCostExpenseQueryKey, useLaborCostExpense } from '@/utils/methods/query/labor-costs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Calculator, Check, Pencil, RefreshCw, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

type LaborCostInformationBlockProps = {
  serviceOrderId: string
  session: TAuthSession
}

export default function LaborCostInformationBlock({ serviceOrderId, session }: LaborCostInformationBlockProps) {
  const queryClient = useQueryClient()
  const query = useLaborCostExpense({ serviceOrderId })
  const [formMode, setFormMode] = useState<'manual' | 'adjust' | null>(null)
  const [value, setValue] = useState(0)
  const [reason, setReason] = useState('')
  const [nature, setNature] = useState<'APROPRIACAO_INTERNA' | 'SERVICO_TERCEIRO'>('SERVICO_TERCEIRO')
  const canOperate = session.user.permissoes.ordensDeServico.editar || session.user.permissoes.financeiro.editar
  const canEditFinancially = session.user.permissoes.financeiro.editar

  const mutation = useMutation({
    mutationKey: ['mutate-service-order-labor-cost', serviceOrderId],
    mutationFn: mutateLaborCostExpense,
    onSuccess: async (response) => {
      if ('status' in response.data && response.data.status !== 'SYNCED' && response.data.status !== 'LOCKED') {
        toast.error(response.data.message || 'Não foi possível calcular o custo automaticamente.')
      } else if ('status' in response.data && response.data.status === 'LOCKED') {
        toast.error(response.data.message || 'O custo já está confirmado.')
      } else {
        toast.success(response.message)
        setFormMode(null)
        setReason('')
      }
      await queryClient.invalidateQueries({ queryKey: laborCostExpenseQueryKey(serviceOrderId) })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const expense = query.data
  const confirmed = Boolean(expense?.efetivacao.efetivado)

  function openAdjustment() {
    if (!expense) return
    setValue(expense.total)
    setReason('')
    setFormMode('adjust')
  }

  return (
    <ResponsiveDialogDrawerSection sectionTitleText="MÃO DE OBRA" sectionTitleIcon={<Calculator size={15} />}>
      {query.isLoading ? <p className="text-muted-foreground py-4 text-center text-sm">Carregando custo...</p> : null}
      {query.isError ? <ErrorComponent msg={getErrorMessage(query.error)} /> : null}

      {query.isSuccess && expense ? (
        <div className="border-border overflow-hidden rounded-lg border">
          <div className="bg-muted/30 flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">Custo de mão de obra</p>
                <Badge variant={confirmed ? 'default' : 'secondary'}>{confirmed ? 'Confirmado' : 'Estimado'}</Badge>
                <Badge variant="outline">
                  {expense.metadados?.chave === 'custo-mao-de-obra' && expense.metadados.natureza === 'APROPRIACAO_INTERNA'
                    ? 'Apropriação interna'
                    : 'Serviço de terceiro'}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                Calculado em{' '}
                {expense.metadados?.chave === 'custo-mao-de-obra' ? formatDateAsLocale(expense.metadados.calculadoEm, true) : 'data não disponível'}
              </p>
            </div>
            <p className="text-primary text-2xl font-semibold tabular-nums">{formatToMoney(expense.total)}</p>
          </div>

          <div className="divide-border divide-y">
            {expense.itens.map((item, index) => (
              <div key={`${item.descricao}-${index}`} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.descricao}</p>
                  <p className="text-muted-foreground text-xs tabular-nums">
                    {item.qtde} {item.unidade} × {formatToMoney(item.preco)}
                  </p>
                </div>
                <p className="shrink-0 font-semibold tabular-nums">{formatToMoney(item.qtde * item.preco)}</p>
              </div>
            ))}
          </div>

          {expense.metadados?.chave === 'custo-mao-de-obra' && expense.metadados.ajuste ? (
            <div className="border-border bg-muted/20 border-t px-4 py-3 text-sm">
              <p className="font-semibold">Valor ajustado</p>
              <p className="text-muted-foreground">
                Original: {formatToMoney(expense.metadados.valorCalculado)} · {expense.metadados.ajuste.motivo}
              </p>
            </div>
          ) : null}

          {canOperate ? (
            <div className="border-border flex flex-wrap justify-end gap-2 border-t p-3">
              {!confirmed ? (
                <>
                  <LoadingButton
                    variant="outline"
                    loading={mutation.isPending && !formMode}
                    onClick={() => mutation.mutate({ acao: 'RECALCULAR', serviceOrderId })}
                  >
                    <RefreshCw className="size-4" />
                    Recalcular
                  </LoadingButton>
                  {canEditFinancially ? (
                    <Button variant="outline" onClick={openAdjustment}>
                      <Pencil className="size-4" />
                      Ajustar
                    </Button>
                  ) : null}
                  <LoadingButton loading={mutation.isPending && !formMode} onClick={() => mutation.mutate({ acao: 'CONFIRMAR', serviceOrderId })}>
                    <Check className="size-4" />
                    Confirmar custo
                  </LoadingButton>
                </>
              ) : canEditFinancially ? (
                <LoadingButton variant="outline" loading={mutation.isPending} onClick={() => mutation.mutate({ acao: 'REABRIR', serviceOrderId })}>
                  <RotateCcw className="size-4" />
                  Reabrir custo
                </LoadingButton>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {query.isSuccess && !expense ? (
        <div className="border-border bg-muted/20 flex flex-col gap-3 rounded-lg border p-4">
          <div>
            <p className="font-semibold">Custo ainda não calculado</p>
            <p className="text-muted-foreground text-sm">
              O cálculo depende da categoria, dos equipamentos e de uma configuração aplicável ao responsável ou equipe.
            </p>
          </div>
          {canOperate ? (
            <div className="flex flex-wrap gap-2">
              <LoadingButton
                loading={mutation.isPending && formMode !== 'manual'}
                onClick={() => mutation.mutate({ acao: 'RECALCULAR', serviceOrderId })}
              >
                <RefreshCw className="size-4" />
                Calcular agora
              </LoadingButton>
              {canEditFinancially ? (
                <Button variant="outline" onClick={() => setFormMode('manual')}>
                  Informar manualmente
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {formMode ? (
        <div className="border-border bg-muted/30 space-y-3 rounded-lg border p-4">
          <div>
            <p className="font-semibold">{formMode === 'adjust' ? 'Ajustar custo calculado' : 'Informar custo manual'}</p>
            <p className="text-muted-foreground text-sm">O motivo ficará registrado nos metadados financeiros da despesa.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberInput label="VALOR" placeholder="0,00" value={value} handleChange={setValue} />
            {formMode === 'manual' ? (
              <SelectInput
                label="NATUREZA"
                value={nature}
                options={[
                  { id: 'internal', value: 'APROPRIACAO_INTERNA', label: 'Apropriação interna' },
                  { id: 'external', value: 'SERVICO_TERCEIRO', label: 'Serviço de terceiro' },
                ]}
                selectedItemLabel="Selecione a natureza"
                handleChange={setNature}
                onReset={() => setNature('SERVICO_TERCEIRO')}
                width="100%"
              />
            ) : null}
          </div>
          <label className="block space-y-1 text-sm font-medium">
            <span>MOTIVO</span>
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explique por que o valor precisa ser informado ou ajustado..."
            />
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setFormMode(null)}>
              Cancelar
            </Button>
            <LoadingButton
              loading={mutation.isPending}
              onClick={() =>
                formMode === 'manual'
                  ? mutation.mutate({
                      acao: 'SALVAR_MANUAL',
                      serviceOrderId,
                      natureza: nature,
                      valor: value,
                      motivo: reason,
                    })
                  : mutation.mutate({
                      acao: 'CONFIRMAR',
                      serviceOrderId,
                      valorFinal: value,
                      motivoAjuste: reason,
                    })
              }
            >
              {formMode === 'manual' ? 'Salvar estimativa' : 'Confirmar ajuste'}
            </LoadingButton>
          </div>
        </div>
      ) : null}
    </ResponsiveDialogDrawerSection>
  )
}
