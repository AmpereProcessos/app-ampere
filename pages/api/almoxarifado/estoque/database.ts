import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { isValidNumber } from "@/utils/methods/validating";
import { QueryMaterialsFiltersSchema, type TMaterialDTO, type TMaterial } from "@/utils/schemas/materials";
import connectToDatabase from "@/utils/services/mongodb/warehouse";
import type { Db, Filter } from "mongodb";
import type { NextApiHandler } from "next";
import type { z } from "zod";

export type TGetMaterialsDatabaseOutput = {
	materials: TMaterialDTO[];
	materialsMatched: number;
	totalPages: number;
};
type PostResponse = {
	data: TGetMaterialsDatabaseOutput;
};

const GetMaterialsWithFiltersInput = QueryMaterialsFiltersSchema;
export type TGetMaterialsDatabaseInput = z.infer<typeof GetMaterialsWithFiltersInput>;
const handleGetMaterialsWithFilters: NextApiHandler<PostResponse> = async (req, res) => {
	const PAGE_SIZE = 100;
	const session = await validateAuthenticationWithSession(req, res);
	const filters = GetMaterialsWithFiltersInput.parse(req.body);

	const db: Db = await connectToDatabase();
	const materialsCollection = db.collection<TMaterial>("material");

	const nameQuery: Filter<TMaterial>[] =
		filters.name.trim().length > 0
			? [
					{
						nome: { $regex: filters.name, $options: "i" },
					},
					{
						nome: filters,
					},
				]
			: [];

	const quantityFilter: Filter<TMaterial> =
		isValidNumber(filters.quantity.greaterThan) && isValidNumber(filters.quantity.lessThan)
			? {
					qtde: { $gte: filters.quantity.greaterThan as number, $lte: filters.quantity.lessThan as number },
				}
			: {};
	const priceFilter: Filter<TMaterial> =
		isValidNumber(filters.price.greaterThan) && isValidNumber(filters.price.lessThan)
			? {
					preco: { $gte: filters.price.greaterThan as number, $lte: filters.price.lessThan as number },
				}
			: {};

	const periodQuery: Filter<TMaterial> =
		filters.period.field && filters.period.after && filters.period.before
			? {
					[filters.period.field]: {
						$gte: filters.period.after,
						$lte: filters.period.before,
					},
				}
			: {};

	const orQuery: Filter<TMaterial> = nameQuery.length > 0 ? { $or: nameQuery } : {};

	const belowMinimumFilter: Filter<TMaterial> = filters.belowMinimum
		? {
				$expr: {
					$and: [
						{ $lt: ["$qtde", "$qtdeMinima"] }, // qtde < qtdeMinima
						{ $ne: ["$qtdeMinima", null] }, // qtdeMinima is not null
					],
				},
			}
		: {};

	const aboveMaximumFilter: Filter<TMaterial> = filters.aboveMaximum
		? {
				$expr: {
					$and: [
						{ $gt: ["$qtde", "$qtdeMaxima"] }, // qtde > qtdeMaxima
						{ $ne: ["$qtdeMaxima", null] }, // qtdeMaxima is not null
					],
				},
			}
		: {};

	const query: Filter<TMaterial> = {
		...orQuery,
		...quantityFilter,
		...priceFilter,
		...periodQuery,
		...belowMinimumFilter,
		...aboveMaximumFilter,
	};

	const skip = PAGE_SIZE * (Number(filters.page) - 1);
	const limit = PAGE_SIZE;

	const materialsMatched = await materialsCollection.countDocuments(query);
	const materials = await materialsCollection.find(query).skip(skip).limit(limit).toArray();
	const totalPages = Math.ceil(materialsMatched / PAGE_SIZE);

	res.status(200).json({ data: { materials: materials.map((m) => ({ ...m, _id: m._id.toString() })), materialsMatched, totalPages } });
};

export default apiHandler({
	POST: handleGetMaterialsWithFilters,
});
