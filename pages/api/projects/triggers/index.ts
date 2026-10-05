import { ensureProjectAssemblyServiceOrder } from "@/lib/projects/update-automations/service-orders";
import { syncServiceOrdersDeliveryRelease } from "@/lib/service-orders/delivery-release";
import { handleProjectUpdateJourneyStepsTracking } from "@/lib/project-journeys/tracking";
import { insertFunnelReference } from "@/repositories/crm-funnel-references/mutations";
import { insertOpportunity } from "@/repositories/crm-oportunities/mutations";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { getProductsStr } from "@/utils/methods/formatting";
import { getContractValue } from "@/utils/methods/util/projects";
import { getPurchaseControlTagsFromProject } from "@/utils/methods/util/purchase-controls";
import { getServiceOrderTagsFromProject } from "@/utils/methods/util/service-order";
import type { TFunnelReference } from "@/utils/schemas/crm/funnel-reference.schema";
import type { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";
import type { TUser } from "@/utils/schemas/crm/user.schema";
import type { TExpense } from "@/utils/schemas/expenses";
import type { TProject } from "@/utils/schemas/projects";
import type { TPurchaseControl } from "@/utils/schemas/purchases";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import dayjs from "dayjs";
import createHttpError from "http-errors";
import { type Collection, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import { z } from "zod";

type PostResponse = {
	data: { insertedId?: string; updatedId?: string };
	message: string;
};
const TriggerType = z.enum([
	"create-project-main-service-order",
	"create-project-main-purchase-control",
	"create-project-main-revenue",
	"sync-project-with-purchase",
	"create-opportunity-on-project-journey-end",
	"create-project-taxes-expense",
]);

const HandleTriggerPayload = z.object({
	projectId: z.string({ required_error: "ID do projeto não informado.", invalid_type_error: "Tipo não válido para o ID do projeto." }),
	triggerType: TriggerType,
});
export type THandleProjectTriggerInput = z.infer<typeof HandleTriggerPayload>;
export const handleProjectTrigger: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const { projectId, triggerType } = HandleTriggerPayload.parse(req.body);

	const db = await connectToDatabase();
	const projectscollection: Collection<TProject> = db.collection("dados");
	const serviceOrdersCollection: Collection<TServiceOrder> = db.collection("ordensDeServico");
	const purchaseControlsCollection: Collection<TPurchaseControl> = db.collection("controles-compras");
	const expensesCollection: Collection<TExpense> = db.collection("despesas");

	const project = await projectscollection.findOne({ _id: new ObjectId(projectId) });

	if (!project) {
		throw new createHttpError.NotFound("Projeto não encontrado.");
	}
	if (triggerType === "create-project-main-service-order") {
		const insertedServiceOrderId = await ensureProjectAssemblyServiceOrder({
			project,
			author: { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url },
			projectsCollection: projectscollection,
			serviceOrdersCollection,
		});
		await syncServiceOrdersDeliveryRelease({ project, serviceOrdersCollection });

		return res.status(200).json({
			data: { insertedId: insertedServiceOrderId },
			message: "Ordem de serviço criada com sucesso.",
		});
	}
	if (triggerType === "create-project-main-purchase-control") {
		const purchaseControl: TPurchaseControl = {
			status: "EM COTAÇÃO",
			titulo: `COMPRA DO ${project.nomeDoContrato}`,
			anotacoes: project.produtos ? `KIT COMPOSTO POR: ${getProductsStr(project.produtos)}` : "",
			projeto: {
				id: project._id.toString(),
				nome: project.nomeDoProjeto,
			},
			etiquetas: getPurchaseControlTagsFromProject(project),
			atualizacoes: [],
			totalPrevisto: project.compra.previsaoValorDoKit,
			liberacao: {
				data: project.compra.dataLiberacao,
				autor: {},
			},
			composicao: [],
			fornecedor: {},
			total: 0,
			faturamentos: [],
			entrega: {
				status: "AGUARDANDO COMPRA",
				localizacao: project.compra.localizacaoEntrega
					? {
							...project.compra.localizacaoEntrega,
							uf: project.compra.localizacaoEntrega.uf || "",
							cidade: project.compra.localizacaoEntrega.cidade || "",
						}
					: {
							uf: project.uf,
							cidade: project.cidade,
						},
			},
			transporte: { transportadora: {} },
			autor: {
				id: session.user.id,
				nome: session.user.nome,
				avatar_url: session.user.avatar_url,
			},
			dataInsercao: new Date().toISOString(),
		};
		const insertPurchaseControlResponse = await purchaseControlsCollection.insertOne(purchaseControl);
		const insertedPurchaseControlId = insertPurchaseControlResponse.insertedId.toString();
		await projectscollection.updateOne({ _id: new ObjectId(projectId) }, { $set: { idCompra: insertedPurchaseControlId } });
		return res.status(200).json({
			data: { insertedId: insertedPurchaseControlId },
			message: "Controle de compra criado com sucesso.",
		});
	}
	if (triggerType === "sync-project-with-purchase") {
		const purchaseControl = await purchaseControlsCollection.findOne({ "projeto.id": project._id.toString() });
		if (!purchaseControl) {
			throw new createHttpError.NotFound("Controle de compra não encontrado.");
		}

		const isSolarUFVSale = ["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"].includes(project.tipoDeServico);

		const previousProjectData = await projectscollection.findOne({ _id: new ObjectId(projectId) });
		if (!previousProjectData) {
			throw new createHttpError.NotFound("Projeto não encontrado.");
		}
		// Now, updating the project with the new allocations and other data
		await projectscollection.updateOne(
			{ _id: new ObjectId(projectId) },
			{
				$set: {
					"compra.status": purchaseControl.status,
					"compra.atualizacoes": purchaseControl.atualizacoes,
					"compra.liberacao": !!purchaseControl.liberacao.data,
					"compra.dataLiberacao": purchaseControl.liberacao.data,
					"compra.fornecedor": purchaseControl.fornecedor.nome,
					"compra.dataPedido": purchaseControl.dataPedido,
					"compra.valorDoKit": purchaseControl.total,
					"compra.valorFrete": purchaseControl.transporte.valor || 0,
					"compra.rastreio": purchaseControl.transporte.linkRastreio,
					"compra.dataRequisicaoPagamento": purchaseControl.dataRequisicaoPagamento,
					"compra.dataPagamento": purchaseControl.dataLiberacaoPagamento,
					"compra.dataPagamentoEquipamentos": purchaseControl.dataPagamento,
					"compra.previsaoEntrega": purchaseControl.entrega.dataPrevisao,
					"compra.dataEntrega": purchaseControl.entrega.dataEfetivacao,
					"compra.statusEntrega": purchaseControl.entrega.status,
					"compra.kitInfo": purchaseControl.composicao.map((c) => `${c.qtde}-${c.descricao}`).join("\n"),
					"obra.pendencias": purchaseControl.metadata?.pendenciasExecucao,
					// updating the comission reference is project is UFV sale
					"comissoes.dataReferencia": isSolarUFVSale ? purchaseControl.dataLiberacaoPagamento : project.comissoes?.dataReferencia,
				},
			},
		);
		const updatedProjectData = await projectscollection.findOne({ _id: new ObjectId(projectId) });
		if (!updatedProjectData) {
			throw new createHttpError.NotFound("Projeto não encontrado.");
		}
		handleProjectUpdateJourneyStepsTracking({ previous: previousProjectData, updated: updatedProjectData });

		if (project.idOrdemServico) {
			await serviceOrdersCollection.updateOne(
				{
					_id: new ObjectId(project.idOrdemServico),
				},
				{
					$set: {
						etiquetas: getServiceOrderTagsFromProject(project),
						"projeto.compraDataPagamento": purchaseControl.dataLiberacaoPagamento,
						"projeto.compraEntregaDataPrevisao": purchaseControl.entrega.dataPrevisao,
						"projeto.compraEntregaDataEfetivacao": purchaseControl.entrega.dataEfetivacao,
						dataPrevisaoLiberacao: purchaseControl.entrega.dataPrevisao,
						alocacoes: project.alocacoes,
					},
				},
			);
		}
		await syncServiceOrdersDeliveryRelease({ project: updatedProjectData, serviceOrdersCollection });
		return res.status(201).json({
			data: { updatedId: projectId },
			message: "Projeto atualizado com sucesso.",
		});
	}
	if (triggerType === "create-opportunity-on-project-journey-end") {
		console.log("WENT THIS WAY");
		const projectCRMClientId = project.idClienteCRM;
		if (!projectCRMClientId)
			throw new createHttpError.BadRequest("Oops, parece que o projeto não possui vinculação com o CRM. Não é possível prosseguir com a automação.");
		const crmDb = await connectToCRMDatabase();
		const usersCollection = crmDb.collection<TUser>("users");
		const opportunitiesCollection = crmDb.collection<TOpportunity>("opportunities");
		const funnelReferencesCollection = crmDb.collection<TFunnelReference>("funnel-references");
		const user = await usersCollection.findOne({
			_id: new ObjectId("67101db881376cb5c51d45af"),
		});
		if (!user)
			// fixing automation into a unique user for now
			throw new createHttpError.InternalServerError("Usuário vinculado à automação não encontrado. Consultar setor responsável.");

		const partnerId = "65454ba15cf3e3ecf534b308";
		const newOpportunity: TOpportunity = {
			nome: project.nomeDoContrato,
			idParceiro: partnerId, // fixing this partner for now ( only matrix partner )
			tipo: {
				id: "661ec8dae03128a48f94b4e0", // fixing the opportunity type for now
				titulo: "MONITORAMENTO",
			},
			categoriaVenda: "PLANO",
			descricao: "",
			identificador: "",
			responsaveis: [
				{
					id: user._id.toString(),
					nome: user.nome,
					papel: "VENDEDOR",
					avatar_url: user.avatar_url,
					telefone: user.telefone,
					dataInsercao: new Date().toISOString(),
				},
			],
			segmento: "RESIDENCIAL",
			idCliente: projectCRMClientId,
			cliente: {
				nome: project.nomeDoContrato,
				cpfCnpj: project.cpf_cnpj?.toString(),
				telefonePrimario: project.telefone || "",
				email: project.email,
				canalAquisicao: project.canalVenda,
			},
			localizacao: {
				cep: project.cep?.toString() || "",
				uf: project.uf,
				cidade: project.cidade,
				bairro: project.bairro,
				endereco: project.logradouro,
				numeroOuIdentificador: project.numeroResidencia?.toString() || "",
				complemento: null,
			},
			perda: {
				idMotivo: undefined,
				descricaoMotivo: undefined,
				data: undefined,
			},
			ganho: {
				idProjeto: undefined,
				data: undefined,
			},
			instalacao: {
				concessionaria: null,
				numero: undefined,
				grupo: undefined,
				tipoLigacao: undefined,
				tipoTitular: undefined,
				nomeTitular: undefined,
			},
			autor: {
				id: user._id.toString(),
				nome: user.nome,
				avatar_url: user.avatar_url,
			},
			interacoesConfiguracao: {
				taxaMedida: "DIAS",
				taxaValor: 15,
			},
			proximaInteracao: dayjs().toISOString(),
			dataInsercao: new Date().toISOString(),
		};
		const insertOpportunityResponse = await insertOpportunity({
			collection: opportunitiesCollection,
			info: newOpportunity,
			partnerId: newOpportunity.idParceiro,
		});

		if (!insertOpportunityResponse.acknowledged)
			throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao criar oportunidade.");
		const insertedOpportunityId = insertOpportunityResponse.insertedId.toString();

		const newFunnelReference: TFunnelReference = {
			idParceiro: partnerId,
			idFunil: "67f97583e21e0e11bc36559d",
			idEstagioFunil: "1",
			idOportunidade: insertedOpportunityId,
			estagios: {
				"1": {
					entrada: new Date().toISOString(),
				},
			},
			dataInsercao: new Date().toISOString(),
		};
		const insertFunnelReferenceResponse = await insertFunnelReference({
			collection: funnelReferencesCollection,
			info: newFunnelReference,
			partnerId: partnerId || "",
		});
		if (!insertFunnelReferenceResponse.acknowledged)
			throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao criar oportunidade.");
		const insertedFunnelReferenceId = insertFunnelReferenceResponse.insertedId.toString();

		return res.status(201).json({
			data: {
				insertedId: insertedOpportunityId,
			},
			message: "Oportunidade criada com sucesso !",
		});
	}
	if (triggerType === "create-project-taxes-expense") {
		const isPurchaseOrdered = !!project.compra.dataPedido;
		if (!isPurchaseOrdered)
			throw new createHttpError.BadRequest("Oops, parece que a compra não foi realizada. Não é possível prosseguir com a automação.");

		const contractValue = getContractValue({
			projectValue: project.sistema.valorProjeto,
			paValue: project.padrao.valor,
			structureValue: project.estruturaPersonalizada.valor,
			oemValue: project.oem.valor,
			insuranceValue: project.seguro.valor,
		});
		const purchaseTotal = project.compra.valorDoKit || 0;

		let taxAmount = 0;
		if (["SANTANDER", "SANTANDER AYMORE", "SOL FÁCIL"].includes(project.pagamento.credor ?? "")) {
			taxAmount = (contractValue - purchaseTotal) * 0.175; // 17.5% of the difference between the contract value and the purchase total
		} else {
			taxAmount = contractValue * 0.085; // 8.5% of the contract value
		}

		const newTaxExpense: TExpense = {
			identificador: "CUSTOS-FINANCEIROS",
			rateio: "IMPOSTOS",
			categoria: "IMPOSTOS",
			descricao: "Custos de impostos do projeto",
			projeto: {
				id: project._id.toString(),
				nome: project.nomeDoContrato,
				identificador: project.qtde,
				tipo: project.tipoDeServico,
			},
			autor: {
				id: session.user.id,
				nome: session.user.nome,
				avatar_url: session.user.avatar_url,
			},
			itens: [],
			total: taxAmount,
			efetivacao: {
				efetivado: true,
				data: new Date().toISOString(),
			},
			criterioReferencia: true,
			criterioCompetencia: true,
			pagamentos: [],
			dataInsercao: new Date().toISOString(),
		};

		const insertExpenseResponse = await expensesCollection.insertOne(newTaxExpense);
		if (!insertExpenseResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao criar despesa.");
		const insertedExpenseId = insertExpenseResponse.insertedId.toString();

		return res.status(201).json({
			data: { insertedId: insertedExpenseId },
			message: "Despesa criada com sucesso.",
		});
	}
};

export default apiHandler({
	POST: handleProjectTrigger,
});
