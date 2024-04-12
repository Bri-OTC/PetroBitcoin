// ResearchComponentUI.tsx

import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { Market } from "./types";

interface ResearchComponentUIProps {
  displayedMarkets: Market[];
  activeTab: string;
  sortByPrice: boolean;
  favorites: string[];
  handleTabClick: (tab: string) => void;
  handleMarketClick: (market: Market) => void;
  toggleSortByPrice: () => void;
  toggleFavorite: (pair: string) => void;
}

function ResearchComponentUI({
  displayedMarkets,
  activeTab,
  sortByPrice,
  favorites,
  handleTabClick,
  handleMarketClick,
  toggleSortByPrice,
  toggleFavorite,
}: ResearchComponentUIProps) {
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
            <tr
              key={`${market.name}-${index}`}
              className="border-none cursor-pointer"
              onClick={() => handleMarketClick(market)}
            >
              <td className="px-4 py-2">
                <div className="flex items-center space-x-3">
                  <FaStar
                    className={`cursor-pointer ${
                      favorites.includes(market.name)
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(market.name);
                    }}
                  />
                  <Image
                    width={30}
                    height={30}
                    src={market.icon}
                    alt={market.name}
                  />
                  <span>{market.name}</span>
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

export default ResearchComponentUI;
