import { MovieRepository } from "../repository/movie.repository.js";

// list + search
export const getMovies = async (req, res) => {
  const { name } = req.query;

  const movies = await MovieRepository.findAll(name);

  return res.success(movies);
};

// detail
export const getMovieById = async (req, res) => {
  const { id } = req.params;

  const movie = await MovieRepository.findByID(Number(id));

  if (!movie) return res.notFound();

  return res.success(movie);
};

// register
export const createMovie = async (req, res) => {
  const { name, rating } = req.body;

  const movie = await MovieRepository.findByName(name);
  if (movie) res.conflict(`${name} 영화는 이미 존재하는 영화입니다!`);

  await MovieRepository.create(name, rating);

  return res.success(null, `${name} 영화가 성공적으로 등록되었습니다.`);
};

// delete
export const deleteMovie = async (req, res) => {
  const { id } = req.params;

  const movieId = Number(id);
  if (!movieId || isNaN(movieId))
    res.validationError("id 데이터가 유효하지 않습니다.");

  const target = await MovieRepository.findByID(movieId);

  if (!target) res.notFound(`존재하지 않는 영화입니다.`);

  await MovieRepository.delete(movieId);

  return res.success(null, `${target.name} 영화가 성공적으로 삭제되었습니다.`);
};

// update
export const updateMovie = async (req, res) => {
  const { id } = req.params;
  const { name, rating } = req.body;

  const movieId = Number(id);

  const target = await MovieRepository.findByID(movieId);
  if (!target) res.notFound(`존재하지 않는 영화입니다.`);

  await MovieRepository.update(name, rating);
  return res.success(null, `${target.name} 영화가 수정되었습니다.`);
};
