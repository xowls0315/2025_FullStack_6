import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// list + search
export const getMovies = async (req, res) => {
  const { name } = req.query;

  const movies = await prisma.movies.findMany({
    where: {
      name: {
        contains: name,
      },
    },
  });

  return res.success(movies);
};

// detail
export const getMovieById = async (req, res) => {
  const { id } = req.params || {};

  if (!id || isNaN(Number(id)))
    res.validationError("id 데이터가 유효하지 않습니다.");

  const movie = await prisma.movies.findUnique({
    where: { id: Number(id) },
  });

  if (!movie) return res.notFound();

  return res.success(movie);
};

// register
export const createMovie = async (req, res) => {
  const { name, rating } = req.body || {};

  if (!req.body) res.validationError("요청 바디가 존재하지 않습니다.");
  if (!name || rating === undefined)
    res.validationError(`name 또는 rating 필수로 입력해야 합니다!`);
  if (name.length <= 0 || name.length > 255)
    res.validationError("name은 1~255자 이내로 입력해야 합니다!");

  const ratingValue = Number(rating);
  if (ratingValue < 1 || ratingValue > 5 || isNaN(ratingValue))
    res.validationError("rating은 1~5의 실수로 입력해야 합니다!");

  const movie = await prisma.movies.findFirst({
    where: { name },
  });
  if (movie) res.conflict(`${name} 영화는 이미 존재하는 영화입니다!`);

  await prisma.movies.create({
    data: { name, rating: ratingValue },
  });

  return res.success(null, `${name} 영화가 성공적으로 등록되었습니다.`, 201);
};

// delete
export const deleteMovie = async (req, res) => {
  const { id } = req.params || {};

  const movieId = Number(id);
  if (!movieId || isNaN(movieId))
    res.validationError("id 데이터가 유효하지 않습니다.");

  const target = await prisma.movies.findUnique({
    where: { id: movieId },
  });

  if (!target) res.notFound(`존재하지 않는 영화입니다.`);

  await prisma.movies.delete({
    where: { id: movieId },
  });

  return res.success(null, `${target.name} 영화가 성공적으로 삭제되었습니다.`);
};

// update
export const updateMovie = async (req, res) => {
  const { id } = req.params || {};
  const { name, rating } = req.body || {};

  const movieId = Number(id);

  if (!movieId || isNaN(movieId))
    res.validationError("id 데이터가 유효하지 않습니다.");
  if (name && (name.length <= 0 || name.length > 255))
    res.validationError("name은 1~255자 이내로 입력해야 합니다!");
  if (rating && (rating < 1 || rating > 5 || isNaN(Number(rating))))
    res.validationError("rating은 1~5의 실수로 입력해야 합니다!");

  const target = await prisma.movies.findUnique({
    where: { id: movieId },
  });
  if (!target) res.notFound(`존재하지 않는 영화입니다.`);

  await prisma.movies.update({
    where: { id: movieId },
    data: {
      name: name || target.name,
      rating: rating || target.rating,
    },
  });

  return res.success(null, `${target.name} 영화가 수정되었습니다.`);
};
