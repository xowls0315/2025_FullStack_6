const express = require("express");
const app = express();
const { ramens, reviews } = require("./data");
const { v4 } = require("uuid");

// JSON 본문 파싱 가능하게 해줌
app.use(express.json());
// HTML form에서 전송된 데이터를 서버에서 읽을 수 있도록 옵션 설정 true
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("<h1>라면 월드에 오신걸 환영합니다!</h1>");
});

// 라면 전체 조회(GET): /ramens => 전체 라면 리스트
// - ?spicyLevel=5 필터로 극한 라면만
app.get("/ramens", (req, res) => {
  const { spicyLevel } = req.query;

  // spicyLevel가 주어진 경우 필터링
  if (spicyLevel) {
    const found = ramens.filter((v) => v.spicyLevel == +spicyLevel);
    if (found.length === 0) {
      return res.status(404).json({
        error: `'${spicyLevel}'레벨의 매운맛 라면은 찾을 수 없습니다.`,
      });
    }
    return res.json(found);
  }

  // 쿼리가 없으면 전체 리스트 반환
  return res.json(ramens);
});

// 라면 상세 조회(GET): /ramens/:id => id로 단일 라면 정보 조회
// - 없는 경우 404
app.get("/ramens/:id", (req, res) => {
  const { id } = req.params; // URL에서 id 추출
  const targetIndex = ramens.findIndex((v) => v.id == id);
  if (targetIndex == -1) {
    res.status(404).json({
      message: `${id}번의 라면은 없습니다!`,
    });
    return;
  }

  return res.json(ramens[targetIndex]);
});

// 라면 등록(POST): /ramens => name, brand, soupType, spicyLevel 등록 (+ id 자동부여)
app.post("/ramens", (req, res) => {
  const { name, brand, soupType, spicyLevel } = req.body;

  if (!name || !brand || !soupType || !spicyLevel) {
    return res.status(400).json({
      error:
        "이름(name), 브랜드(brand), 스프타입(soupType), 매운맛 레벨(spicyLevel)을 모두 입력해야 합니다.",
    });
  }

  if (spicyLevel < 1 || spicyLevel > 5) {
    return res.status(400).json({
      error: "spciyLevel은 1~5사이의 숫자만 가능합니다.",
    });
  }

  if (ramens.some((v) => v.name === name)) {
    return res.status(409).json({
      error: `이미 '${name}'이라는 이름의 라면이 존재합니다.`,
    });
  }

  //   // ✅ 다음 id 계산 (배열 비어있으면 0부터, 아니면 최댓값+1)
  //   const nextId = ramens.length ? ramens[ramens.length - 1].id + 1 : 0;

  //   ramens.push({ id: nextId, name, brand, soupType, spicyLevel });
  ramens.push({ id: v4(), name, brand, soupType, spicyLevel });

  return res.status(201).json({
    message: `'${name}' 라면이 추가되었습니다!`,
    newRamen: { name, brand, soupType, spicyLevel },
  });
});

// 라면 삭제(DELETE): /ramens/:id => 배열에서 삭제 후 id 재정렬
// - splice() 활용
app.delete("/ramens/:id", (req, res) => {
  const { id } = req.params;
  const targetIndex = ramens.findIndex((v) => v.id == id);
  if (targetIndex == -1) {
    res.status(404).json({
      message: `${id}번의 라면은 없습니다!`,
    });
    return;
  }
  const [deletedRamen] = ramens.splice(targetIndex, 1);

  // ✅ 남은 항목들 id를 0부터 재정렬 (현재 순서를 기준으로)
  ramens.forEach((item, i) => (item.id = i));

  console.log(ramens);

  return res.status(200).json({
    message: `id ${id}번 '${deletedRamen.name}' 라면이 삭제되었습니다.`,
    deleted: deletedRamen,
  });
});

// 라면 수정(PUT): /ramens/:id => name, brand, spicyLevel만 수정 가능
app.put("/ramens/:id", (req, res) => {
  const { id } = req.params;
  const targetIndex = ramens.findIndex((v) => v.id == id);
  if (targetIndex == -1) {
    res.status(404).json({
      message: `${id}번의 라면은 없습니다!`,
    });
    return;
  }

  // 라면의 name이나 brand나 spicyLevel을 바꿀 수 있는 로직 구성하기
  const { name, brand, spicyLevel } = req.body;
  ramens[targetIndex].name = name || ramens[targetIndex].name;
  ramens[targetIndex].brand = brand || ramens[targetIndex].brand;
  ramens[targetIndex].spicyLevel = spicyLevel || ramens[targetIndex].spicyLevel;

  return res.status(200).json({
    message: `id ${id}번 라면 정보가 수정되었습니다.`,
    updated: ramens[targetIndex],
  });
});

app.post("/reviews", (req, res) => {
  const { nickname, contents, ramenID } = req.body;

  if (!nickname || !contents || !ramenID) {
    res.status(400).json({ message: "데이터가 유효하지 않습니다." });
    return;
  }

  const target = ramens.findIndex((v) => v.id == ramenID);
  if (target == -1) {
    res.status(400).json({ message: "해당 라면은 존재하지 않습니다." });
    return;
  }

  reviews.push({ id: v4(), nickname, contents, ramenID });
  return res.status(200).json({ message: "댓글이 생성되었습니다!" });
});

app.get("/ramens/:id/reviews", (req, res) => {
  const { id } = req.params;
  const targetIndex = ramens.findIndex((v) => v.id == id);
  if (targetIndex == -1) {
    res.status(404).json({
      message: `해당 라면은 없습니다!`,
    });
    return;
  }

  const targets = reviews.filter((v) => v.ramenID == id);
  return res.status(200).json(targets);
});

app.listen(3000, () => {
  console.log("Ramen World 실행중~!");
});
