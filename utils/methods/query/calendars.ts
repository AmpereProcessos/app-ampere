import { TCalendarDTO } from "@/utils/schemas/calendars";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchCalendars() {
	try {
		const { data } = await axios.get("/api/utils/calendars");
		return data.data as TCalendarDTO[];
	} catch (error) {
		throw error;
	}
}

export default function useCalendars() {
	return useQuery({
		queryKey: ["calendars"],
		queryFn: fetchCalendars,
	});
}
