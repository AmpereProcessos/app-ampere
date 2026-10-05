import { ensureProjectAssemblyServiceOrder } from "@/lib/projects/update-automations/service-orders";
import { syncServiceOrdersDeliveryRelease } from "@/lib/service-orders/delivery-release";
import { apiHandler } from "@/utils/api";
import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import type { TProject } from "@/utils/schemas/projects";
import type { TPurchaseControl } from "@/utils/schemas/purchases";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import { type TTransportControl, TransportControlTransportItemSchema } from "@/utils/schemas/transport-controls";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { type Collection, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import z from "zod";

export const UpdateTransportControlItemInputSchema = z.object({
	transportControlId: z.string({ required_error: "ID do controle de transporte não informado." }),
	itemIndex: z.number({ required_error: "Índice do item não informado." }),
	changes: TransportControlTransportItemSchema.partial(),
});
export type TUpdateTransportControlItemInput = z.infer<typeof UpdateTransportControlItemInputSchema>;

async function updateTransportControlItem({ input }: { input: TUpdateTransportControlItemInput }) {
	const { transportControlId, itemIndex, changes } = input;

	console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Starting", input);
	const db = await connectToDatabase();
	const crmDb = await connectToCRMDatabase();
	const fileReferencesCollection: Collection<TFileReference> = crmDb.collection("file-references");
	const projectsCollection: Collection<TProject> = db.collection("dados");
	const purchaseControlsCollection: Collection<TPurchaseControl> = db.collection("controles-compras");
	const transportControlsCollection: Collection<TTransportControl> = db.collection("controles-transportes");
	const serviceOrdersCollection: Collection<TServiceOrder> = db.collection("ordensDeServico");

	const previousTransportControl = await transportControlsCollection.findOne({ _id: new ObjectId(transportControlId) });
	if (!previousTransportControl) throw new createHttpError.NotFound("Controle de transporte não encontrado.");

	const previousTransportControlItem = previousTransportControl.itens[itemIndex];
	if (!previousTransportControlItem) throw new createHttpError.NotFound("Item de controle de transporte não encontrado.");

	const updatedTransportControlItems = previousTransportControl.itens.map((item, index) => (index === itemIndex ? { ...item, ...changes } : item));
	const updateTransportControlResponse = await transportControlsCollection.updateOne(
		{ _id: new ObjectId(transportControlId) },
		{ $set: { itens: updatedTransportControlItems } },
	);
	if (!updateTransportControlResponse.acknowledged)
		throw new createHttpError.InternalServerError("Oops, houve um erro ao atualizar o item do controle de transporte.");

	const updatedTransportControl = await transportControlsCollection.findOne({ _id: new ObjectId(transportControlId) });
	if (!updatedTransportControl) throw new createHttpError.InternalServerError("Oops, houve um erro ao atualizar o item do controle de transporte.");

	const updatedTransportControlItem = updatedTransportControl.itens[itemIndex];

	// Corrections and clearing must propagate too, without repeating initial-delivery attachments.
	if (previousTransportControlItem.dataEfetivacao &&
			previousTransportControlItem.dataEfetivacao !== (updatedTransportControlItem.dataEfetivacao || null)) {
		const deliveryDate = updatedTransportControlItem.dataEfetivacao || null;
		const deliveryStatus = deliveryDate ? "ENTREGUE" : "EM ROTA";
		const purchaseControl = await purchaseControlsCollection.findOne({ _id: new ObjectId(updatedTransportControlItem.id) });
		if (!purchaseControl) throw new createHttpError.NotFound("Controle de compra não encontrado.");
		await purchaseControlsCollection.updateOne({ _id: purchaseControl._id }, {
			$set: { "entrega.dataEfetivacao": deliveryDate, "entrega.status": deliveryStatus },
		});
		if (purchaseControl.projeto.id) {
			await projectsCollection.updateOne({ _id: new ObjectId(purchaseControl.projeto.id) }, {
				$set: { "compra.dataEntrega": deliveryDate, "compra.status": deliveryStatus },
			});
			const project = await projectsCollection.findOne({ _id: new ObjectId(purchaseControl.projeto.id) });
			if (!project) throw new createHttpError.NotFound("Projeto não encontrado.");
			await syncServiceOrdersDeliveryRelease({ project, serviceOrdersCollection });
		}
	}

	if (!previousTransportControlItem.dataEfetivacao && updatedTransportControlItem.dataEfetivacao) {
		console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Effetivation identified, starting triggers");
		const attachments = updatedTransportControlItem.anexos || [];

		// If the item was effectivated thought the update, we need to update the purchase control delivery date and status
		const purchaseControl = await purchaseControlsCollection.findOne({ _id: new ObjectId(previousTransportControlItem.id) });
		if (!purchaseControl) throw new createHttpError.NotFound("Controle de compra não encontrado.");
		await purchaseControlsCollection.updateOne(
			{ _id: new ObjectId(previousTransportControlItem.id) },
			{ $set: { "entrega.dataEfetivacao": updatedTransportControlItem.dataEfetivacao, "entrega.status": "ENTREGUE" } },
		);

		if (purchaseControl.projeto.id) {
			console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Purchase control project found, starting project update");
			// If purchase control has a vinculated project, update the project delivery date and delivery status
			const project = await projectsCollection.findOne({ _id: new ObjectId(purchaseControl.projeto.id) });
			if (!project) throw new createHttpError.NotFound("Projeto não encontrado.");
			await projectsCollection.updateOne(
				{ _id: new ObjectId(purchaseControl.projeto.id) },
				{ $set: { "compra.status": "ENTREGUE", "compra.dataEntrega": updatedTransportControlItem.dataEfetivacao } },
			);

			const postUpdateProject = await projectsCollection.findOne({ _id: project._id });
			if (!postUpdateProject) throw new createHttpError.NotFound("Projeto não encontrado.");
			await ensureProjectAssemblyServiceOrder({
				project: postUpdateProject,
				author: purchaseControl.autor,
				projectsCollection,
				serviceOrdersCollection,
			});
			await syncServiceOrdersDeliveryRelease({ project: postUpdateProject, serviceOrdersCollection });
		}

		const fileReferencesToInsert: TFileReference[] = attachments.map((attachment) => ({
			titulo: attachment.titulo,
			categorias: ["COMPRAS"],
			formato: attachment.formato,
			url: attachment.url,
			tamanho: attachment.tamanho,
			autor: {
				id: purchaseControl.autor.id,
				nome: purchaseControl.autor.nome,
				avatar_url: purchaseControl.autor.avatar_url,
			},
			dataInsercao: new Date().toISOString(),
			idTransporte: transportControlId,
			idCompra: updatedTransportControlItem.id,
			idProjeto: purchaseControl.projeto.id,
		}));

		if (fileReferencesToInsert.length > 0) {
			console.log(`[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] ${fileReferencesToInsert.length} file references to insert found, starting insertion`);
			await fileReferencesCollection.insertMany(fileReferencesToInsert);
		}
	}
	return {
		data: {
			updatedId: transportControlId.toString(),
		},
		message: "Item de controle de transporte atualizado com sucesso.",
	};
}
export type TUpdateTransportControlItemOutput = Awaited<ReturnType<typeof updateTransportControlItem>>;

const updateTransportControlItemRoute: NextApiHandler<TUpdateTransportControlItemOutput> = async (req, res) => {
	const input = UpdateTransportControlItemInputSchema.parse(req.body);
	const result = await updateTransportControlItem({ input });
	return res.status(200).json(result);
};

export default apiHandler({
	PUT: updateTransportControlItemRoute,
});
