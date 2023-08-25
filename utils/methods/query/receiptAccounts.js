import axios from "axios";
import { useQuery } from "react-query";

export async function fetchReceiptAccounts() {
  try {
    const { data } = await axios.get("/api/configuracoes/centrosDeCusto");
    if (!data) return [];
    if (!Array.isArray(data)) return [];
  } catch (error) {
    throw error;
  }
}

export function useReceiptAccounts(enabled) {
  return useQuery({
    queryKey: ["receiptAccounts"],
    queryFn: fetchReceiptAccounts,
    refetchOnWindowFocus: false,
    enabled: !!enabled,
  });
}
