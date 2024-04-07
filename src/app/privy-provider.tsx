"use client";
import { PrivyProvider } from "@privy-io/react-auth";

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
          logo: "./favicon.png",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
