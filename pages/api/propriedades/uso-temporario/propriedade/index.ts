import { apiHandler } from "@/utils/api";
import type { TProperty, TPropertyTemporaryUsage } from "@/utils/schemas/properties";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import { z } from "zod";

const TemporaryUsageByPropertyQueryParams = z.object({
	openUsagePropertyId: z.string({
		required_error: "ID da propriedade não informado.",
		invalid_type_error: "Tipo não válido para o ID da propriedade.",
	}),
});
export type TTemporaryUsageByPropertyInput = z.infer<typeof TemporaryUsageByPropertyQueryParams>;

export async function getTemporaryUsageByPropertyRoute({ params }: { params: TTemporaryUsageByPropertyInput }) {
	const { openUsagePropertyId } = params;
	if (!ObjectId.isValid(openUsagePropertyId)) throw new createHttpError.BadRequest("ID da propriedade inválido.");

	const db = await connectToAdministrationDatabase();

	const propertiesCollection = db.collection<TProperty>("propriedades");
	const temporaryUsagesCollection = db.collection<TPropertyTemporaryUsage>("propriedades-uso-temporario");

	const [property, temporaryUsage] = await Promise.all([
		propertiesCollection.findOne({
			_id: new ObjectId(openUsagePropertyId),
		}),
		temporaryUsagesCollection.findOne({
			"propriedade.id": openUsagePropertyId,
			dataFim: null,
		}),
	]);

	if (!property) throw new createHttpError.NotFound("Propriedade não encontrada.");

	return {
		data: {
			property: { ...property, _id: property._id.toString() },
			openUsage: temporaryUsage ? { ...temporaryUsage, _id: temporaryUsage._id.toString() } : null,
		},
	};
}
export type TGetTemporaryUsageByPropertyOutput = Awaited<ReturnType<typeof getTemporaryUsageByPropertyRoute>>;

const getTemporaryUsageByPropertyHandler: NextApiHandler<TGetTemporaryUsageByPropertyOutput> = async (req, res) => {
	const params = TemporaryUsageByPropertyQueryParams.parse(req.query);
	const temporaryUsage = await getTemporaryUsageByPropertyRoute({ params });
	res.status(200).json(temporaryUsage);
};

export default apiHandler({
	GET: getTemporaryUsageByPropertyHandler,
});
