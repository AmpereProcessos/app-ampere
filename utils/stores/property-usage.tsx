"use client";

import { createStore } from "zustand";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import type React from "react";
import type { TAttachmentState } from "../methods/uploading";
import type { TPropertyTemporaryUsage } from "../schemas/properties";

// Tipos para inicialização da store
interface PropertyUsageInitProps {
  propertyUsage?: Partial<TPropertyTemporaryUsage>;
  attachments?: TAttachmentState[];
}

export type TPropertyUsageStore = {
  propertyUsage: TPropertyTemporaryUsage;
  attachments: TAttachmentState[];

  redefineState: (propertyUsage: TPropertyTemporaryUsage, attachments: TAttachmentState[]) => void;
  // actions
  updatePropertyUsage: (propertyUsage: Partial<TPropertyTemporaryUsage>) => void;
  updateAttachments: (attachments: TAttachmentState[]) => void;
  updatePropertyUsageMetadata: (
    propertyUsageMetadata: Partial<TPropertyTemporaryUsage["metadados"]>,
  ) => void;
  addAttachment: ({ attachment }: { attachment: TAttachmentState }) => void;
  updateAttachment: ({
    index,
    changes,
  }: {
    index: number;
    changes: Partial<TAttachmentState>;
  }) => void;
  mutateAttachment: ({
    identifier,
    attachment,
  }: {
    identifier: string;
    attachment: TAttachmentState;
  }) => void;
  removeAttachment: ({ index }: { index: number }) => void;
  clearAttachments: () => void;
  clearPropertyUsage: () => void;
  getPropertyUsage: () => TPropertyTemporaryUsage;
  getAttachments: () => TAttachmentState[];
  reset: () => void;
};

export type PropertyUsageStore = ReturnType<typeof createPropertyUsageStore>;

// Estado inicial padrão
const getDefaultState = (): Pick<TPropertyUsageStore, "propertyUsage" | "attachments"> => ({
  propertyUsage: {
    propriedade: {
      id: "",
      nome: "",
      identificador: "",
      imagemUrl: "",
    },
    responsaveis: [],
    arquivos: [],
    metadados: {
      tipo: "USO DE VEÍCULO",
      kmInicial: 0,
    },
    autor: {
      id: "",
      nome: "",
      avatar_url: null,
      cpf: "",
      telefone: "",
    },
    dataInsercao: new Date().toISOString(),
  },
  attachments: [],
});

// Função criadora da store
export const createPropertyUsageStore = (initProps?: PropertyUsageInitProps) => {
  const defaultState = getDefaultState();

  // Merge das props de inicialização com o estado padrão
  const initialState = {
    propertyUsage: { ...defaultState.propertyUsage, ...initProps?.propertyUsage },
    attachments: initProps?.attachments || defaultState.attachments,
  };

  return createStore<TPropertyUsageStore>()((set, get) => ({
    ...initialState,
    redefineState: (propertyUsage, attachments) => set({ propertyUsage, attachments }),
    updatePropertyUsage: (propertyUsage) =>
      set({ propertyUsage: { ...get().propertyUsage, ...propertyUsage } }),
    updateAttachments: (attachments) => set({ attachments }),
    mutateAttachment: ({ identifier, attachment }) => {
      const isAttachmentDefined = get().attachments.find(
        (attachment) => attachment.identificador === identifier,
      );
      if (isAttachmentDefined) {
        set({
          attachments: get().attachments.map((currentAttachment) =>
            currentAttachment.identificador === identifier
              ? { ...currentAttachment, ...attachment }
              : currentAttachment,
          ),
        });
      } else {
        set({ attachments: [...get().attachments, attachment] });
      }
    },
    updatePropertyUsageMetadata: (propertyUsageMetadata) =>
      set({
        propertyUsage: {
          ...get().propertyUsage,
          metadados: { ...get().propertyUsage.metadados, ...propertyUsageMetadata },
        },
      }),
    addAttachment: ({ attachment }) => set({ attachments: [...get().attachments, attachment] }),
    updateAttachment: ({ index, changes }) =>
      set({
        attachments: get().attachments.map((attachment, i) =>
          i === index ? { ...attachment, ...changes } : attachment,
        ),
      }),
    removeAttachment: ({ index }) =>
      set({ attachments: get().attachments.filter((_, i) => i !== index) }),
    clearAttachments: () => set({ attachments: [] }),
    clearPropertyUsage: () => set(defaultState),
    getPropertyUsage: () => get().propertyUsage,
    getAttachments: () => get().attachments,
    reset: () => set(defaultState),
  }));
};

// Contexto React
export const PropertyUsageContext = createContext<PropertyUsageStore | null>(null);

// Tipos para o Provider
type PropertyUsageProviderProps = React.PropsWithChildren<PropertyUsageInitProps>;

// Provider component
export function PropertyUsageProvider({ children, ...props }: PropertyUsageProviderProps) {
  const storeRef = useRef<PropertyUsageStore>();
  if (!storeRef.current) {
    storeRef.current = createPropertyUsageStore(props);
  }
  return (
    <PropertyUsageContext.Provider value={storeRef.current}>
      {children}
    </PropertyUsageContext.Provider>
  );
}

// Hook customizado para acessar a store
export function usePropertyUsageStore<T>(selector: (state: TPropertyUsageStore) => T): T {
  const store = useContext(PropertyUsageContext);
  if (!store) throw new Error("Missing PropertyUsageProvider in the tree");
  return useStore(store, selector);
}
