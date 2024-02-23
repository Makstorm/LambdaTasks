import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import { arrayBuffer } from "stream/consumers";

export const setupBotListeners = (bot: TelegramBot) => {
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    if (msg.text.match(/photo/)) {
      return;
    }

    console.log(`Пользователь ${msg.from.first_name} написал: ${msg.text}`);

    bot.sendMessage(chatId, `Ви написали: "${msg.text}"`);
  });

  bot.onText(/photo/, async (msg) => {
    const chatId = msg.chat.id;

    const response = await axios.get(process.env.PICSUM_URI, {
      responseType: "arraybuffer",
    });

    console.log(`Пользователь ${msg.from?.first_name} написал: ${msg.text}`);

    bot.sendPhoto(chatId, response.data);
  });
};
