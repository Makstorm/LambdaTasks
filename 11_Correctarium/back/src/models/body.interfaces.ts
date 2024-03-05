import { Languages, MimeTypes } from "./body.enums";

export interface CorrectariumRequestBody {
  language: Languages;
  mimetype: MimeTypes;
  count: number;
}
