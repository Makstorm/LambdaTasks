import TelegramBot from "node-telegram-bot-api";
import { setupBotListeners } from "./utils";
import { program } from "commander";

export const App = async () => {
  const token = "6954166288:AAEYiUIf1bWOj810VOamdIPimLdochakmQU";
  const bot = new TelegramBot(token, { polling: true });
  const userIds = setupBotListeners(bot);

  program
    .name("lambda-sende")
    .description("CLI to some use telegram bot message sending")
    .version("0.1.0");

  program
    .command("send-meaasge")
    .alias("m")
    .alias("message")
    // .command("message")
    .description("Send message via tg bot")
    .argument("<string>", "message string")
    .action(async (str) => {
      await bot.sendMessage(5726200132, str);
      process.exit();
    });

  program
    .command("send-photo")
    .alias("p")
    .alias("photo")
    .description("Send photo via tg bot")
    .argument("<path>", "path to your photofile")
    .action(async (str) => {
      await bot.sendPhoto(5726200132, str);
      process.exit();
    });

  program.parse();
};
