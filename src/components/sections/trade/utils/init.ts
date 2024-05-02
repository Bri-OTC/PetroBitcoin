/*
// init
    init db with events
    PionerV1.mintTestNet(1e36):
    set MM address
    init MT5 connection
    login to API ?
    config fill 
    max leverage
    */
import {
  networks,
  FakeUSD,
  PionerV1Compliance,
} from "@pionerfriends/blockchain-client";

import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";
import { defineChain, Address, createPublicClient } from "viem";
import { avalancheFuji } from "viem/chains";

const fantomSonicTestnet = defineChain({
  id: 64165,
  name: "Fantom Sonic Testnet",
  network: "fantom-sonic-testnet",
  nativeCurrency: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.sonic.fantom.network/"] },
    public: { http: ["https://rpc.sonic.fantom.network/"] },
  },
});

const chains = { 64165: fantomSonicTestnet, 64156: avalancheFuji };
const chainName = { 64165: "sonic", 64156: "fuji" };
interface ChainContracts {
  [chainId: number]: string;
}

const fakeUSDContract: ChainContracts = {
  64165: networks.sonic.contracts.FakeUSD,
  64156: networks.fuji.contracts.FakeUSD,
};
const pionerV1Contract: ChainContracts = {
  64165: networks.sonic.contracts.PionerV1,
  64156: networks.fuji.contracts.PionerV1,
};
const pionerV1ComplianceContract: ChainContracts = {
  64165: networks.sonic.contracts.PionerV1Compliance,
  64156: networks.fuji.contracts.PionerV1Compliance,
};
const pionerV1OpenContract: ChainContracts = {
  64165: networks.sonic.contracts.PionerV1Open,
  64156: networks.fuji.contracts.PionerV1Open,
};
const pionerV1CloseContract: ChainContracts = {
  64165: networks.sonic.contracts.PionerV1Close,
  64156: networks.fuji.contracts.PionerV1Close,
};
const pionerV1DefaultContract: ChainContracts = {
  64165: networks.sonic.contracts.PionerV1Default,
  64156: networks.fuji.contracts.PionerV1Default,
};
const pionerV1WrapperContract: ChainContracts = {
  64165: networks.sonic.contracts.PionerV1Wrapper,
  64156: networks.fuji.contracts.PionerV1Wrapper,
};

const account0 = privateKeyToAccount(
  "0xceed6376f9371cd316329c401d99ddcd3b1e3ab0792d4275ff18f6589a2e24af" as Address
);

const web3Client = createPublicClient({
  chain: fantomSonicTestnet,
  transport: http(),
});

const accounts = [account0];

const wallet0 = createWalletClient({
  account:
    "0xceed6376f9371cd316329c401d99ddcd3b1e3ab0792d4275ff18f6589a2e24af" as Address,
  chain: fantomSonicTestnet,
  transport: http(),
});

const wallets = [wallet0];

export {
  fakeUSDContract,
  pionerV1ComplianceContract,
  pionerV1Contract,
  pionerV1OpenContract,
  pionerV1CloseContract,
  pionerV1DefaultContract,
  pionerV1WrapperContract,
  chains,
  chainName,
  accounts,
  wallets,
  web3Client,
  fantomSonicTestnet,
};
