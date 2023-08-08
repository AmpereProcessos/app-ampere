import axios from "axios";
import { useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";

export async function fetchInfiniteForms({ page = 1, limit }) {
  const { data } = await axios.get(
    `/api/almoxarifado/formularios?page=${page}&limit=${limit}`
  );
  //   if (!response?.data) return undefined;
  //   if (!Array.isArray(response)) return undefined;

  return data;
}
export async function fetchForms() {
  const { data } = await axios.get(
    `/api/almoxarifado/formularios?page=1&limit=1500`
  );
  //   if (!response?.data) return undefined;
  //   if (!Array.isArray(response)) return undefined;

  return data;
}

export function useForms(enabled) {
  return useQuery({
    queryKey: ["warehouseForms"],
    queryFn: fetchForms,
    refetchOnWindowFocus: false,
    enabled: !!enabled,
  });
}
