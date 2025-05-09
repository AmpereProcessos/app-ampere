import type { TProject } from "@/utils/schemas/projects";
import type { TPurchaseControl } from "@/utils/schemas/purchases";

export function getPurchaseControlTagsFromProject(project: TProject) {
	const purchaseControltags: Exclude<TPurchaseControl["etiquetas"], undefined | null> = [];
	const projectTags = project.etiquetas || [];
	if (project.homologacao.fastTrack) {
		purchaseControltags.push({
			id: "6798eb1b19ad4c2b679bd2e1",
			titulo: "FAST TRACK",
			cores: {
				primaria: "#058A05",
				secundaria: "#B7FDB7",
			},
		});
	}
	if (["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO", "SISTEMA FOTOVOLTAICO (OFF GRID)"].includes(project.tipoDeServico)) {
		purchaseControltags.push({
			id: "671146dea74d7a14b032aff3",
			titulo: "KIT SOLAR",
			cores: {
				primaria: "#4682B4",
				secundaria: "#B0E0E6",
			},
		});
	}
	return [...projectTags, ...purchaseControltags];
}
