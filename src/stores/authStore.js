import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authStatus: false,
  changeStatus: (status) => set((state) => ({ authStatus: status })),
}));
