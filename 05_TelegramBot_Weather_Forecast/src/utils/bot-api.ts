import TelegramBot from "node-telegram-bot-api";
import { getWeatherForecast } from "./weather-api";
import { getCurrency } from "./currency-api";

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
    (msg: TelegramBot.Message, option?: number) => Promise<void>
  > = {
    awaiting_option: async (msg, option) => {
      const chatId = msg.chat.id;

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
      setUserState(chatId, { state: "" });
    },
  };

  const mainMenuKeyboard = {
    reply_markup: {
      keyboard: [[{ text: "/Курс валют" }, { text: "/Погода" }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  const currencyOptions = {
    reply_markup: {
      keyboard: [
        [{ text: "USD" }, { text: "EUR" }],
        [{ text: "Попереднє меню" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  const weatherForecastOptions = {
    reply_markup: {
      keyboard: [
        [{ text: "Кожні 3 години" }, { text: "Кожні 6 годин" }],
        [{ text: "Попереднє меню" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Меню", mainMenuKeyboard);
  });

  bot.onText(/\/Погода/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      "Оберіть інтервал в якому показати прогноз:",
      weatherForecastOptions
    );
  });

  bot.onText(/\/Курс валют/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      "Оберіть валюту, курс якої бажаєте дізнатись",
      currencyOptions
    );
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || "";

    if (!msg.text) return;
    const userState = getUserState(msg.chat.id);
    if (userState.state) {
      const handler = stateHandlers[userState.state];
      if (handler) {
        await handler(msg);
        bot.sendMessage(chatId, "Оберіть опцію...", mainMenuKeyboard);
        return;
      }
    }

    switch (text) {
      case "/start":
        break;
      case "/Погода":
        break;
      case "/Курс валют":
        bot.sendMessage(chatId, "Оберіть валюту", currencyOptions);
        break;
      case "USD": {
        bot.sendMessage(chatId, await getCurrency(msg.text), mainMenuKeyboard);
        break;
      }
      case "EUR": {
        bot.sendMessage(chatId, await getCurrency(msg.text), mainMenuKeyboard);
        break;
      }

      case "Кожні 3 години":
        await stateHandlers["awaiting_option"](msg, 3);
        break;
      case "Кожні 6 годин":
        await stateHandlers["awaiting_option"](msg, 6);
        break;
      case "Попереднє меню":
        bot.sendMessage(chatId, "Меню", mainMenuKeyboard);
        break;
      default:
        bot.sendMessage(
          chatId,
          "Будь ласка введіть валідні команди.",
          mainMenuKeyboard
        );
        break;
    }
  });
};
