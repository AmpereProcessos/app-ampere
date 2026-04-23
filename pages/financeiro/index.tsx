import { useSession } from "@/components/providers/SessionProvider";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthorizedComponent from "@/components/utils/UnauthorizedComponent";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Banknote, ChartBarIcon, DollarSignIcon, ListIcon } from "lucide-react";
import FinancesStatsView from "@/components/identificador/financeiro/FinancesStatsView";
import AccountingEntriesView from "@/components/identificador/financeiro/AccountingEntriesView";
import FinancialTransactionsView from "@/components/identificador/financeiro/FinancialTransactionsView";
import FinancialAccountsView from "@/components/identificador/financeiro/FinancialAccountsView";

export default function FinanceiroPage() {
  const { session, status } = useSession();

  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;

  const isAuthorized = session?.user.permissoes.financeiro.visualizar;
  if (!isAuthorized) return <UnauthorizedComponent />;

  return <FinanceiroContent session={session} />;
}

type FinanceiroContentModes =
  | "stats"
  | "accounting-entries"
  | "financial-transactions"
  | "financial-accounts";
function FinanceiroContent({ session }: { session: TAuthSession }) {
  const [mode, setMode] = useState<FinanceiroContentModes>("stats");

  const MODE_TITLE_MAP = {
    stats: "Estatísticas",
    "accounting-entries": "Lançamentos Contábeis",
    "financial-transactions": "Transações Financeiras",
    "financial-accounts": "Contas Financeiras",
  };
  return (
    <div className="w-full flex flex-col gap-2 p-6 grow">
      <div className="w-full flex items-center justify-between flex-col lg:flex-row gap-2">
        <h1 className="text-2xl font-black text-[#15599a]">{MODE_TITLE_MAP[mode]}</h1>
        <div className="flex items-center gap-1 px-2 py-1 bg-primary/20 rounded-lg">
          <button
            type="button"
            onClick={() => setMode("stats")}
            className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", {
              "bg-transparent": mode !== "stats",
              "bg-primary text-primary-foreground": mode === "stats",
            })}
          >
            <ChartBarIcon className="w-3 h-3 min-w-3 min-h-3" />
            ESTATÍSTICAS
          </button>
          <button
            type="button"
            onClick={() => setMode("accounting-entries")}
            className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", {
              "bg-transparent": mode !== "accounting-entries",
              "bg-primary text-primary-foreground": mode === "accounting-entries",
            })}
          >
            <ListIcon className="w-3 h-3 min-w-3 min-h-3" />
            LANÇAMENTOS CONTÁBEIS
          </button>
          <button
            type="button"
            onClick={() => setMode("financial-transactions")}
            className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", {
              "bg-transparent": mode !== "financial-transactions",
              "bg-primary text-primary-foreground": mode === "financial-transactions",
            })}
          >
            <DollarSignIcon className="w-3 h-3 min-w-3 min-h-3" />
            TRANSAÇÕES FINANCEIRAS
          </button>
          <button
            type="button"
            onClick={() => setMode("financial-accounts")}
            className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", {
              "bg-transparent": mode !== "financial-accounts",
              "bg-primary text-primary-foreground": mode === "financial-accounts",
            })}
          >
            <Banknote className="w-3 h-3 min-w-3 min-h-3" />
            CONTAS FINANCEIRAS
          </button>
        </div>
      </div>

      {mode === "stats" ? <FinancesStatsView /> : null}
      {mode === "accounting-entries" ? <AccountingEntriesView session={session} /> : null}
      {mode === "financial-transactions" ? <FinancialTransactionsView session={session} /> : null}
      {mode === "financial-accounts" ? <FinancialAccountsView session={session} /> : null}
    </div>
  );
}
