import { Joi } from "celebrate";

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "유효한 이메일 형식이 아닙니다.",
    "any.required": "email은 필수 항목입니다.",
  }),
  password: Joi.string().min(4).max(255).required().messages({
    "string.min": "password는 최소 4자 이상이어야 합니다.",
    "any.required": "password는 필수 항목입니다.",
  }),
  nickname: Joi.string().min(1).max(100).required().messages({
    "any.required": "nickname은 필수 항목입니다.",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "유효한 이메일 형식이 아닙니다.",
    "any.required": "email은 필수 항목입니다.",
  }),
  password: Joi.string().min(4).max(255).required().messages({
    "any.required": "password는 필수 항목입니다.",
  }),
});
