import { getProjectEquipment, type ProjectEquipmentInput } from "@/lib/projects/equipment";

export function getProjectOemModuleQuantity(project: ProjectEquipmentInput) {
	return getProjectEquipment(project, "oem").modulos.qtde;
}

export function getProjectOemPower(project: ProjectEquipmentInput) {
	return getProjectEquipment(project, "oem").potPico;
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
