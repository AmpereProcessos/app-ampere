"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { InteractiveInput } from "@/components/ui/interactive-input";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { cn } from "@/lib/utils";
import { formatToMoney } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useFinancesFinancialAccounts } from "@/utils/methods/query/finances";
import { formatDateForInputValue, formatDateInputChange } from "@/utils/methods/shared";
import {
  FinancialTransactionPaymentMethodsOptions,
  FinancialTransactionTypeOptions,
} from "@/utils/select-options";
import { TUseAccountingEntryState } from "@/utils/state/accounting-entry";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import {
  CalendarClock,
  Check,
  CheckCheck,
  Clock,
  Layers3,
  ListOrdered,
  Wallet,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DateInput from "@/components/inputs/Date";
import NumberInput from "@/components/inputs/Number";

type FinancialTx = TUseAccountingEntryState["state"]["entryFinancialTransactions"][number];

type DraftRow = {
  draftId: string;
  transaction: FinancialTx;
};

type GenerationMode = "installments" | "split_2" | "split_3";

const SPLIT_2 = [
  { label: "50-50", parts: [50, 50] as const },
  { label: "60-40", parts: [60, 40] as const },
  { label: "70-30", parts: [70, 30] as const },
  { label: "80-20", parts: [80, 20] as const },
  { label: "90-10", parts: [90, 10] as const },
] as const;

const SPLIT_3 = [
  { label: "34-33-33", parts: [34, 33, 33] as const },
  { label: "40-30-30", parts: [40, 30, 30] as const },
] as const;

function distributeTotalEqually(total: number, n: number): number[] {
  if (n <= 0) return [];
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / n);
  const remainder = cents - base * n;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    out.push((base + (i < remainder ? 1 : 0)) / 100);
  }
  return out;
}

function distributeByPercentages(total: number, pcts: number[]): number[] {
  if (pcts.length === 0) return [];
  const sum = pcts.reduce((a, b) => a + b, 0);
  if (sum <= 0) return pcts.map(() => 0);
  const cents = Math.round(total * 100);
  const floored: number[] = pcts.map((p) => Math.floor((cents * p) / sum));
  const used = floored.reduce((a, b) => a + b, 0);
  let rem = cents - used;
  const result = [...floored];
  let k = 0;
  while (rem > 0) {
    result[k % result.length] += 1;
    rem -= 1;
    k += 1;
  }
  return result.map((c) => c / 100);
}

function createEmptyRow(base: FinancialTx, seed?: Partial<FinancialTx>): FinancialTx {
  return {
    ...base,
    ...seed,
  };
}

function isImmediate(tx: FinancialTx) {
  return !!tx.dataEfetivacao;
}

type AddMultiFinancialTransactionsMenuProps = {
  entryTotalValue: number;
  onCommit: (rows: FinancialTx[]) => void;
  closeMenu: () => void;
};

export function AddMultiFinancialTransactionsMenu({
  entryTotalValue,
  onCommit,
  closeMenu,
}: AddMultiFinancialTransactionsMenuProps) {
  const { data: financialAccountsData } = useFinancesFinancialAccounts({
    initialParams: { activeOnly: true },
  });
  const accounts = financialAccountsData?.accounts ?? [];

  const accountOptions = useMemo(
    () =>
      accounts.map((a) => ({
        id: a.id,
        value: a.id,
        label: a.nome,
      })),
    [accounts],
  );

  const [generationMode, setGenerationMode] = useState<GenerationMode>("installments");
  const [installmentCount, setInstallmentCount] = useState(2);
  const [split2Index, setSplit2Index] = useState(0);
  const [split3Index, setSplit3Index] = useState(0);
  const [firstDate, setFirstDate] = useState(() => dayjs().startOf("day").toISOString());
  const [dayInterval, setDayInterval] = useState(30);
  const [defaultTipo, setDefaultTipo] = useState<FinancialTx["tipo"]>("ENTRADA");
  const [defaultMethod, setDefaultMethod] = useState<FinancialTx["metodo"]>("PIX");

  const [drafts, setDrafts] = useState<DraftRow[]>([]);

  const makeBaseTransaction = useCallback((): FinancialTx => {
    return {
      titulo: "",
      tipo: defaultTipo,
      valor: 0,
      dataPrevisao: firstDate,
      dataEfetivacao: null,
      metodo: defaultMethod,
      contaFinanceira: { id: "", nome: "", tipo: "BANCO" },
      dataInsercao: new Date().toISOString(),
      parcela: null,
      totalParcelas: null,
      id: null,
      deletar: null,
    };
  }, [defaultMethod, defaultTipo, firstDate]);

  const runGeneration = useCallback(() => {
    const total = entryTotalValue;
    const base = makeBaseTransaction();
    let n = 2;
    let pcts: number[] = [50, 50];

    if (generationMode === "installments") {
      n = Math.min(12, Math.max(2, Math.round(installmentCount)));
      const amounts = distributeTotalEqually(total, n);
      const rows: DraftRow[] = [];
      for (let i = 0; i < n; i++) {
        const d = dayjs(firstDate).add(i * dayInterval, "day");
        const previsao = formatDateInputChange(d.toDate(), "string") as string;
        rows.push({
          draftId: crypto.randomUUID(),
          transaction: createEmptyRow(base, {
            titulo: `Parcela ${i + 1}/${n}`,
            valor: amounts[i] ?? 0,
            dataPrevisao: previsao,
            dataEfetivacao: null,
            parcela: i + 1,
            totalParcelas: n,
            tipo: defaultTipo,
            metodo: defaultMethod,
          }),
        });
      }
      setDrafts(rows);
      return;
    }

    if (generationMode === "split_2") {
      pcts = [...SPLIT_2[split2Index]!.parts];
    } else {
      pcts = [...SPLIT_3[split3Index]!.parts];
    }
    n = pcts.length;
    const amounts = distributeByPercentages(total, pcts);
    const rows: DraftRow[] = [];
    for (let i = 0; i < n; i++) {
      const d = dayjs(firstDate).add(i * dayInterval, "day");
      const previsao = formatDateInputChange(d.toDate(), "string") as string;
      const labelP = pcts[i];
      rows.push({
        draftId: crypto.randomUUID(),
        transaction: createEmptyRow(base, {
          titulo: `Pagamento ${labelP}%`,
          valor: amounts[i] ?? 0,
          dataPrevisao: previsao,
          dataEfetivacao: null,
          parcela: i + 1,
          totalParcelas: n,
          tipo: defaultTipo,
          metodo: defaultMethod,
        }),
      });
    }
    setDrafts(rows);
  }, [
    dayInterval,
    defaultMethod,
    defaultTipo,
    entryTotalValue,
    firstDate,
    generationMode,
    installmentCount,
    makeBaseTransaction,
    split2Index,
    split3Index,
  ]);

  const didAutoGenerate = useRef(false);
  useEffect(() => {
    if (entryTotalValue <= 0) return;
    if (didAutoGenerate.current) return;
    didAutoGenerate.current = true;
    runGeneration();
  }, [entryTotalValue, runGeneration]);

  const updateDraft = useCallback((draftId: string, changes: Partial<FinancialTx>) => {
    setDrafts((prev) =>
      prev.map((row) =>
        row.draftId === draftId ? { ...row, transaction: { ...row.transaction, ...changes } } : row,
      ),
    );
  }, []);

  const removeDraft = useCallback((draftId: string) => {
    setDrafts((prev) => prev.filter((r) => r.draftId !== draftId));
  }, []);

  const sumDrafts = useMemo(
    () => drafts.reduce((acc, r) => acc + (r.transaction.valor || 0), 0),
    [drafts],
  );
  const sumOk = Math.abs(sumDrafts - entryTotalValue) < 0.02;

  return (
    <ResponsiveDialogDrawer
      menuTitle="MÚLTIPLAS TRANSAÇÕES"
      menuDescription="Configure parcelas ou divisão percentual, ajuste os itens e adicione todos ao lançamento."
      menuActionButtonText="ADICIONAR TODAS"
      menuCancelButtonText="CANCELAR"
      actionFunction={() => {
        if (entryTotalValue <= 0) {
          toast.error("Defina o valor do lançamento (seção VALORES).");
          return;
        }
        if (drafts.length === 0) {
          toast.error("Gere a lista com «Aplicar configuração» antes de adicionar.");
          return;
        }
        if (!sumOk) {
          toast.error("A soma das transações precisa bater o total do lançamento.");
          return;
        }
        onCommit(drafts.map((d) => d.transaction));
      }}
      actionIsPending={false}
      stateIsLoading={false}
      closeMenu={closeMenu}
    >
      <div className="flex flex-col gap-4">
        {entryTotalValue <= 0 ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Defina um valor no lançamento (seção VALORES) para distribuir entre as transações.
          </p>
        ) : null}
        <ResponsiveDialogDrawerSection
          sectionTitleText="CONFIGURAÇÃO"
          sectionTitleIcon={<ListOrdered className="h-3.5 w-3.5" />}
        >
          <p className="text-muted-foreground text-xs">
            Base: {formatToMoney(entryTotalValue)} (valor do lançamento contábil)
          </p>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="xs"
              variant={generationMode === "installments" ? "default" : "outline"}
              className="gap-1.5"
              onClick={() => setGenerationMode("installments")}
            >
              <Layers3 className="h-3.5 w-3.5" />
              PARCELAS
            </Button>
            <Button
              type="button"
              size="xs"
              variant={generationMode === "split_2" ? "default" : "outline"}
              className="gap-1.5"
              onClick={() => setGenerationMode("split_2")}
            >
              NEGOCIAÇÃO (2 PG)
            </Button>
            <Button
              type="button"
              size="xs"
              variant={generationMode === "split_3" ? "default" : "outline"}
              className="gap-1.5"
              onClick={() => setGenerationMode("split_3")}
            >
              NEGOCIAÇÃO (3 PG)
            </Button>
          </div>

          {generationMode === "installments" ? (
            <label className="flex flex-col gap-1 text-xs font-medium w-full">
              PARCELAS
              <Input
                type="number"
                min={2}
                max={12}
                className="h-9"
                value={installmentCount}
                onChange={(e) => setInstallmentCount(Number(e.target.value) || 2)}
              />
            </label>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {(generationMode === "split_2" ? SPLIT_2 : SPLIT_3).map((preset, idx) => {
                const active =
                  generationMode === "split_2" ? split2Index === idx : split3Index === idx;
                return (
                  <Button
                    key={preset.label}
                    type="button"
                    size="xs"
                    variant={active ? "secondary" : "ghost"}
                    className="text-[0.65rem] tracking-tight"
                    onClick={() => {
                      if (generationMode === "split_2") setSplit2Index(idx);
                      else setSplit3Index(idx);
                    }}
                  >
                    {preset.label}
                  </Button>
                );
              })}
            </div>
          )}

          <DateInput
            label="DATA INICIAL (1º VENCIMENTO)"
            value={formatDateForInputValue(firstDate)}
            handleChange={(value) => {
              setFirstDate(formatDateInputChange(value, "string") as string);
            }}
            width=""
          />
          <NumberInput
            label="INTERVALO ENTRE PAGAMENTOS (DIAS)"
            value={dayInterval}
            handleChange={(value) => setDayInterval(Math.max(0, Number(value) || 0))}
            width="100%"
            placeholder="Preencha o intervalo entre pagamentos..."
          />

          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs font-medium">PADRÃO (NOVAS GERAÇÕES)</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" size="xs" variant="outline" className="gap-1.5">
                  TIPO: {defaultTipo}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>TIPO</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {FinancialTransactionTypeOptions.map((o) => (
                  <DropdownMenuItem key={o.value} onClick={() => setDefaultTipo(o.value)}>
                    <div className="flex w-full items-center justify-between gap-2">
                      {o.label}
                      {o.value === defaultTipo ? <Check className="h-3.5 w-3.5" /> : null}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" size="xs" variant="outline" className="gap-1.5">
                  <Wallet className="h-3.5 w-3.5" />
                  {defaultMethod}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
                <DropdownMenuLabel>MÉTODO</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {FinancialTransactionPaymentMethodsOptions.map((o) => {
                  if (o.value === "A DEFINIR") return null;
                  return (
                    <DropdownMenuItem key={o.id} onClick={() => setDefaultMethod(o.value)}>
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                          {o.icon}
                          {o.label}
                        </span>
                        {o.value === defaultMethod ? <Check className="h-3.5 w-3.5" /> : null}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button type="button" size="sm" variant="default" onClick={runGeneration}>
              Aplicar configuração
            </Button>
          </div>
        </ResponsiveDialogDrawerSection>

        <ResponsiveDialogDrawerSection
          sectionTitleText="TRANSAÇÕES"
          sectionTitleIcon={<CalendarClock className="h-3.5 w-3.5" />}
        >
          <p
            className={cn(
              "text-xs font-medium",
              sumOk && drafts.length > 0 ? "text-emerald-700" : "text-amber-800",
            )}
          >
            Soma: {formatToMoney(sumDrafts)} / Total: {formatToMoney(entryTotalValue)}
            {!sumOk && drafts.length > 0 ? " — ajuste os valores para bater o total" : null}
          </p>

          <div className="max-h-[min(52vh,480px)] space-y-2 overflow-y-auto pr-0.5">
            {drafts.length === 0 ? (
              <p className="text-muted-foreground text-center text-xs italic">
                Use &quot;Aplicar configuração&quot; para gerar os itens.
              </p>
            ) : (
              drafts.map((row) => (
                <MultiTransactionCard
                  key={row.draftId}
                  draftId={row.draftId}
                  transaction={row.transaction}
                  accountOptions={accountOptions}
                  accounts={accounts}
                  onUpdate={updateDraft}
                  onRemove={removeDraft}
                />
              ))
            )}
          </div>
        </ResponsiveDialogDrawerSection>
      </div>
    </ResponsiveDialogDrawer>
  );
}

type Option = { id: string; value: string; label: string };

type AccountRow = {
  id: string;
  nome: string;
  tipo: FinancialTx["contaFinanceira"]["tipo"];
};

type MultiTransactionCardProps = {
  draftId: string;
  transaction: FinancialTx;
  accountOptions: Option[];
  accounts: AccountRow[];
  onUpdate: (id: string, ch: Partial<FinancialTx>) => void;
  onRemove: (id: string) => void;
};

function MultiTransactionCard({
  draftId,
  transaction,
  accountOptions,
  accounts,
  onUpdate,
  onRemove,
}: MultiTransactionCardProps) {
  const selectedType = useMemo(
    () => FinancialTransactionTypeOptions.find((o) => o.value === transaction.tipo),
    [transaction.tipo],
  );
  const selectedMethod = useMemo(
    () => FinancialTransactionPaymentMethodsOptions.find((o) => o.value === transaction.metodo),
    [transaction.metodo],
  );
  const selectedForecast = transaction.dataPrevisao
    ? new Date(transaction.dataPrevisao)
    : undefined;

  return (
    <div className="border-border flex w-full flex-col gap-2 rounded-lg border px-2 py-2">
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant={isImmediate(transaction) ? "secondary" : "outline"}
                size="xs"
                className="h-8 shrink-0 gap-1 rounded-lg px-2"
                title="Efetivação"
              >
                {isImmediate(transaction) ? (
                  <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="z-200">
              <DropdownMenuLabel>EFETIVAÇÃO</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const d = formatDateInputChange(new Date(), "string") as string;
                  onUpdate(draftId, { dataEfetivacao: d, dataPrevisao: d });
                }}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                EFETIVAR AGORA
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const pre =
                    transaction.dataPrevisao ??
                    (formatDateInputChange(new Date(), "string") as string);
                  onUpdate(draftId, {
                    dataEfetivacao: null,
                    dataPrevisao: pre,
                  });
                }}
              >
                <Clock className="h-3.5 w-3.5" />
                MANTER PENDENTE
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-1.5 text-xs uppercase"
              >
                {selectedType?.icon ?? <Wallet className="h-3.5 w-3.5" />}
                {selectedType?.label ?? transaction.tipo}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="z-200">
              <DropdownMenuLabel>TIPO</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {FinancialTransactionTypeOptions.map((o) => (
                <DropdownMenuItem
                  key={o.value}
                  onClick={() => onUpdate(draftId, { tipo: o.value })}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      {o.icon}
                      {o.label}
                    </span>
                    {o.value === transaction.tipo ? <Check className="h-4 w-4" /> : null}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-1.5 text-xs uppercase"
              >
                {selectedMethod?.icon ?? <Wallet className="h-4 w-4" />}
                <span className="max-w-[8rem] truncate">
                  {selectedMethod?.label ?? transaction.metodo}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="z-200 max-h-64 overflow-y-auto">
              <DropdownMenuLabel>MÉTODO</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {FinancialTransactionPaymentMethodsOptions.map((o) => {
                if (o.value === "A DEFINIR") return null;
                return (
                  <DropdownMenuItem
                    key={o.id}
                    onClick={() => onUpdate(draftId, { metodo: o.value })}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        {o.icon}
                        {o.label}
                      </span>
                      {o.value === transaction.metodo ? <Check className="h-4 w-4" /> : null}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            className="h-8 w-24 max-w-full text-xs"
            value={Number.isNaN(transaction.valor) ? 0 : transaction.valor}
            onChange={(e) => onUpdate(draftId, { valor: Number(e.target.value) || 0 })}
            step="0.01"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive h-8 w-8"
            onClick={() => onRemove(draftId)}
            aria-label="Remover"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="w-full max-w-full">
        <Input
          className="h-8 text-xs"
          placeholder="Título"
          value={transaction.titulo}
          onChange={(e) => onUpdate(draftId, { titulo: e.target.value })}
        />
      </div>

      {transaction.totalParcelas && transaction.totalParcelas > 1 ? (
        <div className="text-muted-foreground text-[0.65rem]">
          Parcela {transaction.parcela}/{transaction.totalParcelas}
        </div>
      ) : null}

      <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:gap-3">
        <InteractiveInput.Root>
          <InteractiveInput.Trigger>
            <Button type="button" variant="ghost" size="sm" className="h-8 gap-1.5 text-[0.7rem]">
              <CalendarClock className="h-3.5 w-3.5 text-amber-600" />
              {transaction.dataPrevisao
                ? `PREVISÃO: ${formatDateAsLocale(transaction.dataPrevisao)}`
                : "DEFINIR PREVISÃO"}
            </Button>
          </InteractiveInput.Trigger>
          <InteractiveInput.Content align="end">
            <InteractiveInput.DateContent
              value={selectedForecast}
              onChange={(next) =>
                onUpdate(draftId, {
                  dataPrevisao: next
                    ? (formatDateInputChange(next, "string") as string)
                    : (formatDateInputChange(new Date(), "string") as string),
                })
              }
            />
          </InteractiveInput.Content>
        </InteractiveInput.Root>

        <InteractiveInput.Root>
          <InteractiveInput.Trigger>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 max-w-full gap-1.5 truncate text-[0.7rem] normal-case"
            >
              <Wallet className="h-3.5 w-3.5" />
              {transaction.contaFinanceira?.id
                ? transaction.contaFinanceira.nome
                : "Conta financeira"}
            </Button>
          </InteractiveInput.Trigger>
          <InteractiveInput.Content align="end" className="w-[min(100vw-2rem,22rem)]">
            <div className="p-0">
              <InteractiveInput.SingleSelectContent
                options={accountOptions}
                value={transaction.contaFinanceira?.id || null}
                onChange={(id) => {
                  const a = accounts.find((acc) => acc.id === id);
                  onUpdate(draftId, {
                    contaFinanceira: a
                      ? { id: a.id, nome: a.nome, tipo: a.tipo }
                      : { id: "", nome: "", tipo: "BANCO" },
                  });
                }}
                searchPlaceholder="Buscar conta..."
                emptyLabel="Nenhuma conta"
              />
            </div>
          </InteractiveInput.Content>
        </InteractiveInput.Root>
      </div>
    </div>
  );
}
