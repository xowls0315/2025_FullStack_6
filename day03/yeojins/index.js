const express = require("express");
const app = express();
const { members } = require("./members");

// JSON 본문 파싱 가능하게 해줌
app.use(express.json());
// HTML form에서 전송된 데이터를 서버에서 읽을 수 있도록 옵션 설정 true
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>여진쓰 월드에 오신걸 환영합니다!</h1>");
});

app.get("/members", (req, res) => {
  const { name, age, position } = req.query;

  // name이 주어진 경우 필터링
  if (name) {
    const found = members.filter((v) => v.name == name);
    if (found.length === 0) {
      return res.status(404).json({
        error: `${name}의 이름인 멤버는 없습니다!`,
      });
    }
    return res.json(found);
  }

  // age가 주어진 경우 필터링
  if (age) {
    const found = members.filter((v) => +v.age == +age);
    if (found.length === 0) {
      return res.status(404).json({
        error: `${age}인 나이인 멤버는 없습니다!`,
      });
    }
    return res.json(found);
  }

  // posotion이 주어진 경우 필터링
  if (position) {
    const found = members.filter((v) => v.position == position);
    if (found.length === 0) {
      return res.status(404).json({
        error: `${position}의 역할인 멤버는 없습니다!`,
      });
    }
    return res.json(found);
  }

  return res.json(members);
});

app.get("/members/:id", (req, res) => {
  const { id } = req.params;
  if (id < 0 || id > members.length) res.send("<h2>그런 멤버 없습니다!!</h2>");

  return res.json(members[+id]);
});

app.post("/add", (req, res) => {
  const { name, age, position } = req.body;
  members.push({ name, age, position });

  return res.json(`${name} 멤버가 추가되었습니다!`);
});

app.listen(3000, () => {
  console.log("여진쓰 시작~!");
});
