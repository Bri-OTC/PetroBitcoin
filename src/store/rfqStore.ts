import create from "zustand";

export interface RfqRequest {
  chainId: number;
  expiration: string;
  assetAId: string;
  assetBId: string;
  sPrice: string;
  sQuantity: string;
  sInterestRate: string;
  sIsPayingApr: boolean;
  sImA: string;
  sImB: string;
  sDfA: string;
  sDfB: string;
  sExpirationA: string;
  sExpirationB: string;
  sTimelockA: string;
  sTimelockB: string;
  lPrice: string;
  lQuantity: string;
  lInterestRate: string;
  lIsPayingApr: boolean;
  lImA: string;
  lImB: string;
  lDfA: string;
  lDfB: string;
  lExpirationA: string;
  lExpirationB: string;
  lTimelockA: string;
  lTimelockB: string;
}

interface RfqRequestStore {
  rfqRequest: RfqRequest;
  updateRfqRequest: (updatedRfqRequest: Partial<RfqRequest>) => void;
}

const initialRfqRequest: RfqRequest = {
  chainId: 64165,
  expiration: "",
  assetAId: "",
  assetBId: "",
  sPrice: "",
  sQuantity: "",
  sInterestRate: "",
  sIsPayingApr: false,
  sImA: "",
  sImB: "",
  sDfA: "",
  sDfB: "",
  sExpirationA: "",
  sExpirationB: "",
  sTimelockA: "",
  sTimelockB: "",
  lPrice: "",
  lQuantity: "",
  lInterestRate: "",
  lIsPayingApr: false,
  lImA: "",
  lImB: "",
  lDfA: "",
  lDfB: "",
  lExpirationA: "",
  lExpirationB: "",
  lTimelockA: "",
  lTimelockB: "",
};

export const useRfqRequestStore = create<RfqRequestStore>((set) => ({
  rfqRequest: initialRfqRequest,
  updateRfqRequest: (updatedRfqRequest) =>
    set((state) => ({
      rfqRequest: {
        ...state.rfqRequest,
        ...updatedRfqRequest,
      },
    })),
}));
