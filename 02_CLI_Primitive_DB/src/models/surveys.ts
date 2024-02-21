import inquirer, { QuestionCollection } from "inquirer";
import { Genders } from "./gender.enum.js";
import { takeSurvey } from "../utils/take-survey.js";
import { IUser } from "./user.interface.js";
import { findUserRequest, saveUserRequest } from "../database/db-service.js";

export const entryCall = async () => {
  const { name } = await takeSurvey<{ name: string }>(firstSurvey);

  return name.trim() !== "" ? await createUser(name) : await dataBaseCall();
};

const createUser = async (name: string): Promise<boolean> => {
  const answers = await takeSurvey<Omit<IUser, "name">>(userCreatePromt);

  const user: IUser = { name, ...answers };
  await saveUserRequest(user);
  console.log(user);
  return false;
};

const dataBaseCall = async () => {
  const { entry } = await takeSurvey<{ entry: string }>(dataBaseEntryPromt);

  if (entry === "no") return true;

  await findUserRequest();

  return false;
};

const firstSurvey = [
  {
    type: "input",
    name: "name",
    message: "Enter the user's name. To cancel press ENTER:",
  },
];

const userCreatePromt: QuestionCollection = [
  {
    type: "list",
    name: "gender",
    message: "Choose your Gender. ",
    choices: Object.values(Genders),
  },
  {
    type: "input",
    name: "age",
    message: "Enter your age. ",
    validate(value: string) {
      if (isNaN(Number(value))) {
        return "Please enter a valid age number";
      }

      return true;
    },
  },
];

const dataBaseEntryPromt = [
  {
    type: "expand",
    message: "Would you to search values in DB?",
    name: "entry",
    choices: [
      {
        key: "Y",
        name: "Yes",
        value: "yes",
      },
      {
        key: "N",
        name: "No",
        value: "no",
      },
    ],
  },
];
