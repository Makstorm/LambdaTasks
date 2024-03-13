type Rates = {
  [currency: string]: string;
};

export interface IKucoinResponse {
  data: Rates;
}
