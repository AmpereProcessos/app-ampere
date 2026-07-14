import DateIntervalInput from "@/components/inputs/DateIntervalInput";
import { useSession } from "@/components/providers/SessionProvider";
import LoadingComponent from "@/components/utils/LoadingComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import type { TAuthSession } from "@/lib/authentication/types";
import { useOverallReport } from "@/utils/methods/query/stats";

import { BarChart3, ChartPie, Gauge, Map, MapPin, X } from "lucide-react";

import ClientProfileReport from "@/components/identificador/estatisticas/overall-report/ClientProfile";
import OverallReportGeneralStats from "@/components/identificador/estatisticas/overall-report/General";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import { serviceTypes } from "@/utils/select-options";
import {
  SEGMENT_DIMENSION_LABELS,
  type TReportSegmentDimension,
  useReportFiltersStore,
} from "@/utils/stores/report-filters-store";
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
  const projectTypes = useReportFiltersStore((s) => s.projectTypes);
  const period = useReportFiltersStore((s) => s.period);
  const location = useReportFiltersStore((s) => s.location);
  const segment = useReportFiltersStore((s) => s.segment);
  const hasHydrated = useReportFiltersStore((s) => s.hasHydrated);
  const setProjectTypes = useReportFiltersStore((s) => s.setProjectTypes);
  const setPeriod = useReportFiltersStore((s) => s.setPeriod);
  const setEstado = useReportFiltersStore((s) => s.setEstado);
  const setCidade = useReportFiltersStore((s) => s.setCidade);
  const removeSegmentValue = useReportFiltersStore((s) => s.removeSegmentValue);
  const resetFilters = useReportFiltersStore((s) => s.resetFilters);

  const {
    data: report,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useOverallReport({
    params: { projectTypes, period, location, segment },
    enabled: hasHydrated,
  });

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

  // Chips de filtros ativos (localidade + segmentos do Perfil)
  const segmentChips = (Object.entries(segment) as [TReportSegmentDimension, string | null | undefined][])
    .filter(([, value]) => !!value)
    .map(([dimension, value]) => ({
      key: `segment-${dimension}`,
      label: `${SEGMENT_DIMENSION_LABELS[dimension]}: ${value}`,
      onRemove: () => removeSegmentValue(dimension),
    }));
  const locationChips = [
    ...(location.estado ? [{ key: "uf", label: `UF: ${location.estado}`, onRemove: () => setEstado(undefined) }] : []),
    ...(location.cidade ? [{ key: "cidade", label: `CIDADE: ${location.cidade}`, onRemove: () => setCidade(undefined) }] : []),
  ];
  const activeChips = [...locationChips, ...segmentChips];

  if (!hasHydrated) return <LoadingPage />;

  return (
    <div className="flex min-h-screen grow flex-col p-6">
      {/* Header com filtros compartilhados entre as abas */}
      <div className="bg-background border-border mb-6 flex flex-col gap-3 rounded-lg border-b px-6 py-4 shadow-xs">
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-[#15599a]" />
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">RELATÓRIO GERAL</p>
          </div>
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-[250px]">
              <MultipleSelectInput
                label="TIPOS DE SERVIÇO"
                selected={projectTypes}
                handleChange={(v) => setProjectTypes(v as string[])}
                options={serviceTypes}
                selectedItemLabel="SEM FILTRO"
                onReset={() => setProjectTypes([])}
                width="100%"
              />
            </div>
            <DateIntervalInput
              label="PERÍODO"
              value={{
                after: period?.after ? new Date(period.after) : undefined,
                before: period?.before ? new Date(period.before) : undefined,
              }}
              handleChange={(v) =>
                setPeriod({
                  after: v.after ? v.after.toISOString() : undefined,
                  before: v.before ? v.before.toISOString() : undefined,
                })
              }
              presets={reportPeriodPresets}
            />
          </div>
        </div>

        {/* Chips de filtros ativos vindos do mapa, ranking ou perfil */}
        {activeChips.length > 0 ? (
          <div className="border-border flex w-full flex-wrap items-center gap-2 border-t pt-3">
            <span className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
              <MapPin className="h-3.5 w-3.5" /> FILTROS ATIVOS:
            </span>
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                className="bg-primary/90 text-primary-foreground hover:bg-primary flex items-center gap-1.5 rounded-lg px-2 py-1"
              >
                <span className="text-[0.65rem] font-medium">{chip.label}</span>
                <X className="h-3 w-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={resetFilters}
              className="text-muted-foreground hover:text-foreground text-xs font-medium underline-offset-2 hover:underline"
            >
              LIMPAR FILTROS
            </button>
          </div>
        ) : null}
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
          <ClientProfileReport />
        </TabsContent>
        <TabsContent value="geografia">
          <GeographicReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
