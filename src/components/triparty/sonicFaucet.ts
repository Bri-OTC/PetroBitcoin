/*import {
  createPublicClient,
  custom,
  http,
  parseEther,
  privateKeyToAccount,
  sendTransaction,
} from "viem";
import { sonic } from "viem/chains";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Sonic chain configuration
const sonicChain = custom(sonic, {
  rpcUrls: {
    public: { http: ["https://your-sonic-rpc-url"] },
    default: { http: ["https://your-sonic-rpc-url"] },
  },
});

// Create a Viem public client instance for Sonic chain
const sonicClient = createPublicClient({
  chain: sonicChain,
  transport: http(),
});

/// @dev function callable by our testnet user to get faucet tokens on sonic ( custom EVM chain )
async function sonicPIOFaucet(address: string): Promise<void> {
  try {
    // Get the FTM balance of the Sonic chain
    const ftmBalance = await sonicClient.getBalance({
      address: sonicChain.contracts.ftm.address,
    });

    if (ftmBalance.lte(parseEther("0.05"))) {
      // If FTM balance is less than or equal to 0.05, send 0.1 FTM to the specified address
      const privateKey = process.env.FAUCET_PRIVATE_KEY;
      const publicKey = process.env.FAUCET_PUBLIC_KEY;

      if (!privateKey) {
        throw new Error("Private key not found in environment variables");
      }
      if (!publicKey) {
        throw new Error("Public key not found in environment variables");
      }

      const account = privateKeyToAccount(privateKey);

      const transaction = await sendTransaction(sonicClient, {
        account,
        to: address,
        value: parseEther("0.1"),
      });

      console.log("Transaction sent:", transaction.hash);
    } else {
      throw new Error("Insufficient FTM balance in the faucet");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Example usage
const recipientAddress = "0x1234567890123456789012345678901234567890";
sonicPIOFaucet(recipientAddress)
  .then(() => console.log("Faucet transaction successful"))
  .catch((error) => console.error("Faucet transaction failed:", error));


*/
