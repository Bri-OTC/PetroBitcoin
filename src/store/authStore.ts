// src/store/authStore.ts
import { create } from "zustand";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createWalletClient, custom, JsonRpcAccount } from "viem";
import { EIP1193Provider } from "@privy-io/react-auth";
import { Wallet, JsonRpcSigner } from "ethers";

interface AuthState {
  token: string | null;
  isMarketOpen: boolean;
  provider: EIP1193Provider | null;
  ethersSigner: JsonRpcSigner | null;
  walletClient: ReturnType<typeof createWalletClient> | null;
  wallet: any | null; // Replace 'any' with the appropriate wallet type
  setToken: (token: string | null) => void;
  setIsMarketOpen: (isOpen: boolean) => void;
  setProvider: (provider: EIP1193Provider | null) => void;
  setEthersSigner: (ethersSigner: JsonRpcSigner | null) => void;
  setWalletClient: (
    walletClient: ReturnType<typeof createWalletClient> | null
  ) => void;
  setWallet: (wallet: any | null) => void; // Replace 'any' with the appropriate wallet type
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isMarketOpen: true,
  provider: null,
  ethersSigner: null,
  walletClient: null,
  wallet: null,
  setToken: (token) => {
    if (token) {
      const decodedToken = jwt.decode(token) as JwtPayload;
      if (decodedToken && decodedToken.exp) {
        const expirationDate = new Date(decodedToken.exp * 1000);
        console.log("TOKEN" + token);
        set({ token });
        Cookies.set("token", token, { expires: expirationDate });
      }
    } else {
      set({ token: null });
      Cookies.remove("token"); // Remove token from cookie
    }
  },
  setIsMarketOpen: (isOpen) => set({ isMarketOpen: isOpen }),
  setProvider: (provider) => set({ provider }),
  setEthersSigner: (ethersSigner) => set({ ethersSigner }),
  setWalletClient: (walletClient) => set({ walletClient }),
  setWallet: (wallet) => set({ wallet }),
}));

export { useAuthStore };
