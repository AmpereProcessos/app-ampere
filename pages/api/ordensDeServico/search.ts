import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { formatDateQuery } from "@/utils/methods/dates";
import { PersonalizedFiltersSchema, ServiceOrderSimplifiedProjection, type TServiceOrder, type TServiceOrderSimplifiedDTO } from "@/utils/schemas/service-order";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import type { Collection, Db, Filter } from "mongodb";
import type { NextApiHandler } from "next";
import { z } from "zod";

export type TServiceOrdersByFiltersResult = {
	serviceOrders: TServiceOrderSimplifiedDTO[];
	serviceOrdersMatched: number;
	totalPages: number;
};

type PostResponse = {
	data: TServiceOrdersByFiltersResult;
};

const QuerySchema = z.object({
	page: z.string({ required_error: "Parâmetro de páginação não informado." }),
});
const getServiceOrdersByPersonalizedFilters: NextApiHandler<PostResponse> = async (req, res) => {
	const PAGE_SIZE = 200;
	const session = await validateAuthenticationWithSession(req, res);
	const { page } = QuerySchema.parse(req.query);

	const filters = PersonalizedFiltersSchema.parse(req.body);

	// Validating page parameter
	if (!page || Number.isNaN(Number(page))) throw new createHttpError.BadRequest("Parâmetro de paginação inválido ou não informado.");

	// Defining the queries
	const nameOrQuery: Filter<TServiceOrder>[] =
		filters.name.trim().length > 0 ? [{ "favorecido.nome": { $regex: filters.name, $options: "i" } }, { "favorecido.nome": filters.name }] : [];
	const responsibleOrQuery: Filter<TServiceOrder>[] =
		filters.responsible.trim().length > 0 ? [{ "responsavel.nome": { $regex: filters.responsible, $options: "i" } }, { "responsavel.nome": filters.responsible }] : [];

	const orQueries = [...nameOrQuery, ...responsibleOrQuery];

	const dateQuery: Filter<TServiceOrder> =
		filters.period.after && filters.period.before && filters.period.field
			? {
					$and: [
						{ [filters.period.field]: { $gte: formatDateQuery(filters.period.after, "start") } },
						{ [filters.period.field]: { $lte: formatDateQuery(filters.period.before, "end") } },
					],
				}
			: {};
	const stateQuery: Filter<TServiceOrder> = filters.state.length > 0 ? { "localizacao.uf": { $in: filters.state } } : {};
	const cityQuery: Filter<TServiceOrder> = filters.city.length > 0 ? { "localizacao.cidade": { $in: filters.city } } : {};
	const categoryQuery: Filter<TServiceOrder> = filters.category.length > 0 ? { categoria: { $in: filters.category as TServiceOrder["categoria"][] } } : {};
	const urgencyQuery: Filter<TServiceOrder> = filters.urgency.length > 0 ? { urgencia: { $in: filters.urgency as TServiceOrder["urgencia"][] } } : {};
	const authorsQuery: Filter<TServiceOrder> = filters.authors.length > 0 ? { "autor.id": { $in: filters.authors as TServiceOrder["autor"]["id"][] } } : {};
	const pendingQuery: Filter<TServiceOrder> = filters.pending ? { dataEfetivacao: null } : {};
	const releasedQuery: Filter<TServiceOrder> = filters.released ? { dataLiberacao: { $ne: null } } : {};

	const query = {
		...(orQueries.length > 0 ? { $or: orQueries } : {}),
		...dateQuery,
		...stateQuery,
		...cityQuery,
		...categoryQuery,
		...urgencyQuery,
		...authorsQuery,
		...pendingQuery,
		...releasedQuery,
	};

	const skip = PAGE_SIZE * (Number(page) - 1);
	const limit = PAGE_SIZE;

	const db: Db = await connectToDatabase();
	const collection: Collection<TServiceOrder> = db.collection("ordensDeServico");

	const { serviceOrders, serviceOrdersMatched } = await getServiceOrdersByFilter({ collection, query, skip, limit });
	const totalPages = Math.ceil(serviceOrdersMatched / PAGE_SIZE);

	return res.status(200).json({ data: { serviceOrders, serviceOrdersMatched, totalPages } });
};

export default apiHandler({ POST: getServiceOrdersByPersonalizedFilters });
type GetServiceOrdersByFilterParams = {
	collection: Collection<TServiceOrder>;
	query: Filter<TServiceOrder>;
	skip: number;
	limit: number;
};
async function getServiceOrdersByFilter({ collection, query, skip, limit }: GetServiceOrdersByFilterParams) {
	try {
		const serviceOrdersMatched = await collection.countDocuments({ ...query });
		const sort = { _id: -1 };
		const match = { ...query };
		const serviceOrders = (await collection
			.aggregate([{ $sort: sort }, { $match: match }, { $skip: skip }, { $project: ServiceOrderSimplifiedProjection }, { $limit: limit }])
			.toArray()) as TServiceOrderSimplifiedDTO[];
		return { serviceOrders, serviceOrdersMatched } as { serviceOrders: TServiceOrderSimplifiedDTO[]; serviceOrdersMatched: number };
	} catch (error) {
		throw error;
	}
}
