import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { InteractiveFilter } from "@/components/ui/interactive-filter";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import SelectInput from "@/components/inputs/Select";
import { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import { TMatchReconciliationOutputData } from "@/pages/api/financeiro/reconciliation/match";
import {
  createReconciliation,
  extractReconciliationFromPdf,
  matchReconciliation,
} from "@/utils/methods/mutation/finances";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useFinancesFinancialAccounts } from "@/utils/methods/query/finances";
import {
  TFinancialReconciliationExtractedLine,
  TFinancialReconciliationMatch,
} from "@/utils/schemas/finances";
import { useFinancialReconciliationState } from "@/utils/state/financial-reconciliation";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  FileSearch,
  Landmark,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import AmbiguousList from "./AmbiguousList";
import CreateTransactionFromLine from "./CreateTransactionFromLine";
import MatchedList from "./MatchedList";
import PdfDropzone from "./PdfDropzone";
import UnmatchedList from "./UnmatchedList";

type Section = "matched" | "ambiguous" | "unmatched";
type MatchData = TMatchReconciliationOutputData;

export default function FinancialReconciliationView({ session }: { session: TAuthSession }) {
  const { state, updateState, upsertMatch, unlinkMatch, resetState } =
    useFinancialReconciliationState({ session });
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("matched");
  const [createForLineId, setCreateForLineId] = useState<string | null>(null);
  /** Map of linhaId -> createdTransactionId so we can stamp the right thing on save. */
  const [createdByLine, setCreatedByLine] = useState<Record<string, string>>({});

  const {
    data: accountsData,
    isLoading: accountsLoading,
    isError: accountsError,
    error: accountsErrorObj,
  } = useFinancesFinancialAccounts({ initialParams: { activeOnly: true, stats: false } });

  const accountOptions = useMemo(
    () =>
      accountsData?.accounts.map((a) => ({
        id: a.id,
        value: a.id,
        label: `${a.nome}${a.tipo === "BANCO" ? " (Banco)" : a.tipo === "CAIXA" ? " (Caixa)" : " (Carteira)"}`,
      })) ?? [],
    [accountsData],
  );

  const periodLabel = useMemo(() => {
    if (!state.periodo.inicio || !state.periodo.fim) return "N/A";
    return `${formatDateAsLocale(state.periodo.inicio)} - ${formatDateAsLocale(state.periodo.fim)}`;
  }, [state.periodo.inicio, state.periodo.fim]);

  const canUpload = !!state.contaFinanceira && !!state.periodo.inicio && !!state.periodo.fim;
  const canRunPipeline = canUpload && !!state.pdf;

  /* -------------------------------------------------------------------------- */
  /* Mutations                                                                  */
  /* -------------------------------------------------------------------------- */

  const { mutate: runExtract, isPending: extracting } = useMutation({
    mutationKey: ["reconciliation-extract"],
    mutationFn: extractReconciliationFromPdf,
    onMutate: () => updateState({ step: "extracting" }),
    onSuccess: (data) => {
      const linhas = data.data.linhasExtraidas;
      updateState({ linhasExtraidas: linhas, step: "matching" });
      toast.success(data.message);
      // Auto-trigger matching after extraction.
      runMatch({
        contaFinanceiraId: state.contaFinanceira!.id,
        periodo: state.periodo,
        linhasExtraidas: linhas,
      });
    },
    onError: (error) => {
      updateState({ step: "upload" });
      toast.error(getErrorMessage(error));
    },
  });

  const { mutate: runMatch, isPending: matching } = useMutation({
    mutationKey: ["reconciliation-match"],
    mutationFn: matchReconciliation,
    onMutate: () => updateState({ step: "matching" }),
    onSuccess: (data) => {
      const allRows = [...data.data.matched, ...data.data.ambiguous, ...data.data.unmatched];
      const initialMatches: TFinancialReconciliationMatch[] = allRows.map((r) => r.match);
      setMatchData(data.data);
      updateState({ matches: initialMatches, step: "review" });
      setActiveSection(data.data.ambiguous.length > 0 ? "ambiguous" : "matched");
      toast.success(data.message);
    },
    onError: (error) => {
      updateState({ step: "upload" });
      toast.error(getErrorMessage(error));
    },
  });

  const { mutate: runSave, isPending: saving } = useMutation({
    mutationKey: ["reconciliation-save"],
    mutationFn: createReconciliation,
    onMutate: () => updateState({ step: "saving" }),
    onSuccess: (data) => {
      updateState({ step: "concluded" });
      toast.success(data.message);
    },
    onError: (error) => {
      updateState({ step: "review" });
      toast.error(getErrorMessage(error));
    },
  });

  /* -------------------------------------------------------------------------- */
  /* Derived bucket views — the underlying linha/candidatos info comes from     */
  /* matchData; the chosen match comes from state.matches (user-mutable).       */
  /* -------------------------------------------------------------------------- */

  const matchByLineId = useMemo(() => {
    const map = new Map<string, TFinancialReconciliationMatch>();
    for (const m of state.matches) map.set(m.linhaId, m);
    return map;
  }, [state.matches]);

  const sections = useMemo(() => {
    if (!matchData) return { matched: [], ambiguous: [], unmatched: [] };
    const matched: typeof matchData.matched = [];
    const ambiguous: typeof matchData.ambiguous = [];
    const unmatched: typeof matchData.unmatched = [];
    const allRows = [...matchData.matched, ...matchData.ambiguous, ...matchData.unmatched];

    for (const row of allRows) {
      const liveMatch = matchByLineId.get(row.linha.id) ?? row.match;
      const liveRow = { ...row, match: liveMatch };
      const isCreated = !!createdByLine[row.linha.id];

      if (isCreated || liveMatch.transacaoId) {
        // Created OR linked to a real txn → show in matched.
        matched.push(liveRow);
      } else if ((row.candidatos ?? []).length > 0 && liveMatch.estrategia !== "MANUAL") {
        ambiguous.push(liveRow);
      } else if ((row.candidatos ?? []).length > 0) {
        // Was ambiguous, user "unlinked" — keep in ambiguous so they can re-pick.
        ambiguous.push(liveRow);
      } else {
        unmatched.push(liveRow);
      }
    }
    return { matched, ambiguous, unmatched };
  }, [matchData, matchByLineId, createdByLine]);

  /* -------------------------------------------------------------------------- */
  /* Handlers                                                                   */
  /* -------------------------------------------------------------------------- */

  const handlePickAmbiguous = useCallback(
    (linhaId: string, match: TFinancialReconciliationMatch) => {
      upsertMatch(match);
    },
    [upsertMatch],
  );

  const handleTransactionCreated = useCallback(
    (linhaId: string, createdId: string) => {
      setCreatedByLine((prev) => ({ ...prev, [linhaId]: createdId }));
      upsertMatch({
        linhaId,
        transacaoId: null,
        transacaoCriadaId: createdId,
        score: 1,
        estrategia: "CRIADA",
      });
      setCreateForLineId(null);
    },
    [upsertMatch],
  );

  const handleConclude = useCallback(() => {
    if (!state.contaFinanceira || !state.pdf) return;
    runSave({
      contaFinanceira: state.contaFinanceira,
      periodo: state.periodo,
      pdf: state.pdf,
      status: "CONCLUIDA",
      linhasExtraidas: state.linhasExtraidas,
      matches: state.matches,
    });
  }, [
    runSave,
    state.contaFinanceira,
    state.linhasExtraidas,
    state.matches,
    state.pdf,
    state.periodo,
  ]);

  const lineForCreate = useMemo<TFinancialReconciliationExtractedLine | null>(() => {
    if (!createForLineId) return null;
    return state.linhasExtraidas.find((l) => l.id === createForLineId) ?? null;
  }, [createForLineId, state.linhasExtraidas]);

  /* -------------------------------------------------------------------------- */
  /* Loading / error guards for prerequisites                                   */
  /* -------------------------------------------------------------------------- */

  if (accountsLoading) return <LoadingComponent />;
  if (accountsError) return <ErrorComponent msg={getErrorMessage(accountsErrorObj)} />;

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Step 1 – filters */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase text-muted-foreground">
            <Landmark className="h-3 w-3" />
            CONTA FINANCEIRA
          </span>
          <SelectInput
            label="CONTA FINANCEIRA"
            showLabel={false}
            value={state.contaFinanceira?.id ?? null}
            options={accountOptions}
            selectedItemLabel="SELECIONE A CONTA"
            handleChange={(value) => {
              const account = accountsData?.accounts.find((a) => a.id === value);
              if (!account) {
                updateState({ contaFinanceira: null });
                return;
              }
              updateState({
                contaFinanceira: { id: account.id, nome: account.nome, tipo: account.tipo },
                step: "filters",
              });
            }}
            onReset={() => updateState({ contaFinanceira: null })}
            width="100%"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            PERÍODO DE CONCILIAÇÃO
          </span>
          <InteractiveFilter.Root className="w-full">
            <InteractiveFilter.Trigger className="w-full justify-between">
              <InteractiveFilter.Icon>
                <CalendarDays className="h-4 w-4" />
                <InteractiveFilter.Label>PERÍODO</InteractiveFilter.Label>
              </InteractiveFilter.Icon>
              <InteractiveFilter.Value>{periodLabel}</InteractiveFilter.Value>
            </InteractiveFilter.Trigger>
            <InteractiveFilter.Content className="w-auto p-0">
              <InteractiveFilter.DateRangeContent
                value={{
                  from: state.periodo.inicio ? new Date(state.periodo.inicio) : undefined,
                  to: state.periodo.fim ? new Date(state.periodo.fim) : undefined,
                }}
                onChange={(next) =>
                  updateState({
                    periodo: {
                      inicio: next.from ? next.from.toISOString() : state.periodo.inicio,
                      fim: next.to ? next.to.toISOString() : state.periodo.fim,
                    },
                  })
                }
              />
            </InteractiveFilter.Content>
          </InteractiveFilter.Root>
        </div>
      </div>

      {/* Step 2 – upload */}
      <div className="flex flex-col gap-2">
        <span className="text-[0.65rem] font-semibold uppercase text-muted-foreground">
          EXTRATO BANCÁRIO (PDF)
        </span>
        <PdfDropzone
          uploadPath={`reconciliacoes/${session.user.id}/${Date.now()}.pdf`}
          value={state.pdf}
          onChange={(pdf) => updateState({ pdf, step: pdf ? "upload" : "filters" })}
          disabled={!canUpload || extracting || matching || saving}
        />
        {!canUpload ? (
          <p className="text-[0.65rem] text-muted-foreground">
            Selecione a conta financeira e o período antes de enviar o PDF.
          </p>
        ) : null}
      </div>

      {/* Step 3 – extract + match trigger */}
      {canRunPipeline && state.step !== "concluded" ? (
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            className="flex items-center gap-1"
            disabled={extracting || matching || saving}
            onClick={() => runExtract({ pdfUrl: state.pdf!.url })}
          >
            <Sparkles className="h-4 w-4" />
            {extracting
              ? "EXTRAINDO PDF..."
              : matching
                ? "BUSCANDO CORRESPONDÊNCIAS..."
                : matchData
                  ? "RODAR NOVAMENTE"
                  : "EXTRAIR E COMPARAR"}
          </Button>
        </div>
      ) : null}

      {extracting || matching ? (
        <div className="rounded-xl border border-border bg-primary/5 px-4 py-3 text-xs text-primary">
          {extracting ? (
            <span>Lendo o PDF com IA. Isso pode levar de 20 a 60 segundos.</span>
          ) : (
            <span>Comparando linhas extraídas com transações do sistema. Quase pronto.</span>
          )}
        </div>
      ) : null}

      {/* Step 4 – review */}
      {matchData && state.step !== "concluded" ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <SectionTab
              label={`CORRESPONDIDAS (${sections.matched.length})`}
              icon={<CheckCircle2 className="h-3 w-3" />}
              active={activeSection === "matched"}
              onClick={() => setActiveSection("matched")}
            />
            <SectionTab
              label={`AMBÍGUAS (${sections.ambiguous.length})`}
              icon={<AlertTriangle className="h-3 w-3" />}
              active={activeSection === "ambiguous"}
              onClick={() => setActiveSection("ambiguous")}
            />
            <SectionTab
              label={`SEM CORRESPONDÊNCIA (${sections.unmatched.length})`}
              icon={<XCircle className="h-3 w-3" />}
              active={activeSection === "unmatched"}
              onClick={() => setActiveSection("unmatched")}
            />
          </div>

          {activeSection === "matched" ? (
            <MatchedList rows={sections.matched} onUnlink={(id) => unlinkMatch(id)} />
          ) : null}
          {activeSection === "ambiguous" ? (
            <AmbiguousList
              rows={sections.ambiguous}
              resolveSelected={(id) => matchByLineId.get(id)?.transacaoId ?? null}
              onPick={handlePickAmbiguous}
            />
          ) : null}
          {activeSection === "unmatched" ? (
            <UnmatchedList
              rows={sections.unmatched}
              isCreated={(id) => !!createdByLine[id]}
              onCreateClick={(id) => setCreateForLineId(id)}
            />
          ) : null}

          <div className="flex items-center justify-between gap-2 border-t pt-3">
            <span className="text-[0.65rem] text-muted-foreground">
              {sections.matched.length} corresp. · {sections.ambiguous.length} ambíguas ·{" "}
              {sections.unmatched.length} sem correspondência · {Object.keys(createdByLine).length}{" "}
              criadas
            </span>
            <Button
              type="button"
              size="sm"
              disabled={saving || sections.matched.length === 0}
              onClick={handleConclude}
              className="flex items-center gap-1"
            >
              <CheckCircle2 className="h-4 w-4" />
              {saving ? "SALVANDO..." : "CONCLUIR CONCILIAÇÃO"}
            </Button>
          </div>
        </div>
      ) : null}

      {/* Step 5 – concluded */}
      {state.step === "concluded" ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CheckCircle2 className="text-green-600" />
            </EmptyMedia>
            <EmptyTitle>Conciliação concluída</EmptyTitle>
            <EmptyDescription>
              As transações correspondentes foram marcadas como conciliadas.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setMatchData(null);
                setCreatedByLine({});
                setActiveSection("matched");
                resetState();
              }}
            >
              NOVA CONCILIAÇÃO
            </Button>
          </EmptyContent>
        </Empty>
      ) : null}

      {/* Idle empty-state when no PDF was processed yet */}
      {!matchData && state.step !== "concluded" && !extracting && !matching ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileSearch />
            </EmptyMedia>
            <EmptyTitle>Reconcilie seu extrato</EmptyTitle>
            <EmptyDescription>
              Selecione a conta, defina o período e envie o PDF do extrato bancário. A IA
              identificará as transações e tentará vinculá-las automaticamente.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent />
        </Empty>
      ) : null}

      {/* Modal: create transaction from unmatched line */}
      {createForLineId && lineForCreate && state.contaFinanceira ? (
        <CreateTransactionFromLine
          session={session}
          contaFinanceira={state.contaFinanceira}
          linha={lineForCreate}
          closeModal={() => setCreateForLineId(null)}
          onCreated={(createdId) => handleTransactionCreated(createForLineId, createdId)}
        />
      ) : null}
    </div>
  );
}

type SectionTabProps = {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
};
function SectionTab({ label, icon, active, onClick }: SectionTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 rounded-md px-2 py-1 text-[0.65rem] font-semibold tracking-tight transition",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-primary/10 text-primary hover:bg-primary/20",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
