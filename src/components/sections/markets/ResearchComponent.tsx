import { TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import useStore from "../../../store/useStore";
interface Market {
  name: string;
  icon: string;
}

interface ResearchComponentProps {
  searchTerm: string;
}

function ResearchComponent({ searchTerm }: ResearchComponentProps) {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [fuse, setFuse] = useState<Fuse<Market> | null>(null);
  const [defaultSecondAsset, setDefaultSecondAsset] = useState("EURUSD");
  const [activeTab, setActiveTab] = useState("all");
  const setSelectedMarket = useStore((state) => state.setSelectedMarket);

  useEffect(() => {
    const fetchMarkets = async () => {
      const response = await fetch(`/${activeTab}.json`);
      const data = await response.json();
      const fetchedMarkets = Object.keys(data).map((pair) => ({
        name: pair,
        icon: "/$.svg",
      }));
      setMarkets(fetchedMarkets);
      console.log("Fetched markets:", fetchedMarkets);

      const fuseInstance = new Fuse(fetchedMarkets, {
        keys: ["name"],
        threshold: 0.4,
        isCaseSensitive: false,
      });
      setFuse(fuseInstance);
    };

    fetchMarkets();
  }, [activeTab]);

  const getDisplayedMarkets = (): Market[] => {
    const [firstAsset, secondAsset] = searchTerm.trim().split("/");
    const secondAssetToUse = secondAsset
      ? secondAsset.toUpperCase()
      : defaultSecondAsset;

    if (firstAsset === "") {
      return markets.slice(0, 20).map((market) => ({
        ...market,
        name: `${market.name}/${secondAssetToUse}`,
      }));
    }

    const searchResults =
      fuse?.search(firstAsset).map((result) => result.item) || [];

    if (searchResults.length === 0) {
      return markets.slice(0, 20).map((market) => ({
        ...market,
        name: `${market.name}/${secondAssetToUse}`,
      }));
    }

    if (secondAsset === "") {
      const displayedMarkets = searchResults.slice(0, 1).flatMap((market) =>
        markets.slice(0, 20).map((secondMarket) => ({
          ...market,
          name: `${market.name}/${secondMarket.name}`,
        }))
      );
      return displayedMarkets.slice(0, 20);
    }

    const displayedMarkets = searchResults.slice(0, 1).flatMap((market) => {
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

    return displayedMarkets.slice(0, 20);
  };

  const displayedMarkets = getDisplayedMarkets();

  console.log("Displayed markets:", displayedMarkets);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleMarketClick = (market: Market) => {
    setSelectedMarket(market);
  };

  return (
    <div>
      <div>
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
      </div>
      {displayedMarkets.map((market, index) => (
        <TableRow
          key={`${market.name}-${index}`}
          className={`border-none cursor-pointer`}
          onClick={() => handleMarketClick(market)}
        >
          <TableCell className="pl-5">
            <div className="flex items-center space-x-3">
              <Image
                width={30}
                height={30}
                src={market.icon}
                alt={market.name}
              />
              <span>{market.name}</span>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </div>
  );
}

export default ResearchComponent;
