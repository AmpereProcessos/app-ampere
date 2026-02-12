import type { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TExpense } from "@/utils/schemas/expenses";
import type { TMaterialUpdateRegistry } from "@/utils/schemas/material-updates-registry";
import type { TMaterial } from "@/utils/schemas/materials";
import type { TProject } from "@/utils/schemas/projects";
import { type TNewWarehouseFormulary, TransactionalWarehouseFormularySchema } from "@/utils/schemas/warehouse-formularies";
import clientPromise from "@/utils/services/mongodb/mongo-client";
import connectToDatabase from "@/utils/services/mongodb/projects";
import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import createHttpError from "http-errors";
import { type AnyBulkWriteOperation, type ClientSession, type Filter, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import z from "zod";

const GetWarehouseFormulariesSchema = z.object({
	id: z
		.string({
			invalid_type_error: "Tipo inválido para o ID do formulário.",
		})
		.optional()
		.nullable(),
	projectId: z
		.string({
			invalid_type_error: "Tipo inválido para o ID do projeto.",
		})
		.optional()
		.nullable(),
	page: z
		.string({
			invalid_type_error: "Tipo inválido para a página.",
		})
		.optional()
		.nullable()
		.transform((val) => (val ? Number(val) : 1)),
	search: z
		.string({
			invalid_type_error: "Tipo inválido para a busca.",
		})
		.optional()
		.nullable(),
	periodType: z.enum(["dataInsercao", "dataEfetivacao"]).optional().nullable(),
	periodAfter: z
		.string({
			invalid_type_error: "Tipo inválido para o período após.",
		})
		.datetime({
			message: "Formato inválido para o período após.",
		})
		.optional()
		.nullable(),
	periodBefore: z
		.string({
			invalid_type_error: "Tipo inválido para o período antes.",
		})
		.datetime({
			message: "Formato inválido para o período antes.",
		})
		.optional()
		.nullable(),
	pendingOnly: z
		.string({
			invalid_type_error: "Tipo inválido para o flag de formulários pendentes.",
		})
		.optional()
		.nullable()
		.transform((val) => val === "true"),
	draftsOnly: z
		.string({
			invalid_type_error: "Tipo inválido para o flag de formulários rascunhos.",
		})
		.optional()
		.nullable()
		.transform((val) => val === "true"),
});
export type TGetWarehouseFormulariesInput = z.infer<typeof GetWarehouseFormulariesSchema>;

async function getWarehouseFormularies({ input, session }: { input: TGetWarehouseFormulariesInput; session: TAuthSession }) {
	const PAGE_SIZE = 50;
	const { id, search, periodType, periodAfter, periodBefore, pendingOnly, page, projectId, draftsOnly } = input;

	const warehouseDb = await connectToWarehouseDatabase();
	const warehouseFormsCollection = warehouseDb.collection<TNewWarehouseFormulary>("formularios");

	if (draftsOnly) {
		const warehouseForms = await warehouseFormsCollection.find({ dataEfetivacao: null, dataInsercao: null }).toArray();
		return {
			data: {
				default: undefined,
				byId: undefined,
				byProjectId: undefined,
				drafts: warehouseForms.map((wf) => ({ ...wf, _id: wf._id.toString() })),
			},
		};
	}
	if (id) {
		if (!ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

		const warehouseForm = await warehouseFormsCollection.findOne({ _id: new ObjectId(id) });
		if (!warehouseForm) throw new createHttpError.NotFound("Formulário não encontrado.");

		return {
			data: {
				default: undefined,
				byId: { ...warehouseForm, _id: warehouseForm._id.toString() },
				byProjectId: undefined,
				drafts: undefined,
			},
		};
	}
	if (projectId) {
		if (!ObjectId.isValid(projectId)) throw new createHttpError.BadRequest("ID do projeto inválido.");
		const project = await warehouseFormsCollection.find({ "projeto.id": projectId }).toArray();
		if (!project) throw new createHttpError.NotFound("Projeto não encontrado.");
		return {
			data: {
				default: undefined,
				byId: undefined,
				byProjectId: project.map((wf) => ({ ...wf, _id: wf._id.toString() })),
				drafts: undefined,
			},
		};
	}
	const searchQuery: Filter<TNewWarehouseFormulary> | null = search && search.trim().length > 0 ? { titulo: { $regex: search, $options: "i" } } : null;

	const periodQuery: Filter<TNewWarehouseFormulary> | null =
		periodType && periodAfter && periodBefore ? { [periodType]: { $gte: periodAfter, $lte: periodBefore } } : null;

	const pendingOnlyQuery: Filter<TNewWarehouseFormulary> | null = pendingOnly ? { dataEfetivacao: null } : null;

	const andQuery = [searchQuery, periodQuery, pendingOnlyQuery].filter((q) => q !== null);
	const query: Filter<TNewWarehouseFormulary> = { $and: [...andQuery, { dataInsercao: { $ne: null } }] };

	const skip = PAGE_SIZE * (Number(page) - 1);
	const limit = PAGE_SIZE;

	const warehouseFormsMatched = await warehouseFormsCollection.countDocuments(query);
	const warehouseForms = await warehouseFormsCollection.find(query).skip(skip).limit(limit).sort({ _id: -1 }).toArray();
	const totalPages = Math.ceil(warehouseFormsMatched / PAGE_SIZE);

	return {
		data: {
			default: {
				warehouseForms: warehouseForms.map((wf) => ({ ...wf, _id: wf._id.toString() })),
				warehouseFormsMatched,
				totalPages,
			},
			byId: undefined,
			byProjectId: undefined,
			drafts: undefined,
		},
	};
}
export type TGetWarehouseFormulariesOutput = Awaited<ReturnType<typeof getWarehouseFormularies>>;
export type TGetWarehouseFormulariesOutputDefault = Exclude<TGetWarehouseFormulariesOutput["data"]["default"], undefined>;
export type TGetWarehouseFormulariesOutputById = Exclude<TGetWarehouseFormulariesOutput["data"]["byId"], undefined>;
export type TGetWarehouseFormulariesOutputByProjectId = Exclude<TGetWarehouseFormulariesOutput["data"]["byProjectId"], undefined>;
export type TGetWarehouseFormulariesOutputDrafts = Exclude<TGetWarehouseFormulariesOutput["data"]["drafts"], undefined>;
const getWarehouseFormulariesHandler: NextApiHandler<TGetWarehouseFormulariesOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	console.log("[INFO][WAREHOUSE_FORM_GET] Getting warehouse forms", {
		user: session.user.nome,
		query: req.query,
	});
	const input = GetWarehouseFormulariesSchema.parse(req.query);
	const output = await getWarehouseFormularies({ input, session });
	res.status(200).json(output);
};

const CreateWarehouseFormulary = z.object({
	warehouseFormulary: TransactionalWarehouseFormularySchema,
});
export type TCreateWarehouseFormularyInput = z.infer<typeof CreateWarehouseFormulary>;
async function createWarehouseFormulary({ input, session }: { input: TCreateWarehouseFormularyInput; session: TAuthSession }) {
	console.log(`[INFO][WAREHOUSE_FORM_CREATION] Creating warehouse form - requested by user ${session.user.nome}`);
	const { warehouseFormulary } = input;

	// Starting MongoDB transaction
	const client = await clientPromise;
	const session_mongo = client.startSession();

	try {
		const warehouseDb = client.db("almoxarifado");
		const warehouseFormsCollection = warehouseDb.collection<TNewWarehouseFormulary>("formularios");
		const warehouseMaterialsCollection = warehouseDb.collection<TMaterial>("material");
		const warehouseLogsCollection = warehouseDb.collection<TMaterialUpdateRegistry>("alteracoes");
		const insertedWarehouseFormularyId = (await session_mongo.withTransaction(async () => {
			// Insert warehouse formulary
			const insertWarehouseFormulary: TNewWarehouseFormulary = {
				...warehouseFormulary,
				materiais: warehouseFormulary.materiais.map((m) => ({ ...m, qtdeRetiradaEfetivada: 0, qtdeDevolucaoEfetivada: 0 })),
				autor: {
					id: session.user.id,
					nome: session.user.nome,
					avatar_url: session.user.avatar_url,
				},
			};
			const insertResponse = await warehouseFormsCollection.insertOne(insertWarehouseFormulary, { session: session_mongo });
			if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro na inserção do formulário.");

			// In case no insertion date was provided, we must insert it as a draft, so no material updates for now
			if (!warehouseFormulary.dataInsercao) {
				console.log("[INFO][WAREHOUSE_FORM_CREATION] No insertion date provided, creating warehouse form as a draft");
				return {
					data: {
						insertedId: insertResponse.insertedId.toString(),
					},
					message: "Formulário criado com sucesso !",
				};
			}
			// Handling materials update
			const warehouseFormularyMaterialsList = warehouseFormulary.materiais;
			const warehouseFormularyMaterialsListIds = warehouseFormularyMaterialsList
				.filter((material) => !!material.id)
				.map((material) => new ObjectId(material.id as string));

			const warehouseFormularyMaterials = await warehouseMaterialsCollection
				.find({ _id: { $in: warehouseFormularyMaterialsListIds } }, { session: session_mongo })
				.toArray();

			const bulkwriteMaterials: AnyBulkWriteOperation<TMaterial>[] = [];
			const bulkwriteLogs: AnyBulkWriteOperation<TMaterialUpdateRegistry>[] = [];

			for (const listMaterial of warehouseFormularyMaterialsList) {
				const correspondingMaterial = warehouseFormularyMaterials.find((mi) => mi._id.toString() === listMaterial.id);
				if (!correspondingMaterial) throw new createHttpError.NotFound("Material não encontrado.");

				// Getting the liquid decrease quantity (takeway - devolution)
				const listMaterialLiquidDecreaseQty = listMaterial.qtdeRetirada - listMaterial.qtdeDevolucao;

				// Checking for inconsistency in quantity update (taking more than available)
				if (correspondingMaterial.qtde < listMaterialLiquidDecreaseQty)
					throw new createHttpError.BadRequest(
						`Quantidade retirada de ${correspondingMaterial.nome} excede o estoque atual contabilizado de ${correspondingMaterial.qtde}.`,
					);

				// If no inconsistency was found, creating bulkwrite operation object
				console.log(
					`[INFO][WAREHOUSE_FORM_CREATION] Updating the quantity of material ${correspondingMaterial.nome} by decreasing ${listMaterialLiquidDecreaseQty} units for warehouse form ${insertResponse.insertedId.toString()}`,
				);
				bulkwriteMaterials.push({
					updateOne: {
						filter: { _id: new ObjectId(correspondingMaterial._id) },
						update: {
							$inc: { qtde: -listMaterialLiquidDecreaseQty }, // Decreasing the quantity of the material by the amount of material taken away
						},
					},
				});
				bulkwriteLogs.push({
					insertOne: {
						document: {
							alteracao: -listMaterialLiquidDecreaseQty,
							autor: { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url },
							dataInsercao: new Date().toISOString(),
							qtdeAnterior: correspondingMaterial.qtde,
							qtdeNovo: correspondingMaterial.qtde - listMaterialLiquidDecreaseQty,
							precoAnterior: correspondingMaterial.preco,
							precoNovo: correspondingMaterial.preco,
							tipo: listMaterialLiquidDecreaseQty > 0 ? "RETIRADA" : "DEVOLUÇÃO",
							idFormulario: insertResponse.insertedId.toString(),
							formulario: { id: insertResponse.insertedId.toString(), titulo: warehouseFormulary.titulo },
							material: { id: correspondingMaterial._id.toString(), nome: correspondingMaterial.nome },
							projeto: { id: warehouseFormulary.projeto.id, nome: warehouseFormulary.projeto.nome },
						},
					},
				});
			}

			// Execute bulk operations within transaction
			if (bulkwriteMaterials.length > 0) {
				await warehouseMaterialsCollection.bulkWrite(bulkwriteMaterials, { session: session_mongo });
			}
			// Inserting the logs
			if (bulkwriteLogs.length > 0) {
				await warehouseLogsCollection.bulkWrite(bulkwriteLogs, { session: session_mongo });
			}

			// Updating the warehouse formulary
			const updateWarehouseFormularyMaterialsList = warehouseFormularyMaterialsList.map((m) => ({
				...m,
				qtdeRetiradaEfetivada: m.qtdeRetirada,
				qtdeDevolucaoEfetivada: m.qtdeDevolucao,
			}));
			await warehouseFormsCollection.updateOne(
				{ _id: new ObjectId(insertResponse.insertedId) },
				{ $set: { materiais: updateWarehouseFormularyMaterialsList } },
				{ session: session_mongo },
			);

			return insertResponse.insertedId.toString();
		})) as unknown as string;

		return {
			data: {
				insertedId: insertedWarehouseFormularyId,
			},
			message: "Formulário criado com sucesso !",
		};
	} finally {
		await session_mongo.endSession();
	}
}
export type TCreateWarehouseFormularyOutput = Awaited<ReturnType<typeof createWarehouseFormulary>>;

const createWarehouseFormularyHandler: NextApiHandler<TCreateWarehouseFormularyOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = CreateWarehouseFormulary.parse(req.body);
	const output = await createWarehouseFormulary({ input, session });
	res.status(200).json(output);
};

const UpdateWarehouseFormulary = z.object({
	warehouseFormularyId: z.string({ invalid_type_error: "Tipo inválido para o ID do formulário." }),
	warehouseFormulary: TransactionalWarehouseFormularySchema,
});
export type TUpdateWarehouseFormularyInput = z.infer<typeof UpdateWarehouseFormulary>;
async function updateWarehouseFormulary({ input, session }: { input: TUpdateWarehouseFormularyInput; session: TAuthSession }) {
	const { warehouseFormularyId, warehouseFormulary } = input;
	console.log(`[INFO][WAREHOUSE_FORM_UPDATE] Updating warehouse form ${warehouseFormularyId} - requested by user ${session.user.nome}`);

	// Starting MongoDB transaction for warehouse operations
	const client = await clientPromise;
	const session_mongo = client.startSession();

	try {
		const projectsDb = client.db("projetos");
		const projectsCollection = projectsDb.collection<TProject>("dados");
		const expensesCollection = projectsDb.collection<TExpense>("despesas");

		const warehouseDb = client.db("almoxarifado");
		const warehouseFormsCollection = warehouseDb.collection<TNewWarehouseFormulary>("formularios");
		const warehouseMaterialsCollection = warehouseDb.collection<TMaterial>("material");
		const warehouseLogsCollection = warehouseDb.collection<TMaterialUpdateRegistry>("alteracoes");
		await session_mongo.withTransaction(async () => {
			const previousWarehouseFormulary = await warehouseFormsCollection.findOne({ _id: new ObjectId(warehouseFormularyId) }, { session: session_mongo });
			if (!previousWarehouseFormulary) throw new createHttpError.NotFound("Formulário não encontrado.");
			const previousWarehouseFormularyMaterialsList = previousWarehouseFormulary.materiais;

			const updateWarehouseFormulary: TNewWarehouseFormulary = {
				...warehouseFormulary,
				materiais: warehouseFormulary.materiais.map((m) => {
					// We get the previous material effectivated quantities
					const previousMaterialInfo = previousWarehouseFormulary.materiais.find((mi) => mi.id === m.id);
					return {
						...m,
						qtdeRetiradaEfetivada: previousMaterialInfo?.qtdeRetiradaEfetivada || 0,
						qtdeDevolucaoEfetivada: previousMaterialInfo?.qtdeDevolucaoEfetivada || 0,
					};
				}),
				autor: previousWarehouseFormulary.autor,
			};
			const updateResponse = await warehouseFormsCollection.updateOne(
				{ _id: new ObjectId(warehouseFormularyId) },
				{
					$set: {
						...updateWarehouseFormulary,
					},
				},
				{ session: session_mongo },
			);
			if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro na atualização do formulário.");

			const updatedWarehouseFormulary = await warehouseFormsCollection.findOne({ _id: new ObjectId(warehouseFormularyId) }, { session: session_mongo });
			if (!updatedWarehouseFormulary) throw new createHttpError.NotFound("Formulário não encontrado.");

			const updatedWarehouseFormularyMaterialsList = updatedWarehouseFormulary.materiais;

			const materialsListMap = new Map<
				string,
				{ newMaterial: TNewWarehouseFormulary["materiais"][number] | null; previousMaterial: TNewWarehouseFormulary["materiais"][number] | null }
			>();

			// Getting a list of
			const materialsListIdsSet = Array.from(
				new Set([
					...previousWarehouseFormulary.materiais.flatMap((m) => m.id as string),
					...updatedWarehouseFormularyMaterialsList.flatMap((m) => m.id as string),
				]),
			).map((id) => new ObjectId(id));

			console.log("[INFO][WAREHOUSE_FORM_UPDATE] Materials list ids set", materialsListIdsSet);

			for (const previousListMaterial of previousWarehouseFormularyMaterialsList) {
				materialsListMap.set(previousListMaterial.id as string, { newMaterial: null, previousMaterial: previousListMaterial });
			}
			for (const updatedListMaterial of updatedWarehouseFormularyMaterialsList) {
				const materialInMap = materialsListMap.get(updatedListMaterial.id as string);
				materialsListMap.set(updatedListMaterial.id as string, {
					newMaterial: updatedListMaterial,
					previousMaterial: materialInMap?.previousMaterial || null,
				});
			}

			const warehouseFormularyMaterials = await warehouseMaterialsCollection
				.find({ _id: { $in: materialsListIdsSet } }, { session: session_mongo })
				.toArray();

			const bulkwriteMaterials: AnyBulkWriteOperation<TMaterial>[] = [];
			const bulkwriteLogs: AnyBulkWriteOperation<TMaterialUpdateRegistry>[] = [];

			for (const listMaterial of materialsListMap.values()) {
				const { newMaterial, previousMaterial } = listMaterial;

				// If none of the materials exist (before and after) (theorically not possible), continuing
				if (!newMaterial && !previousMaterial) continue;

				// If the material existed before, but does not exist anymore (meaning it was removed from the warehouse form) we need to increase the quantity of the material in stock
				if (!newMaterial && !!previousMaterial) {
					const correspondingMaterial = warehouseFormularyMaterials.find((mi) => mi._id.toString() === previousMaterial.id);
					if (!correspondingMaterial) throw new createHttpError.NotFound("Material não encontrado.");

					const listMaterialLiquidDecreaseQty = previousMaterial.qtdeRetiradaEfetivada - previousMaterial.qtdeDevolucaoEfetivada;
					// If the material was removed, we need to increase the quantity of the material
					bulkwriteMaterials.push({
						updateOne: {
							filter: { _id: new ObjectId(correspondingMaterial._id) },
							update: { $inc: { qtde: listMaterialLiquidDecreaseQty } },
						},
					});
					console.log(
						`[INFO][WAREHOUSE_FORM_UPDATE] Material ${previousMaterial.id} removed, increasing quantity of material by ${listMaterialLiquidDecreaseQty} units`,
					);

					bulkwriteLogs.push({
						insertOne: {
							document: {
								alteracao: listMaterialLiquidDecreaseQty, // Positive, since we are returning to stock
								tipo: "DEVOLUÇÃO",
								idFormulario: warehouseFormularyId,
								formulario: { id: warehouseFormularyId, titulo: updatedWarehouseFormulary.titulo },
								material: { id: correspondingMaterial._id.toString(), nome: correspondingMaterial.nome },
								projeto: { id: updatedWarehouseFormulary.projeto.id, nome: updatedWarehouseFormulary.projeto.nome },
								autor: { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url },
								dataInsercao: new Date().toISOString(),
								qtdeAnterior: correspondingMaterial.qtde,
								qtdeNovo: correspondingMaterial.qtde - listMaterialLiquidDecreaseQty,
								precoAnterior: correspondingMaterial.preco,
								precoNovo: correspondingMaterial.preco,
							},
						},
					});
					continue;
				}

				// If the material does not exist, continuing
				if (!newMaterial) continue;

				// If the material exists, we need to update the quantity of the material
				const correspondingMaterial = warehouseFormularyMaterials.find((mi) => mi._id.toString() === newMaterial.id);
				if (!correspondingMaterial) throw new createHttpError.NotFound("Material não encontrado.");

				const listMaterialTakeAwayDiff = newMaterial.qtdeRetirada - newMaterial.qtdeRetiradaEfetivada;
				const listMaterialDevolutionDiff = newMaterial.qtdeDevolucao - newMaterial.qtdeDevolucaoEfetivada;

				// Getting the liquid decrease quantity (takeway - devolution)
				const listMaterialLiquidDecreaseQty = listMaterialTakeAwayDiff - listMaterialDevolutionDiff;

				// If not changes were made to quantities, skipping
				if (listMaterialLiquidDecreaseQty === 0) continue;

				// Validating inconsistency in quantity update (taking more than available)
				if (correspondingMaterial.qtde < listMaterialLiquidDecreaseQty)
					throw new createHttpError.BadRequest(
						`Quantidade retirada de ${correspondingMaterial.nome} excede o estoque atual contabilizado de ${correspondingMaterial.qtde}.`,
					);

				console.log(
					`[INFO][WAREHOUSE_FORM_UPDATE] Updating the quantity of material ${correspondingMaterial.nome} by decreasing ${listMaterialLiquidDecreaseQty} units for warehouse form ${warehouseFormularyId}`,
				);
				bulkwriteMaterials.push({
					updateOne: {
						filter: { _id: new ObjectId(correspondingMaterial._id) },
						update: { $inc: { qtde: -listMaterialLiquidDecreaseQty } },
					},
				});
				bulkwriteLogs.push({
					insertOne: {
						document: {
							alteracao: -listMaterialLiquidDecreaseQty, // Negative, since our base operation is "taking away"
							tipo: listMaterialLiquidDecreaseQty > 0 ? "RETIRADA" : "DEVOLUÇÃO",
							idFormulario: warehouseFormularyId,
							formulario: { id: warehouseFormularyId, titulo: updatedWarehouseFormulary.titulo },
							material: { id: correspondingMaterial._id.toString(), nome: correspondingMaterial.nome },
							projeto: { id: updatedWarehouseFormulary.projeto.id, nome: updatedWarehouseFormulary.projeto.nome },
							autor: { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url },
							dataInsercao: new Date().toISOString(),
							qtdeAnterior: correspondingMaterial.qtde,
							qtdeNovo: correspondingMaterial.qtde - listMaterialLiquidDecreaseQty,
							precoAnterior: correspondingMaterial.preco,
							precoNovo: correspondingMaterial.preco,
						},
					},
				});
			}

			if (bulkwriteMaterials.length > 0) {
				// Execute bulk operations within transaction
				await warehouseMaterialsCollection.bulkWrite(bulkwriteMaterials, { session: session_mongo });
			}
			if (bulkwriteLogs.length > 0) {
				await warehouseLogsCollection.bulkWrite(bulkwriteLogs, { session: session_mongo });
			}

			// Updating the warehouse formulary
			const newUpdatedWarehouseFormularyMaterialsList = updatedWarehouseFormularyMaterialsList.map((m) => ({
				...m,
				qtdeRetiradaEfetivada: m.qtdeRetirada,
				qtdeDevolucaoEfetivada: m.qtdeDevolucao,
			}));
			await warehouseFormsCollection.updateOne(
				{ _id: new ObjectId(warehouseFormularyId) },
				{ $set: { materiais: newUpdatedWarehouseFormularyMaterialsList } },
				{ session: session_mongo },
			);
			// Getting the updated formulary again since it was updated in the transaction
			const finalUpdatedWarehouseFormulary = await warehouseFormsCollection.findOne(
				{ _id: new ObjectId(warehouseFormularyId) },
				{ session: session_mongo },
			);

			if (!finalUpdatedWarehouseFormulary) {
				throw new createHttpError.NotFound("Formulário não encontrado.");
			}

			if (!previousWarehouseFormulary?.dataEfetivacao && !!finalUpdatedWarehouseFormulary?.dataEfetivacao) {
				// Checking for possible effectivation of the warehouse form
				// If, checking for possible project associated to the warehouse form
				if (finalUpdatedWarehouseFormulary?.projeto.id) {
					const project = await projectsCollection.findOne({ _id: new ObjectId(finalUpdatedWarehouseFormulary.projeto.id) }, { session: session_mongo });
					if (!project) throw new createHttpError.NotFound("Projeto não encontrado.");

					// Creating a expense from the warehouse form
					const newExpense: TExpense = {
						rateio: "CUSTOS DIRETOS",
						categoria: "INSUMOS DE ALMOXARIFADO",
						descricao: finalUpdatedWarehouseFormulary.titulo,
						projeto: {
							id: finalUpdatedWarehouseFormulary.projeto.id,
							nome: finalUpdatedWarehouseFormulary.projeto.nome,
							identificador: finalUpdatedWarehouseFormulary.projeto.identificador, // identificador QTDE do projeto no banco de projetos
							tipo: "",
						},
						idFormularioAlmoxarifado: finalUpdatedWarehouseFormulary._id.toString(),
						autor: {
							id: session.user.id,
							nome: session.user.nome,
							avatar_url: session.user.avatar_url,
						},
						itens: finalUpdatedWarehouseFormulary.materiais.map((m) => ({
							idMaterial: m.id,
							descricao: m.nome,
							preco: m.preco,
							qtde: m.qtdeRetirada - m.qtdeDevolucao,
							unidade: m.grandeza || "UN",
						})),
						total: finalUpdatedWarehouseFormulary.materiais.reduce((acc, m) => acc + m.preco * (m.qtdeRetirada - m.qtdeDevolucao), 0),
						efetivacao: {
							efetivado: true,
							data: new Date().toISOString(),
						},
						criterioCompetencia: true,
						criterioReferencia: false,
						pagamentos: [],
						dataInsercao: new Date().toISOString(),
					};
					await expensesCollection.insertOne(newExpense, { session: session_mongo });
				}
			}

			if (finalUpdatedWarehouseFormulary.projeto.id) {
				console.log("[INFO][WAREHOUSE_FORM_UPDATE] Updating project allocations.", {
					warehouseFormularyId,
					projectId: finalUpdatedWarehouseFormulary.projeto.id,
				});
				const project = await projectsCollection.findOne({ _id: new ObjectId(finalUpdatedWarehouseFormulary.projeto.id) }, { session: session_mongo });
				if (!project) throw new createHttpError.NotFound("Projeto não encontrado.");

				const allocations = project.alocacoes || [];
				const allocationsMap = new Map(allocations.map((a) => [a.idMaterial, a]));

				const wrMaterials = finalUpdatedWarehouseFormulary.materiais.filter((m) => !!m.id);
				for (const wfMaterial of wrMaterials) {
					const existingAllocationForMaterial = allocationsMap.get(wfMaterial.id as string);

					// If no existing allocation for the material is defined:
					// Pretty straight forward, we gotta create a new allocation for the material with a new movement from the warehouse form
					if (!existingAllocationForMaterial) {
						allocationsMap.set(wfMaterial.id as string, {
							idMaterial: wfMaterial.id as string,
							nome: wfMaterial.nome,
							unidade: wfMaterial.grandeza || "UN",
							quantidade: wfMaterial.qtdeRetiradaEfetivada - wfMaterial.qtdeDevolucaoEfetivada,
							quantidadePrevista: wfMaterial.qtdeRetiradaEfetivada - wfMaterial.qtdeDevolucaoEfetivada,
							precoUnitario: wfMaterial.preco,
							movimentacoes: [
								{
									data: new Date().toISOString(),
									titulo: finalUpdatedWarehouseFormulary.titulo,
									quantidade: wfMaterial.qtdeRetiradaEfetivada - wfMaterial.qtdeDevolucaoEfetivada,
									precoUnitario: wfMaterial.preco,
									idFormularioSaida: warehouseFormularyId,
								},
							],
						});
					} else {
						// If an existing allocation for the material is defined:
						// We gotta add/update the movement from the warehouse form

						let updatedMovements: Exclude<TProject["alocacoes"], undefined | null>[number]["movimentacoes"] = existingAllocationForMaterial.movimentacoes;

						const hasMovementsFromWarehouseForm = existingAllocationForMaterial.movimentacoes.some((m) => m.idFormularioSaida === warehouseFormularyId);
						if (!hasMovementsFromWarehouseForm) {
							updatedMovements.push({
								data: new Date().toISOString(),
								titulo: finalUpdatedWarehouseFormulary.titulo,
								quantidade: wfMaterial.qtdeRetiradaEfetivada - wfMaterial.qtdeDevolucaoEfetivada,
								precoUnitario: wfMaterial.preco,
								idFormularioSaida: warehouseFormularyId,
							});
						} else {
							updatedMovements = updatedMovements.map((m) => {
								if (m.idFormularioSaida === warehouseFormularyId) {
									return {
										idFormularioSaida: warehouseFormularyId,
										titulo: finalUpdatedWarehouseFormulary.titulo,
										data: new Date().toISOString(),
										quantidade: wfMaterial.qtdeRetiradaEfetivada - wfMaterial.qtdeDevolucaoEfetivada,
										precoUnitario: wfMaterial.preco,
									};
								}
								return m;
							});
						}

						const newAllocationQty = updatedMovements.reduce((acc, curr) => acc + curr.quantidade, 0);
						const newAllocationPrice = updatedMovements.reduce((acc, curr) => acc + curr.quantidade * curr.precoUnitario, 0) / newAllocationQty;

						allocationsMap.set(wfMaterial.id as string, {
							...existingAllocationForMaterial,
							quantidade: newAllocationQty,
							precoUnitario: newAllocationPrice,
							movimentacoes: updatedMovements,
						});
					}
				}

				const newAllocations = Array.from(allocationsMap.values());
				console.log("[INFO][WAREHOUSE_FORM_UPDATE] Project allocations updated.", { newAllocations });
				await projectsCollection.updateOne(
					{ _id: new ObjectId(finalUpdatedWarehouseFormulary.projeto.id) },
					{ $set: { alocacoes: newAllocations } },
					{ session: session_mongo },
				);
			}
		});

		return {
			data: {
				updatedId: warehouseFormularyId,
			},
			message: "Formulário atualizado com sucesso !",
		};
	} finally {
		await session_mongo.endSession();
	}
}
export type TUpdateWarehouseFormularyOutput = Awaited<ReturnType<typeof updateWarehouseFormulary>>;

const updateWarehouseFormularyHandler: NextApiHandler<TUpdateWarehouseFormularyOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = UpdateWarehouseFormulary.parse(req.body);
	const output = await updateWarehouseFormulary({ input, session });
	res.status(200).json(output);
};

const DeleteWarehouseFormulary = z.object({
	warehouseFormularyId: z.string({ invalid_type_error: "Tipo inválido para o ID do formulário." }),
});
export type TDeleteWarehouseFormularyInput = z.infer<typeof DeleteWarehouseFormulary>;
async function deleteWarehouseFormulary({ input, session }: { input: TDeleteWarehouseFormularyInput; session: TAuthSession }) {
	const { warehouseFormularyId } = input;

	// Starting MongoDB transaction for warehouse operations
	const client = await clientPromise;
	const session_mongo = client.startSession();

	try {
		const projectsDb = client.db("projetos");
		const expensesCollection = projectsDb.collection<TExpense>("despesas");
		const warehouseDb = client.db("almoxarifado");
		const warehouseFormsCollection = warehouseDb.collection<TNewWarehouseFormulary>("formularios");
		const warehouseMaterialsCollection = warehouseDb.collection<TMaterial>("material");
		const warehouseLogsCollection = warehouseDb.collection<TMaterialUpdateRegistry>("alteracoes");
		await session_mongo.withTransaction(async () => {
			const warehouseFormulary = await warehouseFormsCollection.findOne({ _id: new ObjectId(warehouseFormularyId) }, { session: session_mongo });
			if (!warehouseFormulary) throw new createHttpError.NotFound("Formulário não encontrado.");
			console.log("[DELETE_WAREHOUSE_FORM] Deleting warehouse form with ID:", warehouseFormularyId);
			const warehouseFormularyMaterialsList = warehouseFormulary.materiais;
			const warehouseFormularyMaterialsListIds = warehouseFormularyMaterialsList
				.filter((material) => !!material.id)
				.map((material) => new ObjectId(material.id as string));

			const warehouseFormularyMaterials = await warehouseMaterialsCollection
				.find({ _id: { $in: warehouseFormularyMaterialsListIds } }, { session: session_mongo })
				.toArray();

			const bulkwriteMaterials: AnyBulkWriteOperation<TMaterial>[] = [];
			const bulkwriteLogs: AnyBulkWriteOperation<TMaterialUpdateRegistry>[] = [];

			for (const listMaterial of warehouseFormularyMaterialsList) {
				const correspondingMaterial = warehouseFormularyMaterials.find((mi) => mi._id.toString() === listMaterial.id);
				if (!correspondingMaterial) throw new createHttpError.NotFound("Material não encontrado.");

				const liquidTakenAwayQuantity = listMaterial.qtdeRetiradaEfetivada - listMaterial.qtdeDevolucaoEfetivada;

				// Checking for theorical impossible scenario
				if (liquidTakenAwayQuantity < 0)
					throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido. Comunique o setor de tecnologia.");
				console.log("[DELETE_WAREHOUSE_FORM] Updating quantity of material:", correspondingMaterial.nome, "by:", liquidTakenAwayQuantity);
				bulkwriteMaterials.push({
					updateOne: {
						filter: { _id: new ObjectId(correspondingMaterial._id) },
						update: { $inc: { qtde: liquidTakenAwayQuantity } },
					},
				});
				bulkwriteLogs.push({
					insertOne: {
						document: {
							alteracao: liquidTakenAwayQuantity,
							tipo: "DEVOLUÇÃO",
							idFormulario: warehouseFormularyId,
							formulario: { id: warehouseFormularyId, titulo: warehouseFormulary.titulo },
							material: { id: correspondingMaterial._id.toString(), nome: correspondingMaterial.nome },
							projeto: { id: warehouseFormulary.projeto.id, nome: warehouseFormulary.projeto.nome },
							autor: { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url },
							dataInsercao: new Date().toISOString(),
							qtdeAnterior: correspondingMaterial.qtde,
							qtdeNovo: correspondingMaterial.qtde + liquidTakenAwayQuantity, // Positive, since we are returning to stock
						},
					},
				});
			}

			// Execute bulk operations within transaction
			if (bulkwriteMaterials.length > 0) {
				await warehouseMaterialsCollection.bulkWrite(bulkwriteMaterials, { session: session_mongo });
			}
			if (bulkwriteLogs.length > 0) {
				await warehouseLogsCollection.bulkWrite(bulkwriteLogs, { session: session_mongo });
			}

			// Deleting the warehouse formulary
			await warehouseFormsCollection.deleteOne({ _id: new ObjectId(warehouseFormularyId) }, { session: session_mongo });
		});

		// After warehouse transaction is complete, delete related expenses
		await expensesCollection.deleteMany({ idFormularioAlmoxarifado: warehouseFormularyId });

		return {
			data: {
				deletedId: warehouseFormularyId,
			},
			message: "Formulário excluído com sucesso !",
		};
	} finally {
		await session_mongo.endSession();
	}
}

const deleteWarehouseFormularyHandler: NextApiHandler<Awaited<ReturnType<typeof deleteWarehouseFormulary>>> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = DeleteWarehouseFormulary.parse(req.query);
	const output = await deleteWarehouseFormulary({ input, session });
	res.status(200).json(output);
};

export default apiHandler({
	GET: getWarehouseFormulariesHandler,
	POST: createWarehouseFormularyHandler,
	PUT: updateWarehouseFormularyHandler,
	DELETE: deleteWarehouseFormularyHandler,
});
