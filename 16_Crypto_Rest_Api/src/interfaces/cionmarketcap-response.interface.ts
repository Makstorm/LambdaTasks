interface Cryptocurrency {
  symbol: string;

  quote: {
    USD: {
      price: number;
    };
  };
}

export interface ICoinmarketcapResponse {
  data: Cryptocurrency[];
}
