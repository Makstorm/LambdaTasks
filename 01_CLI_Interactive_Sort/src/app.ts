import { listenOption, takeInput } from "./utils";

export const App = async () => {
  let exit = false;

  for (; !exit; ) {
    //
    const words = await takeInput(
      "Hello! Enter 10 words or digits dividing them in spaces: "
    );

    if (words === "exit") {
      exit = true;
    }

    if (words.split(" ").length < 10) {
      console.log("There must be 10 words or digits");
      continue;
    } else if (words.split(" ").length > 10) {
      console.log("To many words or digits");
      continue;
    }

    exit = await listenOption(words.split(" "));
  }

  console.log("bie bie");
};
