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

export function Menu() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const pathname = usePathname();
  const { wallets } = useWallets();
  const wallet = wallets[0];

  const disableLogin = !ready || authenticated;

  return (
    <div className="w-full sticky bottom-0 h-[110px] md:h-[130px]">
      <div className="w-full h-[1px] bg-border"></div>
      <div className="container bg-background flex items-center justify-center">
        {authenticated ? (
          <div className="text-center text-white p-3 flex items-center">
            <h3 className="mr-2">Account: ${wallet?.address}</h3>
            <button onClick={logout} className="text-white hover:text-gray-200">
              <FaTimes size={10} />
            </button>
          </div>
        ) : (
          <button
            disabled={disableLogin}
            onClick={login}
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
