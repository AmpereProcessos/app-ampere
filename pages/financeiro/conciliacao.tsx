import FinancialReconciliationView from "@/components/identificador/financeiro/conciliacao/FinancialReconciliationView";
import { useSession } from "@/components/providers/SessionProvider";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedComponent from "@/components/utils/UnauthorizedComponent";
import { TAuthSession } from "@/lib/authentication/types";
import { Scale } from "lucide-react";

export default function ConciliacaoPage() {
  const { session, status } = useSession();

  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;

  const isAuthorized = session?.user.permissoes.financeiro.visualizar;
  if (!isAuthorized) return <UnauthorizedComponent />;

  return <ConciliacaoContent session={session} />;
}

function ConciliacaoContent({ session }: { session: TAuthSession }) {
  return (
    <div className="flex w-full grow flex-col gap-3 p-6">
      <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-[#15599a]" />
          <h1 className="text-2xl font-black text-[#15599a]">Conciliação Financeira</h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Envie um extrato em PDF para vincular automaticamente as transações do sistema.
        </p>
      </div>

      <FinancialReconciliationView session={session} />
    </div>
  );
}
