export interface IMonobankResponseEntry {
  currencyCodeA: number;
  currencyCodeB: number;
  date: number;
  rateSell: number;
  rateBuy: number;
  rateCross: number;
}

export type IMonobankResponse = IMonobankResponseEntry[];

export interface IMonobankCache {
  timestamp: number | null;
  data: IMonobankResponse | null;
}

export interface IPrivatbankResponseEntry {
  ccy: string;
  base_ccy: string;
  buy: string;
  sale: string;
}

export type IPrivatbankResponse = IPrivatbankResponseEntry[];
