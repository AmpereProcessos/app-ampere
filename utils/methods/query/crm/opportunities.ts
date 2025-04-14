import type {
	TOpportunitySimplifiedDTOWithProposalAndActivitiesAndFunnels,
	TOpportunitySimplifiedWithProposalAndActivitiesAndFunnels,
} from "@/utils/schemas/crm/opportunity.schema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchNutritionOpportunities() {
	try {
		const { data } = await axios.get("/api/crm/opportunities/nutrition");
		return data.data as TOpportunitySimplifiedDTOWithProposalAndActivitiesAndFunnels[];
	} catch (error) {
		throw error;
	}
}

export function useNutritionOpportunities() {
	return useQuery({
		queryKey: ["nutrition-opportunities"],
		queryFn: async () => await fetchNutritionOpportunities(),
	});
}
