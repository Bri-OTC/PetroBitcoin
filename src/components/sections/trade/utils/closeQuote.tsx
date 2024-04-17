import { sendSignedCloseQuote } from "@pionerfriends/api-client";
import { useAuthStore } from "@/store/authStore";
import { useWalletAndProvider } from "@/components/layout/menu";
import { parseUnits } from "viem";
import { networks } from "@pionerfriends/blockchain-client";
