import type { TReportLocation, TReportPeriod, TReportSegment } from "@/utils/schemas/report-filter.schema";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Fonte única dos filtros do relatório. Persiste no localStorage para manter o
 * último recorte ao reabrir a página. As três abas (Visão Geral, Perfil e
 * Geografia) leem daqui, e qualquer seleção (cabeçalho, mapa, ranking ou resumo
 * do Perfil) escreve aqui.
 */

export type TReportLocationFilter = TReportLocation;
export type TReportSegmentDimension = keyof TReportSegment;

/** Rótulos curtos das dimensões de segmento, usados nos chips e barras de recorte. */
export const SEGMENT_DIMENSION_LABELS: Record<TReportSegmentDimension, string> = {
  sexo: "SEXO",
  faixaEtaria: "FAIXA ETÁRIA",
  faixaValor: "FAIXA DE VALOR",
  profissao: "PROFISSÃO",
  formaPagamento: "PAGAMENTO",
};

type TReportFilters = {
  projectTypes: string[];
  period: TReportPeriod;
  location: TReportLocation;
  segment: TReportSegment;
};

const initialFilters = (): TReportFilters => ({ projectTypes: [], period: {}, location: {}, segment: {} });

type TReportFiltersStore = TReportFilters & {
  // Evita disparar consulta com filtros vazios antes do localStorage ser lido.
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setProjectTypes: (projectTypes: string[]) => void;
  setPeriod: (period: TReportPeriod) => void;
  // Trocar a UF limpa a cidade caso ela deixe de ser válida para a nova UF.
  setEstado: (estado?: string | null) => void;
  setCidade: (cidade?: string | null) => void;
  setLocation: (location: TReportLocation) => void;
  clearLocation: () => void;
  toggleSegmentValue: (dimension: TReportSegmentDimension, value: string) => void;
  removeSegmentValue: (dimension: TReportSegmentDimension) => void;
  clearSegment: () => void;
  resetFilters: () => void;
};

export const useReportFiltersStore = create<TReportFiltersStore>()(
  persist(
    (set) => ({
      ...initialFilters(),
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setProjectTypes: (projectTypes) => set({ projectTypes }),
      setPeriod: (period) => set({ period }),
      setEstado: (estado) =>
        set((state) => {
          const nextEstado = estado || undefined;
          const estadoChanged = (state.location.estado || undefined) !== nextEstado;
          return {
            location: { estado: nextEstado, cidade: estadoChanged ? undefined : state.location.cidade },
          };
        }),
      setCidade: (cidade) => set((state) => ({ location: { ...state.location, cidade: cidade || undefined } })),
      setLocation: (location) =>
        set({ location: { estado: location.estado || undefined, cidade: location.cidade || undefined } }),
      clearLocation: () => set({ location: {} }),
      toggleSegmentValue: (dimension, value) =>
        set((state) => ({
          segment: { ...state.segment, [dimension]: state.segment[dimension] === value ? undefined : value },
        })),
      removeSegmentValue: (dimension) =>
        set((state) => ({ segment: { ...state.segment, [dimension]: undefined } })),
      clearSegment: () => set({ segment: {} }),
      resetFilters: () => set(initialFilters()),
    }),
    {
      name: "overall-report-filters",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        projectTypes: state.projectTypes,
        period: state.period,
        location: state.location,
        segment: state.segment,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
