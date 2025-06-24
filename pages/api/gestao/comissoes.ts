import connectToAppDatabase from "../../../utils/services/mongodb/projects";
import { calculateStringSimilarity } from "../../../utils/constants";
import connectToCRMDatabase from "../../../utils/services/mongodb/crm/main";
import { errorHandler } from "../../../utils/methods/handlers";
import { getContractValue } from "../../../utils/methods/util/projects";
import createHttpError from "http-errors";
import { type Collection, type Db, type Filter, ObjectId, type WithId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { ProjectComissionSimplifiedProjection, type TProjectComissionSimplified, type TProject } from "@/utils/schemas/projects";
import type { TUser } from "@/utils/schemas/crm/user.schema";
import { z } from "zod";
import type { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";
import dayjs from "dayjs";
import { apiHandler, UnwrapNextResponse, validateAuthenticationWithSession } from "@/utils/api";

const QueryParamsSchema = z.object({
	after: z
		.string({ required_error: "Parâmetros de período inválidos.", invalid_type_error: "Parâmetros de período inválidos." })
		.datetime({ message: "Parâmetros de período inválidos." }),
	before: z
		.string({ required_error: "Parâmetros de período inválidos.", invalid_type_error: "Parâmetros de período inválidos." })
		.datetime({ message: "Parâmetros de período inválidos." }),
	sellers: z.string({ invalid_type_error: "Tipo não válido para os vendedores." }).optional().nullable(),
	insiders: z.string({ invalid_type_error: "Tipo não válido para os insiders." }).optional().nullable(),
	serviceTypes: z.string({ invalid_type_error: "Tipo não válido para os tipos de serviço." }).optional().nullable(),
});

async function getComissionData(params: z.infer<typeof QueryParamsSchema>) {
	console.log(params);
	const { after, before, sellers, insiders, serviceTypes } = params;

	// Ajusting the filters
	const afterFixed = dayjs(after).subtract(3, "hour").toISOString();
	const beforeFixed = dayjs(before).subtract(3, "hour").toISOString();
	const sellersArr = sellers?.split(",").filter((s) => !!s) || [];
	const insidersArr = insiders?.split(",").filter((s) => !!s) || [];
	const serviceTypesArr = serviceTypes?.split(",").filter((s) => !!s) || [];

	const appDb = await connectToAppDatabase();
	const appProjectsCollection = appDb.collection<TProject>("dados");

	const crmDb = await connectToCRMDatabase();
	const crmUsersCollection = crmDb.collection<TUser>("users");
	const crmOpportunitiesCollection = crmDb.collection<TOpportunity>("opportunities");

	const crmUsers = await crmUsersCollection.find({}).toArray();
	const projects = await getProjectsForComission({
		collection: appProjectsCollection,
		after: afterFixed,
		before: beforeFixed,
		sellers: sellersArr,
		insiders: insidersArr,
		serviceTypes: serviceTypesArr,
	});
	const opportunities = await getOpportunitiesForComission({ collection: crmOpportunitiesCollection, after: afterFixed, before: beforeFixed });

	const comissionInformation = projects
		.map((project) => {
			// Getting the equivalent crm opportunity
			const crmOpportunity = opportunities.find((opportunity) => opportunity._id.toString() === project.idProjetoCRM);

			if (!crmOpportunity) return null;

			const crmOpportunityResponsibles = crmOpportunity.responsaveis || [];
			const crmSeller = crmOpportunityResponsibles.find((r) => r.papel === "VENDEDOR");
			const crmSDR = crmOpportunityResponsibles.find((r) => r.papel === "SDR");
			const crmSellerUserInfo = crmUsers.find((user) => crmSeller?.id === user._id.toString());
			const crmSDRUserInfo = crmUsers.find((user) => crmSDR?.id === user._id.toString());

			// Defining commission values
			const commissionPercentageValues = {
				seller: 0,
				insider: 0,
			};
			const isComissionPaid = !!project.comissoes?.pagamentoRealizado;
			const isComissionDefined = !!project.comissoes?.efetivado;

			const definedSellerComissionPercentage = project.comissoes?.porcentagemVendedor;
			const definedInsiderComissionPercentage = project.comissoes?.porcentagemInsider;

			// If the commission values are already defined, use them
			if (typeof definedSellerComissionPercentage === "number" && typeof definedInsiderComissionPercentage === "number") {
				commissionPercentageValues.seller = definedSellerComissionPercentage;
				commissionPercentageValues.insider = definedInsiderComissionPercentage;
			} else {
				// Else, use commission values defined in CRM for the responsible and representative
				const { seller, insider } = getCRMCommissionValues({ sellerUserInfo: crmSellerUserInfo, sdrUserInfo: crmSDRUserInfo });
				commissionPercentageValues.seller = seller;
				commissionPercentageValues.insider = insider;
			}

			const comissianableItems = project.comissoes?.itensComissionaveis || ["SISTEMA", "PADRÃO", "ESTRUTURA PERSONALIZADA", "OEM", "SEGURO"];
			return {
				_id: project._id.toString(),
				nome: project.nomeDoContrato,
				tipo: project.tipoDeServico,
				identificadorApp: project.qtde,
				identificadorCrm: project.codigoSVB,
				uf: project.uf,
				cidade: project.cidade,
				vendedorApp: project.vendedor.nome,
				insiderApp: project.insider,
				dataAssinatura: project.contrato?.dataAssinatura,
				dataRecebimentoParcial: project.compra?.dataPagamento,
				potenciaPico: project.sistema?.potPico,
				valorProjeto: project.sistema?.valorProjeto,
				valorPadrao: project.padrao?.valor,
				valorEstruturaPersonalizada: project.estruturaPersonalizada?.valor,
				valorOem: project.oem?.valor,
				valorSeguro: project.seguro?.valor,
				valorContrato: getContractValue({
					projectValue: project.sistema?.valorProjeto,
					paValue: project.padrao?.valor,
					structureValue: 0,
				}),
				comissoes: {
					efetivado: isComissionDefined,
					pagamentoRealizado: isComissionPaid,
					itensComissionaveis: comissianableItems,
					valorComissionavel: getContractValue({
						projectValue: comissianableItems.includes("SISTEMA") ? project.sistema?.valorProjeto : 0,
						paValue: comissianableItems.includes("PADRÃO") ? project.padrao?.valor : 0,
						structureValue: comissianableItems.includes("ESTRUTURA PERSONALIZADA") ? project.estruturaPersonalizada?.valor : 0,
						oemValue: comissianableItems.includes("OEM") ? project.oem?.valor : 0,
						insuranceValue: comissianableItems.includes("SEGURO") ? project.seguro?.valor : 0,
					}),
					porcentagemVendedor: commissionPercentageValues.seller,
					porcentagemInsider: commissionPercentageValues.insider,
					dataValidacaoVendedor: project.comissoes?.dataValidacaoVendedor,
					dataValidacaoInsider: project.comissoes?.dataValidacaoInsider,
				},
			};
		})
		.filter((project) => project !== null);

	return comissionInformation;
}

export type TComissionData = Awaited<ReturnType<typeof getComissionData>>;
async function getComissionDataHandler(req: NextApiRequest, res: NextApiResponse) {
	const session = await validateAuthenticationWithSession(req, res);
	const userHasAdministrativeViewPermission = !!session?.user.permissoes.administrativo.visualizar;
	const userHasFinancesViewPermission = !!session?.user.permissoes.financeiro.visualizar;
	if (!userHasAdministrativeViewPermission && !userHasFinancesViewPermission) throw new createHttpError.Forbidden("Você não tem permissão para acessar esta página.");

	const params = QueryParamsSchema.parse(req.query);
	const comissionData = await getComissionData(params);

	return res.status(200).json({ data: comissionData });
}

const UpdateComissionDataSchema = z.object({
	changes: z.array(
		z.object({
			crmProjectId: z.string({
				required_error: "ID do projeto CRM é obrigatório.",
				invalid_type_error: "ID do projeto CRM é obrigatório.",
			}),
			appProjectId: z.string({
				required_error: "ID do projeto App é obrigatório.",
				invalid_type_error: "ID do projeto App é obrigatório.",
			}),
			sellerCommission: z.number({
				required_error: "Porcentagem de comissão do vendedor é obrigatória.",
				invalid_type_error: "Porcentagem de comissão do vendedor é obrigatória.",
			}),
			insiderCommission: z.number({
				required_error: "Porcentagem de comissão do insider é obrigatória.",
				invalid_type_error: "Porcentagem de comissão do insider é obrigatória.",
			}),
			validateComissionValues: z.boolean({
				required_error: "Validação de comissões é obrigatória.",
				invalid_type_error: "Validação de comissões é obrigatória.",
			}),
		}),
	),
});
export type TUpdateComissionDataInput = z.infer<typeof UpdateComissionDataSchema>;
async function updateComissionDataHandler(req: NextApiRequest, res: NextApiResponse) {
	const session = await validateAuthenticationWithSession(req, res);
	const userHasAdministrativeEditPermission = !!session?.user.permissoes.administrativo.editar;
	const userHasFinancesEditPermission = !!session?.user.permissoes.financeiro.editar;
	if (!userHasAdministrativeEditPermission || !userHasFinancesEditPermission) throw new createHttpError.Forbidden("Você não tem permissão para acessar esta página.");

	const params = UpdateComissionDataSchema.parse(req.body);

	const { changes } = params;

	const appDb = await connectToAppDatabase();
	const appProjectsCollection = appDb.collection<TProject>("dados");

	const crmDb = await connectToCRMDatabase();
	const crmOpportunitiesCollection = crmDb.collection<TOpportunity>("opportunities");

	await updateAppProjectsComission({ collection: appProjectsCollection, changes });

	return res.status(201).json({
		message: "Atualizações feitas com sucesso !",
	});
}

export default apiHandler({
	GET: getComissionDataHandler,
	POST: updateComissionDataHandler,
});
type GetProjectsForComissionParams = {
	collection: Collection<TProject>;
	after: string;
	before: string;
	sellers: string[];
	insiders: string[];
	serviceTypes: string[];
};
async function getProjectsForComission({ collection, after, before, sellers, insiders, serviceTypes }: GetProjectsForComissionParams) {
	const signedQueryFilter: Filter<TProject> = {
		"contrato.status": "ASSINADO",
	};
	const photovoltaicQueryFilter: Filter<TProject> = {
		tipoDeServico: { $in: ["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"] },
		$and: [{ "compra.dataPagamento": { $gte: after } }, { "compra.dataPagamento": { $lte: before } }],
	};
	const nonPhotovoltaicQueryFilter: Filter<TProject> = {
		tipoDeServico: { $nin: ["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"] },
		$and: [{ "contrato.dataAssinatura": { $gte: after } }, { "contrato.dataAssinatura": { $lte: before } }],
	};
	const sellersQueryFilter: Filter<TProject> = sellers.length > 0 ? { "vendedor.nome": { $in: sellers } } : {};
	const insidersQueryFilter: Filter<TProject> = insiders.length > 0 ? { "insider.nome": { $in: insiders } } : {};
	const serviceTypesQueryFilter: Filter<TProject> = serviceTypes.length > 0 ? { tipoDeServico: { $in: serviceTypes } } : {};

	const projectsQueryFilter: Filter<TProject> = {
		...signedQueryFilter,
		...photovoltaicQueryFilter,
		...nonPhotovoltaicQueryFilter,
		...sellersQueryFilter,
		...insidersQueryFilter,
		...serviceTypesQueryFilter,
	};
	const projects = await collection.find(projectsQueryFilter, { projection: ProjectComissionSimplifiedProjection }).toArray();

	return projects as WithId<TProjectComissionSimplified>[];
}
type GetOpportunitiesForComissionParams = {
	collection: Collection<TOpportunity>;
	after: string;
	before: string;
};
async function getOpportunitiesForComission({ collection, after, before }: GetOpportunitiesForComissionParams) {
	const opportunitiesQueryFilter: Filter<TOpportunity> = {
		"ganho.data": { $gte: after, $lte: before },
	};
	const opportunities = await collection.find(opportunitiesQueryFilter).toArray();
	return opportunities as WithId<TOpportunity>[];
}

type GetCRMCommissionValuesParams = {
	sellerUserInfo: TUser | undefined;
	sdrUserInfo: TUser | undefined;
};
function getCRMCommissionValues({ sellerUserInfo, sdrUserInfo }: GetCRMCommissionValuesParams) {
	const commission = {
		seller: 0,
		insider: 0,
	};
	if (!sellerUserInfo && !sdrUserInfo) return commission;
	// In case there is information about an SDR, than, it is a sale with Representante
	if (sdrUserInfo) {
		commission.seller = sellerUserInfo?.comissoes.comSDR || 0;
		commission.insider = sdrUserInfo?.comissoes?.semSDR || 0;
	} else {
		commission.seller = sellerUserInfo?.comissoes?.semSDR || 0;
	}

	return commission;
}

type updateAppProjectsComissionProps = {
	collection: Collection<TProject>;
	changes: TUpdateComissionDataInput["changes"];
};
async function updateAppProjectsComission({ collection, changes }: updateAppProjectsComissionProps) {
	try {
		const bulkwriteAppUpdate = changes.map((project) => {
			const { crmProjectId, appProjectId, sellerCommission, insiderCommission } = project;
			return {
				updateOne: {
					filter: { _id: new ObjectId(appProjectId) },
					update: {
						$set: {
							"comissoes.porcentagemVendedor": sellerCommission,
							"comissoes.porcentagemInsider": insiderCommission,
							"comissoes.pagamentoRealizado": true,
						},
					},
				},
			};
		});
		if (bulkwriteAppUpdate.length > 0) {
			await collection.bulkWrite(bulkwriteAppUpdate);
			return;
		}
		return;
	} catch (error) {
		throw error;
	}
}
