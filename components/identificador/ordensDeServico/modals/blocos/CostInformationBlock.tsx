import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import EditExpense from "@/components/identificador/despesas/modals/EditExpense";
import NewExpense from "@/components/identificador/despesas/modals/NewExpense";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import ErrorComponent from "@/components/utils/ErrorComponent";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import type { TAuthSession } from "@/lib/authentication/types";
import { formatToMoney } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { createExpense, deleteExpense } from "@/utils/methods/mutation/expenses";
import { mutateLaborCostExpense } from "@/utils/methods/mutation/labor-costs";
import { useProjectExpenses } from "@/utils/methods/query/expenses";
import { laborCostExpenseQueryKey, useLaborCostExpense } from "@/utils/methods/query/labor-costs";
import type { TExpenseDTO } from "@/utils/schemas/expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calculator,
  Check,
  ChevronDown,
  DollarSign,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
  WandSparkles,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const toolbarButtonClass = "gap-2 text-xs font-medium uppercase tracking-wide";
const costListHeaderClass =
  "hidden border-border bg-muted/50 text-muted-foreground border-b px-3 py-1.5 text-[0.65rem] font-medium tracking-wide uppercase lg:grid lg:grid-cols-[minmax(0,1fr)_5.5rem_6.5rem] lg:items-center lg:gap-2";
const costRowActionsClass = "flex w-[6.5rem] shrink-0 items-center justify-end gap-0.5";
const costRowClass = "flex items-center gap-2 px-3 py-2 transition-colors hover:bg-muted/30";
const rowBadgeClass = "h-5 border-transparent px-1.5 py-0 text-[0.65rem] font-medium";
const rowIconButtonClass = "size-7 shrink-0";

type CostsInformationProps = {
  sessionUser: TAuthSession;
  projectName?: string | null;
  projectId?: string | null;
  projectIdentifier?: string | null;
  serviceOrderId: string;
  serviceOrderDescription: string;
};

export default function CostsInformation({
  sessionUser,
  projectName,
  projectId,
  projectIdentifier,
  serviceOrderId,
  serviceOrderDescription,
}: CostsInformationProps) {
  const queryClient = useQueryClient();
  const [newExpenseMenuIsOpen, setNewExpenseMenuIsOpen] = useState(false);
  const [laborFormMode, setLaborFormMode] = useState<"manual" | "adjust" | null>(null);
  const [laborValue, setLaborValue] = useState(0);
  const [laborReason, setLaborReason] = useState("");
  const [laborNature, setLaborNature] = useState<"APROPRIACAO_INTERNA" | "SERVICO_TERCEIRO">(
    "SERVICO_TERCEIRO",
  );

  const projectExpensesQuery = useProjectExpenses({
    projectId: projectId || "",
    enabled: Boolean(projectId),
    identifier: "CUSTOS-ORDEM-DE-SERVICO",
  });
  const laborExpenseQuery = useLaborCostExpense({ serviceOrderId });
  const laborExpense = laborExpenseQuery.data;
  const canOperateLabor =
    sessionUser.user.permissoes.ordensDeServico.editar ||
    sessionUser.user.permissoes.financeiro.editar;
  const canEditFinancially = sessionUser.user.permissoes.financeiro.editar;

  const laborMutation = useMutation({
    mutationKey: ["mutate-service-order-labor-cost", serviceOrderId],
    mutationFn: mutateLaborCostExpense,
    onSuccess: async (response) => {
      if ("status" in response.data && response.data.status !== "SYNCED") {
        toast.error(response.data.message || "Não foi possível inferir o custo de mão de obra.");
      } else {
        toast.success(response.message);
        setLaborFormMode(null);
        setLaborReason("");
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: laborCostExpenseQueryKey(serviceOrderId) }),
        queryClient.invalidateQueries({ queryKey: projectExpensesQuery.queryKey }),
      ]);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteLaborMutation = useMutation({
    mutationKey: ["delete-service-order-labor-cost", serviceOrderId],
    mutationFn: () => mutateLaborCostExpense({ acao: "EXCLUIR", serviceOrderId }),
    onSuccess: async (response) => {
      toast.success(response.message);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: laborCostExpenseQueryKey(serviceOrderId) }),
        queryClient.invalidateQueries({ queryKey: projectExpensesQuery.queryKey }),
      ]);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteExpenseMutation = useMutation({
    mutationKey: ["delete-service-order-expense", serviceOrderId],
    mutationFn: deleteExpense,
    onSuccess: async (message) => {
      toast.success(message);
      await queryClient.invalidateQueries({ queryKey: projectExpensesQuery.queryKey });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const generatedCostMutation = useMutation({
    mutationKey: ["create-service-order-expense", serviceOrderId],
    mutationFn: async () => {
      if (!projectId)
        throw new Error("Vincule um projeto à OS antes de gerar os custos operacionais.");
      return createExpense({
        identificador: "CUSTOS-ORDEM-DE-SERVICO",
        rateio: "DESPESAS OBRAS",
        categoria: "DESPESAS OBRAS",
        descricao: `Custos operacionais da OS: ${serviceOrderDescription}`,
        projeto: {
          id: projectId,
          nome: projectName || null,
          identificador: projectIdentifier || null,
        },
        ordemServico: { id: serviceOrderId, descricao: serviceOrderDescription },
        autor: {
          id: sessionUser.user.id,
          nome: sessionUser.user.nome,
          avatar_url: sessionUser.user.avatar_url,
        },
        itens: [
          { descricao: "CUSTO KM RODADO", preco: 0, qtde: 1, unidade: "KM" },
          { descricao: "CUSTO DE ALIMENTAÇÃO", preco: 0, qtde: 1, unidade: "UN" },
          { descricao: "CUSTO DE PEDÁGIO E ESTACIONAMENTO", preco: 0, qtde: 1, unidade: "UN" },
          { descricao: "CUSTO DE HOSPEDAGEM", preco: 0, qtde: 1, unidade: "UN" },
        ],
        total: 0,
        efetivacao: { efetivado: true, data: new Date().toISOString() },
        pagamentos: [],
        criterioReferencia: true,
        criterioCompetencia: true,
        dataInsercao: new Date().toISOString(),
      });
    },
    onSuccess: (message) => toast.success(message),
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: async () =>
      queryClient.invalidateQueries({ queryKey: projectExpensesQuery.queryKey }),
  });

  const otherExpenses =
    projectExpensesQuery.data?.filter(
      (expense) =>
        expense.metadados?.chave !== "custo-mao-de-obra" &&
        (!expense.ordemServico || expense.ordemServico.id === serviceOrderId),
    ) || [];
  const hasGeneratedOperationalCost = otherExpenses.some(
    (expense) =>
      expense.ordemServico?.id === serviceOrderId &&
      expense.identificador === "CUSTOS-ORDEM-DE-SERVICO",
  );
  const total = otherExpenses.reduce(
    (sum, expense) => sum + expense.total,
    laborExpense?.total || 0,
  );
  const isLoading = projectExpensesQuery.isLoading || laborExpenseQuery.isLoading;
  const hasExpenses = Boolean(laborExpense) || otherExpenses.length > 0;
  const laborPendingConfirmation = Boolean(laborExpense && !laborExpense.efetivacao.efetivado);

  const secondaryMenuItems = [
    canEditFinancially && !laborExpense
      ? {
          key: "manual",
          label: "Informar mão de obra manualmente",
          onClick: () => openLaborForm("manual"),
        }
      : null,
    projectId && !hasGeneratedOperationalCost
      ? {
          key: "operational",
          label: "Gerar planilha de custos operacionais",
          onClick: () => generatedCostMutation.mutate(),
          disabled: generatedCostMutation.isPending,
        }
      : null,
  ].filter(Boolean) as { key: string; label: string; onClick: () => void; disabled?: boolean }[];

  function openLaborForm(mode: "manual" | "adjust") {
    setLaborValue(mode === "adjust" ? laborExpense?.total || 0 : 0);
    setLaborReason("");
    setLaborFormMode(mode);
  }

  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="CUSTOS"
      sectionTitleIcon={<DollarSign className="size-4" aria-hidden />}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-muted-foreground max-w-2xl text-sm">
          Mão de obra e despesas operacionais vinculadas a esta ordem. Valores estimados precisam de
          confirmação antes de fechar o custo.
        </p>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {canOperateLabor && !laborExpense?.efetivacao.efetivado ? (
            <LoadingButton
              loading={laborMutation.isPending && !laborFormMode}
              onClick={() => laborMutation.mutate({ acao: "RECALCULAR", serviceOrderId })}
              size="xs"
              variant={laborExpense ? "outline" : "default"}
              className={toolbarButtonClass}
            >
              {laborExpense ? (
                <RefreshCw className="size-3.5" aria-hidden />
              ) : (
                <Calculator className="size-3.5" aria-hidden />
              )}
              {laborExpense ? "Recalcular" : "Inferir"}
            </LoadingButton>
          ) : null}
          {secondaryMenuItems.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="xs" className={toolbarButtonClass}>
                  <MoreHorizontal className="size-3.5" aria-hidden />
                  Mais
                  <ChevronDown className="size-3 opacity-70" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {secondaryMenuItems.map((item) => (
                  <DropdownMenuItem key={item.key} disabled={item.disabled} onClick={item.onClick}>
                    {item.key === "operational" ? (
                      <WandSparkles className="size-4" aria-hidden />
                    ) : (
                      <Pencil className="size-4" aria-hidden />
                    )}
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          {projectId ? (
            <Button
              size="xs"
              className={toolbarButtonClass}
              onClick={() => setNewExpenseMenuIsOpen(true)}
            >
              <Plus className="size-3.5" aria-hidden />
              Novo custo
            </Button>
          ) : null}
        </div>
      </div>

      {!projectId ? (
        <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-3 text-sm">
          Vincule um projeto à ordem para registrar despesas e custos operacionais.
        </p>
      ) : null}

      {laborFormMode ? (
        <LaborCostFormDialog
          mode={laborFormMode}
          value={laborValue}
          reason={laborReason}
          nature={laborNature}
          loading={laborMutation.isPending}
          onValueChange={setLaborValue}
          onReasonChange={setLaborReason}
          onNatureChange={setLaborNature}
          onClose={() => setLaborFormMode(null)}
          onSave={() =>
            laborFormMode === "manual"
              ? laborMutation.mutate({
                  acao: "SALVAR_MANUAL",
                  serviceOrderId,
                  natureza: laborNature,
                  valor: laborValue,
                  motivo: laborReason,
                })
              : laborMutation.mutate({
                  acao: "CONFIRMAR",
                  serviceOrderId,
                  valorFinal: laborValue,
                  motivoAjuste: laborReason,
                })
          }
        />
      ) : null}

      {isLoading ? (
        <p className="text-muted-foreground py-8 text-center text-sm">Carregando custos...</p>
      ) : null}
      {projectExpensesQuery.isError ? (
        <ErrorComponent msg={getErrorMessage(projectExpensesQuery.error)} />
      ) : null}
      {laborExpenseQuery.isError ? (
        <ErrorComponent msg={getErrorMessage(laborExpenseQuery.error)} />
      ) : null}

      {!isLoading && hasExpenses ? (
        <div className="border-border overflow-hidden rounded-lg border shadow-xs">
          <div className={costListHeaderClass} aria-hidden="true">
            <span>Descrição</span>
            <span className="text-end">Valor</span>
            <span className="text-end">Ações</span>
          </div>
          <ul className="divide-border m-0 list-none divide-y p-0">
            {laborExpense ? (
              <li>
                <LaborExpenseRow
                  expense={laborExpense}
                  canOperate={canOperateLabor}
                  canEditFinancially={canEditFinancially}
                  canDelete={
                    canEditFinancially || (canOperateLabor && !laborExpense.efetivacao.efetivado)
                  }
                  loading={laborMutation.isPending}
                  deleteLoading={deleteLaborMutation.isPending}
                  onAdjust={() => openLaborForm("adjust")}
                  onConfirm={() => laborMutation.mutate({ acao: "CONFIRMAR", serviceOrderId })}
                  onReopen={() => laborMutation.mutate({ acao: "REABRIR", serviceOrderId })}
                  onDelete={() => deleteLaborMutation.mutateAsync()}
                />
              </li>
            ) : null}
            {otherExpenses.map((expense) => (
              <li key={expense._id}>
                <ExpenseItemRow
                  expense={expense}
                  session={sessionUser}
                  canDelete={canEditFinancially}
                  deleteLoading={
                    deleteExpenseMutation.isPending &&
                    deleteExpenseMutation.variables?.id === expense._id
                  }
                  onDelete={() => deleteExpenseMutation.mutateAsync({ id: expense._id })}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!isLoading && !hasExpenses && projectId ? (
        <div className="border-border bg-muted/30 flex flex-col items-center gap-2 rounded-lg border px-6 py-10 text-center">
          <Calculator className="text-primary size-7" aria-hidden />
          <p className="font-semibold">Nenhum custo nesta ordem</p>
          <p className="text-muted-foreground max-w-md text-sm">
            Inferir a mão de obra a partir das regras configuradas ou adicione despesas manualmente.
          </p>
          {canOperateLabor ? (
            <LoadingButton
              className={`mt-1 ${toolbarButtonClass}`}
              size="xs"
              loading={laborMutation.isPending}
              onClick={() => laborMutation.mutate({ acao: "RECALCULAR", serviceOrderId })}
            >
              <Calculator className="size-3.5" aria-hidden />
              Inferir
            </LoadingButton>
          ) : null}
        </div>
      ) : null}

      {hasExpenses ? (
        <div className="border-border bg-muted/30 flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Total da ordem de serviço
            </p>
            {laborPendingConfirmation ? (
              <p className="text-muted-foreground mt-0.5 text-xs">
                Confirme a mão de obra estimada para fechar o custo.
              </p>
            ) : null}
          </div>
          <p className="text-xl font-semibold tabular-nums">{formatToMoney(total)}</p>
        </div>
      ) : null}

      {newExpenseMenuIsOpen && projectId ? (
        <NewExpense
          initialState={{
            identificador: "CUSTOS-ORDEM-DE-SERVICO",
            projeto: { id: projectId, nome: projectName, identificador: projectIdentifier },
            ordemServico: { id: serviceOrderId, descricao: serviceOrderDescription },
          }}
          session={sessionUser}
          closeModal={() => setNewExpenseMenuIsOpen(false)}
        />
      ) : null}
    </ResponsiveDialogDrawerSection>
  );
}

function LaborExpenseRow({
  expense,
  canOperate,
  canEditFinancially,
  canDelete,
  loading,
  deleteLoading,
  onAdjust,
  onConfirm,
  onReopen,
  onDelete,
}: {
  expense: TExpenseDTO;
  canOperate: boolean;
  canEditFinancially: boolean;
  canDelete: boolean;
  loading: boolean;
  deleteLoading: boolean;
  onAdjust: () => void;
  onConfirm: () => void;
  onReopen: () => void;
  onDelete: () => Promise<unknown>;
}) {
  const confirmed = Boolean(expense.efetivacao.efetivado);
  const metadata = expense.metadados?.chave === "custo-mao-de-obra" ? expense.metadados : null;

  const detail = expense.itens
    .map((item) => `${item.qtde} ${item.unidade} × ${formatToMoney(item.preco)}`)
    .join(" · ");
  const adjustmentNote = metadata?.ajuste
    ? ` · Calc. ${formatToMoney(metadata.valorCalculado)} — ${metadata.ajuste.motivo}`
    : "";

  return (
    <div className={costRowClass}>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <p className="text-sm font-semibold">Mão de obra</p>
          {confirmed ? (
            <Badge variant="default" className={rowBadgeClass}>
              CONFIRMADO
            </Badge>
          ) : (
            <Badge
              className={`${rowBadgeClass} bg-accent-amber text-accent-amber-foreground hover:bg-accent-amber/90`}
            >
              ESTIMADO
            </Badge>
          )}
          <Badge variant="outline" className={rowBadgeClass}>
            {metadata?.natureza === "APROPRIACAO_INTERNA" ? "INTERNA" : "TERCEIRO"}
          </Badge>
        </div>
        <p className="text-muted-foreground truncate text-xs">
          {detail}
          {adjustmentNote}
        </p>
      </div>
      <p className="w-[5.5rem] shrink-0 text-end text-sm font-semibold tabular-nums">
        {formatToMoney(expense.total)}
      </p>
      <div className={costRowActionsClass}>
        {!confirmed && canEditFinancially ? (
          <Button
            variant="ghost"
            size="icon"
            className={rowIconButtonClass}
            onClick={onAdjust}
            aria-label="Ajustar mão de obra"
          >
            <Pencil className="size-3.5" aria-hidden />
          </Button>
        ) : null}
        {!confirmed && canOperate ? (
          <LoadingButton
            size="icon"
            className={rowIconButtonClass}
            loading={loading}
            onClick={onConfirm}
            aria-label="Confirmar mão de obra"
          >
            <Check className="size-3.5" aria-hidden />
          </LoadingButton>
        ) : null}
        {confirmed && canEditFinancially ? (
          <LoadingButton
            variant="ghost"
            size="icon"
            className={rowIconButtonClass}
            loading={loading}
            onClick={onReopen}
            aria-label="Reabrir mão de obra"
          >
            <RotateCcw className="size-3.5" aria-hidden />
          </LoadingButton>
        ) : null}
        {canDelete ? (
          <CostRowDeleteButton
            ariaLabel="Excluir mão de obra"
            title="Excluir mão de obra"
            description="A despesa de mão de obra será removida desta ordem. Essa ação não pode ser desfeita."
            loading={deleteLoading}
            onConfirm={onDelete}
          />
        ) : null}
      </div>
    </div>
  );
}

function ExpenseItemRow({
  expense,
  session,
  canDelete,
  deleteLoading,
  onDelete,
}: {
  expense: TExpenseDTO;
  session: TAuthSession;
  canDelete: boolean;
  deleteLoading: boolean;
  onDelete: () => Promise<unknown>;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const meta = [
    expense.rateio,
    expense.categoria,
    expense.efetivacao.data ? formatDateAsLocale(expense.efetivacao.data, true) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={costRowClass}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{expense.descricao}</p>
        <p className="text-muted-foreground truncate text-xs">{meta}</p>
      </div>
      <p className="w-[5.5rem] shrink-0 text-end text-sm font-semibold tabular-nums">
        {formatToMoney(expense.total)}
      </p>
      <div className={costRowActionsClass}>
        <Button
          variant="ghost"
          size="icon"
          className={rowIconButtonClass}
          onClick={() => setIsEditing(true)}
          aria-label="Editar despesa"
        >
          <Pencil className="size-3.5" aria-hidden />
        </Button>
        {canDelete ? (
          <CostRowDeleteButton
            ariaLabel="Excluir despesa"
            title="Excluir despesa"
            description={`A despesa "${expense.descricao}" será removida. Essa ação não pode ser desfeita.`}
            loading={deleteLoading}
            onConfirm={onDelete}
          />
        ) : null}
      </div>
      {isEditing ? (
        <EditExpense
          expenseId={expense._id}
          session={session}
          closeModal={() => setIsEditing(false)}
        />
      ) : null}
    </div>
  );
}

function CostRowDeleteButton({
  ariaLabel,
  title,
  description,
  loading,
  onConfirm,
}: {
  ariaLabel: string;
  title: string;
  description: string;
  loading: boolean;
  onConfirm: () => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className={rowIconButtonClass} aria-label={ariaLabel}>
          <Trash2 className="text-destructive size-3.5" aria-hidden />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={toolbarButtonClass}>Cancelar</AlertDialogCancel>
          <LoadingButton
            variant="destructive"
            size="xs"
            className={toolbarButtonClass}
            loading={loading}
            onClick={() => {
              void onConfirm()
                .then(() => setOpen(false))
                .catch(() => undefined);
            }}
          >
            Excluir
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function LaborCostFormDialog({
  mode,
  value,
  reason,
  nature,
  loading,
  onValueChange,
  onReasonChange,
  onNatureChange,
  onClose,
  onSave,
}: {
  mode: "manual" | "adjust";
  value: number;
  reason: string;
  nature: "APROPRIACAO_INTERNA" | "SERVICO_TERCEIRO";
  loading: boolean;
  onValueChange: (value: number) => void;
  onReasonChange: (value: string) => void;
  onNatureChange: (value: "APROPRIACAO_INTERNA" | "SERVICO_TERCEIRO") => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const title = mode === "adjust" ? "AJUSTAR MÃO DE OBRA" : "INFORMAR MÃO DE OBRA";

  return (
    <ResponsiveDialogDrawer
      menuTitle={title}
      menuDescription="O motivo ficará registrado na despesa para auditoria."
      menuActionButtonText="SALVAR"
      menuCancelButtonText="CANCELAR"
      actionFunction={onSave}
      actionIsPending={loading}
      stateIsLoading={false}
      closeMenu={onClose}
      dialogVariant="fit"
      drawerVariant="fit"
      dialogContentClassName="w-full max-w-md"
    >
      <div className="flex w-full min-w-[min(100%,18rem)] flex-col gap-3">
        <div className={mode === "manual" ? "grid w-full gap-3 sm:grid-cols-2" : "w-full"}>
          <NumberInput
            label="VALOR"
            placeholder="0,00"
            value={value}
            handleChange={onValueChange}
            width="100%"
          />
          {mode === "manual" ? (
            <SelectInput
              label="NATUREZA"
              value={nature}
              options={[
                { id: "internal", value: "APROPRIACAO_INTERNA", label: "Apropriação interna" },
                { id: "external", value: "SERVICO_TERCEIRO", label: "Serviço de terceiro" },
              ]}
              selectedItemLabel="Selecione a natureza"
              handleChange={onNatureChange}
              onReset={() => onNatureChange("SERVICO_TERCEIRO")}
              width="100%"
            />
          ) : null}
        </div>
        <label className="block space-y-1">
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Motivo
          </span>
          <Textarea
            className="min-h-[4.5rem] resize-y text-sm"
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder="Explique o valor informado..."
          />
        </label>
      </div>
    </ResponsiveDialogDrawer>
  );
}
