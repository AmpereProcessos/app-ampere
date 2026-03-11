import { SESSION_COOKIE_NAME } from "@/config";
import ClientsBirthdays from "@/components/identificador/dashboard/ClientsBirthdays";
import SalesRanking from "@/components/identificador/resultados/SalesRanking";
import SDRRanking from "@/components/identificador/resultados/SdrRanking";
import { useSession } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import type { TSession } from "@/utils/schemas/session";
import { TEmployee } from "@/utils/schemas/users";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { useDashboardStats, useGraphsStats, useOverallReport } from "@/utils/methods/query/stats";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import dayjs from "dayjs";
import {
  BadgeDollarSign,
  Check,
  CirclePlus,
  Clock,
  Play,
  Star,
  TrendingDown,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Label,
  PolarGrid,
  PolarRadiusAxis,
  XAxis,
  YAxis,
} from "recharts";
import type { GetServerSideProps } from "next";
import { ObjectId } from "mongodb";
import { RadialBar, RadialBarChart } from "recharts";

async function getViewTypeFromToken(token: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const admDb = await connectToAdministrationDatabase();
  const sessionsCollection = admDb.collection<TSession>("sessoes-usuarios");
  const usersCollection = admDb.collection<TEmployee>("colaboradores");

  const session = await sessionsCollection.findOne({ sessaoId: sessionId });
  if (!session) return null;

  if (Date.now() > new Date(session.dataExpiracao).getTime()) {
    await sessionsCollection.deleteOne({ sessaoId: session.sessaoId });
    return null;
  }

  if (dayjs().add(15, "days").isAfter(dayjs(session.dataExpiracao))) {
    await sessionsCollection.updateOne(
      { sessaoId: sessionId },
      { $set: { dataExpiracao: dayjs().add(15, "days").toISOString() } },
    );
  }

  const user = await usersCollection.findOne({ _id: new ObjectId(session.usuarioId) });
  return user?.visualizacao?.tipo ?? null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authCookie = context.req.cookies[SESSION_COOKIE_NAME];
  if (!authCookie) return { props: {} };

  const viewType = await getViewTypeFromToken(authCookie);
  if (viewType === "EXECUÇÃO") {
    return {
      redirect: {
        destination: "/ordens-de-servico/roteiro",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default function HomePage() {
  const { session, status } = useSession();

  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;

  return <HomeContent user={session.user} />;
}

type HomePageProps = {
  user: TAuthSession["user"];
};
function HomeContent({ user: _user }: HomePageProps) {
  return (
    <div className="bg-background flex grow flex-col gap-6 p-6">
      <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row lg:items-stretch">
        <div className="w-full lg:w-1/2">
          <SalesRanking />
        </div>
        <div className="w-full lg:w-1/2">
          <SDRRanking />
        </div>
      </div>
      <HomePageGeneralStats />
      <ClientsBirthdays />
    </div>
  );
}

function HomePageGeneralStats() {
  console.log("TESTING");
  const {
    data: stats,
    isLoading: _isLoading,
    isSuccess: _isSuccess,
    isError: _isError,
  } = useDashboardStats();

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row lg:items-stretch">
        <div className="w-full lg:w-1/2">
          <NPSStat value={stats?.nps ?? 0} />
        </div>
        <div className="w-full lg:w-1/2">
          <GraphsStats />
        </div>
      </div>
      {/**COMERCIAL */}
      <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
        <CardStat
          title="PROJETOS VENDIDOS"
          icon={<CirclePlus className="h-4 min-h-4 w-4 min-w-4" />}
          current={stats?.comercial.qtdeVendida.atual ?? 0}
          previous={stats?.comercial.qtdeVendida.anterior ?? 0}
          className="w-full lg:w-1/2"
        />
        <CardStat
          title="POTÊNCIA VENDIDA"
          icon={<Zap className="h-4 min-h-4 w-4 min-w-4" />}
          current={stats?.comercial.potenciaVendidaUFV.atual ?? 0}
          previous={stats?.comercial.potenciaVendidaUFV.anterior ?? 0}
          formatCurrent={(n) => `${formatDecimalPlaces(n)}kWp`}
          formatPrevious={(n) => `${formatDecimalPlaces(n)}kWp`}
          className="w-full lg:w-1/2"
        />
      </div>
      {/**SUPRIMENTOS */}
      <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
        <CardStat
          title="PEDIDOS FEITOS"
          icon={<CirclePlus className="h-4 min-h-4 w-4 min-w-4" />}
          current={stats?.suprimentos.qtdePedidos.atual ?? 0}
          previous={stats?.suprimentos.qtdePedidos.anterior ?? 0}
          className="w-full lg:w-1/3"
        />
        <CardStat
          title="ENTREGAS EFETIVADAS"
          icon={<Truck className="h-4 min-h-4 w-4 min-w-4" />}
          current={stats?.suprimentos.qtdeEntregas.atual ?? 0}
          previous={stats?.suprimentos.qtdeEntregas.anterior ?? 0}
          className="w-full lg:w-1/3"
        />
        <CardStat
          title="TEMPO MÉDIO DE ENTREGA"
          icon={<Clock className="h-4 min-h-4 w-4 min-w-4" />}
          current={stats?.suprimentos.tempoMedioEntrega.atual ?? 0}
          previous={stats?.suprimentos.tempoMedioEntrega.anterior ?? 0}
          formatCurrent={(n) => `${formatDecimalPlaces(n)}d`}
          formatPrevious={(n) => `${formatDecimalPlaces(n)}d`}
          lowerIsBetter
          className="w-full lg:w-1/3"
        />
      </div>
      {/**EXECUÇÃO */}
      <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
        <CardStat
          title="OBRAS INICIADAS"
          icon={<Play className="h-4 min-h-4 w-4 min-w-4" />}
          current={stats?.execucao.qtdeIniciados.atual ?? 0}
          previous={stats?.execucao.qtdeIniciados.anterior ?? 0}
          className="w-full lg:w-1/3"
        />
        <CardStat
          title="OBRAS CONCLUÍDAS"
          icon={<Check className="h-4 min-h-4 w-4 min-w-4" />}
          current={stats?.execucao.qtdeConcluidos.atual ?? 0}
          previous={stats?.execucao.qtdeConcluidos.anterior ?? 0}
          className="w-full lg:w-1/3"
        />
        <CardStat
          title="TEMPO MÉDIO DE EXECUÇÃO"
          icon={<Clock className="h-4 min-h-4 w-4 min-w-4" />}
          current={stats?.execucao.tempoMedioExecucao.atual ?? 0}
          previous={stats?.execucao.tempoMedioExecucao.anterior ?? 0}
          formatCurrent={(n) => `${formatDecimalPlaces(n)}d`}
          formatPrevious={(n) => `${formatDecimalPlaces(n)}d`}
          lowerIsBetter
          className="w-full lg:w-1/3"
        />
      </div>
    </div>
  );
}

function GraphsStats() {
  const { data: graphsStats, queryKey, queryParams, updateQueryParams } = useGraphsStats({});

  const METRIC_LABELS = {
    SALE_VALUE: {
      title: "VALOR VENDIDO",
      chartLabel: "VALOR (R$)",
      valorFormatting: (value: number) => `${formatToMoney(value)}`,
      icon: <BadgeDollarSign className="h-4 min-h-4 w-4 min-w-4" />,
    },
    SALE_QUANTITY: {
      title: "PROJETOS VENDIDOS",
      chartLabel: "PROJETOS",
      valorFormatting: (value: number) => String(value),
      icon: <CirclePlus className="h-4 min-h-4 w-4 min-w-4" />,
    },
    SALE_UFV_POWER: {
      title: "POTÊNCIA VENDIDA",
      chartLabel: "POTÊNCIA (kWp)",
      valorFormatting: (value: number) => `${formatDecimalPlaces(value)}kWp`,
      icon: <Zap className="h-4 min-h-4 w-4 min-w-4" />,
    },
  };
  const firstPeriodChartConfig = {
    identificador: {
      color: "#15599a",
      label: "Identificador",
    },
    valor: {
      label: METRIC_LABELS[queryParams.metric].chartLabel,
      color: "#15599a",
    },
  };
  return (
    <div className="bg-card border-primary/20 flex w-full flex-col gap-3 rounded-xl border px-3 py-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h1 className="text-xs font-medium tracking-tight uppercase">
          {METRIC_LABELS[queryParams.metric].title}
        </h1>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={queryParams.metric === "SALE_UFV_POWER" ? "default" : "ghost"}
                size="fit"
                className="rounded-lg p-2"
                onClick={() => updateQueryParams({ metric: "SALE_UFV_POWER" })}
              >
                <Zap className="h-4 min-h-4 w-4 min-w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>POTÊNCIA VENDIDA</p>
            </TooltipContent>
          </Tooltip>

          {/* DISABLED FOR NOW <Button variant="ghost" size="icon" onClick={() => updateQueryParams({ metric: 'SALE_VALUE' })}>
            <BadgeDollarSign className="h-4 min-h-4 w-4 min-w-4" />
          </Button> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={queryParams.metric === "SALE_QUANTITY" ? "default" : "ghost"}
                size="fit"
                className="rounded-lg p-2"
                onClick={() => updateQueryParams({ metric: "SALE_QUANTITY" })}
              >
                <CirclePlus className="h-4 min-h-4 w-4 min-w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>PROJETOS VENDIDOS</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex w-full items-center gap-4">
        <div className="flex max-h-[400px] min-h-[400px] w-full items-center justify-center lg:max-h-[350px] lg:min-h-[350px]">
          <ChartContainer
            config={firstPeriodChartConfig}
            className="aspect-auto h-[350px] w-full lg:h-[250px]"
          >
            <ComposedChart
              data={graphsStats?.ATUAL || []}
              margin={{
                top: 0,
                right: 15,
                left: 15,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="firstGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="10%"
                    stopColor={firstPeriodChartConfig.valor.color}
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="90%"
                    stopColor={firstPeriodChartConfig.valor.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="identificador"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                // tickFormatter={(value) => formatDateAsLocale(value) || ''}
                interval="preserveStartEnd" // Mostra primeiro e último valor
                angle={-15} // Rotaciona os labels para melhor legibilidade
                textAnchor="end" // Alinhamento do texto
              />
              <YAxis
                orientation="left"
                tickFormatter={(value) => METRIC_LABELS[queryParams.metric].valorFormatting(value)}
                stroke={firstPeriodChartConfig.valor.color}
              />

              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="valor"
                type="monotone"
                fill="url(#firstGradient)"
                stroke={firstPeriodChartConfig.valor.color}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </ComposedChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

function NPSStat({ value }: { value: number }) {
  // Clamp value between 0 and 100 for the chart
  const chartValue = Math.max(0, Math.min(100, value));
  const chartData = [
    {
      name: "NPS",
      value: chartValue,
      fill: "#15599a",
    },
  ];

  const chartConfig = {
    name: {
      color: "#15599a",
      label: "NPS",
    },
    value: {
      label: "NPS",
      color: "#15599a",
    },
  };
  return (
    <div className="bg-card border-primary/20 flex h-full min-h-fit w-full flex-col gap-3 rounded-xl border px-3 py-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h1 className="text-xs font-medium tracking-tight uppercase">SATISFAÇÃO DO CLIENTE</h1>
        <div className="flex items-center gap-2">
          <Star className="h-4 min-h-4 w-4 min-w-4" />
        </div>
      </div>
      <div className="flex w-full flex-1 items-center justify-center gap-4">
        <div className="flex h-[350px] w-[350px] items-center justify-center">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <RadialBarChart
              data={chartData}
              startAngle={0}
              endAngle={250}
              innerRadius={80}
              outerRadius={110}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
              />
              <RadialBar dataKey="value" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-4xl font-bold"
                          >
                            {formatDecimalPlaces(chartData[0].value)}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            NPS
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

type CardStatProps = {
  title: string;
  icon: React.ReactNode;
  current: number;
  previous: number;
  formatCurrent?: (n: number) => string;
  formatPrevious?: (n: number) => string;
  lowerIsBetter?: boolean;
  className?: string;
};
function CardStat({
  title,
  icon,
  current,
  previous,
  formatCurrent,
  formatPrevious,
  lowerIsBetter,
  className,
}: CardStatProps) {
  const change = (() => {
    if (previous === 0) {
      if (current === 0) return 0;
      return 100;
    }
    return ((current - previous) / Math.abs(previous)) * 100;
  })();

  const isGood = lowerIsBetter ? change < 0 : change > 0;
  const isNeutral = change === 0;
  const changeAbs = Math.abs(change);
  console.log(change, changeAbs, isGood, isNeutral);
  return (
    <div
      className={cn(
        "bg-card border-primary/20 flex w-full flex-col gap-1 rounded-xl border px-3 py-4 shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xs font-medium tracking-tight uppercase">{title}</h1>
        <div className="flex items-center gap-2">
          {!isNeutral && (
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.65rem] font-bold",
                isGood ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700",
              )}
            >
              {isGood ? (
                <TrendingUp className="h-3 min-h-3 w-3 min-w-3" />
              ) : (
                <TrendingDown className="h-3 min-h-3 w-3 min-w-3" />
              )}
              {formatDecimalPlaces(changeAbs)}%
            </div>
          )}
          {icon}
        </div>
      </div>
      <div className="flex w-full flex-col">
        <div className="text-2xl font-bold text-[#15599a] dark:text-[#fead61]">
          {formatCurrent ? formatCurrent(current) : String(current)}
        </div>
        <p className="text-primary/60 text-xs tracking-tight">
          NO MÊS ANTERIOR: {formatPrevious ? formatPrevious(previous) : String(previous || 0)}
        </p>
      </div>
    </div>
  );
}
