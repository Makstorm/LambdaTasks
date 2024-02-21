import { Genders } from "./gender.enum.js";

export interface IUser {
  name: string;
  age: number;
  gender: Genders;
}
