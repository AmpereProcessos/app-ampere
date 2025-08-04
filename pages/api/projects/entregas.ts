import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { TProject } from "@/utils/schemas/projects";
import type { TPurchaseControl } from "@/utils/schemas/purchases";
import connectToDatabase from "@/utils/services/mongodb/projects";
import dayjs from "dayjs";
import type { Db, Filter } from "mongodb";
import type { NextApiHandler } from "next";
import { z } from "zod";

const ProjectDeliveryQueryFiltersSchema = z.object({
	search: z.string({ invalid_type_error: "Tipo não válido para o filtro de busca." }).optional().nullable(),
	deliveryStatus: z
		.string({ invalid_type_error: "Tipo não válido para o filtro de status de entrega." })
		.optional()
		.nullable()
		.transform((v) => (v ? v.split(",") : [])),
	cities: z
		.string({ invalid_type_error: "Tipo não válido para o filtro de cidades." })
		.optional()
		.nullable()
		.transform((v) => (v ? v.split(",") : [])),
	ufs: z
		.string({ invalid_type_error: "Tipo não válido para o filtro de UFs." })
		.optional()
		.nullable()
		.transform((v) => (v ? v.split(",") : [])),
	tagIds: z
		.string({ invalid_type_error: "Tipo não válido para o filtro de IDs de etiquetas." })
		.optional()
		.nullable()
		.transform((v) => (v ? v.split(",") : [])),
	purchasedOnly: z
		.string({ invalid_type_error: "Tipo não válido para o filtro de projetos comprados." })
		.optional()
		.nullable()
		.transform((v) => v === "true"),
	deliveredRecentOnly: z
		.string({ invalid_type_error: "Tipo não válido para o filtro de projetos entregues." })
		.optional()
		.nullable()
		.transform((v) => v === "true"),
});

const getProjectsInDeliveryProcessRoute: NextApiHandler<any> = async (req, res) => {
	const afterDateWithMargin = dayjs().subtract(7, "days").startOf("day").toISOString();
	const session = await validateAuthenticationWithSession(req, res);

	const params = ProjectDeliveryQueryFiltersSchema.parse(req.query);
	console.log("[INFO] [GET_PURCHASES_DELIVERIES] Params passed:", params);
	const { search, deliveryStatus, cities, ufs, tagIds, purchasedOnly, deliveredRecentOnly } = params;
	const db: Db = await connectToDatabase();
	const purchaseControlsCollection = db.collection<TPurchaseControl>("controles-compras");

	const searchQuery: Filter<TPurchaseControl> = search && search?.trim().length > 0 ? { titulo: { $regex: search, $options: "i" } } : {};
	const deliveryStatusQuery: Filter<TPurchaseControl> =
		deliveryStatus && deliveryStatus?.length > 0 ? { "entrega.status": { $in: deliveryStatus as TPurchaseControl["entrega"]["status"][] } } : {};
	const citiesQuery: Filter<TPurchaseControl> = cities && cities?.length > 0 ? { "entrega.localizacao.cidade": { $in: cities } } : {};
	const ufsQuery: Filter<TPurchaseControl> = ufs && ufs?.length > 0 ? { "entrega.localizacao.uf": { $in: ufs } } : {};
	const tagIdsQuery: Filter<TPurchaseControl> = tagIds && tagIds?.length > 0 ? { "etiquetas.id": { $in: tagIds } } : {};
	const purchasedOnlyQuery: Filter<TPurchaseControl> = purchasedOnly ? { dataPedido: { $ne: null } } : {};
	const deliveredOnlyQuery: Filter<TPurchaseControl> = deliveredRecentOnly ? { "entrega.dataEfetivacao": { $gt: afterDateWithMargin } } : { "entrega.dataEfetivacao": null };
	const query = {
		...searchQuery,
		...deliveryStatusQuery,
		...citiesQuery,
		...ufsQuery,
		...tagIdsQuery,
		...purchasedOnlyQuery,
		...deliveredOnlyQuery,
	};
	console.log("[INFO] [GET_PURCHASES_DELIVERIES] Query:", JSON.stringify(query, null, 2));
	const addFields = { projectIdAsObjectId: { $toObjectId: "$projeto.id" } };
	const lookup = { from: "dados", localField: "projectIdAsObjectId", foreignField: "_id", as: "projetoDados" };
	const aggregationResult = await purchaseControlsCollection
		.aggregate([
			{
				$match: {
					...query,
				},
			},
			{ $addFields: addFields },
			{ $lookup: lookup },
			{
				$project: {
					titulo: 1,
					dataPedido: 1,
					entrega: 1,
					fornecedor: 1,
					transporte: 1,
					etiquetas: 1,
					dataInsercao: 1,
					"projetoDados._id": 1,
					"projetoDados.nomeDoContrato": 1,
					"projetoDados.telefone": 1,
					"projetoDados.vendedor": 1,
				},
			},
		])
		.toArray();

	const purchaseControls = aggregationResult.map((r) => ({ ...r, projetoDados: r.projetoDados[0] }));
	return res.status(200).json({ data: purchaseControls });
};

export default apiHandler({ GET: getProjectsInDeliveryProcessRoute });
