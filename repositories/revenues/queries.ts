import { RevenueSimplifiedProjection, TRevenue, TRevenueSimplifiedDTO } from "@/utils/schemas/revenues";
import { Collection, Filter } from "mongodb";

type GetRevenueByFiltersParams = {
	collection: Collection<TRevenue>;
	query: Filter<TRevenue>;
	skip: number;
	limit: number;
};

export async function getRevenuesByFilters({ collection, query, skip, limit }: GetRevenueByFiltersParams) {
	try {
		const revenuesMatched = await collection.countDocuments({ ...query });
		const sort = { _id: -1 };
		const match = { ...query };
		const revenues = await collection
			.aggregate([{ $sort: sort }, { $match: match }, { $skip: skip }, { $limit: limit }, { $project: RevenueSimplifiedProjection }])
			.toArray();

		return { revenues, revenuesMatched } as { revenues: TRevenueSimplifiedDTO[]; revenuesMatched: number };
	} catch (error) {
		throw error;
	}
}
