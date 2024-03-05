import { CorrectariumRequestBody, Languages, MimeTypes } from "../models";

export const getPrice = (req: CorrectariumRequestBody) => {
  const signCost = req.language === Languages.ENGLISH ? 0.12 : 0.05;
  const priceModifier = req.mimetype === MimeTypes.OTHER ? 1.2 : 1;

  const cost = req.count * signCost >= 50 ? req.count * signCost : 50;

  return cost * priceModifier;
};
