export async function sendSignedFillOpenQuote(
  quote: SignedFillOpenQuoteRequest,
  token: string,
  timeout: number = 3000
): Promise<AxiosResponse<signedFillOpenQuoteResponse> | undefined> {
  return await axios.post(
    `${protocol}://${serverAddress}:${serverPort}/api/v1/submit_signed_fill_open_quote`,
    quote,
    {
      headers: {
        Authorization: token,
      },
      timeout: timeout,
    }
  );
}

export interface signedFillOpenQuoteResponse {
  issuerAddress: string;
  counterpartyAddress: string;
  signatureOpenQuote: string;
  version: string;
  chainId: number;
  verifyingContract: string;
  bcontractId: number;
  acceptPrice: string;
  backendAffiliate: string;
  amount: string;
  nonceAcceptQuote: number;
  signatureAcceptQuote: string;
  emitTime: string;
  messageState: number;
}
