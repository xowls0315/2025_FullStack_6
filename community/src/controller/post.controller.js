import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /posts  (auth 필요)
export const createPost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  const post = await prisma.posts.create({
    data: {
      title,
      content,
      author_id: userId,
    },
  });

  return res.success(post, 201);
};

// GET /posts?page=&limit=
export const getPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await prisma.posts.findMany({
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      title: true,
      author_id: true,
      created_at: true,
    },
  });

  // 🔹 Prisma 결과를 API 응답용 형태로 가공
  const data = posts.map((post) => ({
    id: post.id,
    title: post.title,
    authorId: post.author_id,
    createdAt: post.created_at,
  }));

  // 🔹 data = 배열 형태로 바로 반환
  return res.success(data);
};

// GET /posts/:postId
export const getPostById = async (req, res) => {
  const { postId } = req.params;

  const id = Number(postId);
  if (!id || isNaN(id))
    return res.validationError("postId가 유효하지 않습니다.");

  const post = await prisma.posts.findUnique({
    where: { id },
    include: {
      users: {
        select: { id: true, email: true, nickname: true },
      },
      comments: {
        orderBy: { created_at: "asc" },
        include: {
          users: { select: { id: true, nickname: true } },
        },
      },
    },
  });

  if (!post) return res.notFound("게시글이 존재하지 않습니다.");

  return res.success(post);
};

// PATCH /posts/:postId  (작성자만)
export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  const id = Number(postId);
  if (!id || isNaN(id))
    return res.validationError("postId가 유효하지 않습니다.");

  const post = await prisma.posts.findUnique({ where: { id } });
  if (!post) return res.notFound("게시글이 존재하지 않습니다.");

  if (post.author_id !== req.user.id)
    return res.unAuthorized("게시글 수정 권한이 없습니다.");

  const updated = await prisma.posts.update({
    where: { id },
    data: {
      title,
      content,
    },
  });

  return res.success(updated);
};

// DELETE /posts/:postId  (작성자만)
export const deletePost = async (req, res) => {
  const { postId } = req.params;
  const id = Number(postId);

  if (!id || isNaN(id))
    return res.validationError("postId가 유효하지 않습니다.");

  const post = await prisma.posts.findUnique({ where: { id } });
  if (!post) return res.notFound("게시글이 존재하지 않습니다.");
  if (post.author_id !== req.user.id)
    return res.unAuthorized("게시글 삭제 권한이 없습니다.");

  await prisma.posts.delete({ where: { id } });

  return res.success(null);
};
