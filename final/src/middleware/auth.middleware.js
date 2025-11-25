import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
  const { sessionID } = req.cookies || {};
  if (!sessionID) return res.unAuthorized();

  const session = await prisma.sessions.findUnique({
    where: { id: sessionID },
  });
  if (!session) return res.unAuthorized();
  if (new Date(session.expires_at) < new Date()) return res.unAuthorized();

  next();
};
