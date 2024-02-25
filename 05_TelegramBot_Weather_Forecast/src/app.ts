import TelegramBot from "node-telegram-bot-api";
import { setupBotListeners } from "./utils";

export const App = () => {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY as string);

  const { APP_URI } = process.env;

  bot.setWebHook(`${APP_URI}/webhook`);

  setupBotListeners(bot);

  return bot;
};
