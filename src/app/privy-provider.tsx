"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { avalancheFuji } from "viem/chains";
import { defineChain } from "viem";

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
    default: { http: ["https://rpcapi.sonic.fantom.network/"] },
    public: { http: ["https://rpcapi.sonic.fantom.network/"] },
  },
});

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

  if (!appId) {
    throw new Error("NEXT_PUBLIC_PRIVY_APP_ID environment variable is not set");
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
          showWalletLoginFirst: false,
          logo: "./logo.svg",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        defaultChain: fantomSonicTestnet,
        supportedChains: [fantomSonicTestnet, avalancheFuji],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
