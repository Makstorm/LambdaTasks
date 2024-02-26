import {
  IMonobankCache,
  IMonobankResponse,
  IPrivatbankResponse,
} from "../models";
import axios from "axios";

let monobankCache: IMonobankCache = {
  timestamp: null,
  data: null,
};

const fetchDataFromMonobank = async (currency: string) => {
  const currentTime = Date.now();
  const sixtySeconds = 60 * 1000;

  const currencyCode = currency === "USD" ? 840 : 978;

  if (
    monobankCache.timestamp &&
    currentTime - monobankCache.timestamp < sixtySeconds
  ) {
    return monobankCache.data.find((el) => el.currencyCodeA === currencyCode);
  } else {
    const response = await axios.get<IMonobankResponse>(
      "https://api.monobank.ua/bank/currency"
    );
    monobankCache = {
      timestamp: currentTime,
      data: response.data,
    };
    return response.data.find((el) => el.currencyCodeA === currencyCode);
  }
};

const fetchDataFromPrivatbank = async (currency: string) => {
  const response = await axios.get<IPrivatbankResponse>(
    "https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=11"
  );

  return response.data.find((el) => el.ccy === currency);
};

export const getCurrency = async (currency: string) => {
  const monobankCurrency = await fetchDataFromMonobank(currency);
  const privatbankCurrency = await fetchDataFromPrivatbank(currency);

  return `Курс UAH відносно ${currency}:
            Monobank: купівля - ${monobankCurrency.rateBuy}, продаж - ${monobankCurrency.rateSell}
            Privatbank: купівля - ${privatbankCurrency.sale}, продаж - ${privatbankCurrency.buy}`;
};
