import { Button } from "@/components/ui/button";
import { Map, MapClusterLayer, MapControls, MapPopup, useMap } from "@/components/ui/map";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorComponent from "@/components/utils/ErrorComponent";
import type {
  TGeographicMetric,
  TGeographicReportOutput,
} from "@/pages/api/stats/geographic-report";
import type { TOverallReportInput } from "@/pages/api/stats/overall-report";
import { useGeographicReport } from "@/utils/methods/query/stats";
import { getErrorMessage } from "@/utils/methods/handlers";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { AlertTriangle, Building2, Crosshair, MapPinned, MapPin, PackageCheck, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type GeographicLocation = TGeographicReportOutput["data"]["locations"][number];

type GeographicReportProps = {
  projectTypes: string[];
  period: TOverallReportInput["period"];
};

const metricOptions: Array<{
  value: TGeographicMetric;
  label: string;
  shortLabel: string;
}> = [
  { value: "SALES", label: "Vendas", shortLabel: "projetos vendidos" },
  { value: "EXECUTIONS", label: "Serviços executados", shortLabel: "serviços executados" },
  { value: "HOMOLOGATIONS", label: "Homologações", shortLabel: "homologações" },
  { value: "SUPPLIES", label: "Suprimentos", shortLabel: "movimentações" },
];

function MapFocus({ location }: { location: GeographicLocation | null }) {
  const { map } = useMap();

  useEffect(() => {
    if (!map || !location?.mapeada || location.longitude === null || location.latitude === null) return;
    map.flyTo({ center: [location.longitude, location.latitude], zoom: Math.max(map.getZoom(), 8), duration: 350 });
  }, [location, map]);

  return null;
}

function getLocationKey(location: Pick<GeographicLocation, "cidade" | "estado">) {
  return `${location.cidade}::${location.estado}`;
}

function formatPrimaryMetric(location: GeographicLocation, metric: TGeographicMetric) {
  switch (metric) {
    case "SALES":
      return `${location.quantidade} projeto${location.quantidade === 1 ? "" : "s"} · ${formatToMoney(location.valor ?? 0)}`;
    case "HOMOLOGATIONS":
      return `${location.quantidade} homologação${location.quantidade === 1 ? "" : "ões"} · ${formatDecimalPlaces(location.potencia ?? 0)} kWp`;
    case "SUPPLIES":
      return `${location.pedidos ?? 0} pedidos · ${location.entregas ?? 0} entregas`;
    default:
      return `${location.quantidade} serviço${location.quantidade === 1 ? "" : "s"}`;
  }
}

export default function GeographicReport({ projectTypes, period }: GeographicReportProps) {
  const [metric, setMetric] = useState<TGeographicMetric>("EXECUTIONS");
  const [stateFilter, setStateFilter] = useState("__all__");
  const [cityFilter, setCityFilter] = useState("__all__");
  const [selectedLocationKey, setSelectedLocationKey] = useState<string | null>(null);
  const { data, isError, error, isLoading, isFetching } = useGeographicReport({
    metric,
    projectTypes,
    period,
  });

  const locations = data?.locations ?? [];
  const states = useMemo(
    () => Array.from(new Set(locations.map((location) => location.estado))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [locations],
  );
  const cities = useMemo(
    () => locations
      .filter((location) => stateFilter === "__all__" || location.estado === stateFilter)
      .map((location) => location.cidade)
      .filter((city, index, list) => list.indexOf(city) === index)
      .sort((a, b) => a.localeCompare(b, "pt-BR")),
    [locations, stateFilter],
  );
  const visibleLocations = useMemo(
    () => locations.filter((location) =>
      (stateFilter === "__all__" || location.estado === stateFilter) &&
      (cityFilter === "__all__" || location.cidade === cityFilter),
    ),
    [cityFilter, locations, stateFilter],
  );
  const selectedLocation = locations.find((location) => getLocationKey(location) === selectedLocationKey) ?? null;
  const mapData = useMemo(() => ({
    type: "FeatureCollection" as const,
    features: visibleLocations
      .filter((location) => location.mapeada && location.longitude !== null && location.latitude !== null)
      .map((location) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [location.longitude as number, location.latitude as number] },
        properties: { cidade: location.cidade, estado: location.estado },
      })),
  }), [visibleLocations]);

  const selectedMetric = metricOptions.find((option) => option.value === metric) ?? metricOptions[0];

  function selectLocation(location: GeographicLocation) {
    setStateFilter(location.estado);
    setCityFilter(location.cidade);
    setSelectedLocationKey(getLocationKey(location));
  }

  function clearLocationFilters() {
    setStateFilter("__all__");
    setCityFilter("__all__");
    setSelectedLocationKey(null);
  }

  if (isLoading && !data) {
    return <GeographicSkeleton />;
  }

  if (isError) {
    return <ErrorComponent msg={getErrorMessage(error)} />;
  }

  const summary = data?.summary;
  const coverage = summary?.localidades ? Math.round((summary.localidadesMapeadas / summary.localidades) * 100) : 0;

  return (
    <section className="space-y-4" aria-label="Avaliação geográfica">
      <div className="border-border bg-background flex flex-col gap-4 rounded-lg border p-4 shadow-xs lg:p-5">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPinned className="size-5 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-semibold tracking-tight">Avaliação geográfica</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl text-sm">
              Explore a distribuição por município. Cada ponto representa o centróide aproximado da cidade, não o endereço do projeto.
            </p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Métrica geográfica">
            {metricOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={metric === option.value ? "default" : "outline"}
                aria-pressed={metric === option.value}
                onClick={() => {
                  setMetric(option.value);
                  clearLocationFilters();
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <dl className="grid gap-3 border-y py-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryItem icon={Building2} label="Localidades" value={summary?.localidades ?? 0} />
          <SummaryItem icon={Crosshair} label="Cobertura mapeada" value={`${coverage}%`} description={`${summary?.localidadesMapeadas ?? 0} cidades`} />
          <SummaryItem icon={MapPin} label={selectedMetric.shortLabel} value={summary?.registros ?? 0} />
          <SummaryItem icon={AlertTriangle} label="Pendências de localização" value={(summary?.localidadesSemCoordenadas ?? 0) + (summary?.localidadesSemCidadeOuUf ?? 0)} attention />
        </dl>

        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
          <div className="border-border overflow-hidden rounded-md border">
            {mapData.features.length ? (
              <div className="relative h-[420px] w-full">
                <Map center={[-52, -15]} zoom={3.6} maxZoom={15} minZoom={2} loading={isFetching}>
                  <MapClusterLayer
                    data={mapData}
                    clusterRadius={46}
                    clusterThresholds={[10, 50]}
                    clusterColors={["#15599a", "#124d87", "#0a0a0a"]}
                    pointColor="#15599a"
                    onPointClick={(feature) => {
                      const properties = feature.properties;
                      const location = locations.find((item) => item.cidade === properties?.cidade && item.estado === properties?.estado);
                      if (location) selectLocation(location);
                    }}
                  />
                  <MapFocus location={selectedLocation} />
                  {selectedLocation?.mapeada && selectedLocation.longitude !== null && selectedLocation.latitude !== null ? (
                    <MapPopup
                      longitude={selectedLocation.longitude}
                      latitude={selectedLocation.latitude}
                      closeButton
                      onClose={() => setSelectedLocationKey(null)}
                      className="w-64"
                    >
                      <p className="text-foreground font-semibold">{selectedLocation.cidade} · {selectedLocation.estado}</p>
                      <p className="text-muted-foreground mt-1 text-sm">{formatPrimaryMetric(selectedLocation, metric)}</p>
                    </MapPopup>
                  ) : null}
                  <MapControls position="top-right" showCompass />
                </Map>
              </div>
            ) : (
              <EmptyMap metricLabel={selectedMetric.label} />
            )}
          </div>

          <aside className="border-border min-w-0 rounded-md border" aria-label="Ranking geográfico">
            <div className="border-border flex flex-col gap-3 border-b p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold">Ranking por localidade</h3>
                  <p className="text-muted-foreground text-xs">Clique em uma linha para localizar no mapa.</p>
                </div>
                {(stateFilter !== "__all__" || cityFilter !== "__all__") ? (
                  <Button variant="ghost" size="xs" onClick={clearLocationFilters}>Limpar</Button>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select value={stateFilter} onValueChange={(value) => { setStateFilter(value); setCityFilter("__all__"); setSelectedLocationKey(null); }}>
                  <SelectTrigger className="w-full" aria-label="Filtrar por estado"><SelectValue placeholder="Todos os estados" /></SelectTrigger>
                  <SelectContent><SelectItem value="__all__">Todos os estados</SelectItem>{states.map((state) => <SelectItem key={state} value={state}>{state}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={cityFilter} onValueChange={(value) => { setCityFilter(value); setSelectedLocationKey(null); }}>
                  <SelectTrigger className="w-full" aria-label="Filtrar por cidade"><SelectValue placeholder="Todas as cidades" /></SelectTrigger>
                  <SelectContent><SelectItem value="__all__">Todas as cidades</SelectItem>{cities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="max-h-[296px] overflow-auto">
              {visibleLocations.length ? (
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground sticky top-0 text-xs">
                    <tr><th className="px-3 py-2 font-medium">Localidade</th><th className="px-3 py-2 text-right font-medium">Resumo</th></tr>
                  </thead>
                  <tbody>
                    {visibleLocations.map((location) => {
                      const isSelected = getLocationKey(location) === selectedLocationKey;
                      return (
                        <tr key={getLocationKey(location)} className={isSelected ? "bg-primary/10" : "hover:bg-muted/60"}>
                          <td className="px-3 py-2 align-top">
                            <button type="button" className="w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => selectLocation(location)}>
                              <span className="flex items-center gap-1.5 font-medium"><MapPin className={location.mapeada ? "size-3.5 text-primary" : "size-3.5 text-accent-amber-foreground"} />{location.cidade}</span>
                              <span className="text-muted-foreground text-xs">{location.estado}{location.mapeada ? "" : " · sem coordenadas"}</span>
                            </button>
                          </td>
                          <td className="px-3 py-2 text-right align-top text-xs font-medium tabular-nums">{formatPrimaryMetric(location, metric)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : <div className="text-muted-foreground p-6 text-center text-sm">Nenhuma localidade corresponde aos filtros.</div>}
            </div>
          </aside>
        </div>

        {(summary?.localidadesSemCoordenadas || summary?.localidadesSemCidadeOuUf) ? (
          <p className="flex items-start gap-2 text-sm text-accent-amber-foreground">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {summary.localidadesSemCidadeOuUf ?? 0} localidades sem cidade/UF e {summary.localidadesSemCoordenadas ?? 0} sem correspondência IBGE não podem ser exibidas no mapa.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function SummaryItem({ icon: Icon, label, value, description, attention = false }: { icon: typeof Zap; label: string; value: string | number; description?: string; attention?: boolean }) {
  return <div className="flex items-start gap-2"><Icon className={attention ? "mt-0.5 size-4 text-accent-amber-foreground" : "mt-0.5 size-4 text-primary"} aria-hidden="true" /><div><dt className="text-muted-foreground text-xs">{label}</dt><dd className="text-base font-semibold tabular-nums">{value}</dd>{description ? <p className="text-muted-foreground text-xs">{description}</p> : null}</div></div>;
}

function EmptyMap({ metricLabel }: { metricLabel: string }) {
  return <div className="text-muted-foreground flex h-[420px] flex-col items-center justify-center gap-2 p-6 text-center"><MapPinned className="size-7 text-primary" /><p className="font-medium text-foreground">Sem localidades mapeadas para {metricLabel.toLowerCase()}.</p><p className="max-w-sm text-sm">A listagem ao lado mostra registros sem cidade, UF ou correspondência na base de municípios.</p></div>;
}

function GeographicSkeleton() {
  return <div className="border-border space-y-4 rounded-lg border p-5"><div className="flex justify-between gap-4"><Skeleton className="h-10 w-64" /><Skeleton className="h-9 w-80" /></div><Skeleton className="h-20 w-full" /><div className="grid gap-4 xl:grid-cols-[2fr_1fr]"><Skeleton className="h-[420px]" /><Skeleton className="h-[420px]" /></div></div>;
}
