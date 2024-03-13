import { cleanEnv, str, num } from "envalid";

export const validateEnv = () => {
  cleanEnv(process.env, {
    DB_HOST: str(),
    DB_PORT: num(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
  });
};
