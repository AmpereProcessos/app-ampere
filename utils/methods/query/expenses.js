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
export function useExpenses(enabled, filters) {
  function checkName(expense, nameFilter) {
    if (nameFilter != "") {
      return (
        expense.projeto?.nome &&
        !!expense.projeto.nome.toUpperCase().includes(nameFilter.toUpperCase())
      );
    } else return true;
  }
  return useQuery({
    queryKey: ["expenses"],
    queryFn: async () => await fetchExpenses(),
    enabled: !!enabled,
    select: (expenses) =>
      expenses.filter((expense) => checkName(expense, filters.search)),
    refetchOnWindowFocus: false,
  });
}
