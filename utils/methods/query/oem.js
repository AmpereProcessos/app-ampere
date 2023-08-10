import axios from "axios";
import { useQuery } from "react-query";

export async function getSectorStats() {
  try {
    const { data } = await axios.get("/api/stats/sector-reports/oem");
    return data;
  } catch (error) {
    throw error;
  }
}

export function useOeMReportData(enabled) {
  return useQuery({
    queryKey: ["oem-report"],
    queryFn: getSectorStats,
    enabled: !!enabled,
    refetchOnWindowFocus: false,
  });
}
