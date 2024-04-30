// components/layout/menu.tsx

"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { GoHomeFill } from "react-icons/go";
import { MdOutlineInsertChart } from "react-icons/md";
import { RiExchangeBoxLine } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { BiSolidWallet } from "react-icons/bi";
import { useWallets } from "@privy-io/react-auth";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import { FaTimes } from "react-icons/fa";
import { getPayload, login as apiLogin } from "@pionerfriends/api-client";

import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import {
  createWalletClient,
  custom,
  verifyMessage,
  EIP1193Provider,
} from "viem";

import { calculatePairPrices } from "@/components/triparty/pairPrice";

export function Menu() {
  const setProvider = useAuthStore((state) => state.setProvider);
  const setWalletClient = useAuthStore((state) => state.setWalletClient);
  const { ready, authenticated, user, logout } = usePrivy();
  const pathname = usePathname();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const setWallet = useAuthStore((state) => state.setWallet);

  const setToken = useAuthStore((state) => state.setToken);
  const token = useAuthStore((state) => state.token);
  const [payload, setPayload] = useState<{
    uuid: string;
    message: string;
  } | null>(null);
  const [payloadError, setPayloadError] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const disableLogin = !!(authenticated && token);

  const { login } = useLogin({
    onComplete: async (user, isNewUser, wasAlreadyAuthenticated) => {
      console.log(user, isNewUser, wasAlreadyAuthenticated);
      await fetchPayload();
      //await signMessage();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    const tokenFromCookie = Cookies.get("token");
    if (tokenFromCookie && !token) {
      setToken(tokenFromCookie);
    }
  }, []);

  /*useEffect(() => {
    clearAllData();
    console.log("clearAllData");
  }, []);*/

  function clearAllData() {
    // Clear cookies
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
    // Clear local storage
    localStorage.clear();
    // Clear session storage
    sessionStorage.clear();
  }
  /*useEffect(() => {
    if (ready && !authenticated && !token) {
      logout();

      privyLogin();
    }
  }, [ready, authenticated, token]);*/

  const fetchPayload = async () => {
    console.log("fetchPayload")
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

  const signMessage = async () => {
    console.log("signMessage")
    console.log(payload, token)
    if (payload && !token) {
      const { uuid, message } = payload;

      try {
        const provider = await wallet.getEthereumProvider();
        const walletClient = createWalletClient({
          transport: custom(provider),
          account: wallet.address as `0x${string}`,
        });
        setProvider(provider);
        setWalletClient(walletClient);
        setWallet(wallet);
        console.log("meny walletClient", walletClient);

        const signature = await walletClient.signMessage({
          account: wallet.address as `0x${string}`,
          message: message,
        });

        const valid = await verifyMessage({
          address: wallet.address as `0x${string}`,
          message: message,
          signature: signature,
        });

        console.log("signature", signature, message, valid);

        return { uuid, signature };
      } catch (error) {
        console.error("Error signing message:", error);
        setLoginError(true);
      }
    }
  };

  useEffect(() => {
    if (payload) {
      signMessage().then((signedData) => {
        if (signedData) {
          const { uuid, signature } = signedData;
          attemptLogin(uuid, signature);
        }
      });
    }
  }, [payload]);

  const attemptLogin = async (uuid: string, signature: string) => {
    try {
      console.log("uuid", uuid);
      console.log("signature", signature);

      const loginResponse = await apiLogin(uuid, signature);
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
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginError(true);
    }
  };

  useEffect(() => {
    if (loginError) {
      logout();
      setPayload(null);
      setToken(null);
      setPayloadError(false);
      setLoginError(false);
    }
  }, [loginError]);

  return (
    <div className="w-full sticky bottom-0 h-[110px] md:h-[130px]">
      <div className="w-full h-[1px] bg-border"></div>
      <div className="container bg-background flex items-center justify-center">
        {ready ? (
          ready && authenticated && token ? (
            <div className="text-center text-white p-3 flex items-center">
              <h3 className="mr-2">Account: {wallet?.address}</h3>
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
          ) : payload ? (
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
              onClick={() => {
                setPayload(null);
                setToken(null);
                setPayloadError(false);
                setLoginError(false);
                if (ready) {
                  login();
                }
              }}
              className="text-center text-white p-3"
            >
              Log in
            </button>
          )
        ) : (
          <div className="text-center text-white p-3">Loading...</div>
        )}
      </div>
      <div className="bg-accent text-card-foreground">
        <div className="flex items-center justify-between w-full container py-3 space-x-5">
          {menus.map((x) => {
            return (
              <Link
                href={x.link}
                key={x.name}
                className={`${pathname === x.link ? "text-primary" : "text-card-foreground"
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

        setProvider(currentProvider as EIP1193Provider | null);
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
