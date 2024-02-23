import TelegramBot from "node-telegram-bot-api";
import { setupBotListeners } from "./utils";

export const App = () => {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY as string, {
    polling: true,
  });
  setupBotListeners(bot);
};
