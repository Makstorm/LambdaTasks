import TelegramBot, { ReplyKeyboardMarkup } from "node-telegram-bot-api";

import { getWeatherForecast } from "./weather-api";
import { start } from "repl";
import { text } from "body-parser";

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

  // bot.on("message", async (msg) => {
  //   if (!msg.text) return;
  //   const userState = getUserState(msg.chat.id);
  //   if (userState.state) {
  //     const handler = stateHandlers[userState.state];
  //     if (handler) {
  //       await handler(msg);
  //       return;
  //     }
  //   }
  //   if (msg.text.startsWith("/")) {
  //     const command = msg.text.split(" ")[0];
  //     switch (command) {
  //       case "/start":
  //       case "/weather":
  //         break;
  //       default:
  //         bot.sendMessage(msg.chat.id, "Please use a valid command.");
  //         break;
  //     }
  //   }
  // });

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
    bot.sendMessage(chatId, "Main Menu", mainMenuKeyboard);
  });

  bot.onText(/\/Погода/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Main Menu", weatherForecastOptions);
  });

  bot.onText(/\/Курс валют/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Main Menu", currencyOptions);
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || "";

    switch (text) {
      case "/Погода":
        break;
      case "/Курс валют":
        break;
      case "USD": {
        break;
      }
      case "EUR": {
        break;
      }

      case "Кожні 3 години":
        await stateHandlers["awaiting_option"](msg, 3);
        break;
      case "Кожні 6 годин":
        await stateHandlers["awaiting_option"](msg, 6);
        break;
      case "Попереднє меню":
        bot.sendMessage(chatId, "Main Menu", mainMenuKeyboard);
        break;
      default:
        bot.(
          chatId,
          "Please use a valid command.",
          mainMenuKeyboard
        );
        break;
    }
  });
};
