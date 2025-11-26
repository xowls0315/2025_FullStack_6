import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// POST /auth/register
export const register = async (req, res) => {
  const { email, password, nickname } = req.body;

  const exists = await prisma.users.findUnique({ where: { email } });
  if (exists) return res.conflict("이미 가입된 이메일입니다.");

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      email,
      password: hashed,
      nickname,
    },
  });

  return res.success(
    {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    },
    201
  );
};

// POST /auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return res.notFound("존재하지 않는 이메일입니다.");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.validationError("비밀번호가 일치하지 않습니다.");

  const sessionId = uuidv4();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 1000 * 60 * 5); // 5분

  await prisma.sessions.create({
    data: {
      session_id: sessionId,
      user_id: user.id,
      created_at: createdAt,
      expires_at: expiresAt,
    },
  });

  res.cookie("sessionID", sessionId, {
    httpOnly: true,
    maxAge: 1000 * 60 * 5, // 5분
  });

  return res.success({
    id: user.id,
    email: user.email,
    nickname: user.nickname,
  });
};

// POST /auth/logout
export const logout = async (req, res) => {
  const { sessionID } = req.cookies || {};

  if (sessionID) {
    await prisma.sessions
      .delete({ where: { session_id: sessionID } })
      .catch(() => {});
  }

  res.clearCookie("sessionID");

  return res.success(null);
};

// GET /auth/me
export const getMe = async (req, res) => {
  // authMiddleware에서 세팅해둔 값 사용
  const user = req.user;
  if (!user) return res.unAuthorized();

  return res.success(user);
};
