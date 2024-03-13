import express from "express";
import {
  Controller,
  ICoinbaseResponse,
  ICoinmarketcapResponse,
  ICoinpaprikaResponse,
  IKucoinResponse,
} from "../interfaces";
import { myDataSource } from "../db";
import { CurrenciesRequestEntity, CurrencyDataEntity } from "../entities";
import axios from "axios";
import cron from "node-cron";

export class CurrencyController implements Controller {
  public router = express.Router();
  private readonly currencyRequestRepository = myDataSource.getRepository(
    CurrenciesRequestEntity
  );
  private readonly currencyDataRepository =
    myDataSource.getRepository(CurrencyDataEntity);

  constructor() {
    this.initializeRoutes();

    // this.scheduleCronJob();
  }

  private initializeRoutes() {
    this.router.get("/", this.refreshData.bind(this));
    this.router.get("/currency", this.getCurrencyData.bind(this));
  }

  private async refreshData() {
    const currencyCodes = new Set<string>();

    const coinbaseResponse = await axios.get<ICoinbaseResponse>(
      "https://api.coinbase.com/v2/exchange-rates"
    );

    const coinbaseCurrencies = Object.entries(
      coinbaseResponse.data.data.rates
    ).map(([key, value]) => {
      const lowerCode = key.trim().toLowerCase();
      currencyCodes.add(lowerCode);
      return {
        currency: lowerCode,
        price: 1 / parseFloat(value),
      };
    });

    const kucoinResponse = await axios.get<IKucoinResponse>(
      "https://api.kucoin.com/api/v1/prices"
    );

    const kucoinCurrencies = Object.entries(kucoinResponse.data.data).map(
      ([key, value]) => {
        const lowerCode = key.trim().toLowerCase();
        currencyCodes.add(lowerCode);
        return { currency: lowerCode, price: parseFloat(value) };
      }
    );

    const coinpapricaResponse = await axios.get<ICoinpaprikaResponse>(
      "https://api.coinpaprika.com/v1/tickers"
    );

    const coinpapricaCurrencies = coinpapricaResponse.data.map((curr) => {
      const lowerCode = curr.symbol.trim().toLowerCase();
      currencyCodes.add(lowerCode);
      return {
        currency: lowerCode,
        price: curr.quotes.USD.price,
      };
    });

    const coinmarketcapResponse = await axios.get<ICoinmarketcapResponse>(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COIN_MARKER_CUP_KEY,
        },
      }
    );

    const coinmarketcapCurrencies = coinmarketcapResponse.data.data.map(
      (curr) => {
        const lowerCode = curr.symbol.trim().toLowerCase();
        currencyCodes.add(lowerCode);
        return {
          currency: lowerCode,
          price: curr.quote.USD.price,
        };
      }
    );

    const apiResponses = [
      { source: "coinbase", data: coinbaseCurrencies },
      { source: "kucoin", data: kucoinCurrencies },
      { source: "coinpaprica", data: coinpapricaCurrencies },
      { source: "coinmarketcap", data: coinmarketcapCurrencies },
    ];

    const requestEntity = new CurrenciesRequestEntity();

    const recordEntity = await this.currencyRequestRepository.save(
      requestEntity
    );

    const currensies: CurrencyDataEntity[] = [];

    for (const code of currencyCodes) {
      const entity = new CurrencyDataEntity();
      entity.code = code;
      entity.requestId = recordEntity.id;

      for (const apiResponse of apiResponses) {
        const price = this.findPriceForCurrency(code, apiResponse.data);

        switch (apiResponse.source) {
          case "coinbase":
            entity.coinbasePrice = price;
            break;
          case "kucoin":
            entity.kucoinPrice = price;
            break;
          case "coinpaprica":
            entity.coinpapricaPrice = price;
            break;
          case "coinmarketcap":
            entity.coinmarketcapPrice = price;
            break;
          default:
            break;
        }
      }

      currensies.push(entity);
    }

    await this.currencyDataRepository.save(currensies);
  }

  private findPriceForCurrency(
    currencyCode: string,
    responseData: { currency: string; price: number }[]
  ): number | null {
    const match = responseData.find((data) => data.currency === currencyCode);
    return match ? match.price : null;
  }

  private async getCurrencyData(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const code = (req.query.code as string) || null;
    const period = (req.query.period as string) || null;
    const api = (req.query.api as string) || null;

    let entities: CurrenciesRequestEntity[];

    try {
      let queryBuilder = await this.currencyRequestRepository
        .createQueryBuilder("request")
        .leftJoinAndSelect("request.curensies", "currency")
        .orderBy("request.createdAt", "DESC");

      if (period) {
        const timestamb = this.getTimeBefore(period);
        queryBuilder = queryBuilder.where(
          "request.createdAt BETWEEN :timestamb AND :now",
          {
            timestamb,
            now: new Date(),
          }
        );
      }

      if (code) {
        queryBuilder.andWhere("currency.code = :code", {
          code: code.trim().toLowerCase(),
        });
      }

      const entities = !period
        ? await queryBuilder.getOne()
        : await queryBuilder.getMany();

      if (Array.isArray(entities)) {
        res.json(
          entities.map((entity) => {
            return {
              refreshRecordTime: entity.createdAt,
              currenciesData: entity.curensies.map((curr) => {
                return {
                  currency: curr.code,
                  price: curr.getAverage(api),
                };
              }),
            };
          })
        );
      } else {
        res.json({
          refreshRecordTime: entities.createdAt,
          currenciesData: entities.curensies.map((curr) => {
            return {
              currency: curr.code,
              price: curr.getAverage(api),
            };
          }),
        });
      }

      res.json();
    } catch (error) {
      console.error("Error retrieving entities:", error);
      return res.status(500).send("Internal server error");
    }
  }

  private getTimeBefore(period: string): Date {
    const currentTime = new Date();
    switch (period) {
      case "15m":
        currentTime.setMinutes(currentTime.getMinutes() - 15);
        break;
      case "1h":
        currentTime.setHours(currentTime.getHours() - 1);
        break;
      case "4h":
        currentTime.setHours(currentTime.getHours() - 4);
        break;
      case "24h":
        currentTime.setDate(currentTime.getDate() - 1);
        break;
      default:
        throw new Error("Unsupported time period");
    }
    return currentTime;
  }

  private scheduleCronJob() {
    cron.schedule("*/5 * * * *", async () => {
      console.log("5 minuts refetch");

      await this.refreshData();
    });
  }
}
