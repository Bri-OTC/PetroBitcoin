// components/layout/menu.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoHomeFill } from "react-icons/go";
import { MdOutlineInsertChart } from "react-icons/md";
import { RiExchangeBoxLine } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { BiSolidWallet } from "react-icons/bi";
import { useWallets } from "@privy-io/react-auth";
import { usePrivy } from "@privy-io/react-auth";
import { FaTimes } from "react-icons/fa";
import { getPayload, login } from "@pionerfriends/api-client";
import useAuthStore from "../../store/authStore";

export function Menu() {
  const { ready, authenticated, user, login: privyLogin, logout } = usePrivy();
  const pathname = usePathname();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const disableLogin = !ready || authenticated;
  const setToken = useAuthStore((state) => state.setToken);

  const handleSignMessage = async () => {
    if (!wallet) {
      return null;
    }

    const address = wallet.address;
    const payloadResponse = await getPayload(address);

    if (
      !payloadResponse ||
      payloadResponse.status !== 200 ||
      !payloadResponse.data.uuid ||
      !payloadResponse.data.message
    ) {
      return null;
    }

    const { uuid, message } = payloadResponse.data;

    try {
      const provider = await wallet.getEthereumProvider();
      const signature = await provider.request({
        method: "personal_sign",
        params: [message, address],
      });

      const loginResponse = await login(uuid, signature);

      if (
        !loginResponse ||
        loginResponse.status !== 200 ||
        !loginResponse.data.token
      ) {
        return null;
      }

      const token = loginResponse.data.token;
      console.log("token", token);
      setToken(token);
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  return (
    <div className="w-full sticky bottom-0 h-[110px] md:h-[130px]">
      <div className="w-full h-[1px] bg-border"></div>
      <div className="container bg-background flex items-center justify-center">
        {authenticated ? (
          <div className="text-center text-white p-3 flex items-center">
            <h3 className="mr-2">Account: {wallet?.address} :setToken </h3>
            {setToken === undefined && (
              <button
                onClick={handleSignMessage}
                className="text-white hover:text-gray-200 mr-2"
              >
                Sign
              </button>
            )}

            <button onClick={logout} className="text-white hover:text-gray-200">
              <FaTimes size={10} />
            </button>
          </div>
        ) : (
          <button
            disabled={disableLogin}
            onClick={privyLogin}
            className="text-center text-white p-3"
          >
            Log in
          </button>
        )}
      </div>
      <div className="bg-accent text-card-foreground">
        <div className="flex items-center justify-between w-full container py-3 space-x-5">
          {menus.map((x) => {
            return (
              <Link
                href={x.link}
                key={x.name}
                className={`${
                  pathname === x.link ? "text-primary" : "text-card-foreground"
                } group flex flex-col items-center text-center space-y-1 hover:text-primary w-full cursor-pointer transition-all`}
              >
                <div className="text-[1.5rem] md:text-[2rem]">{x.icon}</div>
                <p>{x.name}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const menus = [
  { name: "Home", icon: <GoHomeFill />, link: "/" },
  { name: "Markets", icon: <MdOutlineInsertChart />, link: "/markets" },
  { name: "Trade", icon: <RiExchangeBoxLine />, link: "/trade" },
  { name: "Wallet", icon: <BiSolidWallet />, link: "/wallet" },
  { name: "User", icon: <IoPersonSharp />, link: "/user" },
];

export default Menu;
