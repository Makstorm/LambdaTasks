import { takeSurvey } from "../utils/take-survey.js";
import { getAllData, saveUserData, searchUsersData } from "./db-repository.js";
import { IUser } from "../models/user.interface.js";

export const findUserRequest = async () => {
  console.log(await getAllData());

  const dataBaseSearchPromt = [
    {
      type: "input",
      message: "Enter user's name you wanna find in DB",
      name: "username",
    },
  ];

  const { username } = await takeSurvey<{ username: string }>(
    dataBaseSearchPromt
  );

  console.log(await searchUsersData(username));
};

export const saveUserRequest = async (user: IUser) => {
  await saveUserData(user);
};
