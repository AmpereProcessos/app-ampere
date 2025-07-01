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
	const projectsDb = await connectToProjectsDatabase();
	const crmDb = await connectToCRMDatabase();

	const projectsCollection = projectsDb.collection<TProject>("dados");
	const crmUsersCollection = crmDb.collection<TCRMUser>("users");

	const projects = await projectsCollection.find({}).toArray();
	const crmUsers = await crmUsersCollection.find({}).toArray();

	const missingSellersMap = new Map<string, number>();
	const missingSdrsMap = new Map<string, number>();
	const comissionsBulkwrite: AnyBulkWriteOperation<TProject>[] = projects.map((project) => {
		let comissionDateReference: string | null = null;
		const comissioned = [];
		const sellerName = project.vendedor.nome;
		const sdrName = project.insider;

		const seller = crmUsers.find((user) => user.nome === sellerName);
		const sdr = crmUsers.find((user) => user.nome === sdrName);
		if (["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"].includes(project.tipoDeServico)) {
			comissionDateReference = project.compra.dataPagamento || null;
		} else {
			comissionDateReference = project.contrato.dataAssinatura || null;
		}

		if (sellerName && !seller) {
			missingSellersMap.set(sellerName || "", (missingSellersMap.get(sellerName || "") || 0) + 1);
		}
		if (sdrName && sdrName !== "NÃO DEFINIDO" && !sdr) {
			missingSdrsMap.set(sdrName || "", (missingSdrsMap.get(sdrName || "") || 0) + 1);
		}
		if (sellerName) {
			comissioned.push({
				idCrm: seller?._id.toString(),
				nome: sellerName,
				papel: "VENDEDOR",
				porcentagem: project.comissoes?.porcentagemVendedor || 0,
				avatar_url: seller?.avatar_url,
				dataEfetivacao: project.comissoes?.efetivado && comissionDateReference ? dayjs(comissionDateReference).endOf("month").subtract(3, "hours").toISOString() : null,
				dataPagamento: project.comissoes?.pagamentoRealizado && comissionDateReference ? dayjs(comissionDateReference).endOf("month").subtract(3, "hours").toISOString() : null,
			});
		}
		if (sdrName && sdrName !== "NÃO DEFINIDO" && sdrName !== sellerName) {
			comissioned.push({
				idCrm: sdr?._id.toString(),
				nome: sdrName,
				papel: "INSIDER",
				porcentagem: project.comissoes?.porcentagemInsider || 0,
				avatar_url: sdr?.avatar_url,
				dataEfetivacao: project.comissoes?.efetivado && comissionDateReference ? dayjs(comissionDateReference).endOf("month").subtract(3, "hours").toISOString() : null,
				dataPagamento: project.comissoes?.pagamentoRealizado && comissionDateReference ? dayjs(comissionDateReference).endOf("month").subtract(3, "hours").toISOString() : null,
			});
		}
		return {
			updateOne: {
				filter: { _id: project._id },
				update: {
					$set: { "comissoes.dataReferencia": comissionDateReference, "comissoes.comissionados": comissioned },
				},
			},
		};
	});

	const bulkwriteResponse = await projectsCollection.bulkWrite(comissionsBulkwrite);

	return res.json({
		bulkwriteResponse,
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
