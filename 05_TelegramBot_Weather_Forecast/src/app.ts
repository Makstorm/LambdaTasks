import TelegramBot from "node-telegram-bot-api";
import { setupBotListeners } from "./utils";

export const App = () => {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY as string, {
    polling: true,
  });

  const { APP_URI, TELEGRAM_BOT_KEY } = process.env;

  bot.setWebHook(`${APP_URI}/bot${TELEGRAM_BOT_KEY}`);
  setupBotListeners(bot);

  return bot;
};
