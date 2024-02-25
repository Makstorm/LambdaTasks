import TelegramBot from "node-telegram-bot-api";

import { getWeatherForecast } from "./weather-api";

interface UserState {
  state: string;
  option?: number;
}

export const setupBotListeners = (bot: TelegramBot) => {
  const chatStates: Record<number, UserState> = {};

  const setUserState = (userId: number, state: UserState): void => {
    chatStates[userId] = state;
  };

  const getUserState = (userId: number): UserState => {
    return chatStates[userId] || { state: "" };
  };

  const stateHandlers: Record<
    string,
    (msg: TelegramBot.Message) => Promise<void>
  > = {
    default: async (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, "Вітаю, оберіть необхідний функціонал:", {
        reply_markup: {
          keyboard: [[{ text: "Курс валют" }, { text: "Прогноз погоди" }]],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      });
    },

    awaiting_start: async (msg) => {
      const chatId = msg.chat.id;
      setUserState(chatId, { state: "awaiting_option" });
      bot.sendMessage(chatId, "Виберіть інтервал для відображення прогнозу:", {
        reply_markup: {
          keyboard: [[{ text: "3" }, { text: "6" }]],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      });
    },
    awaiting_option: async (msg) => {
      const chatId = msg.chat.id;
      const option = msg.text || "";
      setUserState(chatId, { state: "awaiting_city", option: +option });
      bot.sendMessage(
        chatId,
        `Ви обрали інтервал в ${option} год. Тепер, будь ласка введіть назву міста, прогноз в якому ви бажаєте отримати:`
      );
    },
    awaiting_city: async (msg) => {
      const chatId = msg.chat.id;
      const city = msg.text || "";
      const userState = getUserState(chatId);
      const option = userState.option || 3;

      bot.sendMessage(chatId, await getWeatherForecast(city, option));
      setUserState(chatId, { state: "default" });
    },
  };

  bot.onText(/\/weather/, async (msg) => {
    const chatId = msg.chat.id;
    setUserState(chatId, { state: "awaiting_start" });
    bot.sendMessage(chatId, "Давайте почнемо:", {
      reply_markup: {
        keyboard: [[{ text: "Start!!!" }]],
        one_time_keyboard: true,
        remove_keyboard: true,
        resize_keyboard: true,
      },
    });
  });

  bot.on("message", async (msg) => {
    if (!msg.text) return;

    const userState = getUserState(msg.chat.id);
    if (userState.state) {
      const handler = stateHandlers[userState.state];
      if (handler) {
        await handler(msg);
        return;
      }
    }

    if (msg.text.startsWith("/")) {
      const command = msg.text.split(" ")[0];
      switch (command) {
        case "/weather":
          break;
        default:
          bot.sendMessage(msg.chat.id, "Please use a valid command.");
          break;
      }
    }
  });
};
