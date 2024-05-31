import { ethers } from "ethers";

/// @dev to set in the sdk
export const convertToBytes32 = (str: string): string => {
  const maxLength = 31;
  const truncatedStr = str.slice(0, maxLength);
  const bytes32 = ethers.utils.formatBytes32String(truncatedStr);
  return bytes32;
};

/// @dev to set in the sdk
export const convertFromBytes32 = (bytes32: string): string => {
  const str = ethers.utils.parseBytes32String(bytes32);
  return str;
};

/// @dev to set in the sdk
export const parseDecimalValue = (value: string): string => {
  try {
    const [integerPart, decimalPart = ""] = value.replace("n", "").split(".");
    const paddedDecimalPart = decimalPart.padEnd(18, "0").slice(0, 18);
    const wei = ethers.utils.parseUnits(
      integerPart + "." + paddedDecimalPart,
      18
    );
    return String(wei.toString());
  } catch (error) {
    console.error("Error parsing decimal value:", error);
    return "0";
  }
};

export function generateRandomNonce() {
  const randomNumber = Math.floor(Math.random() * 1000000) + 1;
  return randomNumber;
}

const prefixList = ["forex", "crypto", "nasdaq"];

export function removePrefix(market: string): string {
  const [base, quote] = market.split("/");
  const baseWithoutPrefix = prefixList.reduce(
    (acc, prefix) => acc.replace(`${prefix}.`, ""),
    base
  );
  const quoteWithoutPrefix = prefixList.reduce(
    (acc, prefix) => acc.replace(`${prefix}.`, ""),
    quote
  );
  return `${baseWithoutPrefix}/${quoteWithoutPrefix}`;
}
