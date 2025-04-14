import type { TFunnelReference } from "@/utils/schemas/crm/funnel-reference.schema";
import type { Collection, Filter } from "mongodb";

type GetFunnelReferencesParams = {
	collection: Collection<TFunnelReference>;
	funnelId: string;
	query: Filter<TFunnelReference>;
};
export async function getFunnelReferences({ collection, funnelId, query }: GetFunnelReferencesParams) {
	try {
		const references = await collection.find({ idFunil: funnelId, ...query }).toArray();
		return references;
	} catch (error) {
		throw error;
	}
}
