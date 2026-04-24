import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TMatchReconciliationRow } from "@/pages/api/financeiro/reconciliation/match";
import { formatToMoney } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { TFinancialReconciliationMatchStrategy } from "@/utils/schemas/finances";
import { CheckCircle2, Unlink } from "lucide-react";

const STRATEGY_LABEL: Record<TFinancialReconciliationMatchStrategy, string> = {
  EXATA: "EXATA",
  APROXIMADA: "APROXIMADA",
  IA: "IA",
  MANUAL: "MANUAL",
  CRIADA: "CRIADA",
};

const STRATEGY_CLASS: Record<TFinancialReconciliationMatchStrategy, string> = {
  EXATA: "bg-green-100 text-green-700",
  APROXIMADA: "bg-amber-100 text-amber-700",
  IA: "bg-blue-100 text-blue-700",
  MANUAL: "bg-zinc-100 text-zinc-700",
  CRIADA: "bg-purple-100 text-purple-700",
};

type MatchedListProps = {
  rows: TMatchReconciliationRow[];
  onUnlink: (linhaId: string) => void;
};

export default function MatchedList({ rows, onUnlink }: MatchedListProps) {
  if (rows.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Nenhuma transação foi automaticamente correspondida ainda.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <MatchedRow key={row.linha.id} row={row} onUnlink={onUnlink} />
      ))}
    </div>
  );
}

type MatchedRowProps = {
  row: TMatchReconciliationRow;
  onUnlink: (linhaId: string) => void;
};

function MatchedRow({ row, onUnlink }: MatchedRowProps) {
  const { linha, match, transacaoCorrespondente } = row;
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-green-200 bg-green-50/40 px-3 py-2 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="text-xs font-bold uppercase tracking-tight">
            {linha.descricao}
          </span>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-[0.6rem] font-semibold",
              STRATEGY_CLASS[match.estrategia],
            )}
          >
            {STRATEGY_LABEL[match.estrategia]}
            {match.estrategia === "IA" ? ` · ${(match.score * 100).toFixed(0)}%` : null}
          </span>
        </div>
        <Button
          type="button"
          size="xs"
          variant="ghost"
          className="flex items-center gap-1"
          onClick={() => onUnlink(linha.id)}
        >
          <Unlink className="h-3 w-3" />
          DESVINCULAR
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-2 text-[0.65rem] text-muted-foreground sm:grid-cols-2">
        <div className="flex flex-col">
          <span className="font-semibold uppercase">No extrato</span>
          <span>
            {formatDateAsLocale(linha.data)} · {formatToMoney(linha.valor)} · {linha.tipo}
          </span>
          {linha.documento ? <span>Doc.: {linha.documento}</span> : null}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold uppercase">No sistema</span>
          {transacaoCorrespondente ? (
            <>
              <span>
                {transacaoCorrespondente.titulo} · {formatToMoney(transacaoCorrespondente.valor)}
              </span>
              <span>
                {transacaoCorrespondente.dataEfetivacao
                  ? `Efetivada em ${formatDateAsLocale(transacaoCorrespondente.dataEfetivacao)}`
                  : `Prevista para ${formatDateAsLocale(transacaoCorrespondente.dataPrevisao)}`}
              </span>
            </>
          ) : (
            <span>Transação não encontrada (id desatualizado?)</span>
          )}
        </div>
      </div>
    </div>
  );
}
