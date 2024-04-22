// src/app/api/prices/route.ts
import { NextResponse } from "next/server";
import { getPrices } from "@pionerfriends/api-client";

interface PriceData {
  bidPrice: string;
  askPrice: string;
}

interface PricesResponse {
  [symbol: string]: PriceData;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol1 = searchParams.get("symbol1");
  const symbol2 = searchParams.get("symbol2");
  const token = searchParams.get("token");
  const currentTabIndex = searchParams.get("currentTabIndex");
  const currentMethod = searchParams.get("currentMethod");

  if (token !== null && symbol1 !== null && symbol2 !== null) {
    const response = await getPrices([symbol1, symbol2], token);

    if (response?.data) {
      const pricesData = response.data as PricesResponse;

      const bidSymbol1 = parseFloat(pricesData[symbol1].bidPrice);
      const bidSymbol2 = parseFloat(pricesData[symbol2].bidPrice);
      const askSymbol1 = parseFloat(pricesData[symbol1].askPrice);
      const askSymbol2 = parseFloat(pricesData[symbol2].askPrice);

      const calculatedBidPrice = bidSymbol1 / bidSymbol2;
      const calculatedAskPrice = askSymbol1 / askSymbol2;

      if (currentTabIndex === "Market") {
        const spread = 0.0005; // 0.05% spread

        if (currentMethod === "Buy") {
          return NextResponse.json({
            bidPrice: calculatedAskPrice * (1 + spread),
          });
        } else {
          return NextResponse.json({
            askPrice: calculatedBidPrice * (1 - spread),
          });
        }
      } else {
        return NextResponse.json({
          bidPrice: calculatedBidPrice,
          askPrice: calculatedAskPrice,
        });
      }
    } else {
      return NextResponse.json(
        { error: "Failed to fetch prices" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
