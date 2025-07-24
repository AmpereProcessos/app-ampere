import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TMaterialUpdateRegistry } from "@/utils/schemas/material-updates-registry";
import type { TMaterial } from "@/utils/schemas/materials";
import type { TProject } from "@/utils/schemas/projects";
import {
	GeneralPurchaseControlSchema,
	PurchaseControlKanbanSimplifiedProjection,
	PurchaseControlSimplifiedProjection,
	type TPurchaseControl,
	type TPurchaseControlWithProjectDTO,
} from "@/utils/schemas/purchases";
import clientPromise from "@/utils/services/mongodb/mongo-client";
import connectToDatabase from "@/utils/services/mongodb/projects";
import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import createHttpError from "http-errors";
import { type ClientSession, type Collection, type Db, type Filter, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import type { Session } from "next-auth";

type GetResponse = {
	data: TPurchaseControlWithProjectDTO | TPurchaseControl[];
};
const getPurchasesControlsRoute: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	console.log(req.query);
	const { id, projectId, queryTags, queryPendingConclusion } = req.query;
	const db: Db = await connectToDatabase();
	const collection = db.collection<TPurchaseControl>("controles-compras");

	if (id) {
		if (typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

		const addFields = { projectIdAsObjectId: { $toObjectId: "$projeto.id" } };
		const lookup = { from: "dados", localField: "projectIdAsObjectId", foreignField: "_id", as: "projetoDados" };
		const purchaseControlArr = await collection
			.aggregate([
				{ $match: { _id: new ObjectId(id) } },
				{ $addFields: addFields },
				{ $lookup: lookup },
				{
					$project: {
						status: 1,
						titulo: 1,
						anotacoes: 1,
						projeto: 1,
						etiquetas: 1,
						atualizacoes: 1,
						totalPrevisto: 1,
						liberacao: 1,
						composicao: 1,
						dataRequisicaoPagamento: 1,
						dataLiberacaoPagamento: 1,
						dataPagamento: 1,
						dataPedido: 1,
						fornecedor: 1,
						total: 1,
						transporte: 1,
						faturamentos: 1,
						entrega: 1,
						autor: 1,
						dataInsercao: 1,
						dataEfetivacao: 1,
						"projetoDados._id": 1,
						"projetoDados.nomeDoContrato": 1,
						"projetoDados.qtde": 1,
						"projetoDados.cpf_cnpj": 1,
						"projetoDados.inscricaoRural": 1,
						"projetoDados.tipoDeServico": 1,
						"projetoDados.telefone": 1,
						"projetoDados.email": 1,
						"projetoDados.cep": 1,
						"projetoDados.uf": 1,
						"projetoDados.cidade": 1,
						"projetoDados.bairro": 1,
						"projetoDados.logradouro": 1,
						"projetoDados.numeroResidencia": 1,
						"projetoDados.pagamento.pagador": 1,
						"projetoDados.pagamento.contatoPagador": 1,
						"projetoDados.pagamento.cpf_cnpjPagador": 1,
						"projetoDados.pagamento.forma": 1,
						"projetoDados.pagamento.metodo": 1,
						"projetoDados.pagamento.credor": 1,
						"projetoDados.pagamento.credorNomeGerente": 1,
						"projetoDados.pagamento.credorContatoGerente": 1,
						"projetoDados.pagamento.negociacao": 1,
						"projetoDados.produtos": 1,
						"projetoDados.idVisitaTecnica": 1,
					},
				},
			])
			.toArray();
		const purchaseControl = purchaseControlArr.map((p) => ({ ...p, projetoDados: p.projetoDados[0] }))[0];
		// const purchaseControl = await collection.findOne({ _id: new ObjectId(id) })
		if (!purchaseControl) throw new createHttpError.NotFound("Controle de compra não encontrado.");
		return res.status(200).json({ data: purchaseControl as TPurchaseControlWithProjectDTO });
	}
	if (projectId) {
		if (typeof projectId !== "string" || !ObjectId.isValid(projectId)) throw new createHttpError.BadRequest("ID do projeto inválido.");

		const purchaseControls = await collection.find({ "projeto.id": projectId }, { projection: PurchaseControlSimplifiedProjection }).toArray();

		return res.status(200).json({ data: purchaseControls });
	}

	const queryTagsIds = typeof queryTags === "string" ? queryTags.split(",").filter((q) => !!ObjectId.isValid(q)) : [];
	const queryPendingConclusionValue = queryPendingConclusion === "true";

	const queryTagsQuery: Filter<TPurchaseControl> = queryTagsIds.length > 0 ? { "etiquetas.id": { $in: queryTagsIds } } : {};
	const queryPendingConclusionQuery: Filter<TPurchaseControl> = queryPendingConclusionValue ? { dataEfetivacao: null } : {};
	console.log(queryTagsQuery);
	console.log(queryPendingConclusionQuery);
	const purchaseControls = await collection
		.find(
			{ ...queryTagsQuery, ...queryPendingConclusionQuery },
			{
				projection: PurchaseControlKanbanSimplifiedProjection,
			},
		)
		.toArray();

	return res.status(200).json({ data: purchaseControls });
};

type PostResponse = {
	data: { insertedId: string };
	message: string;
};

const createPurchaseControlRoute: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const purchaseControl = GeneralPurchaseControlSchema.parse(req.body);

	const db: Db = await connectToDatabase();
	const collection = db.collection<TPurchaseControl>("controles-compras");

	const purchaseControlWithRegistrosStatus = {
		...purchaseControl,
		registrosStatus: { [purchaseControl.status]: { entrada: new Date().toISOString() } },
	};
	const insertResponse = await collection.insertOne(purchaseControlWithRegistrosStatus);
	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao inserir controle de compra.");
	const insertedId = insertResponse.insertedId.toString();

	return res.status(201).json({ data: { insertedId }, message: "Controle de compra criado com sucesso !" });
};

type PutResponse = {
	message: string;
};
const updatePurchaseControlRoute: NextApiHandler<PutResponse> = async (req, res) => {
	console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Iniciando atualização do controle de compra.");
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;

	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

	console.log("[INFO] [UPDATE-PURCHASE-CONTROL] ID recebido: " + id);

	const changes = GeneralPurchaseControlSchema.partial().parse(req.body);
	console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Mudanças recebidas para update:", changes);

	const dbClient = await clientPromise;
	const db: Db = dbClient.db("projetos");
	const warehouseDb: Db = dbClient.db("almoxarifado");
	const purchaseControlsCollection = db.collection<TPurchaseControl>("controles-compras");
	const projectsCollection = db.collection<TProject>("dados");

	const materialsCollection = warehouseDb.collection<TMaterial>("material");
	const materialsLogsCollection = warehouseDb.collection<TMaterialUpdateRegistry>("alteracoes");

	const dbSession = dbClient.startSession();

	try {
		console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Iniciando transação para controle de compra " + id);
		await dbSession.withTransaction(async () => {
			console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Buscando controle de compra anterior: " + id);
			const previousPurchaseControl = await purchaseControlsCollection.findOne({ _id: new ObjectId(id) }, { session: dbSession });

			if (!previousPurchaseControl) {
				console.error("[ERROR] [UPDATE-PURCHASE-CONTROL] Controle de compra não encontrado: " + id);
				throw new createHttpError.NotFound("Controle de compra não encontrado.");
			}
			console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Controle de compra anterior encontrado:", previousPurchaseControl);

			console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Atualizando controle de compra: " + id + " com mudanças:", changes);
			const updateResponse = await purchaseControlsCollection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } }, { session: dbSession });
			if (!updateResponse.acknowledged) {
				console.error("[ERROR] [UPDATE-PURCHASE-CONTROL] Erro ao atualizar controle de compra: " + id);
				throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar controle de compra.");
			}

			console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Controle de compra atualizado: " + id);
			const updatedPurchaseControl = await purchaseControlsCollection.findOne({ _id: new ObjectId(id) }, { session: dbSession });
			if (!updatedPurchaseControl) {
				console.error("[ERROR] [UPDATE-PURCHASE-CONTROL] Erro ao buscar controle de compra atualizado: " + id);
				throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar controle de compra.");
			}
			console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Controle de compra atualizado encontrado:", updatedPurchaseControl);

			const isAllocating = !previousPurchaseControl?.entrega.dataEfetivacao && updatedPurchaseControl.entrega.dataEfetivacao;
			const isDeallocating = previousPurchaseControl?.entrega.dataEfetivacao && !updatedPurchaseControl.entrega.dataEfetivacao;
			const isUpdating = previousPurchaseControl?.entrega.dataEfetivacao && updatedPurchaseControl.entrega.dataEfetivacao;

			console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Flags - isAllocating: " + isAllocating + ", isDeallocating: " + isDeallocating + ", isUpdating: " + isUpdating);

			if (isAllocating) {
				console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Iniciando alocação para controle: " + id);
				await handlePurchaseControlAllocationsImproved({
					type: "ALLOCATING",
					purchaseControlId: id,
					purchaseControlTitle: updatedPurchaseControl.titulo,
					purchaseControlDeliveryDate: updatedPurchaseControl.entrega.dataEfetivacao,
					purchaseControlComposition: updatedPurchaseControl.composicao,
					projectId: previousPurchaseControl.projeto.id,
					purchaseControlsCollection,
					projectsCollection,
					materialsCollection,
					materialsLogsCollection,
					dbSession,
					userSession: session,
				});
			}
			if (isDeallocating) {
				console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Iniciando devolução para controle: " + id);
				await handlePurchaseControlAllocationsImproved({
					type: "DEALLOCATING",
					purchaseControlId: id,
					purchaseControlTitle: updatedPurchaseControl.titulo,
					purchaseControlDeliveryDate: updatedPurchaseControl.entrega.dataEfetivacao,
					purchaseControlComposition: updatedPurchaseControl.composicao,
					projectId: previousPurchaseControl.projeto.id,
					purchaseControlsCollection,
					projectsCollection,
					materialsCollection,
					materialsLogsCollection,
					dbSession,
					userSession: session,
				});
			}
			if (isUpdating) {
				console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Iniciando atualização de alocação para controle: " + id);
				await handlePurchaseControlAllocationsImproved({
					type: "UPDATING",
					purchaseControlId: id,
					purchaseControlTitle: updatedPurchaseControl.titulo,
					purchaseControlDeliveryDate: updatedPurchaseControl.entrega.dataEfetivacao,
					purchaseControlComposition: updatedPurchaseControl.composicao,
					projectId: previousPurchaseControl.projeto.id,
					purchaseControlsCollection,
					projectsCollection,
					materialsCollection,
					materialsLogsCollection,
					dbSession,
					userSession: session,
				});
			}
		});
	} catch (error) {
		console.error("[ERROR] [UPDATE-PURCHASE-CONTROL] Erro ao atualizar controle de compra " + id + ":", error);
		throw error;
	} finally {
		console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Transação finalizada para controle de compra " + id);
		await dbSession.endSession();
	}

	console.log("[INFO] [UPDATE-PURCHASE-CONTROL] Controle de compras atualizado com sucesso: " + id);
	return res.status(201).json({ message: "Controle de compras atualizado com sucesso !" });
};

const deletePurchaseControlRoute: NextApiHandler<any> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;
	console.log("ID PARA DELETE", id);
	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

	const dbClient = await clientPromise;
	const db: Db = dbClient.db("projetos");
	const warehouseDb: Db = dbClient.db("almoxarifado");
	const purchaseControlsCollection = db.collection<TPurchaseControl>("controles-compras");
	const projectsCollection = db.collection<TProject>("dados");

	const materialsCollection = warehouseDb.collection<TMaterial>("material");
	const materialsLogsCollection = warehouseDb.collection<TMaterialUpdateRegistry>("alteracoes");

	const dbSession = dbClient.startSession();

	try {
		await dbSession.withTransaction(async () => {
			const currentPurchaseControl = await purchaseControlsCollection.findOne({ _id: new ObjectId(id) }, { session: dbSession });

			// Handling the deallocation for the purchase control in case it was allocated
			if (currentPurchaseControl?.entrega.dataEfetivacao) {
				await handlePurchaseControlAllocationsImproved({
					type: "DEALLOCATING",
					purchaseControlId: id,
					purchaseControlTitle: currentPurchaseControl.titulo,
					purchaseControlDeliveryDate: currentPurchaseControl.entrega.dataEfetivacao,
					purchaseControlComposition: currentPurchaseControl.composicao,
					projectId: currentPurchaseControl.projeto.id,
					purchaseControlsCollection,
					projectsCollection,
					materialsCollection,
					materialsLogsCollection,
					dbSession,
					userSession: session,
				});
			}
			// Then, we delete the purchase control
			const deleteResponse = await purchaseControlsCollection.deleteOne({ _id: new ObjectId(id) }, { session: dbSession });
			if (!deleteResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao excluir o controle de compra.");
			if (deleteResponse.deletedCount === 0) throw new createHttpError.NotFound("Controle de compra não encontrado.");
		});
	} catch (error) {
		console.log("[ERROR] [DELETE-PURCHASE-CONTROL] Error deleting purchase control.", error);
		throw error;
	} finally {
		console.log("[INFO] [DELETE-PURCHASE-CONTROL] Transaction ended.");
		await dbSession.endSession();
	}
	return res.status(201).json({ data: "Controle de compra excluído com sucesso !", message: "Controle de compra excluído com sucesso !" });
};

export default apiHandler({
	GET: getPurchasesControlsRoute,
	POST: createPurchaseControlRoute,
	PUT: updatePurchaseControlRoute,
	DELETE: deletePurchaseControlRoute,
});

type HandlePurchaseControlAllocationsImprovedParams = {
	type: "ALLOCATING" | "UPDATING" | "DEALLOCATING";
	purchaseControlId: string;
	purchaseControlTitle: TPurchaseControl["titulo"];
	purchaseControlDeliveryDate: TPurchaseControl["entrega"]["dataEfetivacao"];
	purchaseControlComposition: TPurchaseControl["composicao"];
	projectId: TPurchaseControl["projeto"]["id"];
	purchaseControlsCollection: Collection<TPurchaseControl>;
	projectsCollection: Collection<TProject>;
	materialsCollection: Collection<TMaterial>;
	materialsLogsCollection: Collection<TMaterialUpdateRegistry>;
	dbSession: ClientSession;
	userSession: Session;
};

export async function handlePurchaseControlAllocationsImproved({
	type,
	purchaseControlId,
	purchaseControlTitle,
	purchaseControlDeliveryDate,
	purchaseControlComposition,
	projectId,
	purchaseControlsCollection,
	projectsCollection,
	materialsCollection,
	materialsLogsCollection,
	dbSession,
	userSession,
}: HandlePurchaseControlAllocationsImprovedParams) {
	console.log("[INFO] [HANDLE-ALLOCATIONS] Iniciando operação " + type + " para controle " + purchaseControlId + " (projeto: " + projectId + ")");
	// There are two paths for the purchase allocation procces:
	// 1. The purchase control is vinculated to a project, therefore, we gotta allocate the items to the project
	// 2. The purchase control is not vinculated to a project, therefore, we gotta allocate the items to stock

	if (projectId) {
		const project = await projectsCollection.findOne({ _id: new ObjectId(projectId) }, { session: dbSession });
		if (!project) {
			console.error("[ERROR] [HANDLE-ALLOCATIONS] Projeto não encontrado: " + projectId);
			throw new createHttpError.NotFound("Projeto não encontrado.");
		}
		if (type === "ALLOCATING" || type === "UPDATING") {
			console.log("[INFO] [HANDLE-ALLOCATIONS] [PROJECT] Alocando/Atualizando materiais para projeto " + projectId + " a partir do controle " + purchaseControlId);
			// Here, we deal with the allocations to the project
			// For project related allocation, the procces is the same for ALLOCATING and UPDATING, since the sync is done by the movements array

			console.log("[INFO] [HANDLE-ALLOCATIONS] [PROJECT ALLOCATION] [ALLOCATING] Allocating items to project.", { projectId });

			let allocations: Exclude<TProject["alocacoes"], undefined | null> = project.alocacoes || [];

			if (allocations.length === 0) {
				// If the project has no allocations, we gotta create them from the purchase composition
				allocations = purchaseControlComposition
					.filter((c) => !!c.materialId)
					.map((c) => ({
						idMaterial: c.materialId as string,
						quantidade: c.qtde,
						quantidadePrevista: c.qtde,
						unidade: c.unidade,
						precoUnitario: c.valor,
						movimentacoes: [
							{
								idCompra: purchaseControlId,
								data: purchaseControlDeliveryDate as string,
								quantidade: c.qtde,
								precoUnitario: c.valor,
								titulo: purchaseControlTitle,
							},
						],
						nome: c.descricao,
					}));
			} else {
				// In case the project already has allocations, we gotta update those who came from the purchase control
				allocations = allocations.map((a) => {
					// Checking if the material exists in the purchase control composition
					const equivalentPurchaseControlMovement = purchaseControlComposition.find((c) => c.materialId === a.idMaterial);
					// If the material doesn't exist in the purchase control composition, we don't need to update anything
					if (!equivalentPurchaseControlMovement) return a;

					let updatedMovements: Exclude<TProject["alocacoes"], undefined | null>[number]["movimentacoes"] = a.movimentacoes;
					// Getting info about the existence of movements from the purchase control
					const hasMovementsFromPurchaseControl = updatedMovements.some((m) => m.idCompra === purchaseControlId);
					// If the allocation has no movements from the purchase control, we need to add a new movement from the purchase control
					if (!hasMovementsFromPurchaseControl) {
						const newMovement = {
							idCompra: purchaseControlId,
							titulo: purchaseControlTitle,
							data: purchaseControlDeliveryDate as string,
							quantidade: equivalentPurchaseControlMovement.qtde,
							precoUnitario: equivalentPurchaseControlMovement.valor,
						};
						updatedMovements.push(newMovement);
					} else {
						// If the allocation has movements from the purchase control, we need to update the data of the movements
						updatedMovements = updatedMovements.map((m) => {
							if (m.idCompra === purchaseControlId) {
								return {
									idCompra: purchaseControlId,
									titulo: purchaseControlTitle,
									data: purchaseControlDeliveryDate as string,
									quantidade: equivalentPurchaseControlMovement?.qtde || m.quantidade,
									precoUnitario: equivalentPurchaseControlMovement?.valor || m.precoUnitario,
								};
							}
							return m;
						});
					}

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
				console.log("[INFO] [HANDLE-ALLOCATIONS] [PROJECT ALLOCATION] [ALLOCATING] Existing allocations to project updated " + allocations.length);
				// We also gotta add allocations for the purchased materials that don't exist in the project allocations
				const purchaseNewAllocations: Exclude<TProject["alocacoes"], undefined | null> = purchaseControlComposition
					.filter((c) => !!c.materialId && !allocations.some((a) => a.idMaterial === c.materialId))
					.map((c) => ({
						idMaterial: c.materialId as string,
						nome: c.descricao,
						unidade: c.unidade,
						quantidade: c.qtde,
						quantidadePrevista: c.qtde,
						precoUnitario: c.valor,
						movimentacoes: [
							{
								idCompra: purchaseControlId,
								titulo: purchaseControlTitle,
								data: purchaseControlDeliveryDate as string,
								quantidade: c.qtde,
								precoUnitario: c.valor,
							},
						],
					}));
				// Adding the new allocations to the project allocations
				allocations.push(...purchaseNewAllocations);
				console.log("[INFO] [HANDLE-ALLOCATIONS] [PROJECT ALLOCATION] [ALLOCATING] New allocations to project added " + purchaseNewAllocations.length);
			}
			// Updating the project with the new allocations
			await projectsCollection.updateOne({ _id: new ObjectId(projectId) }, { $set: { alocacoes: allocations } }, { session: dbSession });

			// Updating the purchase control composition items with allocated date and allocated quantity
			const updatedPurchaseControlComposition = purchaseControlComposition.map((c) => ({
				...c,
				dataAlocacao: purchaseControlDeliveryDate,
				qtdeAlocada: c.qtde,
			}));
			await purchaseControlsCollection.updateOne({ _id: new ObjectId(purchaseControlId) }, { $set: { composicao: updatedPurchaseControlComposition } }, { session: dbSession });
			console.log("[INFO] [HANDLE-ALLOCATIONS] [PROJECT ALLOCATION] [ALLOCATING] Purchase control updated with allocations.", { purchaseControlId });
		}
		if (type === "DEALLOCATING") {
			console.log("[INFO] [HANDLE-ALLOCATIONS] [PROJECT] Devolvendo materiais do projeto " + projectId + " para o controle " + purchaseControlId);
			// For the deallocation, we gotta remove the project allocation movements that came from the purchase control
			let allocations: Exclude<TProject["alocacoes"], undefined | null> = project.alocacoes || [];

			if (allocations.length > 0) {
				allocations = allocations.map((a) => {
					// Checking if the material exists in the purchase control composition
					const equivalentPurchaseControlMovement = purchaseControlComposition.find((c) => c.materialId === a.idMaterial);
					// If the material doesn't exist in the purchase control composition, we don't need to update anything
					if (!equivalentPurchaseControlMovement) return a;

					let updatedMovements: Exclude<TProject["alocacoes"], undefined | null>[number]["movimentacoes"] = a.movimentacoes;

					// Weed to update the data of the movements by filtering out the movements that came from the purchase control
					updatedMovements = updatedMovements.filter((m) => m.idCompra !== purchaseControlId);

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

			// Updating the project with the new allocations
			await projectsCollection.updateOne({ _id: new ObjectId(projectId) }, { $set: { alocacoes: allocations } }, { session: dbSession });

			// Updating the purchase control composition items with allocated date and allocated quantity
			const updatedPurchaseControlComposition = purchaseControlComposition.map((c) => ({
				...c,
				dataAlocacao: null,
				qtdeAlocada: 0,
			}));
			await purchaseControlsCollection.updateOne({ _id: new ObjectId(purchaseControlId) }, { $set: { composicao: updatedPurchaseControlComposition } }, { session: dbSession });
			console.log("[INFO] [HANDLE-ALLOCATIONS] [PROJECT ALLOCATION] [DEALLOCATING] Purchase control updated with allocations.", { purchaseControlId });
		}
		return {
			message: "Controle de compra atualizado com sucesso !",
		};
	}

	// If the purchase control is not vinculated to a project, we gotta allocate the items to stock
	if (type === "ALLOCATING") {
		console.log("[INFO] [HANDLE-ALLOCATIONS] [STOCK] Alocando materiais em estoque para controle " + purchaseControlId);
		// Here, we deal with the allocations to stock
		const purchasedMaterialsObjectIds = purchaseControlComposition.filter((c) => !!c.materialId).map((c) => new ObjectId(c.materialId as string));
		const materials = await materialsCollection.find({ _id: { $in: purchasedMaterialsObjectIds } }, { session: dbSession }).toArray();
		for (const item of purchaseControlComposition) {
			const existingMaterial = materials.find((mat) => mat._id.toString() === item.materialId);

			if (!existingMaterial) {
				console.error("[ERROR] [HANDLE-ALLOCATIONS] [STOCK] Material não encontrado: " + item.materialId + " no controle " + purchaseControlId);
				throw new createHttpError.NotFound("Material não encontrado.");
			}
			const newQty = existingMaterial.qtde + item.qtde;
			const newPrice = (existingMaterial.qtde * existingMaterial.preco + item.qtde * item.valor) / (existingMaterial.qtde + item.qtde);
			console.log("[INFO] [HANDLE-ALLOCATIONS] [STOCK] Atualizando material:", {
				materialId: existingMaterial._id.toString(),
				qtdeAnterior: existingMaterial.qtde,
				qtdeNova: newQty,
				precoAnterior: existingMaterial.preco,
				precoNovo: newPrice,
				item,
			});
			const diff = item.qtde;

			const updateMaterialResponse = await materialsCollection.updateOne(
				{
					_id: existingMaterial._id,
				},
				{
					$inc: { qtde: diff },
					$set: { preco: newPrice },
				},
				{
					session: dbSession,
				},
			);
			await materialsLogsCollection.insertOne(
				{
					alteracao: diff,
					idCompra: purchaseControlId,
					tipo: "ENTRADA",
					material: {
						id: existingMaterial._id.toString(),
						nome: existingMaterial.nome,
					},
					projeto: {
						id: null,
						nome: null,
					},
					qtdeAnterior: existingMaterial.qtde,
					qtdeNovo: newQty,
					precoAnterior: existingMaterial.preco,
					precoNovo: newPrice,
					autor: {
						id: userSession.user.id,
						nome: userSession.user.nome,
						avatar_url: userSession.user.avatar_url,
					},
					dataInsercao: new Date().toISOString(),
				},
				{
					session: dbSession,
				},
			);
		}

		// Everything dealt with, we gotta update the purchase control composition items with allocated date and allocated quantity
		const updatedPurchaseControlComposition = purchaseControlComposition.map((c) => ({
			...c,
			dataAlocacao: purchaseControlDeliveryDate,
			qtdeAlocada: c.qtde,
		}));
		console.log("[INFO] [HANDLE-ALLOCATIONS] [STOCK] Composição do controle de compra após alocação:", updatedPurchaseControlComposition);
		await purchaseControlsCollection.updateOne({ _id: new ObjectId(purchaseControlId) }, { $set: { composicao: updatedPurchaseControlComposition } }, { session: dbSession });
		console.log("[INFO] [HANDLE-ALLOCATIONS] [STOCK] Purchase control updated with allocations", { purchaseControlId });
	}
	if (type === "UPDATING") {
		console.log("[INFO] [HANDLE-ALLOCATIONS] [STOCK] Atualizando materiais em estoque para controle " + purchaseControlId);
		const purchasedMaterialsObjectIds = purchaseControlComposition.filter((c) => !!c.materialId).map((c) => new ObjectId(c.materialId as string));
		const materials = await materialsCollection.find({ _id: { $in: purchasedMaterialsObjectIds } }, { session: dbSession }).toArray();
		const purchaseRelatedLogs = await materialsLogsCollection.find({ idCompra: purchaseControlId }, { session: dbSession }).toArray();
		for (const item of purchaseControlComposition) {
			const existingMaterial = materials.find((mat) => mat._id.toString() === item.materialId);

			if (!existingMaterial) {
				console.error("[ERROR] [HANDLE-ALLOCATIONS] [STOCK] Material não encontrado: " + item.materialId + " no controle " + purchaseControlId);
				throw new createHttpError.NotFound("Material não encontrado.");
			}
			const existingAllocationLog = purchaseRelatedLogs.find((log) => log.material.id === existingMaterial._id.toString());

			const isItemAllocated = !!item.dataAlocacao;
			// If the item is allocated and the allocation log already exists and the quantity is the same, we don't need to update anything
			if (isItemAllocated && existingAllocationLog && existingAllocationLog.qtdeNovo === item.qtdeAlocada) continue;

			const updateQtyDiff = item.qtde - (item.qtdeAlocada || 0);
			const newQty = existingMaterial.qtde + updateQtyDiff;
			const newPrice = (existingMaterial.qtde * existingMaterial.preco + updateQtyDiff * item.valor) / (existingMaterial.qtde + updateQtyDiff);
			console.log("[INFO] [HANDLE-ALLOCATIONS] [STOCK] Atualizando material:", {
				materialId: existingMaterial._id.toString(),
				diferenca: updateQtyDiff,
				qtdeAnterior: existingMaterial.qtde,
				qtdeNova: newQty,
				precoAnterior: existingMaterial.preco,
				precoNovo: newPrice,
				item,
			});

			const updateMaterialResponse = await materialsCollection.updateOne(
				{
					_id: existingMaterial._id,
				},
				{
					$inc: { qtde: updateQtyDiff },
					$set: { preco: newPrice },
				},
				{
					session: dbSession,
				},
			);
			if (isItemAllocated) {
				// Updating the material log
				await materialsLogsCollection.updateOne(
					{
						idCompra: purchaseControlId,
						"material.id": existingMaterial._id.toString(),
					},
					{
						$inc: {
							qtdeNovo: updateQtyDiff,
						},
						$set: {
							alteracao: updateQtyDiff,
							precoNovo: newPrice,
						},
					},
					{
						session: dbSession,
					},
				);
			} else {
				// Inserting the material log
				await materialsLogsCollection.insertOne(
					{
						alteracao: updateQtyDiff,
						idCompra: purchaseControlId,
						tipo: "ENTRADA",
						material: {
							id: existingMaterial._id.toString(),
							nome: existingMaterial.nome,
						},
						projeto: {
							id: null,
							nome: null,
						},
						qtdeAnterior: existingMaterial.qtde,
						qtdeNovo: newQty,
						precoAnterior: existingMaterial.preco,
						precoNovo: newPrice,
						autor: {
							id: userSession.user.id,
							nome: userSession.user.nome,
							avatar_url: userSession.user.avatar_url,
						},
						dataInsercao: new Date().toISOString(),
					},
					{
						session: dbSession,
					},
				);
			}
		}

		// Updating the purchase control composition items with allocated date and allocated quantity
		const updatedPurchaseControlComposition = purchaseControlComposition.map((c) => ({
			...c,
			dataAlocacao: purchaseControlDeliveryDate,
			qtdeAlocada: c.qtde,
		}));
		console.log("[INFO] [HANDLE-ALLOCATIONS] [STOCK] Composição do controle de compra após atualização:", updatedPurchaseControlComposition);
		await purchaseControlsCollection.updateOne({ _id: new ObjectId(purchaseControlId) }, { $set: { composicao: updatedPurchaseControlComposition } }, { session: dbSession });
	}
	if (type === "DEALLOCATING") {
		console.log("[INFO] [HANDLE-ALLOCATIONS] [STOCK] Devolvendo materiais do estoque para controle " + purchaseControlId);
		const purchaseControlCompositionMaterials = purchaseControlComposition.filter((c) => !!c.materialId);
		for (const compositionItem of purchaseControlCompositionMaterials) {
			const currentMaterialInfo = await materialsCollection.findOne({ _id: new ObjectId(compositionItem.materialId as string) }, { session: dbSession });
			if (!currentMaterialInfo) {
				console.error("[ERROR] [HANDLE-ALLOCATIONS] [STOCK] Material não encontrado: " + compositionItem.materialId);
				throw new createHttpError.NotFound("Material não encontrado.");
			}

			const currentQuantity = currentMaterialInfo.qtde;
			const currentPrice = currentMaterialInfo.preco;
			const restoredQty = currentQuantity - compositionItem.qtde;
			const restoredPrice = (currentPrice * currentQuantity - compositionItem.qtde * compositionItem.valor) / restoredQty;

			await materialsCollection.updateOne({ _id: new ObjectId(compositionItem.materialId as string) }, { $set: { qtde: restoredQty, preco: restoredPrice } }, { session: dbSession });
		}

		// Deleting all logs from the purchase control
		await materialsLogsCollection.deleteMany({ idCompra: purchaseControlId }, { session: dbSession });

		// Updating the purchase control composition items with allocated date and allocated quantity
		const updatedPurchaseControlComposition = purchaseControlComposition.map((c) => ({
			...c,
			dataAlocacao: null,
			qtdeAlocada: 0,
		}));
		console.log("[INFO] [HANDLE-ALLOCATIONS] [STOCK] Composição do controle de compra após devolução:", updatedPurchaseControlComposition);
		await purchaseControlsCollection.updateOne({ _id: new ObjectId(purchaseControlId) }, { $set: { composicao: updatedPurchaseControlComposition } }, { session: dbSession });
		console.log("[INFO] [HANDLE-ALLOCATIONS] [DEALLOCATING] Purchase control updated with allocations.", { purchaseControlId });
	}

	console.log("[INFO] [HANDLE-ALLOCATIONS] Operação " + type + " finalizada para controle " + purchaseControlId);
	return {
		message: "Controle de compra atualizado com sucesso !",
	};
}
