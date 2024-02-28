import inquirer, { Answers, QuestionCollection } from "inquirer";

export const takeSurvey = async <T extends Answers>(
  question: QuestionCollection
): Promise<T> => {
  return await inquirer.prompt<T>(question);
};
