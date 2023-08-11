import axios from "axios";
import { useQuery } from "react-query";

async function fetchNPSData() {
  const { data } = await axios.get("/api/projects/nps");
  if (!data) return [];
  if (!Array.isArray(data)) return [];
  return data;
}

export function useNPS(enabled) {
  return useQuery({
    queryKey: ["nps"],
    queryFn: fetchNPSData,
    refetchOnWindowFocus: false,
    enabled: !!enabled,
  });
}
