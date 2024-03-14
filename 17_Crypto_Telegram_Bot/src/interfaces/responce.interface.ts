export interface CurrencyData {
  currency: string;
  price: number;
}

export interface CurrenciesInfo {
  refreshRecordTime: string;
  currenciesData: CurrencyData[];
}
