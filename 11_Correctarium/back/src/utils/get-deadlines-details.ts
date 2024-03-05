import { CorrectariumRequestBody, Languages, MimeTypes } from "../models";
import { calculateDeadline } from "./calculate-deadline";

export const getDeadlineDetails = (req: CorrectariumRequestBody) => {
  const signsSpeedPerHour = req.language === Languages.ENGLISH ? 333 : 1333;
  const timeModifier = req.mimetype === MimeTypes.OTHER ? 1.2 : 1;

  const workTime =
    30 + (req.count * 60) / signsSpeedPerHour >= 60
      ? (30 + (req.count * 60) / signsSpeedPerHour) * timeModifier
      : 60 * timeModifier;

  console.log("task minutes", Math.ceil(workTime));

  const deadline = calculateDeadline(Math.ceil(workTime));

  return {
    time: workTime / 60,
    deadline: Math.floor(deadline.getTime() / 1000),
    daadlineDay: deadline.toLocaleString(),
  };
};
