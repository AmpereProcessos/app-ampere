import axios from "axios";
import { useQuery } from "react-query";

export async function fetchCostApportionments() {
  try {
    const { data } = await axios.get("/api/configuracoes/centrosDeCusto");
    if (!data) return [];
    if (!Array.isArray(data)) return [];
    return data;
  } catch (error) {
    throw error;
  }
}

export function useCostApportionments(enabled) {
  return useQuery({
    queryKey: ["costApportionments"],
    queryFn: fetchCostApportionments,
    refetchOnWindowFocus: false,
    enabled: !!enabled,
  });
}
