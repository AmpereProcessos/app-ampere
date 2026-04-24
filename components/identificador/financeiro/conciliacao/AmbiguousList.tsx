import { cn } from "@/lib/utils";
import { TMatchReconciliationRow } from "@/pages/api/financeiro/reconciliation/match";
import { formatToMoney } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { TFinancialReconciliationMatch } from "@/utils/schemas/finances";
import { AlertTriangle } from "lucide-react";

type AmbiguousListProps = {
  rows: TMatchReconciliationRow[];
  /** Returns the current chosen transactionId for the line (from the parent's matches map). */
  resolveSelected: (linhaId: string) => string | null;
  onPick: (linhaId: string, match: TFinancialReconciliationMatch) => void;
};

export default function AmbiguousList({ rows, resolveSelected, onPick }: AmbiguousListProps) {
  if (rows.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Nenhuma linha ambígua a resolver.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <AmbiguousRow
          key={row.linha.id}
          row={row}
          selectedId={resolveSelected(row.linha.id)}
          onPick={onPick}
        />
      ))}
    </div>
  );
}

type AmbiguousRowProps = {
  row: TMatchReconciliationRow;
  selectedId: string | null;
  onPick: (linhaId: string, match: TFinancialReconciliationMatch) => void;
};

function AmbiguousRow({ row, selectedId, onPick }: AmbiguousRowProps) {
  const { linha, candidatos } = row;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2 shadow-2xs">
      <div className="flex flex-wrap items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <span className="text-xs font-bold uppercase tracking-tight">{linha.descricao}</span>
        <span className="text-[0.65rem] text-muted-foreground">
          {formatDateAsLocale(linha.data)} · {formatToMoney(linha.valor)} · {linha.tipo}
          {linha.documento ? ` · Doc. ${linha.documento}` : ""}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[0.6rem] font-semibold uppercase text-muted-foreground">
          Selecione a transação correspondente:
        </span>
        {candidatos.length === 0 ? (
          <span className="text-[0.65rem] text-muted-foreground">
            Nenhum candidato disponível.
          </span>
        ) : (
          candidatos.map((c) => {
            const isSelected = selectedId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  onPick(linha.id, {
                    linhaId: linha.id,
                    transacaoId: c.id,
                    score: 0.95,
                    estrategia: "MANUAL",
                  })
                }
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs transition",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-zinc-200 bg-white hover:border-primary/40",
                )}
              >
                <div className="flex flex-col">
                  <span className="font-semibold">{c.titulo}</span>
                  <span className="text-[0.65rem] text-muted-foreground">
                    {formatToMoney(c.valor)} ·{" "}
                    {c.dataEfetivacao
                      ? `Efetivada em ${formatDateAsLocale(c.dataEfetivacao)}`
                      : `Prevista para ${formatDateAsLocale(c.dataPrevisao)}`}
                  </span>
                </div>
                <span className="text-[0.65rem] font-semibold uppercase">
                  {isSelected ? "Selecionado" : "Selecionar"}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
