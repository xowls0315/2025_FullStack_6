const express = require("express");
const app = express();
const { cats } = require("./data");

// JSON 본문 파싱 가능하게 해줌
app.use(express.json());
// HTML form에서 전송된 데이터를 서버에서 읽을 수 있도록 옵션 설정 true
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("<h1>고양이 월드에 오신걸 환영합니다!</h1>");
});

// GET: /cats => 모든 고양이 목록 반환
// ?color= 필터 지원
// GET: /cats/:id => 해당 id의 고양이 조회
// 없을 경우 404 응답
// POST: /cats => 배열에 새로운 고양이 추가 (이름 중복 불가)

app.get("/cats", (req, res) => {
  const { color } = req.query;

  // color가 주어진 경우 필터링
  if (color) {
    const found = cats.filter((v) => v.color == color);
    if (found.length === 0) {
      return res.status(404).json({
        error: `'${color}'색의 고양이는 찾을 수 없습니다.`,
      });
    }
    return res.json(found);
  }

  // 쿼리가 없으면 전체 리스트 반환
  return res.json(cats);
});

app.get("/cats/:id", (req, res) => {
  const { id } = req.params; // URL에서 id 추출
  const index = parseInt(id, 10); // 문자열 → 숫자 변환

  // 입력 검증
  if (Number.isNaN(index) || index < 0 || index >= cats.length)
    res.status(404).json({
      error: `해당 번호(${id})의 고양이는 존재하지 않습니다.`,
    });

  return res.json(cats[index]);
});

app.post("/cats", (req, res) => {
  const { name, age, color } = req.body;
  // 1️⃣ 유효성 검사 (모든 필드가 있어야 함)
  if (!name || !age || !color) {
    return res.status(400).json({
      error: "이름(name), 나이(age), 색깔(color)을 모두 입력해야 합니다.",
    });
  }

  // 2️⃣ 이름 중복 검사
  if (cats.some((v) => v.name === name)) {
    return res.status(409).json({
      error: `이미 '${name}'이라는 이름의 고양이가 존재합니다.`,
    });
  }

  // 3️⃣ 중복이 없을 경우 추가
  cats.push({ name, age, color });

  // 4️⃣ 응답
  return res.status(201).json({
    message: `'${name}' 고양이가 추가되었습니다!`,
    newCat: { name, age, color },
  });
});

// 해당 id의 cat이 삭제되도록 로직 구성하기
// /cats - body[id:1]
app.delete("/cats/:id", (req, res) => {
  const { id } = req.params;
  const targetIndex = cats.findIndex((v) => v.id == +id);
  if (targetIndex == -1) {
    res.status(404).json({
      message: `${id}번의 고양이 없습니다!`,
    });
    return;
  }
  const [deletedCat] = cats.splice(targetIndex, 1);

  return res.status(200).json({
    message: `id ${id}번 '${deletedCat.name}' 고양이가 삭제되었습니다.`,
    deleted: deletedCat,
  });
});

app.put("/cats/:id", (req, res) => {
  const { id } = req.params;
  const targetIndex = cats.findIndex((v) => v.id == +id);
  if (targetIndex == -1) {
    res.status(404).json({
      message: `${id}번의 고양이 없습니다!`,
    });
    return;
  }

  // 고양의 age나 color를 바꿀 수 있는 로직 구성하기
  const { name, age, color } = req.body;
  cats[targetIndex].name = name || cats[targetIndex].name;
  cats[targetIndex].age = age || cats[targetIndex].age;
  cats[targetIndex].color = color || cats[targetIndex].color;

  return res.status(200).json({
    message: `id ${id}번 고양이 정보가 수정되었습니다.`,
    updated: cats[targetIndex],
  });
});

app.listen(3000, () => {
  console.log("Cat World 실행중~!");
});
