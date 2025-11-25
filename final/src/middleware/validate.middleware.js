import { movieBodySchema, movieParamsSchema } from "../schema/movie.schema.js";

export const movieParamsValidator = (req, res, next) => {
  const { error } = movieParamsSchema.validate(req.params);
  if (error) return res.validationError(error.message);
  next();
};

export const movieBodyValidator = (req, res, next) => {
  const { error } = movieBodySchema.validate(req.body);
  if (error) return res.validationError(error.message);
  next();
};

export const movieParamsAndBodyValidator = (req, res, next) => {
  const { error: parmasError } = movieParamsSchema.validate(req.params);
  if (parmasError) res.validationError(parmasError.message);
  const { error: bodyError } = movieBodySchema.validate(req.body);
  if (bodyError) return res.validationError(bodyError.message);
  next();
};
