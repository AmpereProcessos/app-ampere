import { PersonalizedFiltersSchema, type TPersonalizedServiceOrderFilter } from '@/utils/schemas/service-order'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type TObrasView = 'execution' | 'planning'

export function createObrasFilters(view: TObrasView): TPersonalizedServiceOrderFilter {
  return {
    page: 1, name: '', responsible: '', state: [], city: [], tags: [], category: [],
    urgency: [], status: [], authors: [], topologies: [], roofTypes: [],
    period: { after: null, before: null, field: null },
    orderBy: { direction: 'desc', field: 'dataInsercao' },
    pending: true, released: false, notReleased: false, missingObservations: false,
    projectEquipmentDelivered: false, projectEquipmentNotDelivered: false,
    projectHomologationApproved: false,
    projectStates: view === 'planning' ? ['approved', 'not-delivered'] : [],
  }
}

type ObrasFiltersStore = {
  filters: Record<TObrasView, TPersonalizedServiceOrderFilter>
  hasHydrated: boolean
  updateFilters: (view: TObrasView, patch: Partial<TPersonalizedServiceOrderFilter>) => void
  resetFilters: (view: TObrasView) => void
}

export const useObrasFiltersStore = create<ObrasFiltersStore>()(
  persist(
    (set) => ({
      filters: { execution: createObrasFilters('execution'), planning: createObrasFilters('planning') },
      hasHydrated: false,
      updateFilters: (view, patch) => set((state) => ({
        filters: { ...state.filters, [view]: { ...state.filters[view], ...patch } },
      })),
      resetFilters: (view) => set((state) => ({
        filters: { ...state.filters, [view]: createObrasFilters(view) },
      })),
    }),
    {
      name: 'obras-filters',
      version: 1,
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try { return localStorage.getItem(name) } catch { return null }
        },
        setItem: (name, value) => {
          try { localStorage.setItem(name, value) } catch { /* Keep filters usable when storage is blocked or full. */ }
        },
        removeItem: (name) => {
          try { localStorage.removeItem(name) } catch { /* Storage can be unavailable in private browsing. */ }
        },
      })),
      skipHydration: true,
      // Reopen at page one, keeping the user's criteria and sort order.
      partialize: (state) => ({ filters: {
        execution: { ...state.filters.execution, page: 1 },
        planning: { ...state.filters.planning, page: 1 },
      } }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<Pick<ObrasFiltersStore, 'filters'>> | undefined
        const filters = { ...current.filters }
        for (const view of ['execution', 'planning'] as const) {
          const parsed = PersonalizedFiltersSchema.safeParse({ ...createObrasFilters(view), ...saved?.filters?.[view], page: 1 })
          if (parsed.success) filters[view] = parsed.data
        }
        return { ...current, filters }
      },
      // Storage failures must not leave queries disabled indefinitely.
      onRehydrateStorage: () => () => useObrasFiltersStore.setState({ hasHydrated: true }),
    },
  ),
)
