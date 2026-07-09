import type { TClientProfileInput } from "@/pages/api/stats/client-profile";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TReportLocationFilter = { estado?: string | null; cidade?: string | null };
type TReportFilters = {
  projectTypes: string[];
  period: { after?: string | null; before?: string | null };
  location: TReportLocationFilter;
  segment: TClientProfileInput["segmento"];
};

const initialFilters = (): TReportFilters => ({ projectTypes: [], period: {}, location: {}, segment: {} });

type TReportFiltersStore = TReportFilters & {
  updateFilters: (filters: Partial<Omit<TReportFilters, "location" | "segment">>) => void;
  updateLocation: (location: TReportLocationFilter) => void;
  updateSegment: (segment: TClientProfileInput["segmento"]) => void;
  resetFilters: () => void;
};

export const useReportFiltersStore = create<TReportFiltersStore>()(
  persist(
    (set) => ({
      ...initialFilters(),
      updateFilters: (filters) => set(filters),
      updateLocation: (location) => set({ location }),
      updateSegment: (segment) => set({ segment }),
      resetFilters: () => set(initialFilters()),
    }),
    { name: "overall-report-filters", storage: createJSONStorage(() => localStorage) },
  ),
);
