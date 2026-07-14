import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useClientProfileReport } from "@/utils/methods/query/stats";
import {
  SEGMENT_DIMENSION_LABELS,
  type TReportSegmentDimension,
  useReportFiltersStore,
} from "@/utils/stores/report-filters-store";
import { Briefcase, Cake, ChevronRight, CreditCard, DollarSign, Info, Loader2, MapPin, MapPinned, Users, Wallet, X } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts";
import { MdDashboard } from "react-icons/md";

/**
 * Relatório de perfil dos clientes (sexo, idade, valor de projeto, profissões
 * e forma de pagamento) com cruzamento interativo: clicar em uma barra de
 * qualquer gráfico restringe todos os demais àquele recorte (estilo facet).
 * O segmento vive na store global, então o recorte reflete em todas as abas.
 */

type TDistributionItem = { titulo: string; qtde: number; percentual: number };

const chartConfig = {
  qtde: {
    label: "Projetos",
    theme: { light: "#2a78d6", dark: "#3987e5" },
  },
} satisfies ChartConfig;

function ClientProfileReport() {
  const projectTypes = useReportFiltersStore((s) => s.projectTypes);
  const period = useReportFiltersStore((s) => s.period);
  const locationFilter = useReportFiltersStore((s) => s.location);
  const segment = useReportFiltersStore((s) => s.segment);
  const hasHydrated = useReportFiltersStore((s) => s.hasHydrated);
  const toggleSegmentValue = useReportFiltersStore((s) => s.toggleSegmentValue);
  const removeSegmentValue = useReportFiltersStore((s) => s.removeSegmentValue);
  const clearSegment = useReportFiltersStore((s) => s.clearSegment);
  const setLocation = useReportFiltersStore((s) => s.setLocation);

  const { data: profile, isLoading, isError, error, isFetching } = useClientProfileReport({
    params: { projectTypes, period, location: locationFilter, segment },
    enabled: hasHydrated,
  });

  const activeSegments = (Object.entries(segment) as [TReportSegmentDimension, string | null | undefined][]).filter(
    ([, value]) => !!value,
  );

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent msg={getErrorMessage(error)} />;
  if (!profile) return null;

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Barra de recorte ativo */}
      <div className="bg-background flex w-full flex-col gap-2 rounded-sm border border-gray-400 p-3 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <Info className="text-muted-foreground h-4 min-h-4 w-4 min-w-4" />
          <p className="text-muted-foreground text-xs">
            Clique nas barras dos gráficos para cruzar as dimensões — os demais gráficos se adaptam ao recorte
            selecionado e o resultado reflete em todas as abas.
          </p>
          {isFetching ? <Loader2 className="text-muted-foreground h-3.5 w-3.5 animate-spin" /> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {activeSegments.length === 0 ? (
            <p className="text-muted-foreground text-xs font-medium">SEM RECORTE APLICADO</p>
          ) : (
            <>
              {activeSegments.map(([dimension, value]) => (
                <button
                  key={dimension}
                  type="button"
                  onClick={() => removeSegmentValue(dimension)}
                  className="bg-primary/90 text-primary-foreground hover:bg-primary flex items-center gap-1.5 rounded-lg px-2 py-1"
                >
                  <p className="text-[0.65rem] font-medium">
                    {SEGMENT_DIMENSION_LABELS[dimension]}: {value}
                  </p>
                  <X className="h-3 w-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => clearSegment()}
                className="text-muted-foreground hover:text-foreground text-xs font-medium underline-offset-2 hover:underline"
              >
                LIMPAR
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPIs do recorte */}
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={<MdDashboard className="h-4 min-h-4 w-4 min-w-4" />}
          label="PROJETOS NO RECORTE"
          value={`${profile.amostra.qtdeProjetosFiltrados}`}
          detail={
            activeSegments.length > 0 ? `de ${profile.amostra.qtdeProjetos} projetos no período` : "todos do período"
          }
        />
        <StatTile
          icon={<Cake className="h-4 min-h-4 w-4 min-w-4" />}
          label="IDADE MÉDIA"
          value={profile.idade.qtdeInformada > 0 ? `${formatDecimalPlaces(profile.idade.media, 0, 1)} anos` : "-"}
          detail={`mediana de ${formatDecimalPlaces(profile.idade.mediana, 0, 0)} anos · ${profile.idade.qtdeInformada} com idade informada`}
        />
        <StatTile
          icon={<DollarSign className="h-4 min-h-4 w-4 min-w-4" />}
          label="VALOR MÉDIO DE PROJETO"
          value={formatToMoney(profile.valor.media)}
          detail={`mediana de ${formatToMoney(profile.valor.mediana)}`}
        />
        <StatTile
          icon={<Wallet className="h-4 min-h-4 w-4 min-w-4" />}
          label="VALOR TOTAL DE PROJETOS"
          value={formatToMoney(profile.valor.total)}
          detail="soma dos projetos no recorte"
        />
      </div>

      {/* Resumo geográfico da amostra filtrada */}
      <GeographySummary
        geografia={profile.geografia}
        totalAmostra={profile.amostra.qtdeProjetosFiltrados}
        onSelectLocation={(cidade, estado) => setLocation({ estado, cidade })}
      />

      {/* Distribuições */}
      <div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
        <ChartCard
          icon={<Users className="h-4 min-h-4 w-4 min-w-4" />}
          title="SEXO"
          subtitle="Estimado a partir do primeiro nome do titular do contrato (CNPJs entram como indeterminado)"
        >
          <DistributionBarList
            items={profile.sexo.distribuicao}
            selected={segment.sexo}
            onSelect={(value) => toggleSegmentValue("sexo", value)}
          />
        </ChartCard>
        <ChartCard
          icon={<CreditCard className="h-4 min-h-4 w-4 min-w-4" />}
          title="FORMA DE PAGAMENTO"
          subtitle="Distribuição dos projetos por método de pagamento negociado"
        >
          <DistributionBarList
            items={profile.pagamento.distribuicao}
            selected={segment.formaPagamento}
            onSelect={(value) => toggleSegmentValue("formaPagamento", value)}
          />
        </ChartCard>
        <ChartCard
          icon={<Cake className="h-4 min-h-4 w-4 min-w-4" />}
          title="DISTRIBUIÇÃO DE IDADE"
          subtitle={`Idade na assinatura do contrato · ${profile.idade.qtdeNaoInformada} sem data de nascimento informada`}
        >
          <DistributionHistogram
            items={profile.idade.distribuicao}
            selected={segment.faixaEtaria}
            onSelect={(value) => toggleSegmentValue("faixaEtaria", value)}
          />
        </ChartCard>
        <ChartCard
          icon={<DollarSign className="h-4 min-h-4 w-4 min-w-4" />}
          title="DISTRIBUIÇÃO DE VALOR DE PROJETO"
          subtitle="Valor total do projeto (sistema, padrão, estrutura, O&M e seguro)"
        >
          <DistributionHistogram
            items={profile.valor.distribuicao}
            selected={segment.faixaValor}
            onSelect={(value) => toggleSegmentValue("faixaValor", value)}
          />
        </ChartCard>
      </div>
      <ChartCard
        icon={<Briefcase className="h-4 min-h-4 w-4 min-w-4" />}
        title="PROFISSÕES MAIS COMUNS"
        subtitle={`Top 5 entre os clientes com profissão informada (${profile.profissoes.qtdeInformada} informadas · ${profile.profissoes.qtdeNaoInformada} não informadas)`}
      >
        {profile.profissoes.top.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            Nenhuma profissão informada para o recorte selecionado.
          </p>
        ) : (
          <DistributionBarList
            items={profile.profissoes.top}
            selected={segment.profissao}
            onSelect={(value) => toggleSegmentValue("profissao", value)}
          />
        )}
      </ChartCard>
    </div>
  );
}
export default ClientProfileReport;

type StatTileProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail?: string;
};
function StatTile({ icon, label, value, detail }: StatTileProps) {
  return (
    <div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-bold tracking-tight">{label}</h2>
      </div>
      <div className="flex w-full flex-col items-center gap-1">
        <h1 className="text-lg font-bold tracking-tight">{value}</h1>
        {detail ? <p className="text-muted-foreground text-center text-[0.65rem]">{detail}</p> : null}
      </div>
    </div>
  );
}

type GeographySummaryProps = {
  geografia: {
    totalCidades: number;
    totalEstados: number;
    projetosComLocalizacao: number;
    projetosSemLocalizacao: number;
    top: { cidade: string; estado: string; qtde: number }[];
    coberturaPercentual: number;
  };
  totalAmostra: number;
  onSelectLocation: (cidade: string, estado: string) => void;
};
function GeographySummary({ geografia, totalAmostra, onSelectLocation }: GeographySummaryProps) {
  return (
    <div className="bg-background flex w-full flex-col gap-3 rounded-sm border border-gray-400 p-4 shadow-xs">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-2">
          <MapPinned className="h-4 min-h-4 w-4 min-w-4" />
          <h2 className="text-sm font-bold tracking-tight">DISTRIBUIÇÃO GEOGRÁFICA DO RECORTE</h2>
        </div>
        <p className="text-muted-foreground text-xs">
          Calculada a partir da amostra filtrada. Clique em uma localidade para aplicar o filtro em todas as abas.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MiniStat label="CIDADES" value={`${geografia.totalCidades}`} />
        <MiniStat label="ESTADOS" value={`${geografia.totalEstados}`} />
        <MiniStat
          label="COM LOCALIZAÇÃO"
          value={`${geografia.projetosComLocalizacao}`}
          detail={`${geografia.projetosSemLocalizacao} sem localização`}
        />
        <MiniStat label="COBERTURA" value={`${formatDecimalPlaces(geografia.coberturaPercentual, 0, 1)}%`} detail={`de ${totalAmostra} projetos`} />
      </div>
      {geografia.top.length > 0 ? (
        <div className="flex w-full flex-col gap-1">
          <p className="text-muted-foreground text-[0.65rem] font-semibold">TOP LOCALIDADES</p>
          {geografia.top.map((item) => (
            <button
              key={`${item.cidade}::${item.estado}`}
              type="button"
              onClick={() => onSelectLocation(item.cidade, item.estado)}
              className="hover:bg-muted/60 group flex w-full items-center justify-between gap-2 rounded-md p-1.5 text-left transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="text-primary h-3.5 w-3.5" />
                <span className="text-xs font-medium">{item.cidade}</span>
                <span className="text-muted-foreground text-[0.65rem]">{item.estado}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-xs font-bold tabular-nums">{item.qtde}</span>
                <ChevronRight className="text-muted-foreground h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-2 text-center text-xs">Nenhum projeto do recorte possui cidade/UF informadas.</p>
      )}
    </div>
  );
}

function MiniStat({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="bg-muted/30 flex flex-col items-center gap-0.5 rounded-lg border border-gray-300 p-2 dark:border-gray-700">
      <p className="text-muted-foreground text-[0.6rem] font-semibold">{label}</p>
      <p className="text-base font-bold tabular-nums">{value}</p>
      {detail ? <p className="text-muted-foreground text-center text-[0.6rem]">{detail}</p> : null}
    </div>
  );
}

type ChartCardProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};
function ChartCard({ icon, title, subtitle, children }: ChartCardProps) {
  return (
    <div className="bg-background flex w-full flex-col gap-3 rounded-sm border border-gray-400 p-4 shadow-xs">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-bold tracking-tight">{title}</h2>
        </div>
        <p className="text-muted-foreground text-xs">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

type DistributionBarListProps = {
  items: TDistributionItem[];
  selected?: string | null;
  onSelect: (value: string) => void;
};
function DistributionBarList({ items, selected, onSelect }: DistributionBarListProps) {
  const maxQtde = Math.max(...items.map((item) => item.qtde), 1);
  return (
    <div className="flex w-full flex-col gap-1">
      {items.map((item) => {
        const isMuted = !!selected && selected !== item.titulo;
        return (
          <button
            key={item.titulo}
            type="button"
            onClick={() => onSelect(item.titulo)}
            className="hover:bg-muted/60 flex w-full cursor-pointer flex-col gap-1 rounded-md p-1.5 text-left transition-colors"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <p className={`truncate text-xs font-medium ${isMuted ? "text-muted-foreground" : ""}`}>{item.titulo}</p>
              <p className="text-xs font-bold whitespace-nowrap">
                {item.qtde}
                <span className="text-muted-foreground ml-1 font-medium">
                  ({formatDecimalPlaces(item.percentual, 0, 1)}%)
                </span>
              </p>
            </div>
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div
                className={`h-2 rounded-full bg-[#2a78d6] transition-all dark:bg-[#3987e5] ${isMuted ? "opacity-25" : ""}`}
                style={{ width: `${(item.qtde / maxQtde) * 100}%` }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}

type DistributionHistogramProps = {
  items: TDistributionItem[];
  selected?: string | null;
  onSelect: (value: string) => void;
};
function DistributionHistogram({ items, selected, onSelect }: DistributionHistogramProps) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
      <BarChart data={items} margin={{ top: 20, left: 8, right: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="titulo" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} interval={0} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, _name, entry) => {
                const percentual = (entry?.payload as TDistributionItem | undefined)?.percentual ?? 0;
                return `${value} projetos (${formatDecimalPlaces(percentual, 0, 1)}%)`;
              }}
            />
          }
        />
        <Bar
          dataKey="qtde"
          radius={[4, 4, 0, 0]}
          className="cursor-pointer"
          onClick={(barData: { payload?: TDistributionItem }) => {
            const titulo = barData?.payload?.titulo;
            if (titulo) onSelect(titulo);
          }}
        >
          <LabelList dataKey="qtde" position="top" className="fill-foreground" fontSize={11} />
          {items.map((item) => (
            <Cell
              key={item.titulo}
              fill="var(--color-qtde)"
              fillOpacity={selected && selected !== item.titulo ? 0.25 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
