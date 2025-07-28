import { apiHandler } from "@/utils/api";

import type { TPurchaseControl } from "@/utils/schemas/purchases";

import connectToProjectsDatabase from "@/utils/services/mongodb/projects";

import { ObjectId, type AnyBulkWriteOperation } from "mongodb";
import type { NextApiHandler } from "next";

import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import type { TMaterial } from "@/utils/schemas/materials";
import type { TProject } from "@/utils/schemas/projects";
import type { TServiceOrder } from "@/utils/schemas/service-order";

const userName = "DEVISSON LIMA";
const getExport: NextApiHandler<any> = async (req, res) => {
	const projectsDb = await connectToProjectsDatabase();

	const projectsCollection = projectsDb.collection<TProject>("dados");

	const projects = await projectsCollection
		.find({
			$or: [
				{
					"vendedor.nome": userName,
				},
				{
					insider: userName,
				},
			],
		})
		.toArray();

	const byType = projects.reduce(
		(acc, project) => {
			const systemPower = project.sistema.potPico;
			const seller = project.vendedor.nome;
			const insider = project.insider;

			if (seller === userName) {
				acc.VENDEDOR.contagem++;
				acc.VENDEDOR.potencia += systemPower;
				return acc;
			}
			if (insider === userName) {
				acc.INSIDER.contagem++;
				acc.INSIDER.potencia += systemPower;
				return acc;
			}
			return acc;
		},
		{
			VENDEDOR: {
				contagem: 0,
				potencia: 0,
			},
			INSIDER: {
				contagem: 0,
				potencia: 0,
			},
		},
	);
	const totalProjectsQty = byType.VENDEDOR.contagem + byType.INSIDER.contagem;
	const totalProjectsPower = byType.VENDEDOR.potencia + byType.INSIDER.potencia;
	return res.json({
		totalProjectsQty,
		totalProjectsPower,
		asSeller: byType.VENDEDOR,
		asInsider: byType.INSIDER,
	});
	// const analysis = projects.map((project) => {
	// 	let comercialValidationConclusionDate = project.obra.saida;
	// 	if (["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"].includes(project.tipoDeServico)) {
	// 		if (project.obra.saida) comercialValidationConclusionDate = project.obra.saida;
	// 		else if (project.compra.dataEntrega) comercialValidationConclusionDate = project.compra.dataEntrega;
	// 		else if (project.contrato.dataAssinatura) comercialValidationConclusionDate = project.contrato.dataAssinatura;
	// 	} else {
	// 		comercialValidationConclusionDate = project.obra.saida || project.contrato.dataAssinatura;
	// 	}

	// 	return {
	// 		QTDE: project.qtde,
	// 		NOME: project.nomeDoContrato,
	// 		"TIPO DE SERVIÇO": project.tipoDeServico,
	// 		"DATA DE VALIDAÇÃO COMERCIAL": formatDateAsLocale(comercialValidationConclusionDate) || null,
	// 	};
	// });
	// const concludedWithCommercialValidation = analysis.filter((project) => !!project["DATA DE VALIDAÇÃO COMERCIAL"]);
	// const concludedWithoutCommercialValidation = analysis.filter((project) => !project["DATA DE VALIDAÇÃO COMERCIAL"]);
	// console.log(`Número de projetos com validação comercial: ${concludedWithCommercialValidation.length}`);
	// console.log(`Número de projetos sem validação comercial: ${concludedWithoutCommercialValidation.length}`);

	// const bulkwriteUpdateArr: AnyBulkWriteOperation<TProject>[] = projects.map((project) => {
	// 	let comercialValidationConclusionDate = project.obra.saida;
	// 	if (["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"].includes(project.tipoDeServico)) {
	// 		if (project.obra.saida) comercialValidationConclusionDate = project.obra.saida;
	// 		else if (project.compra.dataEntrega) comercialValidationConclusionDate = project.compra.dataEntrega;
	// 		else if (project.contrato.dataAssinatura) comercialValidationConclusionDate = project.contrato.dataAssinatura;
	// 	} else {
	// 		comercialValidationConclusionDate = project.obra.saida || project.contrato.dataAssinatura;
	// 	}

	// 	return {
	// 		updateOne: {
	// 			filter: { _id: project._id },
	// 			update: {
	// 				$set: {
	// 					dataValidacaoComercial: comercialValidationConclusionDate,
	// 				},
	// 			},
	// 		},
	// 	};
	// });

	// const bulkwriteResponse = await projectsCollection.bulkWrite(bulkwriteUpdateArr);
	// return res.json({
	// 	concludedWithCommercialValidation,
	// 	concludedWithoutCommercialValidation,
	// 	groupedServiceTypesWithoutCommercialValidation: concludedWithoutCommercialValidation.reduce((acc: { [key: string]: number }, project) => {
	// 		const serviceType = project["TIPO DE SERVIÇO"];
	// 		if (!acc[serviceType]) acc[serviceType] = 0;
	// 		acc[serviceType] = acc[serviceType] + 1;
	// 		return acc;
	// 	}, {}),
	// });
};
export default apiHandler({
	GET: getExport,
});
