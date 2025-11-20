const express = require("express");
const app = express();
const bcrpyt = require("bcrypt");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.get("/boards", async (req, res) => {
  const boards = await prisma.boards.findMany();
  res.json(boards);
});

app.post("/users", async (req, res) => {
  const { id, password, nickname } = req.body;

  const newPW = await bcrpyt.hash(password, 10);

  await prisma.users.create({
    data: {
      id: id,
      password: newPW,
      nickname: nickname,
    },
  });

  res.json({ msg: `${id}가 생성되었습니다!` });
});

app.post("/test", async (req, res) => {
  const { id, password } = req.body;
  const user = await prisma.users.findUnique({ where: { id: id } });
  const oldPW = user.password;
  const result = await bcrpyt.compare(password, oldPW);

  res.json(result);
});

app.listen(3000, () => {
  console.log("서버 시작~!");
});
