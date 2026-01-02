import { useDebounceMemo } from "@/lib/hooks/debounce";
import type {
	TGetTransportControlByIdPublicOutput,
	TGetTransportControlsInput,
	TGetTransportControlsOutput,
} from "@/pages/api/controles-transportes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

async function fetchTransportControls({ input }: { input: TGetTransportControlsInput }) {
	const searchParams = new URLSearchParams();
	searchParams.set("page", input.page.toString());
	if (input.search) searchParams.set("search", input.search);
	const url = `/api/controles-transportes?${searchParams.toString()}`;
	const { data } = await axios.get<TGetTransportControlsOutput>(url);
	return data.data;
}

type UseTransportControlsParams = {
	initialParams?: Partial<TGetTransportControlsInput>;
};
export function useTransportControls({ initialParams }: UseTransportControlsParams = {}) {
	const [params, setParams] = useState<TGetTransportControlsInput>({
		page: initialParams?.page || 1,
		search: initialParams?.search || "",
	});
	function updateParams(params: Partial<TGetTransportControlsInput>) {
		setParams((prev) => ({ ...prev, ...params }));
	}

	const debouncedSearch = useDebounceMemo(
		{
			search: params.search,
		},
		500,
	);
	const finalParams = {
		...params,
		search: debouncedSearch.search,
	};
	return {
		...useQuery({
			queryKey: ["transport-controls", finalParams],
			queryFn: async () =>
				await fetchTransportControls({
					input: finalParams,
				}),
		}),
		queryKey: ["transport-controls", finalParams],
		params,
		updateParams,
	};
}

async function fetchTransportControlByIdPublic({ id }: { id: string }) {
	const { data } = await axios.get<TGetTransportControlByIdPublicOutput>(`/api/controles-transportes?id=${id}`);
	return data.data;
}

export function useTransportControlByIdPublic({ id }: { id: string }) {
	return {
		...useQuery({
			queryKey: ["transport-control-by-id-public", id],
			queryFn: async () => await fetchTransportControlByIdPublic({ id }),
		}),
		queryKey: ["transport-control-by-id-public", id],
	};
}
