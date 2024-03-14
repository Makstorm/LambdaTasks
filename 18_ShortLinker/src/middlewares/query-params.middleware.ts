import { NextFunction, Request, Response } from "express";

export const checkQueryParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requiredParams: string[] = ["login"];

  for (const param of requiredParams) {
    const value = req.query[param];

    if (value === undefined) {
      return next(new Error(`Missing query parameter: ${param}`));
    }
  }

  next();
};
