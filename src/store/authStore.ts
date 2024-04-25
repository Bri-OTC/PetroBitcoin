// src/store/authStore.ts
import { create } from "zustand";
import { createWalletClient, custom } from "viem";
import { EIP1193Provider } from "@privy-io/react-auth";

interface AuthState {
  token: string | null;
  isMarketOpen: boolean;
  provider: EIP1193Provider | null;
  walletClient: ReturnType<typeof createWalletClient> | null;
  wallet: any | null; // Replace 'any' with the appropriate wallet type
  setToken: (token: string | null) => void;
  setIsMarketOpen: (isOpen: boolean) => void;
  setProvider: (provider: EIP1193Provider | null) => void;
  setWalletClient: (
    walletClient: ReturnType<typeof createWalletClient> | null
  ) => void;
  setWallet: (wallet: any | null) => void; // Replace 'any' with the appropriate wallet type
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isMarketOpen: true,
  provider: null,
  walletClient: null,
  wallet: null,
  setToken: (token) => set({ token }),
  setIsMarketOpen: (isOpen) => set({ isMarketOpen: isOpen }),
  setProvider: (provider) => set({ provider }),
  setWalletClient: (walletClient) => set({ walletClient }),
  setWallet: (wallet) => set({ wallet }),
}));

export { useAuthStore };
