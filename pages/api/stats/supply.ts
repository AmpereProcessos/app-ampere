import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { WAREHOUSE_PURCHASE_TAG_ID } from "@/utils/purchase-control-constants";
import type { TPurchaseControl } from "@/utils/schemas/purchases";
import connectToDatabase from "@/utils/services/mongodb/projects";
import type { Collection, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import { z } from "zod";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"] as const;

const QuerySchema = z.object({
	year: z.coerce.number().int().min(2000).max(2100),
	suppliers: z.string().optional().default(""),
	states: z.string().optional().default(""),
	statuses: z.string().optional().default(""),
});

export type TSupplyAnalyticsDetail = {
	id: string;
	kind: "freight" | "purchase" | "warehouse-purchase";
	month: number;
	title: string;
	supplier: string;
	carrier: string;
	status: string;
	date: string;
	city: string;
	state: string;
	purchaseValue: number;
	freightValue: number;
	itemsCount: number;
};

export type TSupplyAnalyticsMonth = {
	month: number;
	label: (typeof MONTHS)[number];
	freightValue: number;
	deliveredPurchases: number;
	warehousePurchaseValue: number;
	warehousePurchases: number;
};

export type TSupplyAnalyticsSummary = {
	purchaseValue: number;
	purchases: number;
	averagePurchase: number;
	freightValue: number;
	deliveredPurchases: number;
	averageFreight: number;
	warehousePurchaseValue: number;
	warehousePurchases: number;
	averageWarehousePurchase: number;
	freightShare: number;
	averageLeadTimeDays: number;
	onTimeRate: number;
	onTimeDeliveries: number;
	deliveriesWithForecast: number;
};

export type TSupplyAnalyticsBreakdown = {
	key: string;
	label: string;
	purchaseValue: number;
	freightValue: number;
	purchases: number;
	deliveredPurchases: number;
};

export type TSupplyAnalyticsResponse = {
	data: {
		year: number;
		generatedAt: string;
		summary: TSupplyAnalyticsSummary;
		previousSummary: TSupplyAnalyticsSummary;
		monthly: TSupplyAnalyticsMonth[];
		breakdowns: {
			suppliers: TSupplyAnalyticsBreakdown[];
			cities: TSupplyAnalyticsBreakdown[];
			states: TSupplyAnalyticsBreakdown[];
			carriers: TSupplyAnalyticsBreakdown[];
			statuses: TSupplyAnalyticsBreakdown[];
		};
		details: TSupplyAnalyticsDetail[];
		filters: { suppliers: string[]; states: string[]; statuses: string[] };
		dataQuality: {
			deliveredWithoutFreightValue: number;
			warehousePurchasesWithoutOrderDate: number;
			purchasesWithoutSupplier: number;
		};
	};
};

type PurchaseProjection = Pick<
	TPurchaseControl,
	| "titulo"
	| "status"
	| "total"
	| "totalPrevisto"
	| "dataPedido"
	| "dataInsercao"
	| "entrega"
	| "transporte"
	| "fornecedor"
	| "composicao"
	| "etiquetas"
> & { _id: ObjectId };

function splitQuery(value: string) {
	return value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
}

function yearRange(year: number) {
	return {
		start: new Date(Date.UTC(year, 0, 1)).toISOString(),
		end: new Date(Date.UTC(year + 1, 0, 1)).toISOString(),
	};
}

function emptySummary(): TSupplyAnalyticsSummary {
	return {
		purchaseValue: 0,
		purchases: 0,
		averagePurchase: 0,
		freightValue: 0,
		deliveredPurchases: 0,
		averageFreight: 0,
		warehousePurchaseValue: 0,
		warehousePurchases: 0,
		averageWarehousePurchase: 0,
		freightShare: 0,
		averageLeadTimeDays: 0,
		onTimeRate: 0,
		onTimeDeliveries: 0,
		deliveriesWithForecast: 0,
	};
}

function monthIndex(date: string | null | undefined) {
	if (!date) return -1;
	const parsed = new Date(date);
	return Number.isNaN(parsed.getTime()) ? -1 : parsed.getUTCMonth();
}

function isWithin(date: string | null | undefined, range: ReturnType<typeof yearRange>) {
	return !!date && date >= range.start && date < range.end;
}

function summarize(records: PurchaseProjection[], year: number) {
	const range = yearRange(year);
	const summary = emptySummary();

	for (const purchase of records) {
		if (isWithin(purchase.dataPedido, range)) {
			summary.purchases += 1;
			summary.purchaseValue += purchase.total || 0;
		}
		if (isWithin(purchase.entrega?.dataEfetivacao, range)) {
			summary.deliveredPurchases += 1;
			summary.freightValue += purchase.transporte?.valor || 0;
			if (purchase.dataPedido) {
				const leadTime = Math.max(
					0,
					Math.round((new Date(purchase.entrega.dataEfetivacao || "").getTime() - new Date(purchase.dataPedido).getTime()) / 86_400_000),
				);
				summary.averageLeadTimeDays += leadTime;
			}
			if (purchase.entrega?.dataPrevisao) {
				summary.deliveriesWithForecast += 1;
				if ((purchase.entrega.dataEfetivacao || "") <= purchase.entrega.dataPrevisao) summary.onTimeDeliveries += 1;
			}
		}
		const isWarehousePurchase = purchase.etiquetas?.some((tag) => tag.id === WAREHOUSE_PURCHASE_TAG_ID);
		if (isWarehousePurchase && isWithin(purchase.dataPedido, range)) {
			summary.warehousePurchases += 1;
			summary.warehousePurchaseValue += purchase.total || 0;
		}
	}

	summary.averagePurchase = summary.purchases ? summary.purchaseValue / summary.purchases : 0;
	summary.averageFreight = summary.deliveredPurchases ? summary.freightValue / summary.deliveredPurchases : 0;
	summary.averageWarehousePurchase = summary.warehousePurchases ? summary.warehousePurchaseValue / summary.warehousePurchases : 0;
	summary.freightShare = summary.purchaseValue ? (summary.freightValue / summary.purchaseValue) * 100 : 0;
	const deliveriesWithOrderDate = records.filter((purchase) => isWithin(purchase.entrega?.dataEfetivacao, range) && !!purchase.dataPedido).length;
	summary.averageLeadTimeDays = deliveriesWithOrderDate ? summary.averageLeadTimeDays / deliveriesWithOrderDate : 0;
	summary.onTimeRate = summary.deliveriesWithForecast ? (summary.onTimeDeliveries / summary.deliveriesWithForecast) * 100 : 0;
	return summary;
}

function buildBreakdown(records: PurchaseProjection[], keyFor: (purchase: PurchaseProjection) => string, mode: "delivery" | "purchase") {
	const grouped = new Map<string, TSupplyAnalyticsBreakdown>();
	for (const purchase of records) {
		const key = keyFor(purchase).trim() || "Não informado";
		const current = grouped.get(key) || { key, label: key, purchaseValue: 0, freightValue: 0, purchases: 0, deliveredPurchases: 0 };
		current.purchaseValue += purchase.total || 0;
		current.freightValue += purchase.transporte?.valor || 0;
		if (mode === "purchase") current.purchases += 1;
		if (mode === "delivery") current.deliveredPurchases += 1;
		grouped.set(key, current);
	}
	return [...grouped.values()].sort((a, b) => (mode === "purchase" ? b.purchaseValue - a.purchaseValue : b.freightValue - a.freightValue));
}

const getSupplyAnalytics: NextApiHandler<TSupplyAnalyticsResponse> = async (req, res) => {
	await validateAuthenticationWithSession(req, res);
	const query = QuerySchema.parse(req.query);
	const suppliers = splitQuery(query.suppliers);
	const states = splitQuery(query.states);
	const statuses = splitQuery(query.statuses);
	const currentRange = yearRange(query.year);
	const previousRange = yearRange(query.year - 1);

	const collection: Collection<TPurchaseControl> = (await connectToDatabase()).collection("controles-compras");
	const optionalFilters = {
		...(suppliers.length ? { "fornecedor.nome": { $in: suppliers } } : {}),
		...(states.length ? { "entrega.localizacao.uf": { $in: states } } : {}),
		...(statuses.length ? { status: { $in: statuses } } : {}),
	};

	const records = (await collection
		.aggregate<PurchaseProjection>([
			{
				$match: {
					...optionalFilters,
					$or: [
						{ dataPedido: { $gte: previousRange.start, $lt: currentRange.end } },
						{ "entrega.dataEfetivacao": { $gte: previousRange.start, $lt: currentRange.end } },
						{
							"etiquetas.id": WAREHOUSE_PURCHASE_TAG_ID,
							dataPedido: { $gte: previousRange.start, $lt: currentRange.end },
						},
						{
							"etiquetas.id": WAREHOUSE_PURCHASE_TAG_ID,
							dataPedido: null,
							dataInsercao: { $gte: currentRange.start, $lt: currentRange.end },
						},
					],
				},
			},
			{
				$project: {
					titulo: 1,
					status: 1,
					total: 1,
					totalPrevisto: 1,
					dataPedido: 1,
					dataInsercao: 1,
					entrega: 1,
					transporte: 1,
					fornecedor: 1,
					composicao: 1,
					etiquetas: 1,
				},
			},
		])
		.toArray()) as PurchaseProjection[];

	const monthly: TSupplyAnalyticsMonth[] = MONTHS.map((label, month) => ({
		month,
		label,
		freightValue: 0,
		deliveredPurchases: 0,
		warehousePurchaseValue: 0,
		warehousePurchases: 0,
	}));
	const details: TSupplyAnalyticsDetail[] = [];

	for (const purchase of records) {
		if (isWithin(purchase.dataPedido, currentRange)) {
			const month = monthIndex(purchase.dataPedido);
			details.push({
				id: purchase._id.toString(),
				kind: "purchase",
				month,
				title: purchase.titulo,
				supplier: purchase.fornecedor?.nome || "Não informado",
				carrier: purchase.transporte?.transportadora?.nome || "Não informada",
				status: purchase.status,
				date: purchase.dataPedido || "",
				city: purchase.entrega?.localizacao?.cidade || "",
				state: purchase.entrega?.localizacao?.uf || "",
				purchaseValue: purchase.total || 0,
				freightValue: purchase.transporte?.valor || 0,
				itemsCount: purchase.composicao?.length || 0,
			});
		}
		const deliveryDate = purchase.entrega?.dataEfetivacao;
		if (isWithin(deliveryDate, currentRange)) {
			const month = monthIndex(deliveryDate);
			monthly[month].freightValue += purchase.transporte?.valor || 0;
			monthly[month].deliveredPurchases += 1;
			details.push({
				id: purchase._id.toString(),
				kind: "freight",
				month,
				title: purchase.titulo,
				supplier: purchase.fornecedor?.nome || "Não informado",
				carrier: purchase.transporte?.transportadora?.nome || "Não informada",
				status: purchase.status,
				date: deliveryDate || "",
				city: purchase.entrega?.localizacao?.cidade || "",
				state: purchase.entrega?.localizacao?.uf || "",
				purchaseValue: purchase.total || 0,
				freightValue: purchase.transporte?.valor || 0,
				itemsCount: purchase.composicao?.length || 0,
			});
		}

		const isWarehousePurchase = purchase.etiquetas?.some((tag) => tag.id === WAREHOUSE_PURCHASE_TAG_ID);
		if (isWarehousePurchase && isWithin(purchase.dataPedido, currentRange)) {
			const month = monthIndex(purchase.dataPedido);
			monthly[month].warehousePurchaseValue += purchase.total || 0;
			monthly[month].warehousePurchases += 1;
			details.push({
				id: purchase._id.toString(),
				kind: "warehouse-purchase",
				month,
				title: purchase.titulo,
				supplier: purchase.fornecedor?.nome || "Não informado",
				carrier: purchase.transporte?.transportadora?.nome || "Não informada",
				status: purchase.status,
				date: purchase.dataPedido || "",
				city: purchase.entrega?.localizacao?.cidade || "",
				state: purchase.entrega?.localizacao?.uf || "",
				purchaseValue: purchase.total || 0,
				freightValue: purchase.transporte?.valor || 0,
				itemsCount: purchase.composicao?.length || 0,
			});
		}
	}

	const currentRecords = records.filter(
		(purchase) =>
			isWithin(purchase.entrega?.dataEfetivacao, currentRange) ||
			(purchase.etiquetas?.some((tag) => tag.id === WAREHOUSE_PURCHASE_TAG_ID) && isWithin(purchase.dataPedido, currentRange)),
	);
	const currentPurchases = records.filter((purchase) => isWithin(purchase.dataPedido, currentRange));
	const currentDeliveries = records.filter((purchase) => isWithin(purchase.entrega?.dataEfetivacao, currentRange));
	const unique = (values: Array<string | null | undefined>) =>
		[...new Set(values.filter((value): value is string => !!value))].sort((a, b) => a.localeCompare(b, "pt-BR"));
	const optionsRangeQuery = {
		$or: [
			{ dataPedido: { $gte: currentRange.start, $lt: currentRange.end } },
			{ "entrega.dataEfetivacao": { $gte: currentRange.start, $lt: currentRange.end } },
			{ "etiquetas.id": WAREHOUSE_PURCHASE_TAG_ID, dataPedido: { $gte: currentRange.start, $lt: currentRange.end } },
		],
	};
	const [filterOptions] = await collection
		.aggregate<{
			suppliers: Array<{ _id: string }>;
			states: Array<{ _id: string }>;
			statuses: Array<{ _id: string }>;
		}>([
			{ $match: optionsRangeQuery },
			{
				$facet: {
					suppliers: [{ $match: { "fornecedor.nome": { $type: "string", $ne: "" } } }, { $group: { _id: "$fornecedor.nome" } }],
					states: [{ $match: { "entrega.localizacao.uf": { $type: "string", $ne: "" } } }, { $group: { _id: "$entrega.localizacao.uf" } }],
					statuses: [{ $match: { status: { $type: "string", $ne: "" } } }, { $group: { _id: "$status" } }],
				},
			},
		])
		.toArray();

	return res.status(200).json({
		data: {
			year: query.year,
			generatedAt: new Date().toISOString(),
			summary: summarize(records, query.year),
			previousSummary: summarize(records, query.year - 1),
			monthly,
			breakdowns: {
				suppliers: buildBreakdown(currentPurchases, (purchase) => purchase.fornecedor?.nome || "", "purchase"),
				cities: buildBreakdown(currentPurchases, (purchase) => purchase.entrega?.localizacao?.cidade || "", "purchase"),
				states: buildBreakdown(currentPurchases, (purchase) => purchase.entrega?.localizacao?.uf || "", "purchase"),
				carriers: buildBreakdown(currentDeliveries, (purchase) => purchase.transporte?.transportadora?.nome || "", "delivery"),
				statuses: buildBreakdown(currentPurchases, (purchase) => purchase.status || "", "purchase"),
			},
			details: details.sort((a, b) => b.date.localeCompare(a.date)),
			filters: {
				suppliers: unique(filterOptions?.suppliers.map((option) => option._id) || []),
				states: unique(filterOptions?.states.map((option) => option._id) || []),
				statuses: unique(filterOptions?.statuses.map((option) => option._id) || []),
			},
			dataQuality: {
				deliveredWithoutFreightValue: currentRecords.filter(
					(purchase) => isWithin(purchase.entrega?.dataEfetivacao, currentRange) && purchase.transporte?.valor == null,
				).length,
				warehousePurchasesWithoutOrderDate: records.filter(
					(purchase) =>
						purchase.etiquetas?.some((tag) => tag.id === WAREHOUSE_PURCHASE_TAG_ID) &&
						!purchase.dataPedido &&
						isWithin(purchase.dataInsercao, currentRange),
				).length,
				purchasesWithoutSupplier: currentPurchases.filter((purchase) => !purchase.fornecedor?.nome).length,
			},
		},
	});
};

export default apiHandler({ GET: getSupplyAnalytics });
