import type { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";
import type { Collection } from "mongodb";

type CreateOpportunityParams = {
	collection: Collection<TOpportunity>;
	info: TOpportunity;
	partnerId: string | null;
};

export async function insertOpportunity({ collection, info, partnerId }: CreateOpportunityParams) {
	try {
		const lastInsertedIdentificator = await collection
			.aggregate([
				{ $project: { identificador: 1 } },
				{
					$sort: {
						_id: -1,
					},
				},
				{
					$limit: 1,
				},
			])
			.toArray();
		const lastIdentifierNumber = lastInsertedIdentificator[0] ? Number(lastInsertedIdentificator[0].identificador.split("-")[1]) : 0;
		const newIdentifierNumber = lastIdentifierNumber + 1;
		const newIdentifier = `CRM-${newIdentifierNumber}`;

		const insertResponse = await collection.insertOne({
			...info,
			identificador: newIdentifier,
			idParceiro: partnerId || "",
			dataInsercao: new Date().toISOString(),
		});
		return insertResponse;
	} catch (error) {
		throw error;
	}
}
