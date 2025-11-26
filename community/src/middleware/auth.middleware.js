import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
  const { sessionID } = req.cookies || {};

  if (!sessionID) return res.unAuthorized();

  const session = await prisma.sessions.findUnique({
    where: { session_id: sessionID },
    include: { users: true },
  });

  if (!session) return res.unAuthorized();
  if (new Date(session.expires_at) < new Date()) return res.unAuthorized();

  // 컨트롤러에서 사용하기 쉽게
  req.user = {
    id: session.users.id,
    email: session.users.email,
    nickname: session.users.nickname,
  };

  next();
};
