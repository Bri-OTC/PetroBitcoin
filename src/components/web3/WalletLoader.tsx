// components/WalletLoader.tsx
import { useEffect, useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom } from "viem";
import { fantomSonicTestnet } from "viem/chains";

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
