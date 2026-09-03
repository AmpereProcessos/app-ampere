import { Button } from "@/components/ui/button";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/lib/hooks/media-query";
import type { TSupplyAnalyticsBreakdown, TSupplyAnalyticsDetail, TSupplyAnalyticsMonth } from "@/pages/api/stats/supply";
import { formatToMoney } from "@/utils/constants";
import { type TSupplyAnalyticsFilters, useSupplyAnalytics } from "@/utils/methods/query/supply-analytics";
import dayjs from "dayjs";
import {
	AlertTriangle,
	ArrowDownRight,
	ArrowUpRight,
	Boxes,
	Building2,
	Clock3,
	Download,
	Gauge,
	MapPin,
	PackageCheck,
	ReceiptText,
	RotateCcw,
	Store,
	Truck,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type DetailField = "carrier" | "city" | "state" | "status" | "supplier";
type DetailSelection = { kind: TSupplyAnalyticsDetail["kind"]; month?: number; field?: DetailField; value?: string } | null;

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
	notation: "compact",
	maximumFractionDigits: 1,
});

function percentageChange(current: number, previous: number) {
	if (!previous) return current ? 100 : 0;
	return ((current - previous) / previous) * 100;
}

function escapeCsv(value: string | number) {
	const text = String(value ?? "");
	return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
	const content = `\uFEFF${rows.map((row) => row.map(escapeCsv).join(";")).join("\n")}`;
	const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	URL.revokeObjectURL(url);
}

export default function SupplyAnalyticsView() {
	const currentYear = new Date().getFullYear();
	const [filters, setFilters] = useState<TSupplyAnalyticsFilters>({
		year: currentYear,
		suppliers: [],
		states: [],
		statuses: [],
	});
	const [selection, setSelection] = useState<DetailSelection>(null);
	const query = useSupplyAnalytics(filters);
	const data = query.data;

	const selectedDetails = useMemo(() => {
		if (!selection || !data) return [];
		return data.details.filter(
			(detail) =>
				detail.kind === selection.kind &&
				(selection.month == null || detail.month === selection.month) &&
				(!selection.field || detail[selection.field] === selection.value),
		);
	}, [data, selection]);

	function updateSingleFilter(key: "suppliers" | "states" | "statuses", value: string) {
		setFilters((previous) => ({ ...previous, [key]: value === "all" ? [] : [value] }));
	}

	function exportOverview() {
		if (!data) return;
		downloadCsv(`estatisticas-suprimentos-${data.year}.csv`, [
			["Mês", "Fretes (R$)", "Compras entregues", "Compras extras (R$)", "Quantidade de compras extras"],
			...data.monthly.map((month) => [
				month.label,
				month.freightValue.toFixed(2),
				month.deliveredPurchases,
				month.warehousePurchaseValue.toFixed(2),
				month.warehousePurchases,
			]),
		]);
	}

	return (
		<section className="flex min-w-0 flex-col gap-6" aria-labelledby="supply-analytics-title">
			<header className="flex flex-col gap-4 border-b pb-4 xl:flex-row xl:items-end xl:justify-between">
				<div className="min-w-0">
					<h1 id="supply-analytics-title" className="text-2xl font-bold tracking-tight text-[#15599a]">
						Custos e compras
					</h1>
					<p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
						Fretes por data de entrega e compras extras criadas pelo fluxo do almoxarifado.
					</p>
				</div>
				<div className="flex flex-wrap items-end gap-2">
					<FilterSelect
						label="Ano"
						value={String(filters.year)}
						options={Array.from({ length: 7 }, (_, index) => String(currentYear - 5 + index))}
						onChange={(value) => setFilters((previous) => ({ ...previous, year: Number(value) }))}
						includeAll={false}
					/>
					<FilterSelect
						label="Fornecedor"
						value={filters.suppliers[0] || "all"}
						options={data?.filters.suppliers || []}
						onChange={(value) => updateSingleFilter("suppliers", value)}
					/>
					<FilterSelect
						label="UF de entrega"
						value={filters.states[0] || "all"}
						options={data?.filters.states || []}
						onChange={(value) => updateSingleFilter("states", value)}
					/>
					<FilterSelect
						label="Status"
						value={filters.statuses[0] || "all"}
						options={data?.filters.statuses || []}
						onChange={(value) => updateSingleFilter("statuses", value)}
					/>
					<Button variant="outline" size="sm" onClick={() => setFilters({ year: currentYear, suppliers: [], states: [], statuses: [] })}>
						<RotateCcw className="size-4" /> Limpar
					</Button>
					<Button size="sm" onClick={exportOverview} disabled={!data}>
						<Download className="size-4" /> Exportar CSV
					</Button>
				</div>
			</header>

			{query.isLoading ? <AnalyticsSkeleton /> : null}
			{query.isError ? (
				<div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
					Não foi possível carregar as estatísticas. Atualize a página ou tente novamente.
				</div>
			) : null}
			{data ? (
				<>
					<div className="grid gap-x-6 gap-y-4 border-b pb-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
						<Metric
							label="Fretes"
							value={formatToMoney(data.summary.freightValue)}
							previous={data.previousSummary.freightValue}
							current={data.summary.freightValue}
							year={data.year}
							icon={Truck}
							onClick={() => setSelection({ kind: "freight" })}
						/>
						<Metric
							label="Compras entregues"
							value={String(data.summary.deliveredPurchases)}
							previous={data.previousSummary.deliveredPurchases}
							current={data.summary.deliveredPurchases}
							year={data.year}
							icon={PackageCheck}
							onClick={() => setSelection({ kind: "freight" })}
						/>
						<Metric
							label="Frete médio"
							value={formatToMoney(data.summary.averageFreight)}
							previous={data.previousSummary.averageFreight}
							current={data.summary.averageFreight}
							year={data.year}
							icon={ReceiptText}
						/>
						<Metric
							label="Compras extras"
							value={formatToMoney(data.summary.warehousePurchaseValue)}
							previous={data.previousSummary.warehousePurchaseValue}
							current={data.summary.warehousePurchaseValue}
							year={data.year}
							icon={Boxes}
							onClick={() => setSelection({ kind: "warehouse-purchase" })}
						/>
						<Metric
							label="Quantidade extra"
							value={String(data.summary.warehousePurchases)}
							previous={data.previousSummary.warehousePurchases}
							current={data.summary.warehousePurchases}
							year={data.year}
							icon={PackageCheck}
							onClick={() => setSelection({ kind: "warehouse-purchase" })}
						/>
						<Metric
							label="Ticket médio extra"
							value={formatToMoney(data.summary.averageWarehousePurchase)}
							previous={data.previousSummary.averageWarehousePurchase}
							current={data.summary.averageWarehousePurchase}
							year={data.year}
							icon={ReceiptText}
						/>
					</div>

					<div className="grid min-w-0 gap-6 2xl:grid-cols-2">
						<MonthlyChart
							title="Fretes e compras entregues"
							description="O mês considera a data efetiva de entrega."
							data={data.monthly}
							valueKey="freightValue"
							countKey="deliveredPurchases"
							valueLabel="Valor dos fretes"
							countLabel="Compras entregues"
							onSelectMonth={(month) => setSelection({ kind: "freight", month })}
						/>
						<MonthlyChart
							title="Compras extras do almoxarifado"
							description="Compras com a etiqueta ALMOXARIFADO, agrupadas pela data do pedido."
							data={data.monthly}
							valueKey="warehousePurchaseValue"
							countKey="warehousePurchases"
							valueLabel="Valor das compras"
							countLabel="Quantidade de compras"
							onSelectMonth={(month) => setSelection({ kind: "warehouse-purchase", month })}
						/>
					</div>

					<section className="border-y py-6" aria-labelledby="efficiency-title">
						<div className="mb-4">
							<h2 id="efficiency-title" className="text-base font-semibold">
								Eficiência operacional
							</h2>
							<p className="text-xs text-muted-foreground">Indicadores calculados sobre todas as compras e entregas do período.</p>
						</div>
						<div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
							<CompactKpi
								label="Valor total comprado"
								value={formatToMoney(data.summary.purchaseValue)}
								supporting={`${data.summary.purchases} compras`}
								icon={ReceiptText}
							/>
							<CompactKpi label="Ticket médio geral" value={formatToMoney(data.summary.averagePurchase)} supporting="por compra realizada" icon={Gauge} />
							<CompactKpi
								label="Frete sobre compras"
								value={`${data.summary.freightShare.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`}
								supporting="participação no valor comprado"
								icon={Truck}
							/>
							<CompactKpi
								label="Prazo médio de entrega"
								value={`${data.summary.averageLeadTimeDays.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} dias`}
								supporting="do pedido à entrega"
								icon={Clock3}
							/>
							<CompactKpi
								label="Entregas no prazo"
								value={`${data.summary.onTimeRate.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`}
								supporting={`${data.summary.onTimeDeliveries} de ${data.summary.deliveriesWithForecast} com previsão`}
								icon={PackageCheck}
							/>
							<CompactKpi label="Fornecedores ativos" value={String(data.breakdowns.suppliers.length)} supporting="com compras no período" icon={Store} />
							<CompactKpi
								label="Estados atendidos"
								value={String(data.breakdowns.states.filter((item) => item.key !== "Não informado").length)}
								supporting="com compras no período"
								icon={MapPin}
							/>
							<CompactKpi
								label="Transportadoras"
								value={String(data.breakdowns.carriers.filter((item) => item.key !== "Não informado").length)}
								supporting="com entregas concluídas"
								icon={Building2}
							/>
						</div>
					</section>

					<section className="space-y-4" aria-labelledby="breakdowns-title">
						<div>
							<h2 id="breakdowns-title" className="text-base font-semibold">
								Composição das compras e entregas
							</h2>
							<p className="text-xs text-muted-foreground">Clique em uma linha para conferir os controles que formam o resultado.</p>
						</div>
						<div className="grid min-w-0 gap-6 xl:grid-cols-2">
							<RankingPanel
								title="Compras por fornecedor"
								items={data.breakdowns.suppliers}
								valueKey="purchaseValue"
								countKey="purchases"
								valueLabel="comprado"
								onSelect={(item) => setSelection({ kind: "purchase", field: "supplier", value: item.key })}
							/>
							<RankingPanel
								title="Fretes por transportadora"
								items={data.breakdowns.carriers}
								valueKey="freightValue"
								countKey="deliveredPurchases"
								valueLabel="em fretes"
								onSelect={(item) => setSelection({ kind: "freight", field: "carrier", value: item.key })}
							/>
							<RankingPanel
								title="Compras por estado"
								items={data.breakdowns.states}
								valueKey="purchaseValue"
								countKey="purchases"
								valueLabel="comprado"
								onSelect={(item) => setSelection({ kind: "purchase", field: "state", value: item.key })}
							/>
							<RankingPanel
								title="Compras por cidade"
								items={data.breakdowns.cities}
								valueKey="purchaseValue"
								countKey="purchases"
								valueLabel="comprado"
								onSelect={(item) => setSelection({ kind: "purchase", field: "city", value: item.key })}
							/>
							<RankingPanel
								title="Compras por status"
								items={data.breakdowns.statuses}
								valueKey="purchaseValue"
								countKey="purchases"
								valueLabel="comprado"
								onSelect={(item) => setSelection({ kind: "purchase", field: "status", value: item.key })}
								className="xl:col-span-2"
							/>
						</div>
					</section>

					<DataQualityNotice quality={data.dataQuality} />
					<DetailPanel selection={selection} details={selectedDetails} onOpenChange={(open) => !open && setSelection(null)} />
				</>
			) : null}
		</section>
	);
}

function CompactKpi({
	label,
	value,
	supporting,
	icon: Icon,
}: { label: string; value: string; supporting: string; icon: React.ComponentType<{ className?: string }> }) {
	return (
		<div className="flex min-w-0 items-start gap-3 py-2">
			<div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#15599a]/10 text-[#15599a]">
				<Icon className="size-4" />
			</div>
			<div className="min-w-0">
				<p className="text-xs font-medium text-muted-foreground">{label}</p>
				<p className="mt-0.5 truncate text-lg font-bold tabular-nums">{value}</p>
				<p className="text-[11px] text-muted-foreground">{supporting}</p>
			</div>
		</div>
	);
}

function RankingPanel({
	title,
	items,
	valueKey,
	countKey,
	valueLabel,
	onSelect,
	className = "",
}: {
	title: string;
	items: TSupplyAnalyticsBreakdown[];
	valueKey: "freightValue" | "purchaseValue";
	countKey: "deliveredPurchases" | "purchases";
	valueLabel: string;
	onSelect: (item: TSupplyAnalyticsBreakdown) => void;
	className?: string;
}) {
	const visible = items.slice(0, 10);
	const maximum = Math.max(...visible.map((item) => item[valueKey]), 1);
	return (
		<article className={`min-w-0 rounded-lg border bg-background p-4 shadow-xs ${className}`}>
			<h3 className="text-sm font-semibold">{title}</h3>
			<div className="mt-3 divide-y">
				{visible.length ? (
					visible.map((item) => (
						<button
							key={item.key}
							type="button"
							onClick={() => onSelect(item)}
							className="group relative grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 overflow-hidden py-2.5 text-left outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
						>
							<span
								aria-hidden
								className="absolute inset-y-1 left-0 rounded-sm bg-[#15599a]/8 transition-colors group-hover:bg-[#15599a]/12"
								style={{ width: `${Math.max(2, (item[valueKey] / maximum) * 100)}%` }}
							/>
							<span className="relative min-w-0 truncate text-sm font-medium">{item.label}</span>
							<span className="relative text-right">
								<span className="block text-sm font-semibold tabular-nums">{formatToMoney(item[valueKey])}</span>
								<span className="block text-[11px] text-muted-foreground">
									{item[countKey]} registros · {valueLabel}
								</span>
							</span>
						</button>
					))
				) : (
					<p className="py-10 text-center text-sm text-muted-foreground">Nenhum dado disponível no período.</p>
				)}
			</div>
			{items.length > 10 ? <p className="mt-3 text-xs text-muted-foreground">Exibindo os 10 maiores de {items.length} resultados.</p> : null}
		</article>
	);
}

function FilterSelect({
	label,
	value,
	options,
	onChange,
	includeAll = true,
}: { label: string; value: string; options: string[]; onChange: (value: string) => void; includeAll?: boolean }) {
	return (
		<div className="flex min-w-32 flex-col gap-1 text-xs font-medium text-muted-foreground">
			<span>{label}</span>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger aria-label={label} size="sm" className="min-w-32 max-w-52 bg-background text-foreground">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{includeAll ? <SelectItem value="all">Todos</SelectItem> : null}
					{options.map((option) => (
						<SelectItem key={option} value={option}>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

function Metric({
	label,
	value,
	current,
	previous,
	year,
	icon: Icon,
	onClick,
}: {
	label: string;
	value: string;
	current: number;
	previous: number;
	year: number;
	icon: React.ComponentType<{ className?: string }>;
	onClick?: () => void;
}) {
	const change = percentageChange(current, previous);
	const content = (
		<>
			<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
				<Icon className="size-4" />
				{label}
			</div>
			<div className="mt-2 flex items-end justify-between gap-2">
				<strong className="text-xl font-bold tabular-nums text-foreground">{value}</strong>
				<span className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
					{change >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
					{Math.abs(change).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%
				</span>
			</div>
			<p className="mt-1 text-[11px] text-muted-foreground">versus {year - 1}</p>
		</>
	);
	return onClick ? (
		<button
			type="button"
			onClick={onClick}
			className="rounded-lg p-3 text-left outline-hidden transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
		>
			{content}
		</button>
	) : (
		<div className="p-3">{content}</div>
	);
}

type ValueKey = "freightValue" | "warehousePurchaseValue";
type CountKey = "deliveredPurchases" | "warehousePurchases";
function MonthlyChart({
	title,
	description,
	data,
	valueKey,
	countKey,
	valueLabel,
	countLabel,
	onSelectMonth,
}: {
	title: string;
	description: string;
	data: TSupplyAnalyticsMonth[];
	valueKey: ValueKey;
	countKey: CountKey;
	valueLabel: string;
	countLabel: string;
	onSelectMonth: (month: number) => void;
}) {
	const chartConfig = {
		[valueKey]: { label: valueLabel, color: "#15599a" },
		[countKey]: { label: countLabel, color: "hsl(var(--foreground))" },
	} satisfies ChartConfig;
	const hasData = data.some((item) => item[valueKey] > 0 || item[countKey] > 0);
	return (
		<article className="min-w-0 rounded-lg border bg-background p-4 shadow-xs">
			<div className="mb-4">
				<h2 className="text-base font-semibold">{title}</h2>
				<p className="text-xs text-muted-foreground">{description}</p>
			</div>
			{hasData ? (
				<div className="grid min-w-0 gap-3 lg:grid-rows-2">
					<ChartContainer config={chartConfig} className="h-[190px] w-full">
						<BarChart
							accessibilityLayer
							data={data}
							onClick={(event) => event?.activePayload?.length && onSelectMonth(event.activePayload[0].payload.month)}
						>
							<CartesianGrid vertical={false} strokeWidth={0.4} />
							<XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
							<YAxis tickLine={false} axisLine={false} width={52} tickFormatter={(value) => moneyFormatter.format(value)} />
							<ChartTooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent formatter={(value) => formatToMoney(Number(value))} />} />
							<Bar dataKey={valueKey} fill={`var(--color-${valueKey})`} radius={[4, 4, 0, 0]} className="cursor-pointer" />
						</BarChart>
					</ChartContainer>
					<ChartContainer config={chartConfig} className="h-[140px] w-full">
						<LineChart
							accessibilityLayer
							data={data}
							onClick={(event) => event?.activePayload?.length && onSelectMonth(event.activePayload[0].payload.month)}
						>
							<CartesianGrid vertical={false} strokeWidth={0.4} />
							<XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
							<YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
							<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
							<Line
								type="monotone"
								dataKey={countKey}
								stroke="hsl(var(--foreground))"
								strokeWidth={2}
								dot={{ r: 3, fill: "#15599a", strokeWidth: 0 }}
								activeDot={{ r: 5 }}
								className="cursor-pointer"
							/>
						</LineChart>
					</ChartContainer>
				</div>
			) : (
				<div className="flex h-[342px] items-center justify-center rounded-md bg-muted/40 px-6 text-center text-sm text-muted-foreground">
					Nenhum registro encontrado para este período e filtros.
				</div>
			)}
		</article>
	);
}

function DataQualityNotice({
	quality,
}: { quality: { deliveredWithoutFreightValue: number; warehousePurchasesWithoutOrderDate: number; purchasesWithoutSupplier: number } }) {
	const total = quality.deliveredWithoutFreightValue + quality.warehousePurchasesWithoutOrderDate + quality.purchasesWithoutSupplier;
	if (!total) return null;
	return (
		<div className="flex items-start gap-3 rounded-lg border border-[#fead41]/70 bg-[#fead41]/10 p-4 text-sm text-foreground">
			<AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#8a5700] dark:text-[#fead41]" />
			<div>
				<p className="font-semibold">Há registros que precisam de revisão</p>
				<p className="mt-1 text-xs text-muted-foreground">
					{quality.deliveredWithoutFreightValue} entregues sem frete · {quality.warehousePurchasesWithoutOrderDate} compras do almoxarifado sem data do
					pedido · {quality.purchasesWithoutSupplier} sem fornecedor.
				</p>
			</div>
		</div>
	);
}

function DetailPanel({
	selection,
	details,
	onOpenChange,
}: { selection: DetailSelection; details: TSupplyAnalyticsDetail[]; onOpenChange: (open: boolean) => void }) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const title =
		selection?.kind === "freight"
			? "Compras entregues e fretes"
			: selection?.kind === "purchase"
				? "Compras realizadas"
				: "Compras extras do almoxarifado";
	const body = <DetailContent details={details} title={title} />;
	if (isDesktop)
		return (
			<Sheet open={!!selection} onOpenChange={onOpenChange}>
				<SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
					<SheetHeader>
						<SheetTitle>{title}</SheetTitle>
						<SheetDescription>{details.length} registro(s) compõem o recorte selecionado.</SheetDescription>
					</SheetHeader>
					{body}
				</SheetContent>
			</Sheet>
		);
	return (
		<Drawer open={!!selection} onOpenChange={onOpenChange}>
			<DrawerContent className="max-h-[92vh]">
				<DrawerHeader>
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>{details.length} registro(s) compõem o recorte selecionado.</DrawerDescription>
				</DrawerHeader>
				<div className="overflow-y-auto px-4 pb-6">{body}</div>
			</DrawerContent>
		</Drawer>
	);
}

function DetailContent({ details, title }: { details: TSupplyAnalyticsDetail[]; title: string }) {
	function exportDetails() {
		downloadCsv(`${title.toLowerCase().replace(/\s+/g, "-")}.csv`, [
			["Compra", "Data", "Fornecedor", "Transportadora", "Status", "Cidade", "UF", "Valor da compra", "Valor do frete", "Itens"],
			...details.map((detail) => [
				detail.title,
				detail.date,
				detail.supplier,
				detail.carrier,
				detail.status,
				detail.city,
				detail.state,
				detail.purchaseValue.toFixed(2),
				detail.freightValue.toFixed(2),
				detail.itemsCount,
			]),
		]);
	}
	return (
		<div className="mt-5 space-y-3">
			<div className="flex items-center justify-between border-b pb-3">
				<span className="text-sm font-semibold tabular-nums">
					Total: {formatToMoney(details.reduce((sum, item) => sum + (item.kind === "freight" ? item.freightValue : item.purchaseValue), 0))}
				</span>
				<Button variant="outline" size="sm" onClick={exportDetails} disabled={!details.length}>
					<Download className="size-4" /> Exportar recorte
				</Button>
			</div>
			{details.length ? (
				details.map((detail) => (
					<div key={`${detail.kind}-${detail.id}`} className="grid gap-2 border-b py-3 text-sm sm:grid-cols-[1fr_auto]">
						<div className="min-w-0">
							<Link href={`/suprimentos/controle-compras/pdf/${detail.id}`} className="font-semibold text-[#15599a] hover:underline">
								{detail.title}
							</Link>
							<p className="mt-1 text-xs text-muted-foreground">
								{detail.supplier} · {detail.carrier}
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								{dayjs(detail.date).format("DD/MM/YYYY")} · {[detail.city, detail.state].filter(Boolean).join("/") || "Local não informado"}
							</p>
						</div>
						<div className="text-left sm:text-right">
							<p className="font-semibold tabular-nums">{formatToMoney(detail.kind === "freight" ? detail.freightValue : detail.purchaseValue)}</p>
							<p className="mt-1 text-xs text-muted-foreground">{detail.status}</p>
						</div>
					</div>
				))
			) : (
				<p className="py-12 text-center text-sm text-muted-foreground">Nenhum registro encontrado neste recorte.</p>
			)}
		</div>
	);
}

function AnalyticsSkeleton() {
	return (
		<div className="space-y-6" aria-label="Carregando estatísticas">
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
				{["freight", "delivered", "average-freight", "warehouse", "warehouse-count", "average-warehouse"].map((key) => (
					<Skeleton key={key} className="h-24" />
				))}
			</div>
			<div className="grid gap-6 2xl:grid-cols-2">
				<Skeleton className="h-[430px]" />
				<Skeleton className="h-[430px]" />
			</div>
		</div>
	);
}
