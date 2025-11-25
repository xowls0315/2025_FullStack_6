import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v6 } from "uuid";

const prisma = new PrismaClient();

export const createMember = async (req, res) => {
  const { id, pw } = req.body;

  const cryptPW = await bcrypt.hash(pw, 10);

  await prisma.members.create({
    data: {
      id,
      pw: cryptPW,
    },
  });

  res.success("회원가입이 완료되었습니다.");
};

export const login = async (req, res) => {
  const { id, pw } = req.body;
  const member = await prisma.members.findUnique({
    where: { id },
  });
  if (!member) res.notFound("존재하지 않는 아이디입니다.");
  const result = await bcrypt.compare(pw, member.pw);
  if (!result) res.validationError("비밀번호가 일치하지 않습니다.");

  const uuid = v6();
  const create_at = new Date();
  const expires_at = new Date(create_at.getTime() + 1000 * 60 * 3); // 3분

  await prisma.sessions.create({
    data: {
      id: uuid,
      create_at,
      expires_at,
      member_id: id,
    },
  });

  res.cookie("sessionID", uuid, {
    httpOnly: true, // 브라우저에서 못 만짐
    maxAge: 1000 * 60 * 3, // 3분
  });

  res.success("로그인 완료");
};
