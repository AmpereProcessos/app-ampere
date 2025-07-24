import { getContractValue } from "@/utils/methods/util/projects";
import type { TUser } from "@/utils/schemas/crm/users.schema";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import connectToAppProjectsDatabase from "@/utils/services/mongodb/projects";
import { ProjectComissionSimplifiedProjection, type TProject, type TProjectComissionSimplified } from "@/utils/schemas/projects";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import type { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";
import { type Filter, type Collection, ObjectId, type WithId } from "mongodb";
import createHttpError from "http-errors";
import dayjs from "dayjs";
import { appRouterApiHandler, type UnwrapAppRouterNextResponse } from "@/utils/api-app-router";

const GeneralQueryParamsSchema = z.object({
	after: z
		.string({ required_error: "Parâmetros de período inválidos.", invalid_type_error: "Parâmetros de período inválidos." })
		.datetime({ message: "Parâmetros de período inválidos." }),
	before: z
		.string({ required_error: "Parâmetros de período inválidos.", invalid_type_error: "Parâmetros de período inválidos." })
		.datetime({ message: "Parâmetros de período inválidos." }),
	sellers: z.string({ invalid_type_error: "Tipo não válido para os vendedores." }).optional().nullable(),
	serviceTypes: z.string({ invalid_type_error: "Tipo não válido para os tipos de serviço." }).optional().nullable(),
});

const ProjectIdQueryParamsSchema = z.object({
	projectId: z.string({ required_error: "ID do projeto é obrigatório.", invalid_type_error: "ID do projeto é obrigatório." }),
});

const GetComissionDataQueryParamsSchema = z.union([GeneralQueryParamsSchema, ProjectIdQueryParamsSchema]);

export type TGetComissionDataInput = z.infer<typeof GetComissionDataQueryParamsSchema>;

async function getComissionData(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const searchParamsEntries = Object.fromEntries(searchParams);
	console.log("Search params entries", searchParamsEntries);
	const params = GetComissionDataQueryParamsSchema.parse(searchParamsEntries);
	if ("projectId" in params) {
		const { projectId } = params;

		const appDb = await connectToAppProjectsDatabase();
		const appProjectsCollection = appDb.collection<TProject>("dados");

		const crmDb = await connectToCRMDatabase();
		const crmUsersCollection = crmDb.collection<TUser>("users");
		const crmOpportunitiesCollection = crmDb.collection<TOpportunity>("opportunities");

		const appProject = await appProjectsCollection.findOne({ _id: new ObjectId(projectId) });
		if (!appProject) throw new createHttpError.NotFound("Projeto não encontrado.");
		if (!appProject.idProjetoCRM)
			// Now, looking for the equivalent crm opportunity
			throw new createHttpError.NotFound("Oportunidade CRM não encontrada.");
		const crmOpportunity = await crmOpportunitiesCollection.findOne({ _id: new ObjectId(appProject.idProjetoCRM) });
		if (!crmOpportunity) throw new createHttpError.NotFound("Oportunidade CRM não encontrada.");

		// Getting the assotiated crm users for the opportunity
		const crmOpportunityResponsiblesObjectIds = crmOpportunity.responsaveis.map((responsible) => new ObjectId(responsible.id)) || [];
		const crmUsers = await crmUsersCollection.find({ _id: { $in: crmOpportunityResponsiblesObjectIds } }).toArray();

		const crmSeller = crmOpportunity.responsaveis.find((r) => r.papel === "VENDEDOR");
		const crmSDR = crmOpportunity.responsaveis.find((r) => r.papel === "SDR");
		const crmSellerUserInfo = crmUsers.find((user) => crmSeller?.id === user._id.toString());
		const crmSDRUserInfo = crmUsers.find((user) => crmSDR?.id === user._id.toString());

		// Getting the commission values for each responsible of the opportunity
		const { seller, insider } = getCRMCommissionValues({ sellerUserInfo: crmSellerUserInfo, sdrUserInfo: crmSDRUserInfo });

		const isComissionPaid = !!appProject.comissoes?.pagamentoRealizado;
		const isComissionDefined = !!appProject.comissoes?.efetivado;

		const comissianableItems = appProject.comissoes?.itensComissionaveis || ["SISTEMA", "PADRÃO", "ESTRUTURA PERSONALIZADA", "OEM", "SEGURO"];
		return NextResponse.json(
			{
				data: {
					default: undefined,
					byProjectId: {
						_id: appProject._id.toString(),
						idOportunidadeCRM: crmOpportunity._id.toString(),
						nome: appProject.nomeDoContrato,
						tipo: appProject.tipoDeServico,
						identificadorApp: appProject.qtde,
						identificadorCrm: appProject.codigoSVB,
						uf: appProject.uf,
						cidade: appProject.cidade,
						vendedorApp: appProject.vendedor.nome,
						insiderApp: appProject.insider,
						dataAssinatura: appProject.contrato?.dataAssinatura,
						dataRecebimentoParcial: appProject.compra?.dataPagamento,
						potenciaPico: appProject.sistema?.potPico,
						valorProjeto: appProject.sistema?.valorProjeto,
						valorPadrao: appProject.padrao?.valor,
						valorEstruturaPersonalizada: appProject.estruturaPersonalizada?.valor,
						valorOem: appProject.oem?.valor,
						valorSeguro: appProject.seguro?.valor,
						valorContrato: getContractValue({
							projectValue: appProject.sistema?.valorProjeto,
							paValue: appProject.padrao?.valor,
							structureValue: appProject.estruturaPersonalizada?.valor,
							oemValue: appProject.oem?.valor,
							insuranceValue: appProject.seguro?.valor,
						}),
						comissoes: {
							efetivado: isComissionDefined,
							comissionados: appProject.comissoes?.comissionados || [],
							pagamentoRealizado: isComissionPaid,
							itensComissionaveis: comissianableItems,
							valorComissionavel: appProject.comissoes?.valorComissionavel || 0,
							valorComissionavelSugerido: getContractValue({
								projectValue: comissianableItems.includes("SISTEMA") ? appProject.sistema?.valorProjeto : 0,
								paValue: comissianableItems.includes("PADRÃO") ? appProject.padrao?.valor : 0,
								structureValue: comissianableItems.includes("ESTRUTURA PERSONALIZADA") ? appProject.estruturaPersonalizada?.valor : 0,
								oemValue: comissianableItems.includes("OEM") ? appProject.oem?.valor : 0,
								insuranceValue: comissianableItems.includes("SEGURO") ? appProject.seguro?.valor : 0,
							}),
							porcentagemVendedor: seller,
							porcentagemInsider: insider,
							dataValidacaoVendedor: appProject.comissoes?.dataValidacaoVendedor,
							dataValidacaoInsider: appProject.comissoes?.dataValidacaoInsider,
						},
					},
				},
				message: "Dados das comissões do projeto obtidos com sucesso.",
			},
			{ status: 200 },
		);
	}
	const { after, before, sellers, serviceTypes } = params;

	// Ajusting the filters
	const afterFixed = dayjs(after).subtract(3, "hour").toISOString();
	const beforeFixed = dayjs(before).subtract(3, "hour").toISOString();
	const sellersArr = sellers?.split(",").filter((s) => !!s) || [];
	const serviceTypesArr = serviceTypes?.split(",").filter((s) => !!s) || [];

	const appDb = await connectToAppProjectsDatabase();
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
		serviceTypes: serviceTypesArr,
	});
	const opportunities = await getOpportunitiesForComission({
		collection: crmOpportunitiesCollection,
		ids: projects.map((project) => project.idProjetoCRM).filter((id) => !!id) as string[],
	});

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
				idOportunidadeCRM: crmOpportunity._id.toString(),
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
					structureValue: project.estruturaPersonalizada?.valor,
				}),
				comissoes: {
					efetivado: isComissionDefined,
					comissionados: project.comissoes?.comissionados || [],
					pagamentoRealizado: isComissionPaid,
					itensComissionaveis: comissianableItems,
					valorComissionavel: project.comissoes?.valorComissionavel || 0,
					valorComissionavelSugerido: getContractValue({
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

	return NextResponse.json(
		{
			data: {
				default: comissionInformation,
				byProjectId: undefined,
			},
			message: "Dados das comissões obtidos com sucesso.",
		},
		{ status: 200 },
	);
}

export type TGetComissionDataOutput = UnwrapAppRouterNextResponse<Awaited<ReturnType<typeof getComissionData>>>;
export type TGetComissionDataOutputDefault = Exclude<TGetComissionDataOutput["data"]["default"], undefined>;
export type TGetComissionDataOutputByProjectId = Exclude<TGetComissionDataOutput["data"]["byProjectId"], undefined>;

export const GET = appRouterApiHandler({
	GET: getComissionData,
});

/**
 * UTILITIES
 */
type GetProjectsForComissionParams = {
	collection: Collection<TProject>;
	after: string;
	before: string;
	sellers: string[];
	serviceTypes: string[];
};
async function getProjectsForComission({ collection, after, before, sellers, serviceTypes }: GetProjectsForComissionParams) {
	const signedQueryFilter: Filter<TProject> = {
		"contrato.status": "ASSINADO",
	};

	const referenceDateQueryFilter: Filter<TProject> = {
		"comissoes.dataReferencia": { $gte: after, $lte: before },
	};
	const sellersQueryFilter: Filter<TProject> = sellers.length > 0 ? { "comissoes.comissionados.idCrm": { $in: sellers } } : {};
	const serviceTypesQueryFilter: Filter<TProject> = serviceTypes.length > 0 ? { tipoDeServico: { $in: serviceTypes } } : {};

	const projectsQueryFilter: Filter<TProject> = {
		...signedQueryFilter,
		...referenceDateQueryFilter,
		...sellersQueryFilter,
		...serviceTypesQueryFilter,
	};
	const projects = await collection.find(projectsQueryFilter, { projection: ProjectComissionSimplifiedProjection }).toArray();

	return projects as WithId<TProjectComissionSimplified>[];
}
type GetOpportunitiesForComissionParams = {
	collection: Collection<TOpportunity>;
	ids: string[];
};
async function getOpportunitiesForComission({ collection, ids }: GetOpportunitiesForComissionParams) {
	const opportunitiesQueryFilter: Filter<TOpportunity> = {
		_id: { $in: ids.map((id) => new ObjectId(id)) },
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
