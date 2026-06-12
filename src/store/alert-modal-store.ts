import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type OpenState = {
  isOpen: true;
  title: string;
  description: string;
  onPositive?: () => void;
  onNegative?: () => void;
};

type CloseState = {
  isOpen: false;
};

const initialState = {
  isOpen: false,
} as State;

type State = OpenState | CloseState;
const alertModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (params: Omit<OpenState, "isOpen">) => {
          set({ ...params, isOpen: true });
        },
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    {
      name: "AlertModalStore",
    },
  ),
);

export const useOpenAlertModal = () => {
  const open = alertModalStore((store) => store.actions.open);
  return open;
};

export const useAlertModal = () => {
  const store = alertModalStore();
  return store as typeof store & State;
};
