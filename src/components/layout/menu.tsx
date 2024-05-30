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
import { createWalletClient, custom, verifyMessage } from "viem";
import { useRfqRequestStore } from "@/components/triparty/quoteStore";
import useUpdateMarketStatus from "@/hooks/marketStatusUpdater";
import useQuoteWss from "@/hooks/useQuoteWss";
import useFillOpenQuote from "@/hooks/useFillOpenQuote";
import useFillCloseQuote from "@/hooks/useFillCloseQuote";
import { useTradeStore } from "@/store/tradeStore";
import { useColorStore } from "@/store/colorStore";
import { useMethodColor } from "@/hooks/useMethodColor";

export function Menu() {
  const setWalletClient = useAuthStore((state) => state.setWalletClient);
  const { ready, authenticated, user, logout } = usePrivy();
  const pathname = usePathname();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const setProvider = useAuthStore((state) => state.setProvider);
  const setToken = useAuthStore((state) => state.setToken);
  const token = useAuthStore((state) => state.token);
  const provider = useAuthStore((state) => state.provider);
  const symbol = useTradeStore((state) => state.symbol);
  const color = useColorStore((state) => state.color);

  const [payload, setPayload] = useState<{
    uuid: string;
    message: string;
  } | null>(null);
  const [payloadError, setPayloadError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const setIsMarketOpen = useAuthStore((state) => state.setIsMarketOpen);
  const { addQuote } = useRfqRequestStore();

  const disableLogin = !!(authenticated && token);

  useUpdateMarketStatus(token, symbol, setIsMarketOpen);
  useQuoteWss(token, addQuote);
  useFillOpenQuote(token);
  useFillCloseQuote(token);
  useMethodColor();

  const { login } = useLogin({
    onComplete: async (user, isNewUser, wasAlreadyAuthenticated) => {
      console.log(user, isNewUser, wasAlreadyAuthenticated);
      await fetchPayload();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    const tokenFromCookie = Cookies.get("token");
    if (tokenFromCookie && !token && ready && authenticated) {
      setToken(tokenFromCookie);
    }
  }, [authenticated]);

  useEffect(() => {
    const fetchData = async () => {
      if (ready && authenticated && wallet) {
        const provider = await wallet.getEthereumProvider();
        setProvider(provider);
        const walletClient = createWalletClient({
          transport: custom(provider),
          account: wallet.address as `0x${string}`,
        });
        setWalletClient(walletClient);
      }
    };

    fetchData();
  }, [wallet]);

  const fetchPayload = async () => {
    if (wallet && !token) {
      const address = wallet.address;

      try {
        const payloadResponse = await getPayload(address);
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
    if (payload && !token) {
      const { uuid, message } = payload;

      try {
        const provider = await wallet.getEthereumProvider();
        const walletClient = createWalletClient({
          transport: custom(provider),
          account: wallet.address as `0x${string}`,
        });

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

  const clearPrivyData = () => {
    // Clear Privy data from localStorage
    localStorage.removeItem("privy:authenticated");
    localStorage.removeItem("privy:user");

    // Clear Privy data from cookies
    Cookies.remove("privy:authenticated");
    Cookies.remove("privy:user");
  };

  const attemptLogin = async (uuid: string, signature: string) => {
    try {
      const loginResponse = await apiLogin(uuid, signature);

      if (
        loginResponse &&
        loginResponse.status === 200 &&
        loginResponse.data.token
      ) {
        const token = loginResponse.data.token;
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
                if (ready && authenticated) {
                  clearPrivyData(); // Clear Privy data if user is already logged in
                  logout(); // Log out the user
                } else if (ready) {
                  login(); // Log in the user if not already logged in
                }
              }}
              className="text-center text-white p-3"
            >
              Connect Wallet
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
  const provider = useAuthStore((state) => state.provider);

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
