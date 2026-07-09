import {
  ChartArea,
  CircleCheck,
  CircleDashed,
  CircleX,
  DraftingCompass,
  GitPullRequestArrow,
  Network,
} from "lucide-react";
import DateIntervalInput from "@/components/inputs/DateIntervalInput";
import { formatDecimalPlaces } from "@/utils/constants";
import { useEngineeringSectorStats } from "@/utils/methods/query/stats";

function EngineeringStats() {
  const { data: stats, queryParams, updateQueryParams } = useEngineeringSectorStats({});
  return (
    <div className="border-border flex w-full flex-col gap-2 rounded-xl border p-3 shadow-xs">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <ChartArea className="h-4 min-h-4 w-4 min-w-4" />
          <h1 className="text-xs font-medium tracking-tight uppercase">ESTATÍSTICAS</h1>
        </div>
        <DateIntervalInput
          label="Período"
          labelClassName="text-xs font-medium leading-none tracking-tight"
          className="h-fit border-none p-0 px-2 py-0.5 shadow-none"
          value={{
            after: queryParams.after ? new Date(queryParams.after) : undefined,
            before: queryParams.before ? new Date(queryParams.before) : undefined,
          }}
          handleChange={(v) =>
            updateQueryParams({
              after: v.after ? v.after.toISOString() : undefined,
              before: v.before ? v.before.toISOString() : undefined,
            })
          }
        />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
        <div className="bg-background border-border flex min-h-[130px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
          <div className="flex items-center justify-between">
            <h1 className="text-xs font-medium tracking-tight uppercase">EM ANDAMENTO</h1>
            <CircleDashed className="h-4 min-h-4 w-4 min-w-4" />
          </div>
          <div className="flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">{stats?.emAndamento.qtde}</div>
            <p className="text-foreground text-xs">
              {formatDecimalPlaces(stats?.emAndamento.potencia || 0)} kWp
            </p>
          </div>
        </div>
        <div className="bg-background border-border flex min-h-[130px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
          <div className="flex items-center justify-between">
            <h1 className="text-xs font-medium tracking-tight uppercase">
              HOMOLOGAÇÕES SOLICITADAS
            </h1>
            <GitPullRequestArrow className="h-4 min-h-4 w-4 min-w-4" />
          </div>
          <div className="flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">
              {stats?.homologacoesSolicitadas.qtde}
            </div>
            <p className="text-foreground text-xs">
              {formatDecimalPlaces(stats?.homologacoesSolicitadas.potencia || 0)} kWp
            </p>
            <p className="text-foreground text-xs">
              {formatDecimalPlaces(stats?.homologacoesSolicitadas.tempoMedio || 0)} HORAS (MÉDIA)
            </p>
          </div>
        </div>
        <div className="bg-background border-border flex min-h-[130px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
          <div className="flex items-center justify-between">
            <h1 className="text-xs font-medium tracking-tight uppercase">
              HOMOLOGAÇÕES EFETIVADAS
            </h1>
            <CircleCheck className="h-4 min-h-4 w-4 min-w-4" />
          </div>
          <div className="flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">
              {stats?.homologacoesEfetivadas.qtde}
            </div>
            <p className="text-foreground text-xs">
              {formatDecimalPlaces(stats?.homologacoesEfetivadas.potencia || 0)} kWp
            </p>
            <p className="text-foreground text-xs">
              {formatDecimalPlaces(stats?.homologacoesEfetivadas.tempoMedio || 0)} HORAS (MÉDIA)
            </p>
          </div>
        </div>
        <div className="bg-background border-border flex min-h-[130px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
          <div className="flex items-center justify-between">
            <h1 className="text-xs font-medium tracking-tight uppercase">
              HOMOLOGAÇÕES REPROVADAS
            </h1>
            <CircleX className="h-4 min-h-4 w-4 min-w-4" />
          </div>
          <div className="flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">
              {stats?.homologacoesReprovadas.qtde}
            </div>
            <p className="text-foreground text-xs">
              {formatDecimalPlaces(stats?.homologacoesReprovadas.potencia || 0)} kWp
            </p>
          </div>
        </div>
        <div className="bg-background border-border flex min-h-[130px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
          <div className="flex items-center justify-between">
            <h1 className="text-xs font-medium tracking-tight uppercase">VISTORIAS SOLICITADAS</h1>
            <CircleX className="h-4 min-h-4 w-4 min-w-4" />
          </div>
          <div className="flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">
              {stats?.vistoriasSolicitadas.qtde}
            </div>
            <p className="text-foreground text-xs">
              {formatDecimalPlaces(stats?.vistoriasSolicitadas.potencia || 0)} kWp
            </p>
            <p className="text-foreground text-xs">
              {formatDecimalPlaces(stats?.vistoriasSolicitadas.tempoMedio || 0)} HORAS (MÉDIA)
            </p>
          </div>
        </div>
        <div className="bg-background border-border flex min-h-[130px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
          <div className="flex items-center justify-between">
            <h1 className="text-xs font-medium tracking-tight uppercase">VISTORIAS EFETIVADAS</h1>
            <CircleCheck className="h-4 min-h-4 w-4 min-w-4" />
          </div>
          <div className="flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">
              {stats?.vistoriasEfetivadas.qtde}
            </div>
            <p className="text-foreground text-xs">
              {formatDecimalPlaces(stats?.vistoriasEfetivadas.potencia || 0)} kWp
            </p>
            <p className="text-foreground text-xs">
              {formatDecimalPlaces(stats?.vistoriasEfetivadas.tempoMedio || 0)} HORAS (MÉDIA)
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
        <div className="bg-background border-border flex w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/2">
          <div className="flex items-center justify-between">
            <h1 className="text-xs font-medium tracking-tight uppercase">
              DESENHOS EXECUTIVOS FEITOS
            </h1>
            <DraftingCompass className="h-4 min-h-4 w-4 min-w-4" />
          </div>
          <div className="flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">
              {stats?.desenhosExecutivosFeitos}
            </div>
          </div>
        </div>
        <div className="bg-background border-border flex w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/2">
          <div className="flex items-center justify-between">
            <h1 className="text-xs font-medium tracking-tight uppercase">
              DIAGRAMAS EXECUTIVOS FEITOS
            </h1>
            <Network className="h-4 min-h-4 w-4 min-w-4" />
          </div>
          <div className="flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">
              {stats?.desenhosExecutivosFeitos}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EngineeringStats;
