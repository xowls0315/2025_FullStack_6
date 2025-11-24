const express = require("express");
const app = express();

// 미들웨어

const test = (req, res, next) => {
  console.log("뒷반 시작함!");
  next();
};

// 시간 나타내는 미들웨어 만들기!
const timeLog = (req, res, next) => {
  console.log("현재 시간:", new Date().toLocaleString());
  next();
};

// app.use(test);
app.use(timeLog);

app.get("/", (req, res) => {
  res.json({ msg: "시작이욤" });
});

app.get("/dogs", (req, res) => {
  res.json({ msg: "멍멍이욤" });
});

app.listen(3000, () => {
  console.log("서버 시즌5 시작~!");
});
