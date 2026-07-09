import DateIntervalInput from "@/components/inputs/DateIntervalInput";
import { useSession } from "@/components/providers/SessionProvider";
import LoadingComponent from "@/components/utils/LoadingComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import type { TAuthSession } from "@/lib/authentication/types";
import { useOverallReport } from "@/utils/methods/query/stats";

import { BarChart3, ChartPie, Gauge, Map } from "lucide-react";

import ClientProfileReport from "@/components/identificador/estatisticas/overall-report/ClientProfile";
import OverallReportGeneralStats from "@/components/identificador/estatisticas/overall-report/General";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import { serviceTypes } from "@/utils/select-options";
import dayjs from "dayjs";
import dynamic from "next/dynamic";

const GeographicReport = dynamic(
  () => import("@/components/identificador/estatisticas/overall-report/Geographic"),
  {
    ssr: false,
    loading: () => <LoadingComponent />,
  },
);

function ReportPage() {
  const { session, status } = useSession();

  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;

  const hasResultsAccess = session.user.permissoes.gestao.visualizarResultados;
  if (!hasResultsAccess) return <UnauthorizedPage />;

  return <ReportPageContent session={session} />;
}
export default ReportPage;

function ReportPageContent({ session }: { session: TAuthSession }) {
  const {
    data: report,
    isLoading,
    isError,
    error,
    isSuccess,
    queryParams,
    updateQueryParams,
  } = useOverallReport({});

  const reportPeriodPresets = [
    {
      label: "Último mês",
      interval: {
        after: dayjs().subtract(1, "month").startOf("month").subtract(3, "hour").toDate(),
        before: dayjs().subtract(1, "month").endOf("month").subtract(3, "hour").toDate(),
      },
    },

    // Generate year presets from 2017 to current year
    ...Array.from({ length: dayjs().year() - 2017 + 1 }, (_, i) => {
      const year = 2017 + i;
      return {
        label: String(year),
        interval: {
          after: dayjs(`${year}-01-01`).startOf("day").subtract(3, "hour").toDate(),
          before: dayjs(`${year}-12-31`).endOf("day").subtract(3, "hour").toDate(),
        },
      };
    }),
  ];
  return (
    <div className="flex min-h-screen grow flex-col p-6">
      {/* Header com filtros compartilhados entre as abas */}
      <div className="bg-background border-border mb-6 flex flex-col items-center rounded-lg border-b px-6 py-4 shadow-xs">
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-[#15599a]" />
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">RELATÓRIO GERAL</p>
          </div>
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-[250px]">
              <MultipleSelectInput
                label="TIPOS DE SERVIÇO"
                selected={queryParams.projectTypes}
                handleChange={(v) => updateQueryParams({ projectTypes: v as string[] })}
                options={serviceTypes}
                selectedItemLabel="SEM FILTRO"
                onReset={() => updateQueryParams({ projectTypes: [] })}
                width="100%"
              />
            </div>
            <DateIntervalInput
              label="PERÍODO"
              value={{
                after: queryParams.period?.after ? new Date(queryParams.period.after) : undefined,
                before: queryParams.period?.before ? new Date(queryParams.period.before) : undefined,
              }}
              handleChange={(v) =>
                updateQueryParams({
                  period: {
                    after: v.after ? v.after.toISOString() : undefined,
                    before: v.before ? v.before.toISOString() : undefined,
                  },
                })
              }
              presets={reportPeriodPresets}
            />
          </div>
        </div>
      </div>
      <Tabs defaultValue="visao-geral" className="w-full gap-4">
        <TabsList className="w-full lg:w-fit">
          <TabsTrigger value="visao-geral">
            <Gauge className="h-4 w-4" />
            VISÃO GERAL
          </TabsTrigger>
          <TabsTrigger value="perfil-clientes">
            <ChartPie className="h-4 w-4" />
            PERFIL DE CLIENTES
          </TabsTrigger>
          <TabsTrigger value="geografia">
            <Map className="h-4 w-4" />
            GEOGRAFIA
          </TabsTrigger>
        </TabsList>
        <TabsContent value="visao-geral">
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? <OverallReportGeneralStats generalData={report?.geral} /> : null}
        </TabsContent>
        <TabsContent value="perfil-clientes">
          <ClientProfileReport projectTypes={queryParams.projectTypes} period={queryParams.period} />
        </TabsContent>
        <TabsContent value="geografia">
          <GeographicReport projectTypes={queryParams.projectTypes} period={queryParams.period} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
