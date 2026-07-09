import DateIntervalInput from "@/components/inputs/DateIntervalInput";
import { useSession } from "@/components/providers/SessionProvider";
import LoadingComponent from "@/components/utils/LoadingComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import type { TAuthSession } from "@/lib/authentication/types";
import { useOverallReport } from "@/utils/methods/query/stats";

import { BarChart3 } from "lucide-react";

import OverallReportGeneralStats from "@/components/identificador/estatisticas/overall-report/General";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import { serviceTypes } from "@/utils/select-options";
import dayjs from "dayjs";

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
      {/* Header */}
      <div className="bg-background border-border mb-6 flex flex-col items-center rounded-lg border-b px-6 py-4 shadow-xs">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-[#15599a]" />
              <p className="text-center text-2xl font-black text-[#15599a] uppercase">
                RELATÓRIO GERAL
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
                before: queryParams.period?.before
                  ? new Date(queryParams.period.before)
                  : undefined,
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
      {isLoading ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess ? (
        <>
          <OverallReportGeneralStats generalData={report?.geral} />
        </>
      ) : null}
    </div>
  );
}
