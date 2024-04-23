import { TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import { useTradeStore } from "@/store/tradeStore";
import { FaStar } from "react-icons/fa";
import useFavorites from "./useFavorites";
import Link from "next/link";

interface Market {
  name: string;
  icon: string;
  price: number;
}

interface ResearchComponentProps {
  searchTerm: string;
  onMarketClick: (market: Market) => void;
  selectedMarket: Market | null;
}

function ResearchComponent({
  searchTerm,
  onMarketClick,
  selectedMarket,
}: ResearchComponentProps) {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [fuse, setFuse] = useState<Fuse<Market> | null>(null);
  const [defaultSecondAsset, setDefaultSecondAsset] = useState("EURUSD");
  const [activeTab, setActiveTab] = useState("all");
  const [sortByPrice, setSortByPrice] = useState(false);

  const setSelectedMarket = useTradeStore((state) => state.setSymbol);
  const { favorites, toggleFavorite } = useFavorites(defaultSecondAsset);
  const menuUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/markets"
      : "https://testnet.pio.finance/markets";

  useEffect(() => {
    const fetchMarkets = async () => {
      if (activeTab !== "favorites") {
        const response = await fetch(`/${activeTab}.json`);
        const data = await response.json();
        const fetchedMarkets = Object.keys(data).map((pair) => ({
          name: pair,
          icon: "/$.svg",
          price: 0,
        }));
        setMarkets(fetchedMarkets);
        console.log("Fetched markets:", fetchedMarkets);

        const fuseInstance = new Fuse(fetchedMarkets, {
          keys: ["name"],
          threshold: 0.4,
          isCaseSensitive: false,
        });
        setFuse(fuseInstance);
      } else {
        setMarkets([]);
      }
    };

    fetchMarkets();
  }, [activeTab]);

  useEffect(() => {
    const updatePrices = () => {
      const updatedMarkets = markets.map((market) => ({
        ...market,
        price: Math.random() * 10000,
      }));
      setMarkets(updatedMarkets);
    };

    const interval = setInterval(updatePrices, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [markets]);

  const getDisplayedMarkets = (): Market[] => {
    let displayedMarkets: Market[] = [];

    if (activeTab === "favorites") {
      displayedMarkets = favorites.map((fav) => {
        const [firstAsset, secondAsset] = fav.split("/");
        return {
          name: fav,
          icon: "/$.svg",
          price: Math.random() * 10000,
        };
      });
    } else {
      const [firstAsset, secondAsset] = searchTerm.trim().split("/");
      const secondAssetToUse = secondAsset
        ? secondAsset.toUpperCase()
        : defaultSecondAsset;

      if (searchTerm.trim() === "") {
        displayedMarkets = markets.slice(0, 20).map((market) => ({
          ...market,
          name: `${market.name}/${secondAssetToUse}`,
        }));
      } else {
        const searchResults =
          fuse?.search(firstAsset).map((result) => result.item) || [];

        if (searchResults.length === 0) {
          displayedMarkets = markets.slice(0, 20).map((market) => ({
            ...market,
            name: `${market.name}/${secondAssetToUse}`,
          }));
        } else if (secondAsset === "") {
          displayedMarkets = searchResults.slice(0, 1).flatMap((market) =>
            markets.slice(0, 20).map((secondMarket) => ({
              ...market,
              name: `${market.name}/${secondMarket.name}`,
            }))
          );
        } else {
          displayedMarkets = searchResults.slice(0, 1).flatMap((market) => {
            const secondMarketSearchResults =
              fuse?.search(secondAssetToUse).map((result) => result.item) || [];
            const secondMarkets =
              secondMarketSearchResults.length > 0
                ? secondMarketSearchResults
                : markets;
            return secondMarkets.slice(0, 20).map((secondMarket) => ({
              ...market,
              name: `${market.name}/${secondMarket.name}`,
            }));
          });
        }
      }
    }

    if (sortByPrice) {
      displayedMarkets.sort((a, b) => b.price - a.price);
    }

    return displayedMarkets.slice(0, 20);
  };

  const displayedMarkets = getDisplayedMarkets();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleMarketClick = (market: Market) => {
    setSelectedMarket(market);
  };

  const toggleSortByPrice = () => {
    setSortByPrice(!sortByPrice);
  };

  return (
    <div className="w-full">
      <div className="flex space-x-4 mb-4">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => handleTabClick("all")}
        >
          All
        </button>
        <button
          className={`tab ${activeTab === "forex" ? "active" : ""}`}
          onClick={() => handleTabClick("forex")}
        >
          Forex
        </button>
        <button
          className={`tab ${activeTab === "nasdaq" ? "active" : ""}`}
          onClick={() => handleTabClick("nasdaq")}
        >
          Nasdaq
        </button>
        <button
          className={`tab ${activeTab === "nyse" ? "active" : ""}`}
          onClick={() => handleTabClick("nyse")}
        >
          NYSE
        </button>
        <button
          className={`tab ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => handleTabClick("favorites")}
        >
          Favorites
        </button>
        <button
          className={`tab ${sortByPrice ? "active" : ""}`}
          onClick={toggleSortByPrice}
        >
          Sort by Price
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Pair</th>
            <th className="px-4 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {displayedMarkets.map((market, index) => (
            <tr key={`${market.name}-${index}`} className="border-none">
              <td className="px-4 py-2">
                <div className="flex items-center space-x-3">
                  <FaStar
                    className={`cursor-pointer ${
                      favorites.includes(market.name)
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                    onClick={() => toggleFavorite(market.name)}
                  />
                  <Image
                    width={30}
                    height={30}
                    src={market.icon}
                    alt={market.name}
                  />
                  <Link href="/trade" onClick={() => handleMarketClick(market)}>
                    <span className="cursor-pointer">{market.name}</span>
                  </Link>
                </div>
              </td>
              <td className="px-4 py-2">{market.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResearchComponent;
