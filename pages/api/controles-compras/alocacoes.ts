import { validateAuthenticationWithSession } from "@/utils/api";
import { TMaterialUpdateRegistry } from "@/utils/schemas/material-updates-registry";
import { TMaterial } from "@/utils/schemas/materials";
import { TPurchaseControl } from "@/utils/schemas/purchases";
import clientPromise from "@/utils/services/mongodb/mongo-client";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { Db, ObjectId } from "mongodb";
import { NextApiHandler } from "next";

type HandlePurchaseControlAllocationsResponse = {
	message: string;
};
const handlePurchaseControlAllocations: NextApiHandler<HandlePurchaseControlAllocationsResponse> = async (req, res) => {
	const { purchaseControlId } = req.query;
	const session = await validateAuthenticationWithSession(req, res);

	if (!purchaseControlId || typeof purchaseControlId !== "string" || !ObjectId.isValid(purchaseControlId)) throw new createHttpError.BadRequest("ID inválido.");

	const dbClient = await clientPromise;

	const projectsDb: Db = dbClient.db("projetos");
	const warehouseDb: Db = dbClient.db("almoxarifado");

	const purchaseControlCollection = projectsDb.collection<TPurchaseControl>("controles-compras");
	const materialStockCollection = warehouseDb.collection<TMaterial>("material");
	const materialStockLogsCollection = warehouseDb.collection<TMaterialUpdateRegistry>("alteracoes");

	const purchaseControl = await purchaseControlCollection.findOne({ _id: new ObjectId(purchaseControlId) });
	if (!purchaseControl) throw new createHttpError.NotFound("Controle de compra não encontrado.");

	// Getting the pending allocations (for which the destination allocator is not null and the allocation date is null)
	const pendingAllocations = purchaseControl.composicao.filter((item) => !!item.alocadorDestinoId && !!item.materialId && !item.dataAlocacao);
	// If there are no pending allocations, return a success message
	if (pendingAllocations.length == 0) return res.status(200).json({ message: "Nenhuma alocação pendente." });

	// In case there is, starting a db session to perform the transaction
	const dbSession = dbClient.startSession();
	try {
		await dbSession.withTransaction(async () => {
			const currentMaterials = await materialStockCollection.find({ _id: { $in: pendingAllocations.map((item) => new ObjectId(item.materialId as string)) } }).toArray();
			// Updating the allocations
			for (const allocation of pendingAllocations) {
				// an allocation could have two types:
				// 1 - item purchase for an allocator
				// 2 - internal transfer between two allocators

				const currentMaterial = currentMaterials.find((item) => item._id.toString() == allocation.materialId);
				if (!currentMaterial) throw new createHttpError.NotFound("Material não encontrado.");

				if (!allocation.alocadorOrigemId) {
					// Case 1: item purchase for an allocator - for this case, we need to update the material stock quantity and its price
					const newQtde = currentMaterial.qtde + allocation.qtde;
					const newPrice = (currentMaterial.qtde * currentMaterial.preco + allocation.qtde * (allocation.valor || 0)) / (currentMaterial.qtde + allocation.qtde);
					await materialStockCollection.updateOne({ _id: new ObjectId(allocation.materialId as string) }, { $set: { preco: newPrice, qtde: newQtde } }, { session: dbSession });
					await materialStockLogsCollection.insertOne(
						{
							alteracao: allocation.qtde,
							tipo: "ENTRADA",
							idFormulario: undefined,
							material: {
								id: allocation.materialId as string,
								nome: allocation.descricao,
							},
							projeto: {
								id: purchaseControl.projeto.id,
								nome: purchaseControl.projeto.nome,
							},
							qtdeAnterior: currentMaterial.qtde,
							qtdeNovo: newQtde,
							precoAnterior: currentMaterial.preco,
							precoNovo: newPrice,
							autor: {
								id: session.user.id,
								nome: session.user.nome,
								avatar_url: session.user.avatar_url,
							},
							dataInsercao: new Date().toISOString(),
						},
						{ session: dbSession },
					);
				} else {
					// Case 2: internal transfer between two allocators - for this case, we need to update the material stock quantity and its price in both allocators

					// updating the origin allocator
					await materialStockCollection.updateOne({ _id: new ObjectId(allocation.materialId as string) }, { $inc: { qtde: -allocation.qtde }, $set: { preco: newPrice } });
				}
			}
		});
	} catch (error) {}
};
