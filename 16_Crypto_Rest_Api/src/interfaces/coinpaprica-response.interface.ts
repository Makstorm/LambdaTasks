type CryptoInfo = {
  symbol: string;
  quotes: {
    USD: {
      price: number;
    };
  };
};

export type ICoinpaprikaResponse = CryptoInfo[];
