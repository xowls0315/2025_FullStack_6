import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /posts/:postId/comments  (auth 필요)
export const createComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  const pid = Number(postId);
  if (!pid || isNaN(pid))
    return res.validationError("postId가 유효하지 않습니다.");

  const post = await prisma.posts.findUnique({ where: { id: pid } });
  if (!post) return res.notFound("게시글이 존재하지 않습니다.");

  const comment = await prisma.comments.create({
    data: {
      content,
      post_id: pid,
      user_id: req.user.id,
    },
  });

  return res.success(comment, 201);
};

// GET /posts/:postId/comments
export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  const pid = Number(postId);

  if (!pid || isNaN(pid))
    return res.validationError("postId가 유효하지 않습니다.");

  const comments = await prisma.comments.findMany({
    where: { post_id: pid },
    orderBy: { created_at: "asc" },
    include: {
      users: { select: { id: true, nickname: true } },
    },
  });

  return res.success(comments);
};

// PATCH /comments/:commentId  (작성자만)
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const id = Number(commentId);
  if (!id || isNaN(id))
    return res.validationError("commentId가 유효하지 않습니다.");

  const target = await prisma.comments.findUnique({ where: { id } });
  if (!target) return res.notFound("댓글이 존재하지 않습니다.");
  if (target.user_id !== req.user.id)
    return res.unAuthorized("댓글 수정 권한이 없습니다.");

  const updated = await prisma.comments.update({
    where: { id },
    data: { content },
  });

  return res.success(updated);
};

// DELETE /comments/:commentId  (작성자만)
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const id = Number(commentId);

  if (!id || isNaN(id))
    return res.validationError("commentId가 유효하지 않습니다.");

  const target = await prisma.comments.findUnique({ where: { id } });
  if (!target) return res.notFound("댓글이 존재하지 않습니다.");
  if (target.user_id !== req.user.id)
    return res.unAuthorized("댓글 삭제 권한이 없습니다.");

  await prisma.comments.delete({ where: { id } });

  return res.success(null);
};
