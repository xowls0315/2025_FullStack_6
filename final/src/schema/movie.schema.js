import Joi from "joi";

export const movieParamsSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "id는 숫자여야 합니다.",
    "number.integer": "id는 정수여야 합니다.",
    "number.positive": "id는 양수여야 합니다.",
    "any.required": "id는 필수 항목입니다.",
  }),
});

export const movieBodySchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    "string.base": "name은 문자열이어야 합니다.",
    "string.min": "name은 최소 1자 이상이어야 합니다.",
    "string.max": "name은 최대 255자 이하이어야 합니다.",
    "any.required": "name은 필수 항목입니다.",
  }),
  rating: Joi.number().positive().min(1).max(5).required().messages({
    "number.base": "rating은 숫자여야 합니다.",
    "number.positive": "rating은 양수여야 합니다.",
    "number.min": "rating은 최소 1 이상의 값이어야 합니다.",
    "number.max": "rating은 최대 5 이하의 값이어야 합니다.",
    "any.required": "rating은 필수 항목입니다.",
  }),
}).required();
