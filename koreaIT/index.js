const express = require("express");
const crypto = require("crypto");
const app = express();
const bcrpyt = require("bcrypt");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 폴더 - koreaIT
// table 학생 - id, password, name, email
// prisma 연동하고, 새로 데이터 생성할 때 password 암호화까지 만들기!

app.post("/students", async (req, res) => {
  const { id, password, name, email } = req.body;

  const newPW = await bcrpyt.hash(password, 10);

  await prisma.students.create({
    data: {
      id: id,
      password: newPW,
      name: name,
      email: email,
    },
  });

  res.json({ msg: `${id}가 생성되었습니다!` });
});

app.post("/login", async (req, res) => {
  const { id, password } = req.body;
  const student = await prisma.students.findUnique({ where: { id: id } });

  if (!student) {
    return res.status(404).json({ msg: "해당 학생이 없습니다." });
  }

  const isMatch = await bcrpyt.compare(password, student.password);

  if (!isMatch) {
    res.json({ msg: "아이디 또는 비밀번호가 일치하지 않습니다." });
    return;
  }

  const uuid = crypto.randomUUID();
  const start_time = new Date();
  const end_time = new Date(start_time);
  end_time.setMinutes(end_time.getMinutes() + 30);

  await prisma.session.create({
    data: {
      id: uuid,
      start_time: start_time.toTimeString().split(" ")[0],
      end_time: end_time.toTimeString().split(" ")[0],
    },
  });

  res.cookie("sessionID", uuid, {
    httpOnly: true, // 브라우저에서 접근 못하게함
    maxAge: 1000 * 60 * 1, // 쿠키 유통기한 (1분)
    secure: false, // http 허용
  });

  res.json({ msg: "로그인 완료!" });
});

app.listen(3000, () => {
  console.log("서버 시작~!");
});
