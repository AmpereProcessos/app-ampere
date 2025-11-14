import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { errorHandler } from "../../../utils/methods/handlers";
import connectToDatabase from "../../../utils/services/mongodb/crm/main";

export default async function handler(req, res) {
	if (req.method == "POST") {
		try {
			const db = await connectToDatabase(process.env.CRM_KEY);
			const collection = db.collection("proposes");
			const { proposeId } = req.query;
			if (!proposeId) throw new createHttpError.BadRequest("ID da propostas não disponibilizado.");

			const { changes } = req.body;
			if (!changes || changes == {}) throw new createHttpError.BadRequest("Mudanças não especificadas.");

			let newObj = await collection.findOneAndUpdate(
				{ _id: ObjectId(proposeId) },
				{
					$set: {
						...changes,
					},
				},
			);
			res.json({ data: newObj });
		} catch (error) {
			errorHandler(error, res);
		}
	}
}
