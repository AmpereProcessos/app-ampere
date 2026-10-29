import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import {
  formatExecutionDate,
  formatExecutionDuration,
  formatExecutionTime,
  summarizeExecutionSessions,
  type TExecutionSession,
} from "@/lib/service-orders/execution-sessions";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useServiceOrderById } from "@/utils/methods/query/service-orders";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ChevronDown, ExternalLink, Timer } from "lucide-react";
import { useId, useMemo, useState } from "react";
import ModalControlServiceOrder from "../modals/ModalControlServiceOrder";

type MainServiceOrderExecutionSummaryProps = {
  session: TAuthSession;
  projectId: string;
  serviceOrderId: string;
};

function MainServiceOrderExecutionSummary({
  session,
  projectId,
  serviceOrderId,
}: MainServiceOrderExecutionSummaryProps) {
  const queryClient = useQueryClient();
  const headingId = useId();
  const listId = useId();
  const [periodsAreVisible, setPeriodsAreVisible] = useState(false);
  const [orderModalIsOpen, setOrderModalIsOpen] = useState(false);
  const { data: serviceOrder, isLoading, isError, error } = useServiceOrderById({ id: serviceOrderId });

  const history = serviceOrder?.periodo?.historico;
  const summary = useMemo(() => summarizeExecutionSessions(history), [history]);
  const orderedSessions = useMemo(
    () =>
      [...summary.sessions].sort(
        (a, b) =>
          (a.startMs ?? Number.POSITIVE_INFINITY) - (b.startMs ?? Number.POSITIVE_INFINITY) || a.index - b.index,
      ),
    [summary.sessions],
  );

  // Same invalidation the project's order list uses, so edits made in the modal refresh the summary and the project.
  const handleMutate = async () => {
    await queryClient.cancelQueries({ queryKey: ["project-service-orders", projectId] });
    await queryClient.cancelQueries({ queryKey: ["project-by-id", projectId] });
  };
  const handleSettled = async () => {
    await queryClient.invalidateQueries({ queryKey: ["service-order", serviceOrderId] });
    await queryClient.invalidateQueries({ queryKey: ["project-service-orders", projectId] });
    await queryClient.invalidateQueries({ queryKey: ["project-by-id", projectId] });
  };

  const hasCompleted = summary.completedCount > 0;
  const notices: string[] = [];
  if (summary.openCount > 0)
    notices.push(
      `${summary.openCount} ${summary.openCount === 1 ? "período em aberto não entra" : "períodos em aberto não entram"} no total.`,
    );
  if (summary.invalidCount > 0)
    notices.push(
      `${summary.invalidCount} ${summary.invalidCount === 1 ? "período com datas inválidas foi ignorado" : "períodos com datas inválidas foram ignorados"}.`,
    );
  if (summary.hasOverlap)
    notices.push(
      `Períodos sobrepostos: ${formatExecutionDuration(summary.overlapMs)} em comum, contado uma única vez no total.`,
    );

  return (
    <section
      aria-labelledby={headingId}
      className="border-border bg-card mx-2 flex min-w-0 flex-col gap-3 rounded-md border p-3 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Timer className="text-primary h-4 w-4 min-h-4 min-w-4" aria-hidden="true" />
          <h3 id={headingId} className="text-xs font-medium tracking-tight">
            EXECUÇÃO DA OS PRINCIPAL
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setOrderModalIsOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:ring-ring flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium duration-300 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          Abrir OS principal
        </button>
      </div>

      {isLoading ? (
        <output className="text-muted-foreground animate-pulse text-xs">
          Buscando execução da OS principal...
        </output>
      ) : null}
      {isError ? (
        <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
          Não foi possível carregar a execução da OS principal. {getErrorMessage(error)}
        </p>
      ) : null}

      {serviceOrder && summary.recordCount === 0 ? (
        <p className="text-muted-foreground text-xs italic">Sem períodos registrados</p>
      ) : null}

      {serviceOrder && summary.recordCount > 0 ? (
        <>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 min-[420px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <Metric
              label="Tempo trabalhado"
              value={hasCompleted ? formatExecutionDuration(summary.totalMs) : "—"}
              hint={hasCompleted ? undefined : "Nenhum período concluído"}
              primary
            />
            <Metric
              label={summary.completedCount === 1 ? "Sessão concluída" : "Sessões concluídas"}
              value={hasCompleted ? String(summary.completedCount) : "—"}
            />
            <Metric
              label={summary.distinctDays === 1 ? "Dia com registro" : "Dias com registro"}
              value={hasCompleted ? String(summary.distinctDays) : "—"}
            />
          </dl>

          {notices.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {notices.map((notice) => (
                <li
                  key={notice}
                  className="flex items-start gap-1.5 rounded border border-[#fead41]/50 bg-[#fead41]/15 px-2 py-1 text-xs text-amber-900 dark:text-amber-200"
                >
                  <AlertTriangle className="mt-px h-3 w-3 min-h-3 min-w-3" aria-hidden="true" />
                  <span>{notice}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              aria-expanded={periodsAreVisible}
              aria-controls={listId}
              onClick={() => setPeriodsAreVisible((current) => !current)}
              className="text-primary focus-visible:ring-ring flex w-fit items-center gap-1 rounded text-xs font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
            >
              <ChevronDown
                className={cn("h-3.5 w-3.5 duration-200 motion-reduce:transition-none", periodsAreVisible && "rotate-180")}
                aria-hidden="true"
              />
              {periodsAreVisible ? "Ocultar períodos" : `Ver períodos (${summary.recordCount})`}
            </button>
            <div id={listId} hidden={!periodsAreVisible}>
              {periodsAreVisible ? (
                <ol className="divide-border border-border max-h-72 divide-y overflow-y-auto rounded border">
                  {orderedSessions.map((item) => (
                    <SessionRow key={item.index} item={item} />
                  ))}
                </ol>
              ) : null}
            </div>
          </div>
        </>
      ) : null}

      {orderModalIsOpen ? (
        <ModalControlServiceOrder
          serviceOrderId={serviceOrderId}
          closeModal={() => setOrderModalIsOpen(false)}
          session={session}
          callbacks={{ onMutate: handleMutate, onSettled: handleSettled }}
        />
      ) : null}
    </section>
  );
}

export default MainServiceOrderExecutionSummary;

type MetricProps = { label: string; value: string; hint?: string; primary?: boolean };
function Metric({ label, value, hint, primary = false }: MetricProps) {
  return (
    <div className="flex min-w-0 flex-col">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd
        className={cn(
          "text-foreground leading-tight font-bold tabular-nums",
          primary ? "text-2xl text-primary" : "text-lg",
        )}
      >
        {value}
      </dd>
      {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
    </div>
  );
}

function SessionRow({ item }: { item: TExecutionSession }) {
  const sameDay =
    item.startMs !== null &&
    item.endMs !== null &&
    formatExecutionDate(item.startMs) === formatExecutionDate(item.endMs);
  const exit =
    item.status === "open"
      ? "em aberto"
      : item.endMs === null
        ? item.saida
          ? "inválida"
          : "—"
        : sameDay
          ? formatExecutionTime(item.endMs)
          : `${formatExecutionDate(item.endMs)} ${formatExecutionTime(item.endMs)}`;
  const entry =
    item.startMs === null ? (item.entrada ? "inválida" : "—") : formatExecutionTime(item.startMs);

  return (
    <li className="flex flex-col gap-1 px-2 py-1.5 text-xs sm:grid sm:grid-cols-[6rem_minmax(0,9.5rem)_5rem_minmax(0,1fr)] sm:items-start sm:gap-x-3">
      <span className="text-foreground font-medium tabular-nums">{formatExecutionDate(item.startMs)}</span>
      <span className="text-foreground tabular-nums">
        {entry} <span aria-hidden="true">→</span>
        <span className="sr-only"> até </span> {exit}
      </span>
      <span className="flex flex-wrap items-center gap-1 font-medium tabular-nums">
        {item.durationMs !== null ? formatExecutionDuration(item.durationMs) : "—"}
      </span>
      <span className="flex min-w-0 flex-wrap items-start gap-x-2 gap-y-1">
        {item.status === "open" ? <Flag>Em aberto, fora do total</Flag> : null}
        {item.status === "invalid" ? <Flag>Intervalo inválido, ignorado</Flag> : null}
        {item.overlaps ? <Flag>Sobreposto</Flag> : null}
        {item.anotacoes ? (
          <span className="text-muted-foreground min-w-0 break-words whitespace-pre-wrap">{item.anotacoes}</span>
        ) : null}
      </span>
    </li>
  );
}

function Flag({ children }: { children: string }) {
  return (
    <span className="rounded border border-[#fead41]/60 bg-[#fead41]/15 px-1.5 text-[0.7rem] leading-4 font-medium text-amber-900 dark:text-amber-200">
      {children}
    </span>
  );
}
