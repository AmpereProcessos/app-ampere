import {
	PurchaseControlSimplifiedProjection,
	TPurchaseControl,
	TPurchaseControlSimplified,
	TPurchaseControlSimplifiedDTO,
} from "@/utils/schemas/purchases";
import { Collection, Filter } from "mongodb";

type GetPurchaseControlsByFilterParams = {
	collection: Collection<TPurchaseControl>;
	query: Filter<TPurchaseControl>;
	skip: number;
	limit: number;
};
export async function getPurchaseControlsByFilter({ collection, query, skip, limit }: GetPurchaseControlsByFilterParams) {
	// Getting the total purchases matched by the query
	const purchaseControlsMatched = await collection.countDocuments({ ...query });
	const sort = { _id: -1 };
	const match = { ...query };
	const purchaseControls = await collection
		.aggregate([{ $sort: sort }, { $match: match }, { $skip: skip }, { $project: PurchaseControlSimplifiedProjection }, { $limit: limit }])
		.toArray();

	return { purchaseControls, purchaseControlsMatched } as { purchaseControls: TPurchaseControlSimplifiedDTO[]; purchaseControlsMatched: number };
}
