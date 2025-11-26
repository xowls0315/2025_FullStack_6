import { celebrate, Segments } from "celebrate";
import { registerSchema, loginSchema } from "../schema/user.schema.js";
import { postBodySchema, postParamsSchema } from "../schema/post.schema.js";
import {
  commentBodySchema,
  commentParamsSchema,
  postIdInParamsSchema,
} from "../schema/comment.schema.js";

// Auth
export const validateRegister = celebrate({
  [Segments.BODY]: registerSchema,
});

export const validateLogin = celebrate({
  [Segments.BODY]: loginSchema,
});

// Posts
export const validatePostParams = celebrate({
  [Segments.PARAMS]: postParamsSchema,
});

export const validatePostBody = celebrate({
  [Segments.BODY]: postBodySchema,
});

export const validatePostParamsAndBody = celebrate({
  [Segments.PARAMS]: postParamsSchema,
  [Segments.BODY]: postBodySchema,
});

// Comments
export const validatePostIdInParams = celebrate({
  [Segments.PARAMS]: postIdInParamsSchema,
});

export const validateCommentParams = celebrate({
  [Segments.PARAMS]: commentParamsSchema,
});

export const validateCommentBody = celebrate({
  [Segments.BODY]: commentBodySchema,
});

export const validateCommentParamsAndBody = celebrate({
  [Segments.PARAMS]: commentParamsSchema,
  [Segments.BODY]: commentBodySchema,
});
