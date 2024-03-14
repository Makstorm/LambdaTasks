import { myDataSource } from "./db/db";
import { UserEntity } from "./db/user.entity";
import { Telegraf, Context, Markup } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { Repository } from "typeorm";
import axios from "axios";
import { CurrenciesInfo, CurrencyData } from "./interfaces";

export class App {
  public bot: Telegraf<Context<Update>>;

  private repositiry: Repository<UserEntity>;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN);

    this.connectToDb();
    this.repositiry = myDataSource.getRepository(UserEntity);
    this.setUpBotListeners();
  }

  private setUpBotListeners() {
    this.bot.start(async (ctx) => {
      const telegramId = ctx.from.id;

      let user = await this.repositiry.findOne({ where: { telegramId } });

      if (!user) {
        user = new UserEntity();
        user.telegramId = telegramId;
        user.favorites = [];
        await this.repositiry.save(user);
      }

      ctx.reply("Welcome! Use /help to see available commands.");
    });

    this.bot.help((ctx) =>
      ctx.reply(
        "This is a Telegram bot. \nAvailable commands: \n/listRecent\n /listFavourite\n /addToFavourite {currency_symbol}\n /deleteFavourite {currency_symbol}"
      )
    );

    this.bot.command("listRecent", async (ctx) => {
      const response = await axios.get<CurrenciesInfo>(
        "http://localhost:3000/currency"
      );
      const message = this.formatUserResponse(response.data.currenciesData);

      await ctx.reply("List of recent cryptocurrencies...");

      await ctx.reply(message);
    });

    this.bot.command("addToFavourite", async (ctx) => {
      const symbol = ctx.message.text.split(" ")[1];

      if (!symbol) {
        return ctx.reply("Please specify a cryptocurrency symbol.");
      }

      const upperSymbol = symbol.toUpperCase();

      const telegramId = ctx.from.id;
      const user = await this.repositiry.findOne({ where: { telegramId } });

      if (user && !user.favorites.includes(upperSymbol)) {
        user.favorites.push(upperSymbol);
        await this.repositiry.save(user);
        ctx.reply(`${upperSymbol} added to your favorites.`);
      } else {
        ctx.reply(
          `${upperSymbol} is already in your favorites or user not found.`
        );
      }
    });

    this.bot.command("listFavourite", async (ctx) => {
      const telegramId = ctx.from.id;

      const user = await this.repositiry.findOne({ where: { telegramId } });

      if (user && user.favorites.length > 0) {
        const favoriteCodesStringArray = user.favorites.map(
          (code) => `code=${code}`
        );

        const queryString = favoriteCodesStringArray.join("&");

        const response = await axios.get<CurrenciesInfo>(
          `http://localhost:3000/currency?${queryString}`
        );

        const message = this.formatUserResponse(response.data.currenciesData);

        ctx.reply(`Your favorites:\n${message}`);
      } else {
        ctx.reply("You have no favorites yet.");
      }
    });

    this.bot.command("deleteFavourite", async (ctx) => {
      const symbol = ctx.message.text.split(" ")[1];
      if (!symbol) {
        return ctx.reply("Please specify a cryptocurrency symbol.");
      }

      const telegramId = ctx.from.id;
      const upperSymbol = symbol.toUpperCase();
      const user = await this.repositiry.findOne({ where: { telegramId } });

      if (user && user.favorites.includes(upperSymbol)) {
        user.favorites = user.favorites.filter((s) => s !== upperSymbol);
        await this.repositiry.save(user);
        ctx.reply(`${upperSymbol} removed from your favorites.`);
      } else {
        ctx.reply(`${upperSymbol} was not in your favorites.`);
      }
    });

    this.bot.hears(/\/([a-zA-Z]+)/, async (ctx) => {
      const telegramId = ctx.from.id;
      const symbol = ctx.match[1].trim().toUpperCase();

      const user = await this.repositiry.findOne({ where: { telegramId } });

      const response = await axios.get<CurrenciesInfo>(
        `http://localhost:3000/currency?code=${symbol}`
      );

      const keyboard = Markup.inlineKeyboard([
        Markup.button.callback(
          user.favorites.includes(symbol)
            ? "Remove from following"
            : "Add to following",
          `toggle_follow_${symbol}`
        ),
      ]);

      ctx.replyWithHTML(
        `<b>${symbol}</b>\nPrice: $${response.data.currenciesData[0].price}`,
        keyboard
      );
    });

    this.bot.action(/toggle_follow_(.+)/, async (ctx) => {
      const symbol = ctx.match[1];

      const telegramId = ctx.from.id;
      const upperSymbol = symbol.toUpperCase();
      const user = await this.repositiry.findOne({ where: { telegramId } });

      if (user && user.favorites.includes(upperSymbol)) {
        user.favorites = user.favorites.filter((s) => s !== upperSymbol);
        await this.repositiry.save(user);
        ctx.reply(`${upperSymbol} removed from your favorites.`);
      } else {
        user.favorites.push(upperSymbol);
        await this.repositiry.save(user);
        ctx.reply(`${upperSymbol} was added in your favorites.`);
      }
    });
  }

  public start() {
    this.bot.launch().then(() => console.log("Bot started"));
  }

  private connectToDb() {
    myDataSource
      .initialize()
      .then(() => {
        console.log("Data Source has been initialized!");
      })
      .catch((err) => {
        console.error("Error during Data Source initialization:", err);
      });
  }

  private formatUserResponse(data: CurrencyData[]) {
    const formattedCurrencies = data.slice(0, 50).map((currency) => {
      return `/${currency.currency.toUpperCase()} $${currency.price.toFixed(
        8
      )}`;
    });

    return formattedCurrencies.join("\n");
  }
}
