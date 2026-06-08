"use client";
import { create } from "zustand";
import { devtools, combine } from "zustand/middleware";

type EditMode = {
  isOpen: true;
  type: "Edit";
  productId: number;
  company: string;
  category: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  qty: number;
  isActive: boolean;
  dufferinComment: string;
  contactComment: string;
};

type CreateMode = {
  isOpen: true;
  type: "Create";
};

type OpenState = CreateMode | EditMode;

type CloseState = {
  isOpen: false;
  type: "None";
};

type State = OpenState | CloseState;

const initialState = {
  isOpen: false,
  type: "None",
} as State;

const productEditorModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        openCreate: () => {
          set({ isOpen: true, type: "Create" });
        },
        openEdit: (param: Omit<EditMode, "isOpen" | "type">) => {
          set({ isOpen: true, type: "Edit", ...param });
        },
        close: () => {
          set({ isOpen: false, type: "None" } as CloseState);
        },
      },
    })),
    {
      name: "ProductEditorModalStore",
    },
  ),
);

export const useProductModalEditorState = () => {
  const isOpen = productEditorModalStore((store) => store.isOpen);
  const type = productEditorModalStore((store) => store.type);
  return { isOpen, type };
};

export const useProductModalActions = () => {
  const actions = productEditorModalStore((store) => store.actions);
  return actions;
};

export const useProductEditorModalStore = () => {
  const store = productEditorModalStore();
  return store as typeof store & State;
};
