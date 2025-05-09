import type { TGetTagsRouteInput, TGetTagsRouteOutput } from "@/pages/api/tags";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

async function fetchTags(filters: TGetTagsRouteInput) {
	try {
		const queryParams = new URLSearchParams();
		const { applicableToOpportunities, applicableToProposals, applicableToPurchases, applicableToProjects, applicableToServiceOrders } = filters;
		if (applicableToOpportunities) queryParams.set("applicableToOpportunities", applicableToOpportunities);
		if (applicableToProposals) queryParams.set("applicableToProposals", applicableToProposals);
		if (applicableToPurchases) queryParams.set("applicableToPurchases", applicableToPurchases);
		if (applicableToProjects) queryParams.set("applicableToProjects", applicableToProjects);
		if (applicableToServiceOrders) queryParams.set("applicableToServiceOrders", applicableToServiceOrders);
		const { data } = await axios.get("/api/tags", {
			params: queryParams,
		});
		const result = data.data as TGetTagsRouteOutput;
		if (!result.default) throw new Error("Oops, houve um erro desconhecido ao buscar as tags.");
		return result.default;
	} catch (error) {
		console.log("Error running fetchTags");
		throw error;
	}
}

type TUseTagsParams = {
	initialFilters: Partial<TGetTagsRouteInput>;
};
export function useTags({ initialFilters }: TUseTagsParams) {
	const [filters, setFilters] = useState<TGetTagsRouteInput>(initialFilters);

	function updateFilters(newFilters: Partial<TGetTagsRouteInput>) {
		setFilters((prev) => ({
			...prev,
			...newFilters,
		}));
	}
	const query = useQuery({
		queryKey: ["tags", filters],
		queryFn: async () => await fetchTags(filters),
	});
	return {
		...query,
		filters,
		updateFilters,
	};
}

async function getTagById({ id }: { id: string }) {
	try {
		const { data } = await axios.get(`/api/tags/${id}`);
		const result = data.data as TGetTagsRouteOutput;
		if (!result.byId) throw new Error("Oops, houve um erro desconhecido ao buscar a tag.");
		return result.byId;
	} catch (error) {
		console.log("Error running getTagById");
		throw error;
	}
}

type TUseTagByIdParams = {
	id: string;
};
export function useTagById({ id }: TUseTagByIdParams) {
	return useQuery({
		queryKey: ["tag-by-id", id],
		queryFn: async () => await getTagById({ id }),
	});
}
