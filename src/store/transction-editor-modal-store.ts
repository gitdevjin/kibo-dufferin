import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
type OpenState = {
  isOpen: true;
  type: "Sale" | "Restock";
  productId: number;
  productName: string;
  currentQty: number;
};

type CloseState = {
  isOpen: false;
};

type State = OpenState | CloseState;

const initialState = {
  isOpen: false,
} as State;

const transactionEditorModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (param: Omit<OpenState, "isOpen">) =>
          set({ isOpen: true, ...param }),
        close: () => set({ isOpen: false } as CloseState),
      },
    })),
    { name: "TransactionEditorModalStore" },
  ),
);

export const useTransactionEditorModalActions = () => {
  return transactionEditorModalStore((store) => store.actions);
};

export const useTransactionEditorModalStore = () => {
  const store = transactionEditorModalStore();
  return transactionEditorModalStore() as typeof store & State;
};
