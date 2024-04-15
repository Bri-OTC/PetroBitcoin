// components/WalletLoader.tsx
import { useEffect, useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import {
  createWalletClient,
  defineChain,
  createPublicClient,
  custom,
} from "viem";

export function WalletLoader() {
  const { wallets } = useWallets();
  const [walletClient, setWalletClient] = useState<ReturnType<
    typeof createWalletClient
  > | null>(null);

  useEffect(() => {
    async function loadWallet() {
      if (wallets.length > 0) {
        const wallet = wallets[0];
        const provider = await wallet.getEthereumProvider();
        const client = createWalletClient({
          chain: fantomSonicTestnet,
          transport: custom(provider),
        });
        setWalletClient(client);
      }
    }

    loadWallet();
  }, [wallets]); //

  return walletClient;
}

export const fantomSonicTestnet = defineChain({
  id: 64165,
  name: "Fantom Sonic Testnet",
  network: "fantom-sonic-testnet",
  nativeCurrency: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpcapi.sonic.fantom.network/"],
    },
    public: {
      http: ["https://rpcapi.sonic.fantom.network/"],
    },
  },
});

const walletClient =
  typeof window !== "undefined"
    ? createWalletClient({
        chain: fantomSonicTestnet,
        transport: custom(window.ethereum),
      })
    : null;

export { walletClient };
