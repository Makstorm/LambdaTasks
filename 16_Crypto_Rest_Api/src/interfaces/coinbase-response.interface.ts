type Rates = {
  [currency: string]: string;
};

export interface ICoinbaseResponse {
  data: {
    rates: Rates;
  };
}
