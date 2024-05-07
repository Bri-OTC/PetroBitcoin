import { ethers } from "ethers";

export const convertToBytes32 = (str: string): string => {
  const maxLength = 32;
  const truncatedStr = str.slice(0, maxLength);
  const bytes32 = ethers.utils.formatBytes32String(truncatedStr);
  return bytes32;
};

export const convertFromBytes32 = (bytes32: string): string => {
  const str = ethers.utils.parseBytes32String(bytes32);
  return str;
};

export const parseDecimalValue = (value: string): string => {
  const [integerPart, decimalPart = ""] = value.split(".");
  const paddedDecimalPart = decimalPart.padEnd(18, "0").slice(0, 18);
  const wei = ethers.utils.parseUnits(
    integerPart + "." + paddedDecimalPart,
    18
  );
  return String(wei.toString());
};
