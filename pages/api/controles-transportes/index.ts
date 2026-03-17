import type { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthentication, validateAuthenticationWithSession } from "@/utils/api";
import { cidadesAtendidas } from "@/utils/constants";
import {
	getServiceObservationsFromObras,
	getServiceOrderInverterMetadataFromProject,
	getServiceOrderModulesMetadataFromProject,
	getServiceOrderTagsFromProject,
} from "@/utils/methods/util/service-order";
import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import type { TProject } from "@/utils/schemas/projects";
import type { TPurchaseControl } from "@/utils/schemas/purchases";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import { type TTransportControl, TransportControlSchema } from "@/utils/schemas/transport-controls";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { type Filter, ObjectId, WithId } from "mongodb";
import type { NextApiHandler } from "next";
import z from "zod";

const GetTransportControlsInputSchema = z.object({
	page: z.string({ required_error: "Página não informada." }).transform((s) => Number(s)),
	search: z.string({ required_error: "Busca não informada." }).optional().nullable(),
});
export type TGetTransportControlsInput = z.infer<typeof GetTransportControlsInputSchema>;

async function getTransportControls({ input, session }: { input: TGetTransportControlsInput; session: TAuthSession }) {
	const PAGE_SIZE = 50;
	const db = await connectToDatabase();
	const transportControlsCollection = db.collection<TTransportControl>("controles-transportes");

	const { page, search } = input;
	const searchQuery: Filter<TTransportControl> =
		search && search.trim().length > 0 ? { $or: [{ titulo: { $regex: search, $options: "i" } }, { titulo: search }] } : {};

	const query: Filter<TTransportControl> = { ...searchQuery };

	const matchedTransportControls = await transportControlsCollection.countDocuments(query);

	const totalPages = Math.ceil(matchedTransportControls / PAGE_SIZE);

	const skip = PAGE_SIZE * (page - 1);
	const limit = PAGE_SIZE;

	const transportControls = await transportControlsCollection.find(query).skip(skip).limit(limit).toArray();

	return {
		data: {
			transportControls: transportControls.map((t) => ({ ...t, _id: t._id.toString() })),
			transportControlsMatched: matchedTransportControls,
			totalPages,
		},
		message: "Controles de transporte encontrados com sucesso.",
	};
}
export type TGetTransportControlsOutput = Awaited<ReturnType<typeof getTransportControls>>;

async function getTransportControlByIdPublic({ id }: { id: string }) {
	const db = await connectToDatabase();
	const transportControlsCollection = db.collection<TTransportControl>("controles-transportes");
	const purchaseControlsCollection = db.collection<TPurchaseControl>("controles-compras");

	if (!ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

	const transportControl = await transportControlsCollection.findOne({ _id: new ObjectId(id) });
	if (!transportControl) throw new createHttpError.NotFound("Controle de transporte não encontrado.");

	// Get all purchase control IDs from transport items
	const purchaseControlIds = transportControl.itens.map((item) => item.id).filter((id) => id && ObjectId.isValid(id));

	// Fetch purchase controls
	const purchaseControls = await purchaseControlsCollection.find({ _id: { $in: purchaseControlIds.map((id) => new ObjectId(id)) } }).toArray();

	// Enrich transport items with purchase control data
	const enrichedItems = transportControl.itens.map((item) => {
		const purchaseControl = purchaseControls.find((p) => p._id.toString() === item.id);
		if (!purchaseControl) throw new createHttpError.NotFound("Controle de compra não encontrado.");
		return {
			...item,
			controleCompra: {
				_id: purchaseControl._id.toString(),
				titulo: purchaseControl.titulo,
				projeto: {
					id: purchaseControl.projeto.id || null,
					nome: purchaseControl.projeto.nome || null,
				},
				entrega: {
					localizacao: {
						cep: purchaseControl.entrega.localizacao.cep || null,
						uf: purchaseControl.entrega.localizacao.uf,
						cidade: purchaseControl.entrega.localizacao.cidade,
						bairro: purchaseControl.entrega.localizacao.bairro || null,
						endereco: purchaseControl.entrega.localizacao.endereco || null,
						numeroOuIdentificador: purchaseControl.entrega.localizacao.numeroOuIdentificador || null,
						complemento: purchaseControl.entrega.localizacao.complemento || null,
						latitude: purchaseControl.entrega.localizacao.latitude || null,
						longitude: purchaseControl.entrega.localizacao.longitude || null,
					},
				},
				composicao: purchaseControl.composicao.map((item) => ({
					categoria: item.categoria,
					descricao: item.descricao,
					unidade: item.unidade,
					valor: item.valor,
					qtde: item.qtde,
				})),
			},
		};
	});

	const enrichedTransportControl = {
		...transportControl,
		_id: transportControl._id.toString(),
		itens: enrichedItems,
	};

	return {
		data: enrichedTransportControl,
		message: "Controle de transporte encontrado com sucesso.",
	};
}
export type TGetTransportControlByIdPublicOutput = Awaited<ReturnType<typeof getTransportControlByIdPublic>>;

const getTransportControlsRoute: NextApiHandler<TGetTransportControlsOutput | TGetTransportControlByIdPublicOutput> = async (req, res) => {
	const { id } = req.query;

	// If id is provided, return enriched transport control
	if (id && typeof id === "string") {
		const result = await getTransportControlByIdPublic({ id });
		return res.status(200).json(result);
	}

	// Otherwise, return paginated list
	const session = await validateAuthenticationWithSession(req, res);
	const input = GetTransportControlsInputSchema.parse(req.query);
	const result = await getTransportControls({ input, session });
	return res.status(200).json(result);
};

const CreateTransportControlInputSchema = z.object({
	transportControl: TransportControlSchema,
});
export type TCreateTransportControlInput = z.infer<typeof CreateTransportControlInputSchema>;

async function createTransportControl({ input, session }: { input: TCreateTransportControlInput; session: TAuthSession }) {
	const db = await connectToDatabase();
	const transportControlsCollection = db.collection<TTransportControl>("controles-transportes");

	const lastTransportControl = await transportControlsCollection.findOne({}, { sort: { _id: -1 } });

	const lastTransportControlIdentifier = lastTransportControl?.identificador ?? 0;

	const newTransportControlIdentifier = lastTransportControlIdentifier + 1;

	const insertedTransportControl = await transportControlsCollection.insertOne({
		...input.transportControl,
		identificador: newTransportControlIdentifier,
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataInsercao: new Date().toISOString(),
	});

	const insertedTransportControlId = insertedTransportControl.insertedId.toString();
	if (!insertedTransportControlId) throw new createHttpError.InternalServerError("Oops, houve um erro ao criar o controle de transporte.");

	return {
		data: {
			insertedId: insertedTransportControlId,
		},
		message: "Controle de transporte criado com sucesso.",
	};
}
export type TCreateTransportControlOutput = Awaited<ReturnType<typeof createTransportControl>>;

const createTransportControlRoute: NextApiHandler<TCreateTransportControlOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = CreateTransportControlInputSchema.parse(req.body);
	const result = await createTransportControl({ input, session });
	return res.status(200).json(result);
};

const UpdateTransportControlInputSchema = z.object({
	transportControlId: z.string({ required_error: "ID do controle de transporte não informado." }),
	changes: TransportControlSchema.partial(),
});
export type TUpdateTransportControlInput = z.infer<typeof UpdateTransportControlInputSchema>;

async function updateTransportControl({ input, user }: { input: TUpdateTransportControlInput; user: TAuthSession["user"] | null }) {
	// console.log("[INFO] [UPDATE-TRANSPORT-CONTROL] Starting transport control update", input);
	const db = await connectToDatabase();
	const crmDb = await connectToCRMDatabase();
	const transportControlsCollection = db.collection<TTransportControl>("controles-transportes");
	const purchaseControlsCollection = db.collection<TPurchaseControl>("controles-compras");
	const projectsCollection = db.collection<TProject>("dados");
	const serviceOrdersCollection = db.collection<TServiceOrder>("ordensDeServico");
	const fileReferencesCollection = crmDb.collection<TFileReference>("file-references");
	const { transportControlId, changes } = input;

	console.log("[INFO] [UPDATE-TRANSPORT-CONTROL] Starting transport control update", transportControlId);

	const previousTransportControl = await transportControlsCollection.findOne({ _id: new ObjectId(transportControlId) });
	if (!previousTransportControl) throw new createHttpError.NotFound("Controle de transporte não encontrado.");

	console.log("[INFO] [UPDATE-TRANSPORT-CONTROL] Transport control found, applying changes");

	const updateTransportControlResponse = await transportControlsCollection.updateOne({ _id: new ObjectId(transportControlId) }, { $set: changes });
	if (!updateTransportControlResponse.acknowledged)
		throw new createHttpError.InternalServerError("Oops, houve um erro ao atualizar o controle de transporte.");
	console.log("[INFO] [UPDATE-TRANSPORT-CONTROL] Transport control updated successfully");

	const updatedTransportControl = await transportControlsCollection.findOne({ _id: new ObjectId(transportControlId) });
	if (!updatedTransportControl) throw new createHttpError.InternalServerError("Oops, houve um erro ao atualizar o controle de transporte.");

	// Handlinig itens effects
	console.log("[INFO] [UPDATE-TRANSPORT-CONTROL] Starting items effects handling", updatedTransportControl.itens.length, "items");
	for (const [updatedTransportControlItemIndex, updatedTransportControlItem] of updatedTransportControl.itens.entries()) {
		const previousTransportControlItem = previousTransportControl.itens.find((item) => item.id === updatedTransportControlItem.id);
		if (!previousTransportControlItem) continue;
		if (!previousTransportControlItem.dataEfetivacao && !!updatedTransportControlItem.dataEfetivacao) {
			console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Item effetivation detected, updating purchase control", updatedTransportControlItem.id);
			await purchaseControlsCollection.updateOne(
				{ _id: new ObjectId(updatedTransportControlItem.id) },
				{ $set: { "entrega.dataEfetivacao": updatedTransportControlItem.dataEfetivacao, "entrega.status": "ENTREGUE" } },
			);
			console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Purchase control delivery status updated to ENTREGUE");
			if (updatedTransportControlItem.projeto?.id) {
				console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Purchase control project found, starting project update");
				// If purchase control has a vinculated project, update the project delivery date and delivery status
				const project = await projectsCollection.findOne({ _id: new ObjectId(updatedTransportControlItem.projeto.id) });
				if (!project) throw new createHttpError.NotFound("Projeto não encontrado.");
				console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Updating project delivery status", updatedTransportControlItem.projeto.id);
				await projectsCollection.updateOne(
					{ _id: new ObjectId(updatedTransportControlItem.projeto.id) },
					{ $set: { "compra.status": "ENTREGUE", "compra.dataEntrega": updatedTransportControlItem.dataEfetivacao } },
				);

				const postUpdateProject = await projectsCollection.findOne({ _id: new ObjectId(updatedTransportControlItem.projeto.id) });
				if (!postUpdateProject) throw new createHttpError.NotFound("Projeto não encontrado.");
				console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Project delivery status updated");

				// Generating the service order trigger
				console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Generating service order for project", updatedTransportControlItem.projeto.id);
				const serviceOrder: TServiceOrder = {
					categoria: "MONTAGEM",
					etiquetas: getServiceOrderTagsFromProject(postUpdateProject),
					favorecido: {
						nome: postUpdateProject.nomeDoContrato || "",
						contato: postUpdateProject.telefone || "",
					},
					idAnaliseTecnica: postUpdateProject.idVisitaTecnica,
					anotacoes: "",
					projeto: {
						id: postUpdateProject._id.toString() || null, // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
						nome: postUpdateProject.nomeDoContrato || null, // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
						identificador: postUpdateProject.qtde || null, // identificador QTDE do projeto no banco de projetos
						tipo: postUpdateProject.tipoDeServico || null, // tipo do projeto
						vendedorNome: postUpdateProject.vendedor?.nome || null,
						contratoDataAssinatura: postUpdateProject.contrato?.dataAssinatura,
						compraEntregaDataPrevisao: postUpdateProject.compra?.previsaoEntrega,
						compraEntregaDataEfetivacao: postUpdateProject.compra?.dataEntrega,
						homologacaoAcessoDataResposta: postUpdateProject.homologacao?.acesso.dataResposta,
						homologacaoVistoriaDataEfetivacao: postUpdateProject.homologacao?.vistoria.dataEfetivacao,
					},
					descricao: `SERVIÇO DO PROJETO ${postUpdateProject.nomeDoContrato}`, // servico executado
					localizacao: {
						cep: postUpdateProject.cep?.toString() || "",
						uf: postUpdateProject.uf,
						cidade: postUpdateProject.cidade,
						bairro: postUpdateProject.bairro,
						endereco: postUpdateProject.logradouro,
						numeroOuIdentificador: postUpdateProject.numeroResidencia?.toString() || "",
					},
					responsavel: {
						nome: postUpdateProject.obra?.equipeResp || "",
						tipo: postUpdateProject.obra?.equipeResp ? "INTERNO" : "EXTERNO",
					},
					responsaveis: [],
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
						id: user?.id || "AUTO",
						nome: user?.nome || "AUTOMÁTICO",
						avatar_url: user?.avatar_url,
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
						tipoEstrutura: postUpdateProject.estruturaPersonalizada?.tipo || null,
						tipoTelha: postUpdateProject.visitaTecnica?.tipoDaTelha || null,
						tipoPadrao: postUpdateProject.padrao?.tipo || null,
						tipoSaidaPadrao: postUpdateProject.visitaTecnica?.saidaDoCliente || null,
						amperagemPadrao: postUpdateProject.visitaTecnica?.amperagem || null,
						responsabilidadePadrao: postUpdateProject.padrao?.respInstalacao,
						topologia: postUpdateProject.sistema?.topologia,
					},

					observacoes: getServiceObservationsFromObras(postUpdateProject.obra?.observacoes || ""),
					dataPrevisaoLiberacao: postUpdateProject.compra.previsaoEntrega,
					dataLiberacao: postUpdateProject.compra.dataEntrega || new Date().toISOString(),
					dataInsercao: new Date().toISOString(),
				};
				const insertServiceOrderResponse = await serviceOrdersCollection.insertOne(serviceOrder);
				const insertedServiceOrderId = insertServiceOrderResponse.insertedId.toString();
				console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Service order created successfully", insertedServiceOrderId);
				// Updating the project with the service order id
				await projectsCollection.updateOne(
					{ _id: new ObjectId(updatedTransportControlItem.projeto.id) },
					{ $set: { idOrdemServico: insertedServiceOrderId } },
				);
				console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Project updated with service order id");
			}

			// Handling the attachments
			console.log(
				"[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Handling attachments for item",
				updatedTransportControlItem.id,
				updatedTransportControlItem.anexos.length,
				"attachments",
			);
			for (const [updatedTransportControlItemAttachmentIndex, updatedTransportControlItemAttachment] of updatedTransportControlItem.anexos.entries()) {
				if (!updatedTransportControlItemAttachment.idArquivoReferencia) {
					console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Creating file reference for attachment", updatedTransportControlItemAttachment.titulo);
					const insertedFileReferenceResponse = await fileReferencesCollection.insertOne({
						titulo: updatedTransportControlItemAttachment.titulo,
						url: updatedTransportControlItemAttachment.url,
						formato: updatedTransportControlItemAttachment.formato,
						tamanho: updatedTransportControlItemAttachment.tamanho,
						categorias: ["COMPRAS"],
						idCompra: updatedTransportControlItem.id,
						idTransporte: transportControlId,
						idProjeto: updatedTransportControlItem.projeto.id,
						autor: {
							id: user?.id || "AUTO",
							nome: user?.nome || "AUTOMÁTICO",
							avatar_url: user?.avatar_url,
						},
						dataInsercao: new Date().toISOString(),
					});
					const insertedFileReferenceId = insertedFileReferenceResponse.insertedId.toString();
					console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] File reference created", insertedFileReferenceId);
					updatedTransportControl.itens[updatedTransportControlItemIndex].anexos[updatedTransportControlItemAttachmentIndex].idArquivoReferencia =
						insertedFileReferenceId;

					await transportControlsCollection.updateOne({ _id: new ObjectId(transportControlId) }, { $set: { itens: updatedTransportControl.itens } });
					console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Transport control updated with file reference");
				}
			}
		}
	}
	// Handling costs effects
	console.log("[INFO] [UPDATE-TRANSPORT-CONTROL] Starting costs effects handling", updatedTransportControl.custos.length, "costs");
	for (const [updatedTransportControlCostIndex, updatedTransportControlCost] of updatedTransportControl.custos.entries()) {
		for (const [updatedTransportControlCostAttachmentIndex, updatedTransportControlCostAttachment] of updatedTransportControlCost.anexos.entries()) {
			if (!updatedTransportControlCostAttachment.idArquivoReferencia) {
				console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-COST] Creating file reference for cost attachment", updatedTransportControlCostAttachment.titulo);
				const insertedFileReferenceResponse = await fileReferencesCollection.insertOne({
					titulo: updatedTransportControlCostAttachment.titulo,
					url: updatedTransportControlCostAttachment.url,
					formato: updatedTransportControlCostAttachment.formato,
					tamanho: updatedTransportControlCostAttachment.tamanho,
					categorias: ["COMPRAS"],
					idTransporte: transportControlId,
					autor: {
						id: user?.id || "AUTO",
						nome: user?.nome || "AUTOMÁTICO",
						avatar_url: user?.avatar_url,
					},
					dataInsercao: new Date().toISOString(),
				});
				const insertedFileReferenceId = insertedFileReferenceResponse.insertedId.toString();
				console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-COST] File reference created", insertedFileReferenceId);
				updatedTransportControl.custos[updatedTransportControlCostIndex].anexos[updatedTransportControlCostAttachmentIndex].idArquivoReferencia =
					insertedFileReferenceId;
				await transportControlsCollection.updateOne({ _id: new ObjectId(transportControlId) }, { $set: { custos: updatedTransportControl.custos } });
				console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-COST] Transport control updated with file reference");
			}
		}
	}

	if (!previousTransportControl.dataFim && !!updatedTransportControl.dataFim) {
		console.log("[INFO] [UPDATE-TRANSPORT-CONTROL] Effetivation identified, starting triggers");

		const distance = (updatedTransportControl.distanciaQuilometragemFinal || 0) - (updatedTransportControl.distanciaQuilometragemInicial || 0);
		const distanceCost = distance * updatedTransportControl.configuracoes.custoQuilometragem;

		console.log("[INFO] [UPDATE-TRANSPORT-CONTROL] Calculated distance cost", distanceCost, "km");
		const finalCosts: TTransportControl["custos"][number][] = [
			...updatedTransportControl.custos,
			{
				descricao: "CUSTO DE TRANSPORTE",
				valor: distanceCost,
				anexos: [],
			},
		];

		const finalCost = finalCosts.reduce((acc, cost) => acc + cost.valor, 0);
		const finalCostPerItem = finalCost / updatedTransportControl.itens.length;
		console.log("[INFO] [UPDATE-TRANSPORT-CONTROL] Final cost calculated", finalCost, "cost per item", finalCostPerItem);
		await transportControlsCollection.updateOne({ _id: new ObjectId(transportControlId) }, { $set: { custos: finalCosts } });
		console.log("[INFO] [UPDATE-TRANSPORT-CONTROL] Transport control costs updated");
		for (const item of updatedTransportControl.itens) {
			console.log("[INFO] [UPDATE-TRANSPORT-CONTROL] Updating purchase control with transportation conclusion...", item.id);
			const purchaseControl = await purchaseControlsCollection.findOne({ _id: new ObjectId(item.id) });
			if (!purchaseControl) throw new createHttpError.NotFound("Controle de compra não encontrado.");
			await purchaseControlsCollection.updateOne({ _id: new ObjectId(item.id) }, { $set: { "transporte.valor": finalCostPerItem } });
			if (purchaseControl.projeto.id) {
				console.log("[INFO] [UPDATE-TRANSPORT-CONTROL] Updating project with freight cost", purchaseControl.projeto.id);
				await projectsCollection.updateOne({ _id: new ObjectId(purchaseControl.projeto.id) }, { $set: { "compra.valorFrete": finalCostPerItem } });
				console.log("[INFO] [UPDATE-TRANSPORT-CONTROL] Project freight cost updated");
			}
		}
	}

	console.log("[INFO] [UPDATE-TRANSPORT-CONTROL] Transport control update completed successfully", transportControlId);

	return {
		data: {
			updatedId: transportControlId.toString(),
		},
		message: "Controle de transporte atualizado com sucesso.",
	};
}
export type TUpdateTransportControlOutput = Awaited<ReturnType<typeof updateTransportControl>>;

const updateTransportControlRoute: NextApiHandler<TUpdateTransportControlOutput> = async (req, res) => {
	const session = await validateAuthentication(req, res);
	const input = UpdateTransportControlInputSchema.parse(req.body);
	const result = await updateTransportControl({ input: req.body, user: session.user });
	return res.status(200).json(result);
};

export type TDeleteTransportControlOutput = {
	data: {
		deletedId: string;
	};
	message: string;
};

async function deleteTransportControl({ transportControlId, user }: { transportControlId: string; user: TAuthSession["user"] }) {
	const db = await connectToDatabase();
	const crmDb = await connectToCRMDatabase();
	const transportControlsCollection = db.collection<TTransportControl>("controles-transportes");
	const purchaseControlsCollection = db.collection<TPurchaseControl>("controles-compras");
	const projectsCollection = db.collection<TProject>("dados");
	const serviceOrdersCollection = db.collection<TServiceOrder>("ordensDeServico");
	const fileReferencesCollection = crmDb.collection<TFileReference>("file-references");

	const transportControl = await transportControlsCollection.findOne({ _id: new ObjectId(transportControlId) });
	if (!transportControl) throw new createHttpError.NotFound("Controle de transporte não encontrado.");

	const totalCosts = transportControl.custos.reduce((acc, cost) => acc + cost.valor, 0);
	const finalCostPerItem = transportControl.itens.length > 0 ? totalCosts / transportControl.itens.length : null;

	for (const item of transportControl.itens) {
		if (!ObjectId.isValid(item.id)) continue;
		const purchaseControl = await purchaseControlsCollection.findOne({ _id: new ObjectId(item.id) });
		const projectId = purchaseControl?.projeto?.id || item.projeto?.id || null;

		if (item.dataEfetivacao) {
			console.log("[INFO] [DELETE-TRANSPORT-CONTROL] Item effetivation detected, updating purchase control", item.id);
			await purchaseControlsCollection.updateOne(
				{ _id: new ObjectId(item.id) },
				{ $set: { "entrega.dataEfetivacao": null, "entrega.status": "EM ROTA" } },
			);
			if (projectId && ObjectId.isValid(projectId)) {
				console.log("[INFO] [DELETE-TRANSPORT-CONTROL] Project found, updating project", projectId);
				const project = await projectsCollection.findOne({ _id: new ObjectId(projectId) });
				await projectsCollection.updateOne(
					{ _id: new ObjectId(projectId) },
					{ $set: { "compra.status": "EM ROTA", "compra.dataEntrega": null, idOrdemServico: null } },
				);
				if (project?.idOrdemServico && ObjectId.isValid(project.idOrdemServico)) {
					const serviceOrder = await serviceOrdersCollection.findOne({ _id: new ObjectId(project.idOrdemServico) });
					if (serviceOrder && serviceOrder.projeto?.id === projectId) {
						await serviceOrdersCollection.deleteOne({ _id: new ObjectId(project.idOrdemServico) });
					}
				}
			}
		}

		if (finalCostPerItem !== null && Number.isFinite(finalCostPerItem)) {
			await purchaseControlsCollection.updateOne(
				{ _id: new ObjectId(item.id), "transporte.valor": finalCostPerItem },
				{ $set: { "transporte.valor": null } },
			);
			if (projectId && ObjectId.isValid(projectId)) {
				await projectsCollection.updateOne(
					{ _id: new ObjectId(projectId), "compra.valorFrete": finalCostPerItem },
					{ $set: { "compra.valorFrete": null } },
				);
			}
		}
	}

	await fileReferencesCollection.updateMany(
		{ idTransporte: transportControlId },
		{ $set: { dataExclusao: new Date().toISOString(), autorIdExclusao: user.id } },
	);

	const deleteResponse = await transportControlsCollection.deleteOne({ _id: new ObjectId(transportControlId) });
	if (!deleteResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao excluir o controle de transporte.");
	if (deleteResponse.deletedCount === 0) throw new createHttpError.NotFound("Controle de transporte não encontrado.");

	return {
		data: {
			deletedId: transportControlId,
		},
		message: "Controle de transporte excluído com sucesso.",
	};
}

const deleteTransportControlRoute: NextApiHandler<TDeleteTransportControlOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const { id } = req.query;
	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

	const result = await deleteTransportControl({ transportControlId: id, user: session.user });
	return res.status(200).json(result);
};

export default apiHandler({
	GET: getTransportControlsRoute,
	POST: createTransportControlRoute,
	PUT: updateTransportControlRoute,
	DELETE: deleteTransportControlRoute,
});
