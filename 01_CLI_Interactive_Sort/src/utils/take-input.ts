import * as readline from "readline";

export const takeInput = (question: string): Promise<string> => {
  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    input.question(question, (words: string) => {
      resolve(words);
      input.close();
    });
  });
};

// input.question(`What's your name?`, (name: string) => {
//   console.log(`Hi ${name}!`);
//   input.close();
// });
