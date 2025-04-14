import type { TFunnelDTO } from "@/utils/schemas/crm/funnels.schema";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

async function fetchFunnelById({ id }: { id: string }) {
	try {
		const { data } = await axios.get(`/api/crm/funnels?id=${id}`);
		return data.data as TFunnelDTO;
	} catch (error) {
		throw error;
	}
}

export function useFunnelById({ id }: { id: string }) {
	return useQuery({
		queryKey: ["funnel-by-id", id],
		queryFn: async () => await fetchFunnelById({ id }),
	});
}
