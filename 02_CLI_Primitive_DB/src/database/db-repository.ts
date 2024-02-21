import { IUser } from "../models/user.interface.js";
import { fileURLToPath } from "url";
import { constants, promises as fs } from "fs";
import * as path from "path";

export const getAllData = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(__filename);
    const filePath = path.join(dirname, "db.txt");
    await checkOrCreateFile(filePath);

    const rawData = await fs.readFile(filePath, "utf8");

    const data = JSON.parse(rawData) as IUser[];

    return data;
  } catch (error) {
    console.error("Сталася помилка при читанні даних:", error);
    throw error;
  }
};

export const searchUsersData = async (username: string) => {
  const data = await getAllData();

  const nameToLowerCase = username.toLowerCase();
  return data.filter((user) =>
    user.name.toLowerCase().includes(nameToLowerCase)
  );
};

export const saveUserData = async (user: IUser) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(__filename);
    const data = await getAllData();
    data.push(user);

    const filePath = path.join(dirname, "db.txt");
    await checkOrCreateFile(filePath);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Сталась помилка при зберіганні:", error);
    throw error;
  }
};

const checkOrCreateFile = async (filePath: string): Promise<void> => {
  try {
    await fs.access(filePath, constants.F_OK);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(filePath, "[]");
    } else {
      console.error("Сталась помилка:", error);
      throw error;
    }
  }
};
