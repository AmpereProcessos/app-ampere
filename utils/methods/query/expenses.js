import axios from "axios";
import { useQuery } from "react-query";

// Expenses by Project
async function fetchProjectExpenses(projectId) {
  try {
    const { data: expenses } = await axios.get(
      `/api/despesas?projectId=${projectId}`
    );
    return expenses;
  } catch (error) {
    throw error;
  }
}
export function useProjectExpenses(projectId, enabled) {
  return useQuery({
    queryKey: ["projectExpenses", projectId],
    queryFn: async () => await fetchProjectExpenses(projectId),
    enabled: !!enabled,
    refetchOnWindowFocus: false,
  });
}

// General expenses
async function fetchExpenses() {
  try {
    const { data: expenses } = await axios.get("/api/despesas");
    return expenses;
  } catch (error) {
    throw error;
  }
}
export function useExpenses(enabled) {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: async () => await fetchExpenses(),
    enabled: !!enabled,
    refetchOnWindowFocus: false,
  });
}
