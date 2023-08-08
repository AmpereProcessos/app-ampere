import axios from "axios";
import { useQuery } from "react-query";

async function fetchProjectExpenses(projectId) {
  try {
    const { data: expenses } = await axios.get(
      `/api/expenses?projectId=${projectId}`
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
