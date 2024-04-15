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
import { PionerV1 } from "@pionerfriends/blockchain-client";

import { useAuthStore } from "../../store/authStore";
import { useEffect, useState } from "react";
import { createWalletClient, custom } from "viem";
import { fantomSonicTestnet, avalancheFuji } from "viem/chains";
import { WalletLoader } from "../web3/WalletLoader";

export function Menu() {
  const { ready, authenticated, user, login: privyLogin, logout } = usePrivy();
  const pathname = usePathname();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const disableLogin = !ready || authenticated;
  const setToken = useAuthStore((state) => state.setToken);
  const token = useAuthStore((state) => state.token);
  const [payload, setPayload] = useState<{
    uuid: string;
    message: string;
  } | null>(null);
  const [payloadError, setPayloadError] = useState(false);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    const fetchPayload = async () => {
      if (wallet && !token) {
        const address = wallet.address;
        console.log("address", address);

        try {
          const payloadResponse = await getPayload(address);
          console.log("payloadResponse", payloadResponse);

          if (
            payloadResponse &&
            payloadResponse.status === 200 &&
            payloadResponse.data.uuid &&
            payloadResponse.data.message
          ) {
            setPayload(payloadResponse.data);
            setPayloadError(false);
          } else {
            setPayload(null);
            setPayloadError(true);
          }
        } catch (error) {
          console.error("Error fetching payload:", error);
          setPayloadError(true);
        }
      }
    };

    fetchPayload();
  }, [wallet, token]);

  useEffect(() => {
    const signMessage = async () => {
      if (payload && !token) {
        const { uuid, message } = payload;

        try {
          const provider = await wallet.getEthereumProvider();
          console.log("provider", provider);
          const signature = await provider.request({
            method: "personal_sign",
            params: [message, wallet.address],
          });
          console.log("signature", signature, message);

          return { uuid, signature };
        } catch (error) {
          console.error("Error signing message:", error);
          setLoginError(true);
        }
      }
    };

    signMessage().then((signedData) => {
      if (signedData) {
        const { uuid, signature } = signedData;
        attemptLogin(uuid, signature);
      }
    });
  }, [payload, wallet, token]);

  const attemptLogin = async (uuid: string, signature: string) => {
    try {
      console.log("uuid", uuid);
      console.log("signature", signature);

      const loginResponse = await login(uuid, signature);
      console.log("loginResponse", loginResponse);

      if (
        loginResponse &&
        loginResponse.status === 200 &&
        loginResponse.data.token
      ) {
        const token = loginResponse.data.token;
        console.log("token", token);
        setToken(token);
        setLoginError(false);
      } else {
        setPayload(null);
        setLoginError(true);
        // Prompt the user to log in again on login error
        privyLogin();
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginError(true);
      // Prompt the user to log in again on login error
      privyLogin();
    }
  };

  useEffect(() => {
    if (loginError) {
      setPayload(null);
      setToken(null);
    }
  }, [loginError]);

  useEffect(() => {
    setPayload(null);
    setToken(null);
    setPayloadError(false);
    setLoginError(false);
  }, [wallet]);
  return (
    <div className="w-full sticky bottom-0 h-[110px] md:h-[130px]">
      <div className="w-full h-[1px] bg-border"></div>
      <div className="container bg-background flex items-center justify-center">
        {authenticated && token ? (
          <div className="text-center text-white p-3 flex items-center">
            <h3 className="mr-2">Account: {wallet?.address}</h3>
            <button onClick={logout} className="text-white hover:text-gray-200">
              <FaTimes size={10} />
            </button>
          </div>
        ) : wallet ? (
          <div className="text-center text-white p-3 flex items-center">
            <span className="mr-2">Signing in...</span>
            <button
              onClick={() => {
                logout();
                setPayload(null);
                setToken(null);
                setPayloadError(false);
                setLoginError(false);
              }}
              className="text-white hover:text-gray-200"
            >
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

export const useWalletAndProvider = () => {
  const { wallets } = useWallets();
  const [provider, setProvider] = useState<EIP1193Provider | null>(null);

  useEffect(() => {
    const getProvider = async () => {
      if (wallets.length > 0) {
        const wallet = wallets[0];
        const currentProvider = await wallet.getEthereumProvider();
        setProvider(currentProvider);
      } else {
        setProvider(null);
      }
    };

    getProvider();
  }, [wallets]);

  return { wallet: wallets[0], provider };
};

const menus = [
  { name: "Home", icon: <GoHomeFill />, link: "/" },
  { name: "Markets", icon: <MdOutlineInsertChart />, link: "/markets" },
  { name: "Trade", icon: <RiExchangeBoxLine />, link: "/trade" },
  { name: "Wallet", icon: <BiSolidWallet />, link: "/wallet" },
  { name: "User", icon: <IoPersonSharp />, link: "/user" },
];

export default Menu;
