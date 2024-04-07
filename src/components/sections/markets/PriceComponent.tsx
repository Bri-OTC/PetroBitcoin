// components/sections/markets/PriceComponent.tsx

import { TableCell, TableRow } from "@/components/ui/table";
import { addCommas } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Market {
  name: string;
  icon: string;
}

interface PriceComponentProps {
  market: Market;
  onClose: () => void;
}

function PriceComponent({ market, onClose }: PriceComponentProps) {
  const [price, setPrice] = useState(0);
  const [dailyChange, setDailyChange] = useState(0);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const fetchPrice = () => {
      setPrice(Math.random() * 10000);
      setDailyChange(Math.random() * 10 - 5);
      setVolume(Math.floor(Math.random() * 1000000000));
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow">
        <h2 className="text-2xl mb-4">{market.name}</h2>
        <TableRow>
          <TableCell>Price</TableCell>
          <TableCell>{price.toFixed(2)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Daily Change</TableCell>
          <TableCell
            className={`${dailyChange > 0 ? "text-green-400" : "text-red-400"}`}
          >
            {dailyChange.toFixed(2)}%
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Volume</TableCell>
          <TableCell>US${addCommas(volume)}</TableCell>
        </TableRow>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PriceComponent;
