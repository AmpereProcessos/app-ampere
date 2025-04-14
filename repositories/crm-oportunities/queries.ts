import type { Collection, Filter, WithId } from "mongodb";
import { SimplifiedOpportunityWithProposalProjection, type TOpportunity, type TOpportunitySimplified } from "@/utils/schemas/crm/opportunity.schema";
import type { TProposal } from "@/utils/schemas/crm/proposal.schema";

type GetOpportunityByQueryParams = {
	collection: Collection<TOpportunity>;
	query: Filter<TOpportunity>;
};

type TOpportunityByQueryResult = TOpportunitySimplified & { proposta: WithId<TProposal>[] };
export async function getOpportunitiesByQuery({ collection, query }: GetOpportunityByQueryParams) {
	try {
		const addFields = { idPropostaAtivaObjectId: { $toObjectId: "$idPropostaAtiva" } };
		const lookup = { from: "proposals", localField: "idPropostaAtivaObjectId", foreignField: "_id", as: "proposta" };
		const projection = SimplifiedOpportunityWithProposalProjection;
		// const opportunities = await collection.find({ ...query, idParceiro: partnerId || '' }).toArray()
		const opportunities = (await collection
			.aggregate([{ $match: { ...query, dataExclusao: null } }, { $addFields: addFields }, { $lookup: lookup }, { $project: projection }])
			.toArray()) as WithId<TOpportunityByQueryResult>[];

		return opportunities;
	} catch (error) {
		throw error;
	}
}
