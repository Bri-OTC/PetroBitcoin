// authStore.ts

// src/store/authStore.ts
import { create } from "zustand";

interface AuthState {
  token: string | null;
  isMarketOpen: boolean;

  setToken: (token: string | null) => void;
  setIsMarketOpen: (isOpen: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isMarketOpen: true,

  setToken: (token) => set({ token }),
  setIsMarketOpen: (isOpen) => set({ isMarketOpen: isOpen }),
}));

export { useAuthStore };
