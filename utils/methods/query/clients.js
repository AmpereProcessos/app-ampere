import axios from "axios";
import { useQuery } from "react-query";

export async function fetchClients() {
  const { data } = await axios.get("/api/projects/todos");
  if (!data) return [];
  if (!Array.isArray(data)) return [];
  return data;
}

export function useClients(enabled) {
  return useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
    refetchOnWindowFocus: false,
    enabled: !!enabled,
  });
}
