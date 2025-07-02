import type { Collection } from "mongodb";
import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/services/mongodb/projects";
import type { NextApiHandler } from "next";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TProject, TProjectComissionedUser } from "@/utils/schemas/projects";
import createHttpError from "http-errors";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import type { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";
import type { TCRMUser, TUserComissionItem } from "@/utils/schemas/crm/users.schema";
import type { TTechnicalAnalysis } from "@/utils/schemas/technical-analysis";
import { getComissionDefinitions, getComissionValue } from "@/lib/comissions";
import { getContractValue } from "@/utils/methods/util/projects";

type PostResponse = {
	data: { insertedId: string };
	message: string;
};
const createNewProjectRoute: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const project: TProject = req.body;

	if (!project.idProjetoCRM) throw new createHttpError.BadRequest("O projeto não possui uma oportunidade CRM associada.");

	const crmDb = await connectToCRMDatabase();
	const appDb = await connectToDatabase();

	const projectsCollection: Collection<TProject> = appDb.collection("dados");

	const opportunitiesCollection: Collection<TOpportunity> = crmDb.collection("opportunities");
	const crmUsersCollection: Collection<TCRMUser> = crmDb.collection("users");
	const technicalAnalysisCollection: Collection<TTechnicalAnalysis> = crmDb.collection("technical-analysis");

	// Getting the latest inserted project
	const latestInserted = await projectsCollection
		.aggregate([
			{
				$sort: {
					qtde: -1,
				},
			},
			{
				$limit: 1,
			},
		])
		.toArray();

	// Defining the indexer for the new project
	const lastIndexer = latestInserted[0].qtde;
	const newIndexer = lastIndexer + 1;

	// Getting the seller from the CRM
	let seller: TProject["vendedor"] = project.vendedor;

	const sellerInCrm = await crmUsersCollection.findOne({ nome: seller.nome });
	if (sellerInCrm) {
		seller = {
			nome: sellerInCrm.nome,
			idCRM: sellerInCrm._id.toString(),
			avatar: sellerInCrm.avatar_url,
		};
	}

	// Getting the client ID from the CRM
	let clientCrmId: string | null = null;
	console.log("[INFO] [ADD PROJECT] Getting the CRM opportunity.");
	const opportunity = await opportunitiesCollection.findOne({
		_id: new ObjectId(project.idProjetoCRM),
	});
	if (!opportunity) throw new createHttpError.BadRequest("O projeto não possui uma oportunidade CRM associada.");
	// Defining the client ID from the CRM
	clientCrmId = opportunity.idCliente;

	const saleValue = getContractValue({
		projectValue: project.sistema.valorProjeto,
		structureValue: project.estruturaPersonalizada.valor || 0,
		paValue: project.padrao?.valor || 0,
		oemValue: project.oem?.valor || 0,
		insuranceValue: project.seguro?.valor || 0,
	});
	// const opportunitySeller = opportunity.responsaveis.find((responsible) => responsible.papel === "VENDEDOR");
	// const opportunityInsider = opportunity.responsaveis.find((responsible) => responsible.papel === "SDR");

	const opportunityResponsibleUsers = await crmUsersCollection
		.find(
			{
				_id: { $in: opportunity.responsaveis.map((responsible) => new ObjectId(responsible.id)) },
			},
			{
				projection: {
					_id: 1,
					comissionamento: 1,
				},
			},
		)
		.toArray();
	console.log("[INFO] [ADD PROJECT] Getting the opportunity responsible users for comission processing.");
	const responsiblesWithComission: TProjectComissionedUser[] = opportunity.responsaveis.map((responsible) => {
		console.log("[INFO] [ADD PROJECT] Processing comission for responsible user:", responsible.nome);
		const userComissionConfig = opportunityResponsibleUsers.find((user) => user._id.toString() === responsible.id);
		if (!userComissionConfig)
			return {
				nome: responsible.nome,
				papel: responsible.papel as TProjectComissionedUser["papel"],
				porcentagem: 0,
				avatar_url: responsible.avatar_url,
				dataEfetivacao: null,
				idCrm: responsible.id,
				dataPagamento: null,
				dataValidacao: null,
			};

		const opportunityResponsibleUniqueRoles = [...new Set(opportunity.responsaveis.map((responsible) => responsible.papel))];
		const opportunityResponsiblesCombination = opportunityResponsibleUniqueRoles.sort((a, b) => a.localeCompare(b)).join(" + ");
		const comissionDefinitions = getComissionDefinitions({
			systemPeakPower: project.sistema.potPico,
			saleValue: saleValue,
			saleProjectValue: project.sistema.valorProjeto,
			saleStructureValue: project.estruturaPersonalizada.valor || 0,
			saleEnergyPaValue: project.padrao?.valor || 0,
			saleOeMValue: project.oem?.valor || 0,
			saleInsuranceValue: project.seguro?.valor || 0,
			saleResponsiblesCombination: opportunityResponsiblesCombination,
		});
		const comissionValue = getComissionValue({
			userRole: responsible.papel,
			projectTypeId: opportunity.tipo.id,
			userComissionConfig: userComissionConfig.comissionamento,
			definitions: comissionDefinitions,
		});
		console.log("[INFO] [ADD PROJECT] Comission value for responsible user:", { name: responsible.nome, comissionValue });
		return {
			nome: responsible.nome,
			papel: responsible.papel as TProjectComissionedUser["papel"],
			porcentagem: comissionValue,
			avatar_url: responsible.avatar_url,
			dataEfetivacao: null,
			idCrm: responsible.id,
			dataPagamento: null,
			dataValidacao: null,
		};
	});

	let allocations: TProject["alocacoes"] = [];
	if (project.idVisitaTecnica) {
		console.log("[INFO] [ADD PROJECT] Getting the technical analysis details for the project.");
		const technicalAnalysis = await technicalAnalysisCollection.findOne({
			_id: new ObjectId(project.idVisitaTecnica),
		});
		if (technicalAnalysis) {
			console.log("[INFO] [ADD PROJECT] Technical analysis found, processing the allocations.");
			allocations =
				technicalAnalysis.suprimentos?.itens
					.filter((i) => !!i.idMaterial)
					.map((item) => ({
						idMaterial: item.idMaterial as string,
						nome: item.descricao,
						quantidade: 0, // non allocated yet
						quantidadePrevista: item.qtde,
						unidade: item.grandeza,
						precoUnitario: item.preco || 0,
						movimentacoes: [],
					})) || [];
		}
	}

	const insertResponse = await projectsCollection.insertOne({
		...project,
		comissoes: {
			comissionados: responsiblesWithComission,
			valorComissionavel: saleValue,
			itensComissionaveis: ["SISTEMA", "PADRÃO", "ESTRUTURA PERSONALIZADA", "OEM", "SEGURO"],
		},
		alocacoes: allocations,
		qtde: newIndexer,
		vendedor: {
			nome: seller.nome,
			codigo: seller.codigo,
			idCRM: seller.idCRM,
			avatar: seller.avatar,
		},
		idClienteCRM: clientCrmId,
	});
	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido na criação do projeto.");

	const insertedId = insertResponse.insertedId.toString();

	return res.status(201).json({ data: { insertedId }, message: "Projeto criado com sucesso !" });
};

export default apiHandler({ POST: createNewProjectRoute });
