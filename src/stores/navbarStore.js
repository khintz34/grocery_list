import { create } from "zustand";

export const useNavbarStore = create((set) => ({
  navbarStatus: false,
  changeStatus: (status) => set((state) => ({ navbarStatus: status })),
}));
