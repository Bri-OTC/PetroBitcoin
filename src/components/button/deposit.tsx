import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

export const depositButton = () => {
  const { ready, authenticated, user, login: privyLogin, logout } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];

  return <Button onClick={() => {}} />;
};
