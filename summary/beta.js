const { data } = require("./data");
const express = require("express");
const app = express();

const students = [
  { name: "이영철", age: 25, gender: "male" },
  { name: "신여진", age: 24, gender: "female" },
  { name: "손정우", age: 23, gender: "male" },
  { name: "박신율", age: 22, gender: "male" },
];

const courses = [
  { name: "리눅스", timetable: ["sat", "sun"], teacher: "손흥민" },
  { name: "파이썬", timetable: ["mon", "wed", "fri"], teacher: "김민재" },
  { name: "자바", timetable: ["tue", "thu", "fri"], teacher: "황희찬" },
];

// Query
app.get("/courses", (req, res) => {
  const { name, timetable, teacher } = req.query;

  if (name && !["리눅스", "파이썬", "자바"].includes(name)) {
    return res.json({ msg: "name 값이 올바르지 않습니다." });
  }
  if (
    timetable &&
    !["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(timetable)
  ) {
    return res.json({ msg: "timetable 값이 올바르지 않습니다." });
  }
  if (teacher && !["손흥민", "김민재", "황희찬"].includes(teacher)) {
    return res.json({ msg: "teacher 값이 올바르지 않습니다." });
  }

  let result = [...courses];

  if (name) {
    result = result.filter((v) => v.name.includes(name));
  }
  if (timetable) {
    result = result.filter((v) => v.timetable.includes(timetable));
  }
  if (teacher) {
    result = result.filter((v) => v.teacher.includes(teacher));
  }

  res.json(result);
});

// Params[매개변수]
app.get("/courses/:id", (req, res) => {
  const { id } = req.params;
  res.json(courses[id] || "그런 강좌 없습니다.");
});

// Query
// /students?gender=female
// 1. 쿼리 존재 여부
// 2. 유효성 검사
// 3. 쿼리조건에 맞도록 돌려줌
app.get("/students", (req, res) => {
  const { age, gender } = req.query;

  if (age && isNaN(+age)) {
    return res.json({ msg: "age 값이 올바르지 않습니다." });
  }
  if (gender && !["male", "female"].includes(gender)) {
    return res.json({ msg: "gender 값이 올바르지 않습니다." });
  }

  let result = [...students];

  if (age) {
    result = result.filter((v) => v.age == +age);
  }
  if (gender) {
    result = result.filter((v) => v.gender == gender);
  }

  res.json(result);
});

// Params[매개변수]
app.get("/students/:id", (req, res) => {
  const { id } = req.params;
  res.json(students[id] || "그런 학생 없습니다.");
});

// /humans
// ?language 없는 언어면 => 해당 언어는 없습니다.
// ?company 없는 회사면 => 해당 회사는 없습니다.
// ?departure 없는 부서면 => 해당 부서는 없습니다.
app.get("/humans", (req, res) => {
  const { name, language, company, departure } = req.query;

  // 유효성 검사: 쿼리가 있을 때만, 실제 data에 존재하는지 확인
  if (language && !data.some((v) => v.language === language)) {
    return res.status(400).json({ msg: "해당 언어는 없습니다." });
  }

  if (company && !data.some((v) => v.company === company)) {
    return res.status(400).json({ msg: "해당 회사는 없습니다." });
  }

  if (departure && !data.some((v) => v.departure === departure)) {
    return res.status(400).json({ msg: "해당 부서는 없습니다." });
  }

  let result = [...data];

  if (name) {
    result = result.filter((v) => v.name == name);
  }
  if (language) {
    result = result.filter((v) => v.language == language);
  }
  if (company) {
    result = result.filter((v) => v.company == company);
  }
  if (departure) {
    result = result.filter((v) => v.departure == departure);
  }

  res.json(result);
});

app.get("/languages", (req, res) => {
  const languages = [...new Set(data.map((v) => v.language))].sort();

  res.json(languages);
});

app.listen(3000, () => {
  console.log("서버 시즌2 시작~!");
});
