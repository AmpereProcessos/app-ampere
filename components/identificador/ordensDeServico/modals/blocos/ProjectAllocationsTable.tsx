import { useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getAllocationProgress } from "@/lib/projects/allocations";
import { getErrorMessage } from "@/utils/methods/handlers";
import { formatDecimalPlaces } from "@/utils/constants";
import type { TServiceOrderProject } from "@/utils/schemas/service-order";

type Allocation = NonNullable<TServiceOrderProject["alocacoes"]>[number];
type Props = {
  allocations: Allocation[];
  projectId: string;
  onSaved: (materialId: string, quantity: number) => void;
};

export default function ProjectAllocationsTable({ allocations, projectId, onSaved }: Props) {
  return (
    <div className="w-full rounded-md border border-border bg-background">
      <div
        className="hidden grid-cols-[minmax(0,2fr)_50px_120px_100px_100px_minmax(0,1fr)] items-center gap-2 border-b border-border bg-muted/50 px-3 py-2 text-xs font-medium lg:grid"
        aria-hidden="true"
      >
        <span className="text-start">MATERIAL</span>
        <span className="text-center">UN.</span>
        <span className="text-center">PREVISTO</span>
        <span className="text-center">ALOCADO</span>
        <span className="text-center">PENDENTE</span>
        <span className="text-center">STATUS</span>
      </div>
      <ul aria-label="Alocações de materiais" className="divide-y divide-border">
        {allocations.map((allocation, index) => (
          <AllocationRow
            key={`${allocation.idMaterial}-${index}`}
            allocation={allocation}
            projectId={projectId}
            onSaved={onSaved}
          />
        ))}
      </ul>
      {allocations.length === 0 ? (
        <p className="px-3 py-5 text-center text-sm">
          Nenhuma alocação adicionada. Selecione um material abaixo para começar.
        </p>
      ) : null}
    </div>
  );
}

function AllocationRow({
  allocation,
  projectId,
  onSaved,
}: { allocation: Allocation } & Omit<Props, "allocations">) {
  const { pending, status } = getAllocationProgress(
    allocation.quantidadePrevista,
    allocation.quantidade,
  );
  return (
    <li className="px-3 py-2 transition-colors hover:bg-muted/30">
      <div className="grid grid-cols-2 items-start gap-x-2 gap-y-3 text-sm lg:grid-cols-[minmax(0,2fr)_50px_120px_100px_100px_minmax(0,1fr)] lg:items-center">
        <p className="break-words font-medium">{allocation.nome}</p>
        <p className="text-center text-xs">
          <span className="sr-only">Unidade: </span>
          {allocation.unidade || "UN"}
        </p>
        <div className="col-span-2 flex min-w-0 items-center justify-between gap-2 lg:col-span-1 lg:block">
          <span className="text-xs lg:hidden">Previsto</span>
          <div className="w-full max-w-40 lg:max-w-none">
            <PlannedQuantityCell allocation={allocation} projectId={projectId} onSaved={onSaved} />
          </div>
        </div>
        <p className="text-center tabular-nums">
          <span className="mb-2 block text-xs lg:sr-only">Alocado</span>
          {formatDecimalPlaces(allocation.quantidade)}
        </p>
        <p className="text-center tabular-nums">
          <span className="mb-2 block text-xs lg:sr-only">Pendente</span>
          {formatDecimalPlaces(pending)}
        </p>
        <span
          className={cn(
            "col-span-2 w-fit justify-self-center rounded px-2 py-1 text-center text-[0.65rem] font-semibold lg:col-span-1",
            pending > 0
              ? "bg-amber-100 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100"
              : "bg-green-100 text-green-950 dark:bg-green-950/50 dark:text-green-100",
          )}
        >
          {status}
        </span>
      </div>
      <details className="mt-2 text-xs">
        <summary className="w-fit cursor-pointer rounded py-1 text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Movimentações ({allocation.movimentacoes.length})
        </summary>
        <ul className="mt-1 space-y-2 border-t border-border py-2">
          {allocation.movimentacoes.map((movement, index) => (
            <li
              key={`${movement.idCompra}-${movement.idFormularioSaida}-${index}`}
              className="flex flex-wrap justify-between gap-2"
            >
              <span>
                {movement.titulo || (movement.idCompra ? "Compra" : "Formulário de saída")}
              </span>
              <span className="tabular-nums">
                {formatDecimalPlaces(movement.quantidade)} {allocation.unidade || "UN"} ·{" "}
                {movement.idCompra ? "Compra" : "Formulário de saída"}
              </span>
            </li>
          ))}
          {!allocation.movimentacoes.length ? <li>Nenhuma movimentação registrada.</li> : null}
        </ul>
      </details>
    </li>
  );
}

function PlannedQuantityCell({
  allocation,
  projectId,
  onSaved,
}: { allocation: Allocation } & Omit<Props, "allocations">) {
  const queryClient = useQueryClient();
  const errorId = useId();
  const [draft, setDraft] = useState(String(allocation.quantidadePrevista).replace(".", ","));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const focused = useRef(false);
  const inFlight = useRef(false);
  const skipBlur = useRef(false);
  const original = useRef(allocation.quantidadePrevista);

  useEffect(() => {
    if (!focused.current && !inFlight.current && !error) {
      setDraft(String(allocation.quantidadePrevista).replace(".", ","));
      original.current = allocation.quantidadePrevista;
    }
  }, [allocation.quantidadePrevista, error]);

  async function commit() {
    if (inFlight.current) return;
    const quantity = Number(draft.trim().replace(",", "."));
    if (!/^\d+(?:[.,]\d+)?$/.test(draft.trim()) || !Number.isFinite(quantity) || quantity <= 0) {
      setError("Informe uma quantidade maior que zero.");
      return;
    }
    if (quantity === original.current) {
      setError("");
      return;
    }
    inFlight.current = true;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await axios.patch("/api/projects/allocations", {
        projectId,
        materialId: allocation.idMaterial,
        quantidadePrevista: quantity,
        quantidadePrevistaAnterior: original.current,
      });
      original.current = quantity;
      onSaved(allocation.idMaterial, quantity);
      setSaved(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      // Refresh stock-derived values as well; other rows retain their own active drafts.
      await queryClient.invalidateQueries({ queryKey: ["service-order-project", projectId] });
      inFlight.current = false;
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="relative">
        <Input
          aria-label={`Quantidade prevista de ${allocation.nome}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-busy={saving}
          data-allocation-quantity="true"
          inputMode="decimal"
          value={draft}
          readOnly={saving}
          onFocus={(event) => {
            focused.current = true;
            original.current = allocation.quantidadePrevista;
            event.target.select();
          }}
          onChange={(event) => {
            setDraft(event.target.value);
            setError("");
            setSaved(false);
          }}
          onBlur={() => {
            focused.current = false;
            if (skipBlur.current) {
              skipBlur.current = false;
              return;
            }
            void commit();
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              skipBlur.current = true;
              setDraft(String(allocation.quantidadePrevista).replace(".", ","));
              setError("");
              event.currentTarget.blur();
            }
            if (event.key === "Enter") {
              event.preventDefault();
              event.currentTarget.blur();
            }
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              const cells = Array.from(
                event.currentTarget
                  .closest("ul")
                  ?.querySelectorAll<HTMLInputElement>("input[data-allocation-quantity]") || [],
              );
              const next =
                cells[cells.indexOf(event.currentTarget) + (event.key === "ArrowDown" ? 1 : -1)];
              if (next) {
                event.preventDefault();
                next.focus();
              }
            }
          }}
          className={cn(
            "h-9 border-transparent bg-transparent px-7 text-center text-sm tabular-nums shadow-none hover:border-border hover:bg-muted/50 focus-visible:border-border focus-visible:ring-2",
            error && "border-destructive",
            saving && "opacity-60",
          )}
        />
        <span className="pointer-events-none absolute right-2 top-3" aria-hidden="true">
          {saving ? (
            <Loader2 className="h-3 w-3 animate-spin motion-reduce:animate-none" />
          ) : saved ? (
            <Check className="h-3 w-3 text-green-700 dark:text-green-300" />
          ) : (
            <Pencil className="h-3 w-3" />
          )}
        </span>
      </div>
      <span role="status" className="sr-only">
        {saving ? "Salvando quantidade" : saved ? "Quantidade salva" : ""}
      </span>
      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
