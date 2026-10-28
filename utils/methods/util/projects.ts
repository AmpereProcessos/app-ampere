import { getExistingProducts } from "@/utils/schemas/crm/kits.schema";
import type { TProjectDTO } from "@/utils/schemas/projects";

export function getProjectOemModuleQuantity(project: Pick<TProjectDTO, "oem" | "sistema">) {
	const fromOem = project.oem?.qtdeModulos;
	if (fromOem != null && fromOem > 0) return fromOem;
	return project.sistema?.qtdeModulos ?? 0;
}

export function getProjectOemPower(project: Pick<TProjectDTO, "produtos" | "sistema">) {
	const power = getExistingProducts(project.produtos ?? [])
		.filter((product) => product.categoria === "MÓDULO")
		.reduce((acc, product) => acc + (product.qtde * (product.potencia || 0)) / 1000, 0);
	return power || project.sistema?.potPico || 0;
}

type GetContractValueParams = {
	projectValue?: number | null;
	paValue?: number | null;
	structureValue?: number | null;
	oemValue?: number | null;
	insuranceValue?: number | null;
};
export function getContractValue({ projectValue, paValue, structureValue, oemValue, insuranceValue }: GetContractValueParams) {
	return [projectValue, paValue, structureValue, oemValue, insuranceValue].map((value) => Number(value || 0)).reduce((sum, value) => sum + value, 0);
}
