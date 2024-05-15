import { getPrices } from "@pionerfriends/api-client";
import { getProxyTicker } from "./configReader";

async function calculatePairPrices(
  pairs: string[],
  token: string | null
): Promise<{ [pair: string]: { bid: number; ask: number } } | undefined> {
  const assetIds = new Set<string>();
  const pairPrices: { [pair: string]: { bid: number; ask: number } } = {};

  try {
    // Collect unique asset IDs from the pairs
    for (const pair of pairs) {
      let [assetAId, assetBId] = pair.split("/");
      let proxyAId = assetAId;
      let proxyBId = assetBId;

      if (assetAId !== undefined) {
        const tempProxyAId = await getProxyTicker(assetAId);
        if (tempProxyAId) {
          proxyAId = tempProxyAId;
        }
      }

      if (assetBId !== undefined) {
        const tempProxyBId = await getProxyTicker(assetBId);
        if (tempProxyBId) {
          proxyBId = tempProxyBId;
        }
      }

      assetIds.add(proxyAId);
      assetIds.add(proxyBId);
    }

    // Check if token is null
    if (token === null) {
      throw new Error("Token is null");
    }

    // Retrieve prices for all unique asset IDs
    const prices = await getPrices(Array.from(assetIds), token);

    console.log(prices);

    // Check if prices is defined
    if (prices && prices.data) {
      // Calculate bid and ask prices for each pair
      for (const pair of pairs) {
        const [assetAId, assetBId] = pair.split("/");
        const proxyAId = await getProxyTicker(assetAId);
        const proxyBId = await getProxyTicker(assetBId);

        if (
          proxyAId &&
          proxyBId &&
          prices.data[proxyAId] &&
          prices.data[proxyBId]
        ) {
          const bidA = Number(prices.data[proxyAId]["bidPrice"] || 0);
          const bidB = Number(prices.data[proxyBId]["bidPrice"] || 0);
          const askA = Number(prices.data[proxyAId]["askPrice"] || 0);
          const askB = Number(prices.data[proxyBId]["askPrice"] || 0);
          const bid = bidB !== 0 ? bidA / bidB : 0;
          const ask = askB !== 0 ? askA / askB : 0;
          pairPrices[pair] = { bid, ask };
        } else {
          pairPrices[pair] = { bid: 0, ask: 0 };
        }
      }
    } else {
      throw new Error("Unable to retrieve prices");
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }

  return pairPrices;
}

export { calculatePairPrices };
