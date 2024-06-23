import SectionPositions from "../SectionPositions";
import SectionOrders from "../SectionOrders";
import { Order } from "../SectionOrders";
import { Position } from "../SectionPositions";
import {
  signedWrappedOpenQuoteResponse,
  getSignedWrappedOpenQuotes,
  getSignedCloseQuotes,
  signedCloseQuoteResponse,
  getPositions,
  PositionResponse,
} from "@pionerfriends/api-client";
import { convertFromBytes32 } from "@/components/web3/utils";

export const getPositionss = async (
  chainId: number,
  token: string,
  issuerAddress: string | undefined = undefined
): Promise<Position[]> => {
  try {
    const response = await getPositions(chainId, token, {
      onlyActive: true,
      address: issuerAddress,
    });

    if (response && response.data) {
      const positions: Position[] = response.data.map(
        (position: PositionResponse) => {
          const size = (parseFloat(position.amount) / 1e18).toFixed(4);
          const entryPrice = (parseFloat(position.entryPrice) / 1e18).toFixed(
            4
          );
          const amount = (Number(size) * Number(entryPrice)).toFixed(4);
          const pnl = (parseFloat(position.mtm) / 1e18).toFixed(4);
          const estLiq = "0";
          const type = position.isAPayingAPR ? "Long" : "Short";
          const market = position.symbol;

          const entryTime = new Date(parseInt(position.openTime, 10));
          const formattedEntryTime = `${entryTime.getFullYear()}/${(
            entryTime.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}/${entryTime
            .getDate()
            .toString()
            .padStart(2, "0")} ${entryTime
            .getHours()
            .toString()
            .padStart(2, "0")}:${entryTime
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${entryTime
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;

          return {
            id: position.id,
            size: size,
            market: market,
            icon: "/$.svg",
            mark: entryPrice,
            entryPrice: entryPrice,
            pnl: pnl,
            amount: amount,
            type: type,
            estLiq: estLiq,
            entryTime: formattedEntryTime,
          };
        }
      );

      return positions;
    }
  } catch (error) {
    console.error("Error fetching positions:", error);
  }

  return [];
};
