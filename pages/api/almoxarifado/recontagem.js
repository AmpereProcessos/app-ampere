import connectToDatabase from "../../../utils/services/mongodb/warehouse";
import { ObjectId } from "mongodb";
import { getValidCurrentSessionUncached } from "../../../lib/authentication/session";
import { notifyMaterialsBelowMinimumIfCrossed } from "../../../lib/notifications/materials";
export default async function handler(req, res) {
	if (req.method === "POST") {
		const { user } = await getValidCurrentSessionUncached();
		const db = await connectToDatabase(process.env.DB_KEY);
		const collection = db.collection("material");
		let { changes } = req.body;
		const materialIds = changes.map((mat) => new ObjectId(mat.id));
		const currentMaterials = await collection.find({ _id: { $in: materialIds } }).toArray();
		// console.log(req.body);
		changes = changes.map((mat) => {
			return {
				updateOne: {
					filter: { _id: new ObjectId(mat.id) },
					update: {
						$set: {
							recontagem: {
								responsavel: user.name,
								data: new Date().toISOString(),
							},
							qtde: mat.recontagem,
						},
						$push: {
							qtdeAlteracoes: {
								$each: [
									{
										dataAlteracao: new Date().toISOString(),
										responsavel: user.name,
										anterior: mat.qtdeAnterior,
										novo: mat.recontagem,
									},
								],
								$slice: -10, // limit the array size to 10 items
							},
						},
					},
				},
			};
		});

		const filteredChanges = changes.filter((change) => !!change);
		console.log(filteredChanges);
		await collection.bulkWrite(filteredChanges);
		await notifyMaterialsBelowMinimumIfCrossed(
			req.body.changes
				.map((change) => {
					const material = currentMaterials.find((currentMaterial) => currentMaterial._id.toString() === change.id);
					if (!material) return null;
					return {
						materialId: change.id,
						materialName: material.nome,
						previousQuantity: material.qtde,
						newQuantity: change.recontagem,
						minimumQuantity: material.qtdeMinima,
					};
				})
				.filter((change) => !!change),
		);

		res.json("UEPA");
	}
}
