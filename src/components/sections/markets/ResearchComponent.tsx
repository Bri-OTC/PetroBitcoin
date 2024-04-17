// ResearchComponent.tsx

import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import { useStore } from "../../../store/useStore";
import useFavorites from "./useFavorites";
import { Market } from "./types";
import { getDisplayedMarkets } from "./utils";
import ResearchComponentUI from "./ResearchComponentUI";

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
  const setSelectedMarket = useStore((state) => state.setSelectedMarket);
  const { favorites, toggleFavorite } = useFavorites(defaultSecondAsset);

  useEffect(() => {
    console.log("markets", markets);
  }, [markets]);

  const displayedMarkets = getDisplayedMarkets(
    activeTab,
    markets,
    favorites,
    searchTerm,
    defaultSecondAsset,
    fuse,
    sortByPrice
  );

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleMarketClick = (market: Market) => {
    onMarketClick(market);
    const pair = market.name;
    toggleFavorite(pair);
  };

  const toggleSortByPrice = () => {
    setSortByPrice(!sortByPrice);
  };

  return (
    <ResearchComponentUI
      displayedMarkets={displayedMarkets}
      activeTab={activeTab}
      sortByPrice={sortByPrice}
      favorites={favorites}
      handleTabClick={handleTabClick}
      handleMarketClick={handleMarketClick}
      toggleSortByPrice={toggleSortByPrice}
      toggleFavorite={toggleFavorite}
    />
  );
}

export default ResearchComponent;
