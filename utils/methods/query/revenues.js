import axios from "axios";
import { useQuery } from "react-query";

// Expenses by Project
async function fetchProjectRevenues(projectId) {
  try {
    const { data: revenues } = await axios.get(
      `/api/receitas?projectId=${projectId}`
    );
    return revenues;
  } catch (error) {
    throw error;
  }
}
export function useProjectRevenues(projectId, enabled) {
  return useQuery({
    queryKey: ["projectRevenues", projectId],
    queryFn: async () => await fetchProjectRevenues(projectId),
    enabled: !!enabled,
    refetchOnWindowFocus: false,
  });
}

// General Revenues
async function fetchRevenues() {
  try {
    const { data: revenues } = await axios.get("/api/receitas");
    return revenues;
  } catch (error) {
    throw error;
  }
}
export function useRevenues(enabled, filters) {
  function checkName(revenue, nameFilter) {
    if (nameFilter != "") {
      return (
        revenue.projeto?.nome &&
        !!revenue.projeto.nome.toUpperCase().includes(nameFilter.toUpperCase())
      );
    } else return true;
  }
  return useQuery({
    queryKey: ["revenues"],
    queryFn: async () => await fetchRevenues(),
    enabled: !!enabled,
    select: (revenues) =>
      revenues.filter((revenue) => checkName(revenue, filters.search)),
    refetchOnWindowFocus: false,
  });
}
