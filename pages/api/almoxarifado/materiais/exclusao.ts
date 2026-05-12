import { notifyMaterialBelowMinimumIfCrossed } from "@/lib/notifications/materials";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TMaterial } from "@/utils/schemas/materials";
import type { TProject } from "@/utils/schemas/projects";
import type { TPurchaseControl } from "@/utils/schemas/purchases";
import type { TTechnicalAnalysis } from "@/utils/schemas/technical-analysis";
import type { TNewWarehouseFormulary } from "@/utils/schemas/warehouse-formularies";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import clientPromise from "@/utils/services/mongodb/mongo-client";
import connectToDatabase from "@/utils/services/mongodb/projects";
import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import createHttpError from "http-errors";
import { type Db, ObjectId } from "mongodb";
import { type NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const DeletionTypesEnumSchema = z.enum(["hard-delete", "soft-delete", "merge"]);
export type TDeletionTypesEnum = z.infer<typeof DeletionTypesEnumSchema>;

const GetMaterialDeletionDataSchema = z.object({
	id: z
		.string({
			required_error: "ID do material não informado.",
			invalid_type_error: "Tipo não válido para o ID do material.",
		})
		.refine((v) => ObjectId.isValid(v), {
			message: "ID do material inválido.",
		}),
});

async function getMaterialDeletionData(input: z.infer<typeof GetMaterialDeletionDataSchema>) {
	const { id } = input;

	const warehouseDb = await connectToWarehouseDatabase();
	const materialsCollection = warehouseDb.collection<TMaterial>("material");
	const warehouseFormulariesCollection = warehouseDb.collection<TNewWarehouseFormulary>("formularios");

	const projectsDb = await connectToDatabase();
	const projectsCollection = projectsDb.collection<TProject>("dados");
	const purchasesCollection = projectsDb.collection<TPurchaseControl>("controles-compras");

	const crmDb = await connectToCRMDatabase();
	const crmTechnicalAnalyses = crmDb.collection<TTechnicalAnalysis>("technical-analysis");

	const material = await materialsCollection.findOne({ _id: new ObjectId(id) }, { projection: { dataExclusao: 1 } });

	if (!material) {
		throw new createHttpError.NotFound("Material não encontrado.");
	}
	const allowedTypesOfDeletion: TDeletionTypesEnum[] = [];

	if (material.dataExclusao) {
		return {
			data: {
				status: "EXCLUÍDO",
				dataExclusao: material.dataExclusao,
				tiposExclusaoHabilitados: allowedTypesOfDeletion,
				dependencias: null,
			},
		};
	}

	const references = {
		purchases: await purchasesCollection.count({
			"composicao.materialId": id,
		}),
		warehouseFormularies: await warehouseFormulariesCollection.count({
			"materiais.id": id,
		}),
		technicalAnalysis: await crmTechnicalAnalyses.count({
			"suprimentos.itens.idMaterial": id,
		}),
		projects: await projectsCollection.count({
			"alocacoes.idMaterial": id,
		}),
	};

	const totalReferences = Object.values(references).reduce((acc, curr) => acc + curr, 0);

	if (totalReferences === 0) allowedTypesOfDeletion.push("hard-delete");
	if (totalReferences > 0) allowedTypesOfDeletion.push("soft-delete");
	allowedTypesOfDeletion.push("merge");

	return {
		data: {
			status: "ATIVO",
			dataExclusao: null,
			tiposExclusaoHabilitados: allowedTypesOfDeletion,
			dependencias: {
				compras: references.purchases,
				formularios: references.warehouseFormularies,
				analisesTecnicas: references.technicalAnalysis,
				projetos: references.projects,
			},
		},
	};
}
export type TMaterialDeletionDataOutput = Awaited<ReturnType<typeof getMaterialDeletionData>>;

const getMaterialDeletionDataHandler: NextApiHandler<TMaterialDeletionDataOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = GetMaterialDeletionDataSchema.parse(req.query);

	const data = await getMaterialDeletionData({ id });

	res.status(200).json(data);
};

const DeleteMaterialInputSchema = z.discriminatedUnion("type", [
	z.object({
		id: z
			.string({
				required_error: "ID do material não informado.",
				invalid_type_error: "Tipo não válido para o ID do material.",
			})
			.refine((v) => ObjectId.isValid(v), {
				message: "ID do material inválido.",
			}),
		type: z.literal(DeletionTypesEnumSchema.Values["hard-delete"]),
	}),
	z.object({
		id: z
			.string({
				required_error: "ID do material não informado.",
				invalid_type_error: "Tipo não válido para o ID do material.",
			})
			.refine((v) => ObjectId.isValid(v), {
				message: "ID do material inválido.",
			}),
		type: z.literal(DeletionTypesEnumSchema.Values["soft-delete"]),
	}),
	z.object({
		id: z
			.string({
				required_error: "ID do material não informado.",
				invalid_type_error: "Tipo não válido para o ID do material.",
			})
			.refine((v) => ObjectId.isValid(v), {
				message: "ID do material inválido.",
			}),
		type: z.literal(DeletionTypesEnumSchema.Values.merge),
		mergeIntoId: z
			.string({
				required_error: "ID do material para mesclagem não informado.",
				invalid_type_error: "Tipo não válido para o ID do material para mesclagem.",
			})
			.refine((v) => ObjectId.isValid(v), {
				message: "ID do material para mesclagem inválido.",
			}),
		mergeMethod: z.enum(["combine", "replace-target-with-origin", "keep-target"]),
	}),
]);
export type TDeleteMaterialInput = z.infer<typeof DeleteMaterialInputSchema>;

async function deleteMaterial(payload: TDeleteMaterialInput) {
	const dbClient = await clientPromise;
	const warehouseDb: Db = dbClient.db("almoxarifado");
	const materialsCollection = warehouseDb.collection<TMaterial>("material");
	const warehouseFormulariesCollection = warehouseDb.collection<TNewWarehouseFormulary>("formularios");

	const projectsDb: Db = dbClient.db("projetos");
	const projectsCollection = projectsDb.collection<TProject>("dados");
	const purchasesCollection = projectsDb.collection<TPurchaseControl>("controles-compras");

	const crmDb: Db = dbClient.db("crm");
	const crmTechnicalAnalyses = crmDb.collection<TTechnicalAnalysis>("technical-analysis");

	const dbSession = dbClient.startSession();

	const references = {
		purchases: await purchasesCollection.count({
			"composicao.materialId": payload.id,
		}),
		warehouseFormularies: await warehouseFormulariesCollection.count({
			"materiais.id": payload.id,
		}),
		technicalAnalysis: await crmTechnicalAnalyses.count({
			"suprimentos.itens.idMaterial": payload.id,
		}),
		projects: await projectsCollection.count({
			"alocacoes.idMaterial": payload.id,
		}),
	};

	const totalReferences = Object.values(references).reduce((acc, curr) => acc + curr, 0);
	let minimumNotificationChange: Parameters<typeof notifyMaterialBelowMinimumIfCrossed>[0] | null = null;
	try {
		const result = await dbSession.withTransaction(async () => {
			// Verificar dependências DENTRO da transação

			if (payload.type === "hard-delete") {
				console.log(`[INFO] [DELETE-MATERIAL] [HARD_DELETE] Running hard delete for ${payload.id}`);
				if (totalReferences > 0) {
					throw new createHttpError.BadRequest("Material possui dependências e não pode ser excluído.");
				}
				await materialsCollection.deleteOne({ _id: new ObjectId(payload.id) }, { session: dbSession });

				return {
					data: { deletedId: payload.id },
					message: "Material excluído com sucesso.",
				};
			}

			if (payload.type === "soft-delete") {
				console.log(`[INFO] [DELETE-MATERIAL] [SOFT_DELETE] Running soft delete for ${payload.id}`);
				await materialsCollection.updateOne(
					{ _id: new ObjectId(payload.id) },
					{ $set: { dataExclusao: new Date().toISOString() } },
					{ session: dbSession },
				);

				return {
					data: { deletedId: payload.id },
					message: "Material excluído com sucesso.",
				};
			}

			if (payload.type === "merge") {
				console.log(`[INFO] [DELETE-MATERIAL] [MERGE] Running merge for ${payload.id} into ${payload.mergeIntoId}`);
				if (!payload.mergeIntoId) {
					throw new createHttpError.BadRequest("ID do material para mesclagem não informado.");
				}

				const originMaterial = await materialsCollection.findOne({ _id: new ObjectId(payload.id) }, { session: dbSession });
				const targetMaterial = await materialsCollection.findOne({ _id: new ObjectId(payload.mergeIntoId) }, { session: dbSession });
				if (!originMaterial || !targetMaterial) {
					throw new createHttpError.NotFound("Material de origem ou destino não encontrado.");
				}
				// First, soft deleting the origin material
				await materialsCollection.updateOne(
					{ _id: new ObjectId(payload.id) },
					{ $set: { dataExclusao: new Date().toISOString() } },
					{ session: dbSession },
				);

				if (payload.mergeMethod === "combine") {
					// Combining the origin material into the target material
					const weightedPrices =
						(originMaterial.preco * originMaterial.qtde + targetMaterial.preco * targetMaterial.qtde) / (originMaterial.qtde + targetMaterial.qtde);
					const finalQty = originMaterial.qtde + targetMaterial.qtde;
					console.log("[INFO] [DELETE-MATERIAL] [MERGE] Combining origin material into target material.", {
						originMaterialPrice: originMaterial.preco,
						originMaterialQty: originMaterial.qtde,
						targetMaterialPrice: targetMaterial.preco,
						targetMaterialQty: targetMaterial.qtde,
						finalPrice: weightedPrices,
						finalQty: finalQty,
					});

					// Updating the target material with the new values
					await materialsCollection.updateOne(
						{ _id: new ObjectId(payload.mergeIntoId) },
						{ $set: { qtde: finalQty, preco: weightedPrices } },
						{ session: dbSession },
					);
					minimumNotificationChange = {
						materialId: targetMaterial._id.toString(),
						materialName: targetMaterial.nome,
						previousQuantity: targetMaterial.qtde,
						newQuantity: finalQty,
						minimumQuantity: targetMaterial.qtdeMinima,
					};
					// Deleting the origin material
					await materialsCollection.deleteOne({ _id: new ObjectId(payload.id) }, { session: dbSession });
				}
				if (payload.mergeMethod === "replace-target-with-origin") {
					console.log("[INFO] [DELETE-MATERIAL] [MERGE] Replacing target material data with origin material.");
					// Replacing the target material with the origin material
					await materialsCollection.updateOne(
						{ _id: new ObjectId(payload.mergeIntoId) },
						{ $set: { qtde: originMaterial.qtde, preco: originMaterial.preco } },
						{ session: dbSession },
					);
					minimumNotificationChange = {
						materialId: targetMaterial._id.toString(),
						materialName: targetMaterial.nome,
						previousQuantity: targetMaterial.qtde,
						newQuantity: originMaterial.qtde,
						minimumQuantity: targetMaterial.qtdeMinima,
					};
				}
				if (payload.mergeMethod === "keep-target") {
					// In this case, nothing needs to be done
					console.log("[INFO] [DELETE-MATERIAL] [MERGE] Keep target method selected. Nothing to do.");
				}
				// Atualizações com session em todas as operações
				console.log("[INFO] [DELETE-MATERIAL] [MERGE] Updating purchases...");
				const updatePurchasesResponse = await purchasesCollection.updateMany(
					{ "composicao.materialId": payload.id },
					{ $set: { "composicao.$[elem].materialId": payload.mergeIntoId } },
					{
						session: dbSession,
						arrayFilters: [{ "elem.materialId": payload.id }],
					},
				);

				const updateWarehouseFormulariesResponse = await warehouseFormulariesCollection.updateMany(
					{ "materiais.id": payload.id },
					{ $set: { "materiais.$[elem].id": payload.mergeIntoId } },
					{
						session: dbSession,
						arrayFilters: [{ "elem.id": payload.id }],
					},
				);

				const updateTechnicalAnalysisResponse = await crmTechnicalAnalyses.updateMany(
					{ "suprimentos.itens.idMaterial": payload.id },
					{ $set: { "suprimentos.itens.$[elem].idMaterial": payload.mergeIntoId } },
					{
						session: dbSession,
						arrayFilters: [{ "elem.idMaterial": payload.id }],
					},
				);

				const updateProjectsResponse = await projectsCollection.updateMany(
					{ "alocacoes.idMaterial": payload.id },
					{ $set: { "alocacoes.$[elem].idMaterial": payload.mergeIntoId } },
					{
						session: dbSession,
						arrayFilters: [{ "elem.idMaterial": payload.id }],
					},
				);
				console.log("[INFO] [DELETE-MATERIAL] [MERGE] Merge completed.", {
					purchases: { matched: updatePurchasesResponse.matchedCount, updated: updatePurchasesResponse.modifiedCount },
					warehouseFormularies: {
						matched: updateWarehouseFormulariesResponse.matchedCount,
						updated: updateWarehouseFormulariesResponse.modifiedCount,
					},
					technicalAnalysis: { matched: updateTechnicalAnalysisResponse.matchedCount, updated: updateTechnicalAnalysisResponse.modifiedCount },
					projects: { matched: updateProjectsResponse.matchedCount, updated: updateProjectsResponse.modifiedCount },
				});
				return {
					data: { deletedId: payload.id },
					message: "Material mesclado com sucesso.",
					mergeStats: {
						purchases: { matched: updatePurchasesResponse.matchedCount, updated: updatePurchasesResponse.modifiedCount },
						warehouseFormularies: {
							matched: updateWarehouseFormulariesResponse.matchedCount,
							updated: updateWarehouseFormulariesResponse.modifiedCount,
						},
						technicalAnalysis: { matched: updateTechnicalAnalysisResponse.matchedCount, updated: updateTechnicalAnalysisResponse.modifiedCount },
						projects: { matched: updateProjectsResponse.matchedCount, updated: updateProjectsResponse.modifiedCount },
					},
				};
			}
		});
		if (minimumNotificationChange) await notifyMaterialBelowMinimumIfCrossed(minimumNotificationChange);

		return result as {
			data: { deletedId: string };
			message: string;
			mergeStats?: {
				purchases: { matched: number; updated: number };
				warehouseFormularies: { matched: number; updated: number };
				technicalAnalysis: { matched: number; updated: number };
				projects: { matched: number; updated: number };
			};
		};
	} catch (error) {
		console.log("[ERROR] [DELETE-MATERIAL] Error deleting material.", error);
		throw error;
	} finally {
		console.log("[INFO] [DELETE-MATERIAL] Transaction ended.");
		await dbSession.endSession();
	}
}
export type TDeleteMaterialOutput = Awaited<ReturnType<typeof deleteMaterial>>;

const deleteMaterialHandler: NextApiHandler<TDeleteMaterialOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	console.log(`[INFO] [DELETE-MATERIAL] Handler called by ${session.user.nome}`);
	console.log(req.body);
	const payload = DeleteMaterialInputSchema.parse(req.body);

	const data = await deleteMaterial(payload);

	res.status(200).json(data);
};

export default apiHandler({
	POST: deleteMaterialHandler,
	GET: getMaterialDeletionDataHandler,
});
