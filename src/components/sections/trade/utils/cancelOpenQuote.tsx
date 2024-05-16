import {
  sendSignedCancelOpenQuote,
  SignedCancelOpenQuoteRequest,
} from "@pionerfriends/api-client";
import { useAuthStore } from "@/store/authStore";
import { useWalletAndProvider } from "@/components/layout/menu";
import { parseUnits } from "viem";
import {
  networks,
  contracts,
  NetworkKey,
} from "@pionerfriends/blockchain-client";
import { Order } from "@/components/sections/trade/SectionOrders";

export async function cancelOrder(order: Order) {
  const wallet = useAuthStore.getState().wallet;
  const token = useAuthStore.getState().token;

  if (!wallet || !token || !wallet.address) {
    console.error("Missing wallet, token, walletClient or wallet.address");
    return;
  }
  console.log("cancelOrder", order);

  const ethersProvider = await wallet.getEthersProvider();
  const ethersSigner = await ethersProvider.getSigner();
  console.log("ethersSigner", ethersSigner);

  const chainId = String(64165);

  const domainOpen = {
    name: "PionerV1Open",
    version: "1.0",
    chainId: 64165,
    verifyingContract: networks[chainId as NetworkKey].contracts.PionerV1Open,
  };

  const cancelSignType = {
    CancelRequestSign: [
      { name: "orderHash", type: "bytes" },
      { name: "nonce", type: "uint256" },
    ],
  };

  const cancelSignValue = {
    orderHash: order.targetHash,
    nonce: 0,
  };

  console.log("cancelSignValue", cancelSignValue);

  const signatureBoracle = await ethersSigner._signTypedData(
    domainOpen,
    cancelSignType,
    cancelSignValue
  );
  console.log("signatureBoracle", signatureBoracle);

  const quote: SignedCancelOpenQuoteRequest = {
    issuerAddress: wallet.address,
    counterpartyAddress: order.counterpartyAddress,
    version: "1.0",
    chainId: 64165,
    verifyingContract: networks[chainId as NetworkKey].contracts.PionerV1Open,
    targetHash: order.targetHash,
    nonceCancel: 0,
    signatureCancel: signatureBoracle,
    emitTime: Date.now().toString(),
    messageState: 0,
  };

  sendSignedCancelOpenQuote(quote, token);
  return true;
}
