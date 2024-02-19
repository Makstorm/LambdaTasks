import { sortingOptions } from "./sorting-options";
import { takeInput } from "./take-input";

export const listenOption = async (words: string[]): Promise<boolean> => {
  while (true) {
    const answer = await takeInput(
      "How would you like to sort values:\n1) Sort by name (from A to Z)\n2) Show digits from smallest\n3) Show digits from biggest\n4) Words by quantity of letters\n5) Only unique words\n\nSelect (1 - 5) and press ENTER: "
    );

    if (answer.toLowerCase() === "exit") {
      console.log("Exiting the app.");
      return true;
    }

    const inputNum = parseInt(answer);

    if (isNaN(inputNum) || inputNum < 1 || inputNum > 5) {
      console.log("Must be a digit between 1 and 5\n");
      continue;
    }

    const optionIndex = inputNum - 1;

    console.log(sortingOptions[optionIndex].execute(words));

    return false;
  }
};
