import { apiHandler } from "@/utils/api";

import type { TPurchaseControl } from "@/utils/schemas/purchases";

import connectToProjectsDatabase from "@/utils/services/mongodb/projects";

import { type Db, ObjectId, type AnyBulkWriteOperation, type Collection } from "mongodb";
import type { NextApiHandler } from "next";

import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import type { TMaterial } from "@/utils/schemas/materials";
import type { TProject } from "@/utils/schemas/projects";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import connectToRequestsDatabase from "@/utils/services/mongodb/requests";
import { TContractRequestDTO } from "@/utils/schemas/contract-requests";
import dayjs from "dayjs";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import type { TEmployee } from "@/utils/schemas/users";
import { novu } from "@/utils/services/novu";
import { getNovuSubscriberId } from "@/utils/services/novu/config";

const previousMonth = dayjs().subtract(1, "month").startOf("month");
const getExport: NextApiHandler<any> = async (req, res) => {
	const admDb = await connectToAdministrationDatabase();
	const usersCollection: Collection<TEmployee> = admDb.collection("colaboradores");

	const employees = await usersCollection.find({}).toArray();

	const novuResponse = await novu.subscribers.createBulk({
		subscribers: employees
			.filter((r) => !!r.email)
			.map((employee) => ({
				subscriberId: getNovuSubscriberId(employee._id.toString()),
				email: employee.email,
				firstName: employee.nome,
				phone: employee.telefone,
				avatar: employee.avatar_url,
				locale: "pt-BR",
			})),
	});
	console.log(novuResponse);

	return res.json({ message: "Subscribers created successfully" });
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
