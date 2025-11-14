const express = require("express");
const morgan = require("morgan");
const joi = require("joi");
const { responseFormatter } = require("./func");
const { members } = require("./data");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 메서드, URL, 상태코드, 응답시간 돌려줌!
app.use(morgan("dev"));
app.use(responseFormatter);

const nyah = (req, res, next) => {
  console.log("메렁😜");
  next();
};

app.get("/", (req, res) => {
  res.success("메인 페이지");
});

app.get("/yeojin", nyah, (req, res) => {
  res.success({ msg: "여진쓰 월드~" });
});

app.get("/doquite", nyah, (req, res) => {
  res.success({ msg: "도콰이엇~" });
});

const schema = joi.object({
  name: joi.string(),
  age: joi.number().integer().min(19),
  position: joi.string().valid("vocal", "rapper", "dancer"),
});

const checkBody = (req, res, next) => {
  const { error } = schema.validate(req.body);
  console.log(error);
  if (error) return res.json({ msg: "에러입니다!!!!" });
  next();
};

app.get("/members", (req, res) => {
  res.success(members);
});

app.post("/members", checkBody, (req, res) => {
  const { name, age, position } = req.body;

  members.push({ name, age, position });
  res.success("멤버가 추가되었습니다!");
});

app.put("/members", checkBody, (req, res) => {
  const { name, age, position } = req.body;

  const targetIndex = members.findIndex((v) => v.name == name);
  if (targetIndex == -1) {
    res.status(404).json({
      message: `${name}의 멤버는 없습니다!`,
    });
    return;
  }

  members[targetIndex].name = name || members[targetIndex].name;
  members[targetIndex].age = age || members[targetIndex].age;
  members[targetIndex].position = position || members[targetIndex].position;

  res.success("멤버가 수정되었습니다!");
});

app.listen(3000, () => {
  console.log("서버 ON~!");
});
