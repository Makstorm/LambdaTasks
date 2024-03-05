import * as Joi from "joi";
import { Languages, MimeTypes } from "./body.enums";
import { Schema } from "joi";

export const correctariumBodySchema: Schema = Joi.object({
  language: Joi.string()
    .valid(...Object.values(Languages))
    .required(),
  mimetype: Joi.string()
    .valid(...Object.values(MimeTypes))
    .required(),
  count: Joi.number().integer().positive().required(),
});
