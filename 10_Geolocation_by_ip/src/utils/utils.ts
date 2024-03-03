import * as path from "path";
import { getCSVData } from "../data";

export const ipToBigInt = (ip: string): bigint => {
  return ip
    .split(".")
    .map(
      (octet, index, array) =>
        BigInt(parseInt(octet)) *
        BigInt(256) ** BigInt(array.length - index - 1)
    )
    .reduce((acc, curr) => acc + curr);
};

export const findCountryByIp = async (
  ip: bigint
): Promise<string | undefined> => {
  const ipRanges = await getCSVData(
    path.join(__dirname, "..", "data", "IP2LOCATION-LITE-DB1.CSV")
  );

  for (const range of ipRanges) {
    if (ip >= range.from && ip <= range.to) {
      return range.country;
    }
  }
  return undefined;
};
