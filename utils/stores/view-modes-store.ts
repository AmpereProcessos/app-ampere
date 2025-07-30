import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type TMode = "database" | "kanban";

export type ViewModesState = {
	modes: {
		comercial: TMode;
		supply: TMode;
		engineering: TMode;
		executions: TMode;
	};
	updateMode: (entity: keyof ViewModesState["modes"], mode: TMode) => void;
	resetModes: () => void;
};

// Estado inicial padrão
const createInitialModes = () => ({
	comercial: "database" as TMode,
	supply: "database" as TMode,
	engineering: "database" as TMode,
	executions: "database" as TMode,
});

export const useViewModesStore = create<ViewModesState>()(
	persist(
		(set, get) => ({
			// Estado inicial
			modes: createInitialModes(),

			// Atualizar modo de uma entidade específica
			updateMode: (entity, mode) =>
				set((state) => ({
					modes: { ...state.modes, [entity]: mode },
				})),

			// Resetar todos os modos para o padrão
			resetModes: () => set({ modes: createInitialModes() }),
		}),
		{
			name: "view-modes-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
