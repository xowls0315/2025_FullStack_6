const express = require("express");
const app = express();
const { students } = require("./data");

app.get("/", (req, res) => {
  res.send("도시락 파티에 오신걸 환영합니다!");
});

// /list 도시락 전체 배열 돌려주기!
// /list/:num 해당 도시락 오브젝트 돌려주기!
// 옵션주기(= 쿼리 스트링)
// /list?name=son => 이름이 son인 사람의 도시락을 json으로 나타내주기
// /list?menu

app.get("/list", (req, res) => {
  const { name, menu } = req.query;

  // name이 주어진 경우 필터링
  if (name) {
    const found = students.filter((v) => v.name === name);
    if (found.length === 0) {
      return res
        .status(404)
        .json({ error: `이름이 '${name}'인 도시락을 찾을 수 없습니다.` });
    }
    return res.json(found);
  }

  // menu가 주어진 경우 필터링
  if (menu) {
    const found = students.filter((v) => v.menu.includes(menu));
    if (found.length === 0) {
      return res
        .status(404)
        .json({
          error: `메뉴가 '${menu}'가 포함된 도시락을 찾을 수 없습니다.`,
        });
    }
    return res.json(found);
  }

  // name이 없으면 전체 리스트 반환
  return res.json(students);
});

app.get("/list/:num", (req, res) => {
  const { num } = req.params; // URL에서 num 추출
  const index = parseInt(num, 10); // 문자열 → 숫자 변환

  // 입력 검증
  if (Number.isNaN(index) || index < 1 || index > students.length)
    res.status(404).json({
      error: `해당 번호(${num})의 도시락이 존재하지 않습니다.`,
    });

  const result = students[index - 1];
  return res.json(result);
});

app.listen(3000, () => {
  console.log("Lunch Box 실행중~!");
});
