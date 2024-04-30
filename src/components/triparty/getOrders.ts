/*import axios, { AxiosResponse } from 'axios';

export async function getSignedWrappedOpenQuotes(
  version: string,
  chainId: number,
  onlyActive: boolean | undefined = undefined,
  start: number | undefined = undefined,
  end: number | undefined = undefined,
  issuerAddress: string | undefined = undefined,
  targetAddress: string | undefined = undefined,
  token: string,
  timeout: number = 3000
): Promise<AxiosResponse<signedWrappedOpenQuoteResponse[]> | undefined> {
  return await axios.get(
    `${protocol}://${serverAddress}:${serverPort}/api/v1/get_signed_wrapped_open_quote`,
    {
      params: {
        version: version,
        chainId: chainId,
        onlyActive: onlyActive,
        start: start,
        end: end,
        issuerAddress: issuerAddress,
        targetAddress: targetAddress,
      },
      headers: {
        Authorization: token,
      },
      timeout: timeout,
    }
  );
}*/

export interface signedWrappedOpenQuoteResponse {
  issuerAddress: string;
  counterpartyAddress: string;
  version: string;
  chainId: number;
  verifyingContract: string;
  x: string;
  parity: string;
  maxConfidence: string;
  assetHex: string;
  maxDelay: string;
  precision: number;
  imA: string;
  imB: string;
  dfA: string;
  dfB: string;
  expiryA: string;
  expiryB: string;
  timeLock: string;
  nonceBoracle: number;
  signatureBoracle: string;
  isLong: boolean;
  price: string;
  amount: string;
  interestRate: string;
  isAPayingApr: boolean;
  frontEnd: string;
  affiliate: string;
  authorized: string;
  nonceOpenQuote: number;
  signatureOpenQuote: string;
  emitTime: string;
  messageState: number;
}
