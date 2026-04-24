import { Button } from "@/components/ui/button";
import { TMatchReconciliationRow } from "@/pages/api/financeiro/reconciliation/match";
import { formatToMoney } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { Plus, XCircle } from "lucide-react";

type UnmatchedListProps = {
  rows: TMatchReconciliationRow[];
  /** Returns true if the row already had a transaction created from it. */
  isCreated: (linhaId: string) => boolean;
  onCreateClick: (linhaId: string) => void;
};

export default function UnmatchedList({ rows, isCreated, onCreateClick }: UnmatchedListProps) {
  if (rows.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Nenhuma linha sem correspondência.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => {
        const created = isCreated(row.linha.id);
        return (
          <div
            key={row.linha.id}
            className="flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50/30 px-3 py-2 shadow-2xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-xs font-bold uppercase tracking-tight">
                  {row.linha.descricao}
                </span>
              </div>
              {created ? (
                <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[0.6rem] font-semibold text-purple-700">
                  TRANSAÇÃO CRIADA
                </span>
              ) : (
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => onCreateClick(row.linha.id)}
                >
                  <Plus className="h-3 w-3" />
                  CRIAR TRANSAÇÃO
                </Button>
              )}
            </div>
            <div className="text-[0.65rem] text-muted-foreground">
              {formatDateAsLocale(row.linha.data)} · {formatToMoney(row.linha.valor)} ·{" "}
              {row.linha.tipo}
              {row.linha.documento ? ` · Doc. ${row.linha.documento}` : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}
