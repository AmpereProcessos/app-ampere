import axios from "axios";
import { useQuery } from "react-query";

export async function fetchMaterials() {
  const { data } = await axios.get("/api/almoxarifado/materiais");
  if (!data) return [];
  if (!Array.isArray(data)) return [];
  return data;
}

export function useMaterials(enabled) {
  return useQuery({
    queryKey: ["materials"],
    queryFn: fetchMaterials,
    refetchOnWindowFocus: false,
    enabled: !!enabled,
  });
}
