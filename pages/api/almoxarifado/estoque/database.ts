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

	const nameQuery: Filter<TMaterial> =
		filters.name.trim().length > 0
			? {
					$or: [
						{
							nome: { $regex: filters.name, $options: "i" },
						},
						{
							nome: filters.name,
						},
					],
				}
			: {};

	const skuQuery: Filter<TMaterial> =
		filters.sku.trim().length > 0
			? {
					$or: [
						{
							sku: { $regex: filters.sku, $options: "i" },
						},
						{
							sku: filters.sku,
						},
					],
				}
			: {};

	const locationQuery: Filter<TMaterial> =
		filters.location.trim().length > 0
			? {
					$or: [
						{
							localizacao: { $regex: filters.location, $options: "i" },
						},
						{
							localizacao: filters.location,
						},
					],
				}
			: {};

	console.log("SUPPLIERS", filters.suppliers);
	const suppliersQuery: Filter<TMaterial> =
		filters.suppliers.length > 0
			? {
					"fornecedores.id": { $in: filters.suppliers },
				}
			: {};

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

	const andOrQuery: Filter<TMaterial> = nameQuery || skuQuery || locationQuery ? { $and: [nameQuery, skuQuery, locationQuery].filter((r) => Object.keys(r).length > 0) } : {};

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

	const maximumUndefinedFilter: Filter<TMaterial> = filters.maximumUndefined
		? {
				qtdeMaxima: null,
			}
		: {};

	const minimumUndefinedFilter: Filter<TMaterial> = filters.minimumUndefined
		? {
				qtdeMinima: null,
			}
		: {};

	const MATERIAL_TYPE_MAP = {
		all: {},
		"equipment-only": { idEquipamento: { $exists: true, $ne: null } },
		"non-equipment-only": { idEquipamento: { $exists: false, $eq: null } },
	};
	const materialTypeFilter: Filter<TMaterial> = MATERIAL_TYPE_MAP[filters.materialType || "all"];

	const query: Filter<TMaterial> = {
		...andOrQuery,
		...quantityFilter,
		...priceFilter,
		...periodQuery,
		...belowMinimumFilter,
		...aboveMaximumFilter,
		...minimumUndefinedFilter,
		...maximumUndefinedFilter,
		...suppliersQuery,
		...materialTypeFilter,
	};

	const skip = PAGE_SIZE * (Number(filters.page) - 1);
	const limit = PAGE_SIZE;

	const materialsMatched = await materialsCollection.countDocuments(query);
	const materials = await materialsCollection.find(query).skip(skip).limit(limit).sort({ nome: 1 }).toArray();
	const totalPages = Math.ceil(materialsMatched / PAGE_SIZE);

	res.status(200).json({ data: { materials: materials.map((m) => ({ ...m, _id: m._id.toString() })), materialsMatched, totalPages } });
};

export default apiHandler({
	POST: handleGetMaterialsWithFilters,
});
