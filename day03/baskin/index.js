const express = require("express");
const app = express();
const { icecreams } = require("./data");

// JSON 본문 파싱 가능하게 해줌
app.use(express.json());
// HTML form에서 전송된 데이터를 서버에서 읽을 수 있도록 옵션 설정 true
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("베라베라 맛있는 베라 어서오소");
});

// / => 베라베라 맛있는 베라 어서오소
// /menu => 아이스크림 리스트
// /menu?underKcal=300 => 300보다 작은 kcal의 아이스크림 리스트
// /menu?flavor=mint => mint를 포함한 아이스크림 리스트
// /menu/1 => 레인보우샤베트 obj

app.get("/menu", (req, res) => {
  const { underKcal, flavor } = req.query;

  // underKcal이 주어진 경우 필터링
  if (underKcal) {
    const found = icecreams.filter((v) => v.kcal < underKcal);
    if (found.length === 0) {
      return res.status(404).json({
        error: `${underKcal}칼로리보다 칼로리가 적은 아이스크림을 찾을 수 없습니다.`,
      });
    }
    return res.json(found);
  }

  // flavor가 주어진 경우 필터링
  if (flavor) {
    const found = icecreams.filter((v) => v.flavor.includes(flavor));
    if (found.length === 0) {
      return res.status(404).json({
        error: `메뉴가 '${flavor}'가(이) 포함된 아이스크림을 찾을 수 없습니다.`,
      });
    }
    return res.json(found);
  }

  // 쿼리가 없으면 전체 리스트 반환
  return res.json(icecreams);
});

app.get("/menu/:id", (req, res) => {
  const { id } = req.params; // URL에서 id 추출
  const index = parseInt(id, 10); // 문자열 → 숫자 변환

  // 입력 검증
  if (Number.isNaN(index) || index < 0 || index >= icecreams.length)
    res.status(404).json({
      error: `해당 번호(${id})의 아이스크림이 존재하지 않습니다.`,
    });

  return res.json(icecreams[index]);
});

app.post("/add", (req, res) => {
  const { name, kcal, flavor1, flavor2 } = req.body;
  icecreams.push({ name, kcal, flavor1, flavor2 });
  console.log({ name, kcal, flavor1, flavor2 });

  res.json(`${name} 아이스크림이 추가 되었습니다!`);
});

app.listen(3000, () => {
  console.log("Baskin Rabbins 실행중~!");
});
