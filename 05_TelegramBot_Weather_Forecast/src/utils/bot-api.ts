import TelegramBot, { ReplyKeyboardMarkup } from "node-telegram-bot-api";

import { getWeatherForecast } from "./weather-api";
import { start } from "repl";
import { text } from "body-parser";

interface UserState {
  state: string;
  option?: number;
}

interface CustomKeyboard extends ReplyKeyboardMarkup {
  reply_markup: {
    keyboard: string[][];
    resize_keyboard: boolean;
    one_time_keyboard: boolean;
  };
}

export const setupBotListeners = (bot: TelegramBot) => {
  // const chatStates: Record<number, UserState> = {};
  // const setUserState = (userId: number, state: UserState): void => {
  //   chatStates[userId] = state;
  // };
  // const getUserState = (userId: number): UserState => {
  //   return chatStates[userId] || { state: "" };
  // };
  // const stateHandlers: Record<
  //   string,
  //   (msg: TelegramBot.Message) => Promise<void>
  // > = {
  //   start: async (msg) => {
  //     const chatId = msg.chat.id;
  //     setUserState(chatId, { state: "fork" });
  //     bot.sendMessage(chatId, "Вітаю, оберіть необхідний функціонал:", {
  //       reply_markup: {
  //         keyboard: [[{ text: "Курс валют" }, { text: "Прогноз погоди" }]],
  //         one_time_keyboard: true,
  //         resize_keyboard: true,
  //       },
  //     });
  //   },
  //   fork: async (msg) => {
  //     const chatId = msg.chat.id;
  //     if (msg.text.trim() === "Курс валют") {
  //       //something with currency
  //     } else if (msg.text.trim() === "Прогноз погоди") {
  //       await stateHandlers["weaher_start"](msg);
  //     } else {
  //       bot.sendMessage(
  //         chatId,
  //         "Нажаль, такої опції, я поки не підтримую оберіть із представлених на кнопках: "
  //       );
  //       await stateHandlers["start"](msg);
  //     }
  //   },
  //   weaher_start: async (msg) => {
  //     const chatId = msg.chat.id;
  //     setUserState(chatId, { state: "awaiting_option" });
  //     bot.sendMessage(chatId, "Виберіть інтервал для відображення прогнозу:", {
  //       reply_markup: {
  //         keyboard: [[{ text: "3" }, { text: "6" }]],
  //         one_time_keyboard: true,
  //         resize_keyboard: true,
  //       },
  //     });
  //   },
  //   awaiting_option: async (msg) => {
  //     const chatId = msg.chat.id;
  //     const option = msg.text || "";
  //     setUserState(chatId, { state: "awaiting_city", option: +option });
  //     bot.sendMessage(
  //       chatId,
  //       `Ви обрали інтервал в ${option} год. Тепер, будь ласка введіть назву міста, прогноз в якому ви бажаєте отримати:`
  //     );
  //   },
  //   awaiting_city: async (msg) => {
  //     const chatId = msg.chat.id;
  //     const city = msg.text || "";
  //     const userState = getUserState(chatId);
  //     const option = userState.option || 3;
  //     bot.sendMessage(chatId, await getWeatherForecast(city, option));
  //     setUserState(chatId, { state: "start" });
  //     // await stateHandlers["start"](msg);
  //   },
  // };
  // bot.onText(/\/weather/, async (msg) => {
  //   await stateHandlers["weaher_start"](msg);
  // });
  // bot.onText(/\/start/, async (msg) => {
  //   await stateHandlers["start"](msg);
  // });
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
      keyboard: [[{ text: "Feature 1" }, { text: "Feature 2" }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  const feature1Keyboard = {
    reply_markup: {
      keyboard: [
        [{ text: "Option 1 - F2" }, { text: "Option 2 - F2" }],
        [{ text: "Back to Menu" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  const feature2Keyboard = {
    reply_markup: {
      keyboard: [
        [{ text: "Option 1 - F2" }, { text: "Option 2 - F2" }],
        [{ text: "Back to Menu" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Main Menu", mainMenuKeyboard);
  });

  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || "";

    switch (text) {
      case "Feature 1":
        bot.sendMessage(chatId, "Feature 1 Options", feature1Keyboard);
        break;
      case "Feature 2":
        bot.sendMessage(chatId, "Feature 2 Options", feature2Keyboard);
        break;
      case "Option 1 - F1":
      case "Option 1 - F2":
      case "Option 2 - F1":
      case "Option 2 - F2":
        bot.sendMessage(chatId, `You selected ${text}`);
        break;
      case "Back to Menu":
        bot.sendMessage(chatId, "Main Menu", mainMenuKeyboard);
        break;
      default:
        // Handling unknown command or navigating back to the main menu
        bot.sendMessage(
          chatId,
          "Please use a valid command.",
          mainMenuKeyboard
        );
        break;
    }
  });
};
