import { apiHandler } from "@/utils/api";
import { calculateStringSimilarity } from "@/utils/constants";
import { formatWithoutDiacritics } from "@/utils/methods/formatting";
import { TMaterial } from "@/utils/schemas/materials";
import type { TPurchaseControl } from "@/utils/schemas/purchases";
import connectToDatabase from "@/utils/services/mongodb/projects";
import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import type { NextApiHandler } from "next";

const handleGetMostUsedCompositionItems: NextApiHandler<any> = async (req, res) => {
	const wareHouseDb = await connectToWarehouseDatabase();
	const appDb = await connectToDatabase();

	const materialsCollection = wareHouseDb.collection<TMaterial>("material");
	const purchaseControlsCollection = appDb.collection<TPurchaseControl>("controles-compras");

	const purchaseControls = await purchaseControlsCollection.find({}).toArray();
	const materials = await materialsCollection.find({}).toArray();

	const mostUsedComposition = purchaseControls.reduce((acc: { [key: string]: number }, purchaseControl) => {
		const compositionCombinationAsStr = purchaseControl.composicao
			.filter((r) => r.categoria !== "INVERSOR" && r.categoria !== "MÓDULO")
			.sort((a, b) => a.descricao.localeCompare(b.descricao))
			.map((item) => `(${item.categoria}) ${item.qtde}x ${item.descricao}`)
			.join(", ");

		if (acc[compositionCombinationAsStr]) {
			acc[compositionCombinationAsStr] += 1;
		} else {
			acc[compositionCombinationAsStr] = 1;
		}
		return acc;
	}, {});

	const mostUsedCompositionItems = purchaseControls
		.flatMap((p) => p.composicao)
		.reduce((acc: { [key: string]: number }, purchaseControl) => {
			const compositionItemAsStr = purchaseControl.descricao;

			if (acc[compositionItemAsStr]) {
				acc[compositionItemAsStr] += 1;
			} else {
				acc[compositionItemAsStr] = 1;
			}
			return acc;
		}, {});

	const sortedCompositions = Object.entries(mostUsedComposition)
		.sort((a, b) => b[1] - a[1])
		.filter((m) => m[1] > 1)
		.map(([name, count]) => ({ name, count }));
	const sortedCompositionItems = Object.entries(mostUsedCompositionItems)
		.sort((a, b) => b[1] - a[1])
		.filter((m) => m[1] > 1)
		.map(([name, count]) => {
			const mostLikelyMaterial = materials.find(
				(material) => calculateStringSimilarity(formatWithoutDiacritics(name, true), formatWithoutDiacritics(material.nome, true)) > 80,
			);
			return { NOME: name, VEZES_UTILIZADO: count, MATERIAL_EQUIVALENTE: mostLikelyMaterial?.nome };
		});
	res.status(200).json({ sortedCompositionItems, sortedCompositions });
};

export default apiHandler({
	GET: handleGetMostUsedCompositionItems,
});
