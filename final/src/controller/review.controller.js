import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createReview = async (req, res) => {
  const { movieId, contents } = req.body || {};

  if (!req.body) res.validationError("body 데이터를 입력해 주세요.");
  if (!contents || !movieId)
    res.validationError("contents와 movieId를 입력해주세요");
  if (Number(movieId) < 0 || isNaN(Number(movieId)))
    res.validationError("movieId는 0 이상의 숫자여야 합니다.");

  const target = await prisma.movies.findFirst({
    where: { id: movieId },
  });
  if (!target) res.notFound("해당 영화가 존재하지 않습니다.");

  await prisma.reviews.create({
    data: {
      contents,
      movie_id: movieId,
    },
  });

  return res.success("댓글이 성공적으로 등록되었습니다.");
};

export const getReviewsById = async (req, res) => {
  const { movieId } = req.params || {};

  if (!Number(movieId) || isNaN(Number(movieId)))
    res.validationError("id 데이터가 유효하지 않습니다.");

  const reviews = await prisma.reviews.findMany({
    where: { movie_id: Number(movieId) },
  });

  if (!reviews || reviews.length === 0)
    return res.notFound("해당 영화의 댓글이 존재하지 않습니다.");

  return res.success(reviews);
};

export const deleteReview = async (req, res) => {
  const { id } = req.params || {};

  const reviewId = Number(id);
  if (!reviewId || isNaN(reviewId))
    res.validationError("id 데이터가 유효하지 않습니다.");

  const target = await prisma.reviews.findUnique({
    where: { id: reviewId },
  });

  if (!target) res.notFound(`존재하지 않는 댓글입니다.`);

  await prisma.reviews.delete({
    where: { id: reviewId },
  });

  return res.success(`${target.id}번 댓글이 성공적으로 삭제되었습니다.`);
};

export const updateReview = async (req, res) => {
  const { id } = req.params || {};
  const { contents } = req.body || {};

  const reviewId = Number(id);

  if (!reviewId || isNaN(reviewId))
    res.validationError("id 데이터가 유효하지 않습니다.");
  if (!req.body) res.validationError("body가 존재하지 않습니다.");
  if (!contents) res.validationError("contents는 필수 입력값입니다.");
  if (contents.trim().length === 0)
    res.validationError("contents는 최소 한글자 있어야 합니다.(공백제거)");

  const target = await prisma.reviews.findUnique({
    where: { id: reviewId },
  });
  if (!target) res.notFound(`존재하지 않는 댓글입니다.`);

  await prisma.reviews.update({
    where: { id: reviewId },
    data: {
      contents: contents,
    },
  });

  return res.success(`${target.id}번 댓글이 수정되었습니다.`);
};
