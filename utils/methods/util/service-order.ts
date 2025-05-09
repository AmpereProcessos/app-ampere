import type { TProject, TProjectDTO } from "@/utils/schemas/projects";
import type { TServiceOrder, TServiceOrderDTO } from "@/utils/schemas/service-order";

export function getObjectDifference(obj1: any, obj2: any, parentKey = "") {
	const diff = {};

	for (const key in obj2) {
		const currentKey = parentKey ? `${parentKey}.${key}` : key;

		if (typeof obj2[key] === "object" && obj2[key] !== null) {
			if (Array.isArray(obj2[key])) {
				// Handle arrays
				if (!Array.isArray(obj1[key])) {
					//@ts-ignore
					diff[currentKey] = obj2[key];
				} else {
					//@ts-ignore
					diff[currentKey] = obj2[key];
				}
			} else {
				// Handle nested objects
				const nestedDiff = getObjectDifference(obj1[key], obj2[key], currentKey);
				Object.assign(diff, nestedDiff);
			}
		} else if (!obj1 || obj1[key] !== obj2[key]) {
			//@ts-ignore
			diff[currentKey] = obj2[key];
		}
	}

	return diff;
}

export function getObservationsGroupedByTopic(observations: TServiceOrderDTO["observacoes"]) {
	if (!Array.isArray(observations)) return [];
	const reduced = observations.reduce((acc: { [key: string]: string[] }, current) => {
		const topic = current.topico.toUpperCase();
		if (!acc[topic]) acc[topic] = [];
		acc[topic].push(current.descricao);
		return acc;
	}, {});
	return Object.entries(reduced).map(([topic, observations]) => ({ topico: topic, observacoes: observations }));
}

export function getServiceObservationsFromObras(str: string): TServiceOrderDTO["observacoes"] {
	return str.split("/").map((obs) => ({ topico: "OBRA", descricao: obs }));
}

export function getAvailableProjectMaterials(str: string) {
	const availableMaterialTextSplitted = str.split("\n");
	const materialsList = availableMaterialTextSplitted
		.map((i) => {
			const materialInfo = i.split("-");

			// obtaining the material qty and desc via arr position
			const materialQty = materialInfo[0] ? Number(materialInfo[0].trim()) : null;
			const materialDesc = materialInfo[1] ? materialInfo[1] : null;

			// in case the material qty or desc is present, return the material object
			if (materialQty || materialDesc)
				return {
					qtde: materialQty,
					descricao: materialDesc || "MATERIAL NÃO IDENTIFICADO",
				};
			// in case neither the qty or the desc is present, return null
			return null;
		})
		// filtering out the null values
		.filter((x) => !!x);
	return materialsList;
}

export function getMissingProjectMaterials(str: string) {
	const missingMaterialTextSplitted = str.split("\n");
	const materialsList = missingMaterialTextSplitted
		.map((i) => {
			const materialInfo = i.split("-");

			// obtaining the material qty and desc via arr position
			const materialQty = materialInfo[0] ? Number(materialInfo[0].trim()) : null;
			const materialDesc = materialInfo[1] ? materialInfo[1] : null;

			// in case the material qty or desc is present, return the material object
			if (materialQty || materialDesc)
				return {
					qtde: materialQty,
					descricao: materialDesc || "MATERIAL NÃO IDENTIFICADO",
				};
			// in case neither the qty or the desc is present, return null
			return null;
		})
		// filtering out the null values
		.filter((x) => !!x);
	return materialsList;
}

export function getServiceOrderInverterMetadataFromProject(project: TProject) {
	const inverterQty = project.produtos?.filter((p) => p.categoria === "INVERSOR").reduce((acc, curr) => acc + curr.qtde, 0);
	const inverterModel = project.produtos
		?.filter((p) => p.categoria === "INVERSOR")
		.map((p) => `${p.qtde}x ${p.modelo}`)
		.join(", ");
	const inverterPower = project.produtos
		?.filter((p) => p.categoria === "INVERSOR")
		.map((p) => `${p.qtde}x ${p.potencia}`)
		.join(", ");
	return {
		qtde: inverterQty,
		modelo: inverterModel,
		potencia: inverterPower,
	};
}
export function getServiceOrderModulesMetadataFromProject(project: TProject) {
	const modulosQty = project.produtos?.filter((p) => p.categoria === "MÓDULO").reduce((acc, curr) => acc + curr.qtde, 0);
	const modulosModel = project.produtos
		?.filter((p) => p.categoria === "MÓDULO")
		.map((p) => `${p.qtde}x ${p.modelo}`)
		.join(", ");
	const modulosPower = project.produtos
		?.filter((p) => p.categoria === "MÓDULO")
		.map((p) => `${p.qtde}x ${p.potencia}`)
		.join(", ");
	return {
		qtde: modulosQty,
		modelo: modulosModel,
		potencia: modulosPower,
	};
}
export function getServiceOrderTagsFromProject(project: TProject) {
	const serviceOrdertags: Exclude<TServiceOrder["etiquetas"], undefined | null> = [];
	const projectTags = project.etiquetas || [];
	if (project.homologacao.fastTrack) {
		serviceOrdertags.push({
			id: "6798eb1b19ad4c2b679bd2e1",
			titulo: "FAST TRACK",
			cores: {
				primaria: "#058A05",
				secundaria: "#B7FDB7",
			},
		});
	}
	if (project.pagamento.credor === "SOL FÁCIL") {
		serviceOrdertags.push({
			id: "6798eb2bd422f4f93779dd0d",
			titulo: "DESLIGAMENTO REMOTO",
			cores: {
				primaria: "#FF0000",
				secundaria: "#FFCCCB",
			},
		});
	}
	if (project.obra.pendencias === "LEVAR ESTRUTURA NA MONTAGEM") {
		serviceOrdertags.push({
			id: "6798eb4e38fd2c093589ee7f",
			titulo: "TRANSPORTAR ESTRUTURA",
			cores: {
				primaria: "#8B4513",
				secundaria: "#DFD0BC",
			},
		});
	}
	return [...projectTags, ...serviceOrdertags];
}
