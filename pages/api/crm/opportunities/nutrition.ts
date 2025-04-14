import { validateAuthenticationWithSession } from "@/utils/api";
import type { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import type { Filter } from "mongodb";
import type { NextApiHandler } from "next";

const handleGetNutritionOpportunities: NextApiHandler<any> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const crmDb = await connectToCRMDatabase();
	const opportunitiesCollection = crmDb.collection<TOpportunity>("opportunities");

	const ongoingOpportunitiesQuery: Filter<TOpportunity> = {
		"perda.data": null,
		"ganho.data": null,
	};
};
