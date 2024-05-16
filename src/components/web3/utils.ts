import { ethers } from "ethers";

export const convertToBytes32 = (str: string): string => {
  const maxLength = 32;
  const truncatedStr = str.slice(0, maxLength);
  const paddedStr = truncatedStr.padEnd(32, "\0");
  const hex = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(paddedStr));
  return hex;
};
export const convertFromBytes32 = (bytes32: string): string => {
  const str = ethers.utils.parseBytes32String(bytes32);
  return str;
};

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
