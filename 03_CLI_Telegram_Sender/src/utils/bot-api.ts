import TelegramBot from "node-telegram-bot-api";

export const setupBotListeners = (bot: TelegramBot) => {
  const userIds: Set<number> = new Set();

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    if (!userIds.has(chatId)) {
      userIds.add(chatId);
    }

    console.log(chatId);

    bot.sendMessage(chatId, "Hello! Your were subscribed for sending.");
  });

  return userIds;
};
