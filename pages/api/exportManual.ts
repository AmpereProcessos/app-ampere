import { apiHandler } from "@/utils/api";
import { formatDateAsLocale, getProductsStr } from "@/utils/methods/formatting";
import type { TContractRequest } from "@/utils/schemas/contract-requests";
import type { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";

import type { TProject, TProjectComissionedUser } from "@/utils/schemas/projects";
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
import { getComissionDefinitions, getComissionValue } from "@/lib/comissions";
const getExport: NextApiHandler<any> = async (req, res) => {
	const projectsDb = await connectToProjectsDatabase();
	const crmDb = await connectToCRMDatabase();

	const projectsCollection = projectsDb.collection<TProject>("dados");
	const crmUsersCollection = crmDb.collection<TCRMUser>("users");
	const crmOpportunitiesCollection = crmDb.collection<TOpportunity>("opportunities");
	const startTwoMonthsAgo = dayjs().subtract(2, "month").startOf("month").toISOString();
	const today = dayjs().toISOString();
	const projects = await projectsCollection
		.find({
			"comissoes.dataReferencia": { $gte: startTwoMonthsAgo, $lte: today },
		})
		.toArray();

	const opportunitiesObjectIds = projects.filter((project) => !!project.idProjetoCRM).map((project) => new ObjectId(project.idProjetoCRM as string));
	const crmUsers = await crmUsersCollection.find({}).toArray();
	const crmOpportunities = await crmOpportunitiesCollection.find({ _id: { $in: opportunitiesObjectIds } }).toArray();

	const bulkwriteArr: AnyBulkWriteOperation<TProject>[] = projects
		.map((project) => {
			const opportunity = crmOpportunities.find((opportunity) => opportunity._id.toString() === project.idProjetoCRM);
			if (!opportunity) {
				console.log("[ERROR] Opportunity not found for project", project.nomeDoContrato);
				return null;
			}
			const saleValue = getContractValue({
				projectValue: project.sistema.valorProjeto,
				structureValue: project.estruturaPersonalizada.valor || 0,
				paValue: project.padrao?.valor || 0,
				oemValue: project.oem?.valor || 0,
				insuranceValue: project.seguro?.valor || 0,
			});
			const opportunityResponsiblesUniqueRoles = [...new Set(opportunity.responsaveis.map((responsible) => responsible.papel))];
			const opportunityResponsiblesCombination = opportunityResponsiblesUniqueRoles.sort((a, b) => a.localeCompare(b)).join(" + ");

			const opportunitySeller = opportunity.responsaveis.find((responsible) => responsible.papel === "VENDEDOR");
			const opportunityInsider = opportunity.responsaveis.find((responsible) => responsible.papel === "SDR");
			const opportunitySellerUser = crmUsers.find((user) => user._id.toString() === opportunitySeller?.id);
			const opportunityInsiderUser = crmUsers.find((user) => user._id.toString() === opportunityInsider?.id);
			const comissionableUsers: TProjectComissionedUser[] = opportunity.responsaveis
				.map((responsible) => {
					const responsibleUser = crmUsers.find((user) => user._id.toString() === responsible.id);
					if (!responsibleUser) {
						console.log("[ERROR] Responsible user not found for opportunity", { opportunityIdentifier: opportunity.identificador, responsibleIdentifier: responsible.id });
						return null;
					}
					const comissionDefinition = getComissionDefinitions({
						systemPeakPower: project.sistema.potPico,
						saleValue,
						saleProjectValue: project.sistema.valorProjeto,
						saleStructureValue: project.estruturaPersonalizada.valor || 0,
						saleEnergyPaValue: project.padrao?.valor || 0,
						saleOeMValue: project.oem?.valor || 0,
						saleInsuranceValue: project.seguro?.valor || 0,
						saleResponsiblesCombination: opportunityResponsiblesCombination,
						salePartnerId: opportunity.idParceiro,
						saleSellerPartnerId: opportunitySellerUser?.idParceiro || "",
						saleSDRPartnerId: opportunityInsiderUser?.idParceiro || "",
					});
					const comissionValue = getComissionValue({
						userRole: responsible.papel,
						projectTypeId: opportunity.tipo.id,
						userComissionConfig: responsibleUser.comissionamento,
						definitions: comissionDefinition,
					});
					const comissionableUser: TProjectComissionedUser = {
						idCrm: responsibleUser._id.toString(),
						nome: responsibleUser.nome,
						papel: responsible.papel as TProjectComissionedUser["papel"],
						porcentagem: (comissionValue / saleValue) * 100,
						valor: comissionValue,
						avatar_url: responsibleUser.avatar_url,
					};
					return comissionableUser;
				})
				.filter((user) => !!user);
			return {
				updateOne: {
					filter: { _id: project._id },
					update: {
						$set: { "comissoes.comissionados": comissionableUsers },
					},
				},
			};
		})
		.filter((operation) => !!operation);

	// const bulkwriteResponse = await projectsCollection.bulkWrite(bulkwriteArr);
	console.log(bulkwriteArr.length);
	return res.json({
		bulkwriteArr,
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
