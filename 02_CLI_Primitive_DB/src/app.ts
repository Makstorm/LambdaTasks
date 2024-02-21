import inquirer from "inquirer";
import { takeSurvey } from "./utils/index.js";
import { entryCall } from "./models/surveys.js";

export const App = async () => {
  let exit = false;

  for (; !exit; ) {
    exit = await entryCall();
  }

  console.log("bye bye");
};
