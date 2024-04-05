"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoHomeFill } from "react-icons/go";
import { MdOutlineInsertChart } from "react-icons/md";
import { RiExchangeBoxLine } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { BiSolidWallet } from "react-icons/bi";

function Menu() {
  const pathname = usePathname();
  return (
    <div className="w-full sticky bottom-0 h-[110px] md:h-[130px]">
      <div className="w-full h-[1px] bg-border"></div>
      <div className="container bg-background">
        <h3 className="text-center text-white p-3">Account: The Pioner Guy</h3>
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
  {
    name: "Home",
    icon: <GoHomeFill />,
    link: "/",
  },
  {
    name: "Markets",
    icon: <MdOutlineInsertChart />,
    link: "/markets",
  },
  {
    name: "Trade",
    icon: <RiExchangeBoxLine />,
    link: "/trade",
  },
  {
    name: "Wallet",
    icon: <BiSolidWallet />,
    link: "/wallet",
  },
  {
    name: "User",
    icon: <IoPersonSharp />,
    link: "/user",
  },
];

export default Menu;
