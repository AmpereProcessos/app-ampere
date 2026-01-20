import type { TProperty } from "@/utils/schemas/properties";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import type { Collection } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const db = await connectToAdministrationDatabase();
	const propertiesCollection: Collection<TProperty> = db.collection("propriedades");

	const LIST_OF_IDENTIFIERS_TO_KEEP_ACTIVE = [
		"TCY-2C77",
		"TCW-3A02",
		"TYD-2D99",
		"TXA-5F40",
		"TYE-6B18",
		"TXA-5E64",
		"SIH-5J25",
		"TDW-3G80",
		"TDW-9E95",
		"QQD-9D77",
	];
	const updatedProperties = await propertiesCollection.updateMany(
		{
			identificador: { $nin: LIST_OF_IDENTIFIERS_TO_KEEP_ACTIVE },
		},
		{ $set: { ativo: false } },
	);

	return res.status(200).json({ data: updatedProperties, message: "Propriedades atualizadas com sucesso!" });
}
