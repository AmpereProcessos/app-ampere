import connectToDatabase from "@/utils/services/mongodb/projects";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { NextApiHandler } from "next";
import { z } from "zod";
import type { TProject } from "@/utils/schemas/projects";
import { type Collection, ObjectId } from "mongodb";
import createHttpError from "http-errors";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import { getServiceOrderInverterMetadataFromProject, getServiceOrderModulesMetadataFromProject, getServiceOrderTagsFromProject } from "@/utils/methods/util/service-order";
import type { TPurchaseControl } from "@/utils/schemas/purchases";

type PostResponse = {
	data: { insertedId?: string; updatedId?: string };
	message: string;
};
const TriggerType = z.enum(["create-project-main-service-order", "create-project-main-purchase-control", "create-project-main-revenue", "sync-project-with-purchase"]);

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

	const project = await projectscollection.findOne({ _id: new ObjectId(projectId) });

	if (!project) {
		throw new createHttpError.NotFound("Projeto não encontrado.");
	}
	if (triggerType === "create-project-main-service-order") {
		// Defining data for the service order based on the project information
		const serviceOrder: TServiceOrder = {
			categoria: "MONTAGEM",
			etiquetas: getServiceOrderTagsFromProject(project),
			favorecido: {
				nome: project.nomeDoContrato || "",
				contato: project.telefone || "",
			},
			anotacoes: "",
			projeto: {
				id: project._id.toString() || null, // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
				nome: project.nomeDoContrato || null, // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
				identificador: project.qtde || null, // identificador QTDE do projeto no banco de projetos
				tipo: project.tipoDeServico || null, // tipo do projeto
				vendedorNome: project.vendedor?.nome || null,
				contratoDataAssinatura: project.contrato?.dataAssinatura,
				compraEntregaDataPrevisao: project.compra?.previsaoEntrega,
				compraEntregaDataEfetivacao: project.compra?.dataEntrega,
				homologacaoAcessoDataResposta: project.homologacao?.acesso.dataResposta,
				homologacaoVistoriaDataEfetivacao: project.homologacao?.vistoria.dataEfetivacao,
			},
			descricao: `SERVIÇO DO PROJETO ${project.nomeDoContrato}`, // servico executado
			localizacao: {
				cep: project.cep?.toString() || "",
				uf: project.uf,
				cidade: project.cidade,
				bairro: project.bairro,
				endereco: project.logradouro,
				numeroOuIdentificador: project.numeroResidencia?.toString() || "",
			},
			responsavel: {
				nome: project.obra?.equipeResp || "",
				tipo: project.obra?.equipeResp ? "INTERNO" : "EXTERNO",
			},
			// configurar: false,
			urgencia: "POUCO URGENTE",
			periodo: {
				inicio: null,
				fim: null,
			},
			pagamento: {
				recebedor: null,
				valor: null,
			},
			cobranca: {
				pagador: null,
				valor: null,
			},
			autor: {
				id: session?.user.id,
				nome: session.user.nome,
				avatar_url: session?.user.avatar_url,
			},
			equipamentos: {
				modulos: getServiceOrderModulesMetadataFromProject(project),
				inversor: getServiceOrderInverterMetadataFromProject(project),
				disponivel: null,
				retirada: null,
			},
			detalhes: {
				pontoAgua: "",
				senhaWifi: "",
				configuracaoMonitoramento: false,
				possuiTrafo: false,
				tipoEstrutura: project.estruturaPersonalizada?.tipo || null,
				tipoTelha: project.visitaTecnica?.tipoDaTelha || null,
				tipoPadrao: project.padrao?.tipo || null,
				tipoSaidaPadrao: project.visitaTecnica?.saidaDoCliente || null,
				amperagemPadrao: project.visitaTecnica?.amperagem || null,
				responsabilidadePadrao: project.padrao?.respInstalacao,
				topologia: project.sistema?.topologia,
			},
			observacoes: [],
			dataPrevisaoLiberacao: project.compra.previsaoEntrega,
			dataLiberacao: project.compra.dataEntrega || new Date().toISOString(),
			dataInsercao: new Date().toISOString(),
		};

		// Inserting the new service order
		const insertServiceOrderResponse = await serviceOrdersCollection.insertOne(serviceOrder);
		const insertedServiceOrderId = insertServiceOrderResponse.insertedId.toString();

		// Updating the project with the service order id
		await projectscollection.updateOne({ _id: new ObjectId(projectId) }, { $set: { idOrdemServico: insertedServiceOrderId } });

		return res.status(200).json({
			data: { insertedId: insertedServiceOrderId },
			message: "Ordem de serviço criada com sucesso.",
		});
	}
	if (triggerType === "sync-project-with-purchase") {
		const purchaseControl = await purchaseControlsCollection.findOne({ "projeto.id": project._id.toString() });
		if (!purchaseControl) {
			throw new createHttpError.NotFound("Controle de compra não encontrado.");
		}

		// Now, syncing the project with update to data information from the purchase control

		// First, getting the project allocations synced
		let projectAllocations: TProject["alocacoes"] = project.alocacoes || [];
		if (purchaseControl.entrega.dataEfetivacao) {
			// If the purchase control has been delivered, we gotta apply some syncing with project allocations
			// If the project has no allocations, we gotta create them from the purchase composition
			if (projectAllocations.length === 0) {
				projectAllocations = purchaseControl.composicao
					.filter((c) => !!c.materialId)
					.map((c) => ({
						idMaterial: c.materialId as string,
						quantidade: c.qtde,
						quantidadePrevista: c.qtde,
						unidade: c.unidade,
						precoUnitario: c.valor,
						movimentacoes: [
							{
								idCompra: purchaseControl._id.toString(),
								data: purchaseControl.entrega.dataEfetivacao as string,
								quantidade: c.qtde,
								precoUnitario: c.valor,
								titulo: purchaseControl.titulo,
							},
						],
						nome: c.descricao,
					}));
			} else {
				console.log("WENT HERE");
				// In case the project already has allocations, we gotta update those who came from the purchase control
				projectAllocations = projectAllocations.map((a) => {
					// Getting info about the existence of movements from the purchase control
					const hasMovementsFromPurchaseControl = a.movimentacoes.some((m) => m.idCompra === purchaseControl._id.toString());
					console.log("hasMovementsFromPurchaseControl", hasMovementsFromPurchaseControl);
					// If the allocation has no movements from the purchase control, we don't need to update anything
					if (!hasMovementsFromPurchaseControl) return a;
					console.log("WENT HERE 2");
					// If the allocation has movements from the purchase control, we need to update the data of the movements
					const updatedMovements: Exclude<TProject["alocacoes"], undefined | null>[number]["movimentacoes"] = a.movimentacoes.map((m) => {
						if (m.idCompra === purchaseControl._id.toString()) {
							const equivalentPurchaseControlMovement = purchaseControl.composicao.find((c) => c.materialId === a.idMaterial);
							return {
								idCompra: purchaseControl._id.toString(),
								titulo: purchaseControl.titulo,
								data: purchaseControl.entrega.dataEfetivacao as string,
								quantidade: equivalentPurchaseControlMovement?.qtde || m.quantidade,
								precoUnitario: equivalentPurchaseControlMovement?.valor || m.precoUnitario,
							};
						}
						return m;
					});
					// Getting the new allocation quantity
					const newAllocationQty = updatedMovements.reduce((acc, curr) => acc + curr.quantidade, 0);
					// Getting the new allocation price from the ponderation of the movements price and quantity
					const newAllocationPrice = updatedMovements.reduce((acc, curr) => acc + curr.quantidade * curr.precoUnitario, 0) / newAllocationQty;
					return {
						...a,
						quantidade: newAllocationQty,
						precoUnitario: newAllocationPrice,
						movimentacoes: updatedMovements,
					};
				});
			}
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
					"compra.rastreio": purchaseControl.transporte.linkRastreio,
					"compra.dataRequisicaoPagamento": purchaseControl.dataRequisicaoPagamento,
					"compra.dataPagamento": purchaseControl.dataLiberacaoPagamento,
					"compra.dataPagamentoEquipamentos": purchaseControl.dataPagamento,
					"compra.previsaoEntrega": purchaseControl.entrega.dataPrevisao,
					"compra.dataEntrega": purchaseControl.entrega.dataEfetivacao,
					"compra.statusEntrega": purchaseControl.entrega.status,
					"compra.kitInfo": purchaseControl.composicao.map((c) => `${c.qtde}-${c.descricao}`).join("\n"),
					"obra.pendencias": purchaseControl.metadata?.pendenciasExecucao,
					alocacoes: projectAllocations,
				},
			},
		);

		return res.status(201).json({
			data: { updatedId: projectId },
			message: "Projeto atualizado com sucesso.",
		});
	}
};

export default apiHandler({
	POST: handleProjectTrigger,
});
