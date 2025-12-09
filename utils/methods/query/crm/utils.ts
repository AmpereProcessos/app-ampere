import type { TCreditorDTO } from "@/utils/schemas/crm/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchCreditors() {
	const { data } = await axios.get("/api/crm/utils?identifier=CREDITOR");
	return data.data as TCreditorDTO[];
}

export function useCreditors() {
	return useQuery({ queryKey: ["creditors"], queryFn: fetchCreditors });
}
