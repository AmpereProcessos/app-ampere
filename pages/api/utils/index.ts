import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { TEquipment } from "@/utils/schemas/crm/equipments";
import { TUtil } from "@/utils/schemas/crm/utils";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import createHttpError from "http-errors";
import { Collection, Filter, WithId } from "mongodb";
import { NextApiHandler } from "next";
import { z } from "zod";

const UtilsIdentifierSchema = z.enum(["EQUIPMENT", "CREDITOR"], {
	required_error: "Identificador não informado.",
	invalid_type_error: "Tipo inválido para identificador.",
});
type GetResponse = {
	data: TUtil[];
};

const getUtilsRelated: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { equipmentCategory } = req.query;
	const identifier = UtilsIdentifierSchema.parse(req.query.identifier);

	const db = await connectToCRMDatabase(process.env.DB_KEY);
	const collection: Collection<TUtil> = db.collection("utils");

	if (identifier == "EQUIPMENT") {
		const categoryQuery: Filter<TUtil> =
			equipmentCategory && equipmentCategory != "null" && equipmentCategory != "undefined" ? { categoria: equipmentCategory } : {};

		const query = { ...categoryQuery };
		const equipments = await getEquipments({ collection: collection, query: query });
		return res.status(200).json({ data: equipments });
	}
	return res.status(200).json({ data: [] });
};

export default apiHandler({ GET: getUtilsRelated });

type GetEquipments = {
	collection: Collection<TUtil>;
	query: Filter<TUtil>;
};

async function getEquipments({ collection, query }: GetEquipments) {
	try {
		const equipments = await collection.find({ identificador: "EQUIPMENT", ...query }).toArray();
		return equipments as WithId<TEquipment>[];
	} catch (error) {
		throw error;
	}
}
