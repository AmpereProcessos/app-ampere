import type { TFunnelReference } from "@/utils/schemas/crm/funnel-reference.schema";
import type { Collection } from "mongodb";

type CreateFunnelReferenceParams = {
	collection: Collection<TFunnelReference>;
	info: TFunnelReference;
	partnerId?: string | null;
};

export async function insertFunnelReference({ collection, info, partnerId }: CreateFunnelReferenceParams) {
	try {
		const insertResponse = await collection.insertOne({
			...info,
			estagios: {
				[`${info.idEstagioFunil}`]: { entrada: new Date().toISOString() },
			},
			idParceiro: partnerId || "",
			dataInsercao: new Date().toISOString(),
		});
		return insertResponse;
	} catch (error) {
		throw error;
	}
}
