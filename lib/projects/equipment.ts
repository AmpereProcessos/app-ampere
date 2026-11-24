import type { TProductItem } from "@/utils/schemas/crm/kits.schema";
import type { TProductOrigin } from "@/utils/schemas/crm/kits.schema";

// Partial API projections and historical projects are valid inputs too.
export type ProjectEquipmentInput = {
	tipoDeServico?: string | null;
	produtos?: TProductItem[] | null;
	oem?: { qtdeModulos?: number | null; qtdeInversores?: number | null } | null;
	sistema?: {
		qtdeModulos?: number | null;
		potModulos?: number | string | null;
		potPico?: number | null;
		inversor?: string | null;
		topologia?: string | null;
	} | null;
};

export function normalizeSystemTopology(value?: string | null) {
	if (value === "MICRO" || value === "MICRO-INVERSOR") return "MICRO-INVERSOR";
	if (value === "INVERSOR" || value === "OTIMIZADOR") return value;
	return null;
}

export function isMaintenanceService(value?: string | null) {
	return ["OPERAÇÃO E MANUTENÇÃO", "MANUTENÇÃO PREVENTIVA", "MANUTENÇÃO CORRETIVA"].includes(value || "");
}

export function getProductOrigin(product: Pick<TProductItem, "origem">): TProductOrigin {
	return product.origem === "EXISTENTE" ? "EXISTENTE" : "VENDA";
}

/** Legacy system fields belong to one group only, never both summaries. */
export function getProjectEquipmentForOrigin(project: ProjectEquipmentInput, origin: TProductOrigin) {
	const maintenance = isMaintenanceService(project.tipoDeServico);
	const context = origin === "EXISTENTE" ? "oem" : "sale";
	const input =
		origin === "EXISTENTE"
			? maintenance
				? project
				: { produtos: project.produtos, oem: project.oem }
			: maintenance
				? { produtos: project.produtos }
				: project;
	return getProjectEquipment(input, context);
}

/** An explicit removal/reclassification must not resurrect a mirrored legacy total. */
export function getRemovedEquipmentFallbacks(project: ProjectEquipmentInput, next: TProductItem[]) {
	const sistema: { qtdeModulos?: number; potModulos?: number | string; potPico?: number; inversor?: string } = {};
	const oem: NonNullable<ProjectEquipmentInput["oem"]> = {};
	const systemOrigin = isMaintenanceService(project.tipoDeServico) ? "EXISTENTE" : "VENDA";
	for (const origin of ["EXISTENTE", "VENDA"] as const) {
		for (const category of ["MÓDULO", "INVERSOR"] as const) {
			const belongs = (item: TProductItem) => getProductOrigin(item) === origin && item.categoria === category && item.qtde > 0;
			if (!(project.produtos ?? []).some(belongs) || next.some(belongs)) continue;
			if (origin === systemOrigin) {
				if (category === "MÓDULO") Object.assign(sistema, { qtdeModulos: 0, potModulos: "", potPico: 0 });
				else sistema.inversor = "";
			}
			if (origin === "EXISTENTE") {
				if (category === "MÓDULO") oem.qtdeModulos = 0;
				else oem.qtdeInversores = 0;
			}
		}
	}
	return { sistema, oem };
}

function positive(value: unknown) {
	const number = Number(value);
	return Number.isFinite(number) && number > 0 ? number : 0;
}

function meaningful(value?: string | number | null) {
	const text = value == null ? "" : String(value).trim();
	return /[1-9]/.test(text) ? text : "";
}

function legacyInverter(value?: string | null) {
	const raw = value?.trim() || "";
	const text = /^0\s*x\s*\(\s*0\s*w\s*\)$/i.test(raw) ? "" : raw;
	// Historical formats: 1xBRAND(5000W), 1 - 6 kW, and 1x(5000W).
	const quantities = [...text.matchAll(/(?:^|[\s/])\s*(\d+)\s*(?:x|\s-\s)/gi)];
	const powers = [...text.matchAll(/(\d+(?:[.,]\d+)?)\s*(k?W)/gi)];
	return {
		qtde: quantities.reduce((sum, match) => sum + positive(match[1]), 0),
		modelo: text,
		potencia: powers.map((match) => String(Number(match[1].replace(",", ".")) * (/kw/i.test(match[2]) ? 1000 : 1))).join(" / "),
	};
}

/** Resolve each field independently; never add product, O&M and legacy totals together. */
export function getProjectEquipment(
	project: ProjectEquipmentInput,
	context: "sale" | "oem" = isMaintenanceService(project.tipoDeServico) ? "oem" : "sale",
) {
	const products = (project.produtos ?? []).filter((product) => (context === "oem" ? product.origem === "EXISTENTE" : product.origem !== "EXISTENTE"));
	const modules = products.filter((product) => product.categoria === "MÓDULO" && positive(product.qtde));
	const inverters = products.filter((product) => product.categoria === "INVERSOR" && positive(product.qtde));
	const quantity = (items: TProductItem[]) => items.reduce((sum, item) => sum + positive(item.qtde), 0);
	const model = (items: TProductItem[]) =>
		items
			.map((item) => item.modelo?.trim() || item.fabricante?.trim())
			.filter(Boolean)
			.join(" / ");
	const power = (items: TProductItem[]) => [...new Set(items.map((item) => positive(item.potencia)).filter(Boolean))].join(" / ");
	const legacy = legacyInverter(project.sistema?.inversor);
	const moduleQuantity = quantity(modules) || (context === "oem" ? positive(project.oem?.qtdeModulos) : 0) || positive(project.sistema?.qtdeModulos);
	const legacyModulePower = meaningful(project.sistema?.potModulos);
	const completeModulePower = modules.length > 0 && modules.every((item) => positive(item.potencia));
	const peakPower = completeModulePower
		? modules.reduce((sum, item) => sum + item.qtde * positive(item.potencia), 0) / 1000
		: positive(project.sistema?.potPico) || (moduleQuantity * positive(legacyModulePower)) / 1000;
	return {
		modulos: {
			qtde: moduleQuantity,
			modelo: model(modules),
			potencia: power(modules) || legacyModulePower,
		},
		inversor: {
			qtde: quantity(inverters) || (context === "oem" ? positive(project.oem?.qtdeInversores) : 0) || legacy.qtde,
			modelo: model(inverters) || legacy.modelo,
			potencia: power(inverters) || legacy.potencia,
		},
		potPico: peakPower,
		inversorDescricao: inverters.length
			? inverters
					.map((item) => `${item.qtde}x ${item.modelo?.trim() || item.fabricante?.trim() || ""}${positive(item.potencia) ? ` (${item.potencia}W)` : ""}`)
					.join(" / ")
			: legacy.modelo,
		topologia: normalizeSystemTopology(project.sistema?.topologia),
		// A product-derived field is a summary; editing its legacy fallback would have no effect.
		derived: {
			modules: modules.length > 0 || (context === "oem" && positive(project.oem?.qtdeModulos) > 0),
			modulePower: modules.some((item) => positive(item.potencia)),
			inverters: inverters.length > 0,
			peakPower: completeModulePower,
		},
	};
}

// Shared projections keep report totals and the UI on the same inputs.
export const ProjectEquipmentProjection = {
	produtos: 1,
	"sistema.qtdeModulos": 1,
	"sistema.potModulos": 1,
	"sistema.potPico": 1,
	"sistema.inversor": 1,
	"sistema.topologia": 1,
	"oem.qtdeModulos": 1,
	"oem.qtdeInversores": 1,
} as const;
