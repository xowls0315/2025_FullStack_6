import { Joi } from "celebrate";

export const postIdInParamsSchema = Joi.object({
  postId: Joi.number().integer().positive().required().messages({
    "number.base": "postId는 숫자여야 합니다.",
    "number.integer": "postId는 정수여야 합니다.",
    "number.positive": "postId는 양수여야 합니다.",
    "any.required": "postId는 필수 항목입니다.",
  }),
});

export const commentParamsSchema = Joi.object({
  commentId: Joi.number().integer().positive().required().messages({
    "number.base": "commentId는 숫자여야 합니다.",
    "number.integer": "commentId는 정수여야 합니다.",
    "number.positive": "commentId는 양수여야 합니다.",
    "any.required": "commentId는 필수 항목입니다.",
  }),
});

export const commentBodySchema = Joi.object({
  content: Joi.string().min(1).required().messages({
    "string.base": "content는 문자열이어야 합니다.",
    "string.min": "content는 최소 1자 이상이어야 합니다.",
    "any.required": "content는 필수 항목입니다.",
  }),
}).required();
