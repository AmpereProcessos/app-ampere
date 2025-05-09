import { apiHandler } from "@/utils/api";
import { formatDateAsLocale, getProductsStr } from "@/utils/methods/formatting";
import type { TContractRequest } from "@/utils/schemas/contract-requests";
import { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";

import type { TProject } from "@/utils/schemas/projects";
import type { TPurchaseControl, TPurchaseControlTag } from "@/utils/schemas/purchases";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToProjectsDatabase from "@/utils/services/mongodb/projects";
import connectToSolicitacoesDatabase from "@/utils/services/mongodb/requests";
import dayjs from "dayjs";
import { type AnyBulkWriteOperation, type Collection, type Db, ObjectId, WithId } from "mongodb";
import type { NextApiHandler } from "next";
import { getContractValue } from "../../utils/methods/util/projects";
import type { TUser } from "@/utils/schemas/crm/user.schema";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import type { TCRMUser } from "@/utils/schemas/crm/users.schema";
import { allActiveSellers, allSellers } from "@/utils/select-options";
import { getProjectExportFormatted, ProjectExportablesSchema, type TProjectExportables } from "@/lib/data-exports";
import { z } from "zod";
import connectToAuxiliariesDatabase from "@/utils/services/mongodb/auxiliaries";
import type { TTag } from "@/utils/schemas/tags";
import type { TServiceOrderTag } from "@/utils/schemas/service-order";
import createHttpError from "http-errors";
const getExport: NextApiHandler<any> = async (req, res) => {
	// const projectsDb = await connectToProjectsDatabase();
	// const requestsDb: Db = await connectToSolicitacoesDatabase();

	// const projectsCollection = projectsDb.collection<TProject>("dados");
	// const requestsCollection = requestsDb.collection<TContractRequest>("contrato");

	// const startDate = dayjs().subtract(1, "month").startOf("month").subtract(3, "hour").toDate();
	// const endDate = dayjs().subtract(1, "month").endOf("month").subtract(3, "hour").toDate();
	// console.log(startDate, endDate);
	// const projects = await projectsCollection
	// 	.find({
	// 		tipoDeServico: { $in: ["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"] },
	// 		"contrato.dataAssinatura": { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
	// 	})
	// 	.toArray();
	// const requests = await requestsCollection.find({}).toArray();

	// const formatted = projects
	// 	.map((project) => {
	// 		const projectRequest = requests.find((request) => request._id.toString() === project.idSolicitacaoContrato);

	// 		if (!projectRequest) return null;

	// 		const paymentForm = projectRequest.formaDePagamento;
	// 		if (!paymentForm) return null;
	// 		if (["100% À VISTA NO DINHEIRO/DÉBITO/PIX", "100% À VISTA NO DÉBITO/PIX", "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO"].includes(paymentForm)) {
	// 			return {
	// 				qtde: project.qtde,
	// 				nome: project.nomeDoContrato,
	// 				formaDePagamento: paymentForm,
	// 				credor: project.pagamento.credor,
	// 				dataAssinatura: formatDateAsLocale(project.contrato.dataAssinatura),
	// 			};
	// 		}
	// 	})
	// 	.filter((project) => !!project);

	// return res.json({
	// 	formatted: formatted.map((f) => `${f.qtde} ${f.nome}`).join(","),
	// });
	return res.send("DESATIVADA");
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
